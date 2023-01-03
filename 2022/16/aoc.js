// Testing
//aoc.input = aoc.inputt;

function Parse() {

    const scan = [];

    for (const line of aoc.input.split('\n')) {
        const reValves = /([A-Z]{2})/g;
        const valves = line.match(reValves);
        const id = valves[0];
        const tunnels = [];
        for (let i = 1; i < valves.length; i++) {
            tunnels.push(valves[i]);
        }
        const reFlow = /(\d+)/;
        const flow = parseInt(line.match(reFlow)[1]);

        scan.push({
            id,
            flow,
            tunnels
        });
    }
    return scan;

}

// One way tunnel to a valve
// class Tunnel {
//     constructor(valve) {
//         this.valve = valve

//     }
// }

class ValveInfo {
    constructor(valve, distance, tunnel) {
        this.valve = valve;
        this.distance = distance;
        this.tunnel = tunnel;
    }
}

class Valve {
    constructor(id, flow) {
        this.id = id;
        this.flow = flow;
        this.tunnels = []; // Array of other valves? With a distance though... { valve, distance, potential?}
        // Thought, maybe after adding a tunnel, we re-sort by... value?
        // Although, the value really depends on how many minutes you have left

        this.potentials = []; //?? I guess just the distance to the valve and the valve itself... ValveInfo?
    }

    AddTunnel(valve) {

        if (this.tunnels.includes(valve)) {
            return;
        }

        this.tunnels.push(valve);
        valve.AddTunnel(this);

        this.tunnels.sort((v1, v2) => v2.flow - v1.flow);
    }

    TraversePotential(valveMap, previousDistance, firstTunnel = null) {
        const distance = previousDistance + 1;
        if (valveMap.get(this).distance <= distance) { return; }

        valveMap.set(this, { distance, firstTunnel });
        for (const t of this.tunnels) {
            const ft = firstTunnel || t;
            t.TraversePotential(valveMap, distance, ft);
        }
    }

    // sort, 

}

function MakeValveGraph(scan) {
    const graph = new Map(); // key: id, value: valve

    for (const v of scan) {
        const valve = new Valve(v.id, v.flow);
        graph.set(v.id, valve);
    }

    // All valves created, now they need to be linked

    for (const v of scan) {
        for (const t of v.tunnels) {
            graph.get(v.id).AddTunnel(graph.get(t));
        }
    }

    // Sort them by flow
    let graphArray = [...graph];
    aoc.ValveGraphSorted = graphArray.sort((pairA, pairB) => pairB[1].flow - pairA[1].flow).map(pair => pair[1]);

    // All valves linked, now we could calculate the distance from every valve to any other

    for (var [id, valve] of graph) {
        const valveMap = new Map();
        for (var [id2, valve2] of graph) {
            //if (valve2===valve){continue;}
            valveMap.set(valve2, { distance: 1000, firstTunnel: null });
        }
        valve.TraversePotential(valveMap, -1);

        // Now the valveMap has the distances

        for (const [mappedValve, distanceTunnelObj] of valveMap) {
            if (mappedValve === valve) { continue; }
            valve.potentials.push(new ValveInfo(mappedValve, distanceTunnelObj.distance, distanceTunnelObj.firstTunnel));
        }

        // This would sort by distance
        //valve.potentials.sort((vp1, vp2) => vp1.distance - vp2.distance);

        // Sort by flow, ignoring the distance...
        valve.potentials.sort((vp1, vp2) => vp2.valve.flow - vp1.valve.flow); // I feel like this would be nearly the same for everyone?
    }

    return graph;
}

class State {
    constructor(state) {
        this.minute = state ? state.minute : 0;
        this.open = state ? [...state.open] : [];
        this.released = state ? state.released : 0;
        this.valve = state ? state.valve : aoc.ValveGraph.get('AA');
    }
}

function FindPotential(state) {

    // Assume you can open all the highest flowing valves
    let nextValveIndex = 0;
    const additionalOpen = [];
    let potential = state.released;
    for (let minute = state.minute + 1; minute <= aoc.LastMinute; minute++) {
        let nextHighest = null;
        while (!nextHighest && nextValveIndex < aoc.ValveGraphSorted.length - 1) {
            const consideredValve = aoc.ValveGraphSorted[nextValveIndex];
            if (!state.open.includes(consideredValve)) {
                nextHighest = consideredValve;
                additionalOpen.push(nextHighest);
            }
            nextValveIndex++;
        }
        //additionalOpen.push(aoc.ValveGraphSorted[])
        for (const o of state.open) {
            potential += o.flow;
        }
        for (const ao of additionalOpen) {
            potential += ao.flow;
        }

    }
    return potential;
}

class Action {
    constructor(valve = null) {
        this.valve = valve;
        this.open = !valve; // If there's no valve, assume we're opening.
    }
}

function Step(action) {
    // Create new state
    const state = new State(aoc.StateStack[aoc.StateStack.length - 1]);
    aoc.StateStack.push(state);

    state.minute++;

    // is there anything that we should do here? Something in the last minute????

    // Release pressure

    // for all open, release that amount of pressure

    for (const o of state.open) {
        state.released += o.flow;
    }

    if (state.minute === aoc.LastMinute) {
        if (state.released > aoc.MostPressure) {
            aoc.MostPressure = state.released;
            console.log(aoc.MostPressure);
        }

        aoc.StateStack.pop();
        return;
    }

    if (FindPotential(state) <= aoc.MostPressure) {
        aoc.StateStack.pop();
        return;
    }

    if (!action) {
        Step();
        aoc.StateStack.pop();
        return;
    }

    // if (!action) {
    //     // First step
    //     actions = [];
    //     actions.push(Action(true));
    //     for (const t of state.valve.tunnels) {
    //         actions.push(new Action(false, t.id));
    //     }
    // }

    // Ok, so.. move or open a valve

    if (action.open) {
        state.open.push(state.valve);
    } else {
        state.valve = action.valve;
    }

    // ok, now let's figure out what to do next

    if (state.valve.flow > 0 && !state.open.includes(state.valve)) {
        //actions.push(new Action());
    }

    for (const t of state.valve.tunnels) {
        // actions.push(new Action(t));
    }

    // here maybe do some sorting

    let sortedActions = [];
    const bestActions = new Set();

    const minutesLeft = aoc.LastMinute - state.minute - 1;

    for (const p of state.valve.potentials) {
        if (!state.open.includes(p.valve)) {
            //not open, that's good

            if (p.valve.flow === 0) {
                continue;
            }
            if (p.distance > minutesLeft) {
                continue;
            }

            if (aoc.StateStack.some(s => s.valve === p.valve)) {
               // continue;
            }

            bestActions.add(p.tunnel);
        }
        if (bestActions.size === state.valve.tunnels.length) {
            break;
        }
    }

    sortedActions = Array.from(bestActions).map(v => new Action(v));

    if (state.valve.flow > 0 && !state.open.includes(state.valve)) {
        sortedActions.unshift(new Action());
    }

    // If there's no action, just run out the clock
    if (sortedActions.length === 0) {
        Step();
        aoc.StateStack.pop();
        return;
    }

    // TODO: Let's see if we can eliminate this or clean it up...


    // let actions = [];

    // if (state.valve.flow > 0 && !state.open.includes(state.valve)) {
    //     actions.unshift(new Action());
    // }

    // for (const a of actions) {
    //     if (!sortedActions.includes(a)) {
    //         sortedActions.push(a);
    //     }
    // }



    for (const action of sortedActions) {
        Step(action);
    }

    aoc.StateStack.pop(); // Always do this when leaving

}

function Main() {

    const scan = Parse();
    aoc.ValveGraph = MakeValveGraph(scan);
    aoc.MostPressure = 0;//  11923;// <-- cheating!

    // Ok, now I guess we need a state stack
    // State contains minute... and the status of all the valves... and the current total released

    // Globals outside recursion
    const state = new State();
    aoc.StateStack = [state];

    // First steps // TODO: Can this be DRY'd up into the Step function?
    const actions = [];
    // actions.push(new Action()); // Commented because we know AA is closed
    for (const t of state.valve.tunnels) {
        actions.push(new Action(t));
    }

    for (const action of actions) {
        Step(action);
    }

    aoc.part1 = aoc.MostPressure;

    return;

}

aoc.LastMinute = 30;

Main();

document.getElementById("part1-result").innerText = `${aoc.part1}`;
document.getElementById("part2-result").innerText = `${aoc.part2}`;
