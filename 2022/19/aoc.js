// Testing
aoc.input = aoc.inputt;

const Mineral = Object.freeze({
    Clay: "Clay",
    Geode: "Geode",
    Obsidian: "Obsidian",
    Ore: "Ore",
});

function MineralObject(fromObject = {}) {
    const mineralObject = {
        [Mineral.Clay]: fromObject[Mineral.Clay] || 0,
        [Mineral.Geode]: fromObject[Mineral.Geode] || 0,
        [Mineral.Obsidian]: fromObject[Mineral.Obsidian] || 0,
        [Mineral.Ore]: fromObject[Mineral.Ore] || 0
    };

    // if (fromObject) {
    //     mineralObject[Mineral.Clay] = fromObject[Mineral.Clay];
    //     mineralObject[Mineral.Geode] = fromObject[Mineral.Geode];
    //     mineralObject[Mineral.Obsidian] = fromObject[Mineral.Obsidian];
    //     mineralObject[Mineral.Ore] = fromObject[Mineral.Ore];
    // }

    return mineralObject;
}

// class Robot {
//     constructor(type) {
//         this.type = type; // research how to extend classes in JS
//         //this.costs = BlueprintCosts(type);
//     }
// }

// class RobotOre extends Robot {
//     constructor() {
//         super(Mineral.Ore);
//     }
// }

class State {
    /**
 * state is a class? needs a clone method
 * mineral amounts
 * robot amounts
 * minute
 * 
 * every minute, you decide to make 1 of the 4  
 */
    // constructor(){
    //     this.minerals = MineralObject();
    //     this.robots = { [Mineral.Ore]: 1 };
    //     this.minute = 0;
    // }

    constructor(state) {
        if (!state) {
            // Initial
            this.minerals = MineralObject();
            this.robots = { [Mineral.Ore]: 1 };
            this.minute = 0;
            this.geodes = 0;
        } else {
            this.minerals = MineralObject(state.minerals);
            this.robots = MineralObject(state.robots);
            this.minute = state.minute;
            this.geodes = state.geodes;
        }
    }
}

function BlueprintCosts(matches) {
    const robots = {
        [Mineral.Clay]: { costs: MineralObject() },
        [Mineral.Geode]: { costs: MineralObject() },
        [Mineral.Obsidian]: { costs: MineralObject() },
        [Mineral.Ore]: { costs: MineralObject() },
    };
    robots[Mineral.Ore].costs[Mineral.Ore] = matches[1];
    robots[Mineral.Clay].costs[Mineral.Ore] = matches[2];
    robots[Mineral.Obsidian].costs[Mineral.Ore] = matches[3];
    robots[Mineral.Obsidian].costs[Mineral.Clay] = matches[4];
    robots[Mineral.Geode].costs[Mineral.Ore] = matches[5];
    robots[Mineral.Geode].costs[Mineral.Obsidian] = matches[6];

    return { robots };
}

function BluePrintCostParser(s) {
    const re = /\d+/g;
    const matches = s.match(re).map(s => parseInt(s));
    return BlueprintCosts(matches);
}

function SufficientMinerals(minerals, costs) {
    return (minerals[Mineral.Clay] >= costs[Mineral.Clay] &&
        minerals[Mineral.Geode] >= costs[Mineral.Geode] &&
        minerals[Mineral.Obsidian] >= costs[Mineral.Obsidian] &&
        minerals[Mineral.Ore] >= costs[Mineral.Ore]);
}

function BuildRobot(minerals, costs) {
    minerals[Mineral.Clay] -= costs[Mineral.Clay];
    minerals[Mineral.Geode] -= costs[Mineral.Geode];
    minerals[Mineral.Obsidian] -= costs[Mineral.Obsidian];
    minerals[Mineral.Ore] -= costs[Mineral.Ore];
}

function AvailableRobots(blueprint, minerals) {
    const available = ["NONE"];

    if (SufficientMinerals(minerals, blueprint.robots[Mineral.Clay].costs)) {
        available.push(Mineral.Clay);
    }
    if (SufficientMinerals(minerals, blueprint.robots[Mineral.Geode].costs)) {
        available.push(Mineral.Geode);
    }
    if (SufficientMinerals(minerals, blueprint.robots[Mineral.Obsidian].costs)) {
        available.push(Mineral.Obsidian);
    }
    if (SufficientMinerals(minerals, blueprint.robots[Mineral.Ore].costs)) {
        available.push(Mineral.Ore);
    }

    return available;
}

function SortAvailable(available, robots) {

    let sortable = [];
    for (var robot in robots) {
        sortable.push([robot, robots[robot]]);
    }


    //sortable.push(["NONE", .5])

    sortable = sortable.sort(function (a, b) {
        return a[1] - b[1];
    });

    sortable.push(["NONE", sortable[0][1] + .5]);

    sortable = sortable.sort(function (a, b) {
        return a[1] - b[1];
    });

    sortable = sortable.map(r => r[0]);

    //sortable.push("NONE");

    //const sortedRobots = [...robots].sort((a,[k,v])=>)

    //console.log('ok, now sort available');

    //const priority = ["NONE", Mineral.Geode, Mineral.Obsidian, Mineral.Clay, Mineral.Ore];

    const prioritized = [];

    for (const p of sortable) {
        if (available.includes(p)) {
            prioritized.push(p);
        }
    }

    return prioritized;
}

// Pass in a choice?

function Choose(choice = "NONE") {

    // TODO: 

    // if minute is > ended




    //TODO:  or we can't possibly create enough geodes

    // Create new state
    const state = new State(aoc.StateStack[aoc.StateStack.length - 1]);
    state.minute++;
    aoc.StateStack.push(state);


    const minutesLeft = aoc.LastMinute - state.minute;
    const geodeRobots = state.robots[Mineral.Geode];
    const maxGeodeRobots = geodeRobots + minutesLeft / 2;
    const maxPotentialGeodes = state.minerals[Mineral.Geode] + maxGeodeRobots * minutesLeft;

    if (maxPotentialGeodes < aoc.MostGeodes) {
        // aoc.StateStack.pop();
        // return;
    }



    //console.log(`Push ` +aoc.StateStack.length);

    // Build your choice of robots

    if (choice !== 'NONE') {
        // build the robot and continue...  

        BuildRobot(state.minerals, aoc.Blueprint.robots[choice].costs);
    }




    // Collect    
    state.minerals[Mineral.Clay] += state.robots[Mineral.Clay];
    state.minerals[Mineral.Geode] += state.robots[Mineral.Geode];
    state.minerals[Mineral.Obsidian] += state.robots[Mineral.Obsidian];
    state.minerals[Mineral.Ore] += state.robots[Mineral.Ore];

    state.robots[choice]++;

    if (state.minute === aoc.LastMinute) {
        if (state.minerals[Mineral.Geode] > aoc.MostGeodes) {
            aoc.MostGeodes = state.minerals[Mineral.Geode];
            console.log(aoc.MostGeodes);
        }
        aoc.StateStack.pop();
        return;
    }

    if (state.minerals[Mineral.Geode] > 0 && state.minute < aoc.EarliestGeodeRobot) {
        aoc.EarliestGeodeRobot = state.minute;
    }

    if (state.minute >= aoc.EarliestGeodeRobot && state.robots[Mineral.Geode] === 0) {
        aoc.StateStack.pop();
        return; //?
    }



    // Figure out available robots

    let availableRobots = AvailableRobots(aoc.Blueprint, state.minerals);

    

    if (state.minerals[Mineral.Geode] === 0 && aoc.EarliestGeodeRobot === aoc.LastMinute) {
        availableRobots = SortAvailable(availableRobots, state.robots);
      
    }
    // sort?



    //const backupMinerals = MineralObject(state.minerals);
    //const backupMinute = state.minute;

    for (const choice of availableRobots) {
        // state.minerals = MineralObject(backupMinerals);
        // state.minute = backupMinute;

        Choose(choice);

    }

    aoc.StateStack.pop(); // As the last thing we do?

    //console.log(`Pop  ` +aoc.StateStack.length);

    // console.log('popped'); // yay, stack overflow
}


function Setup() {
    aoc.Blueprints = aoc.input.split("\n").map(BluePrintCostParser);
}

function Run(lastMinute) {
    aoc.LastMinute = lastMinute;

    aoc.part1 =0;

    let b  =1;

    for (const blueprint of aoc.Blueprints) {

        // Globabls outside of recursion
        aoc.Blueprint = blueprint;
        aoc.StateStack = [new State()];
        aoc.MostGeodes = 0;
        aoc.EarliestGeodeRobot = lastMinute;

        Choose();

        aoc.part1 += (b*aoc.MostGeodes);
        b++;

    }
}

// Part 1
Setup();

Run(24);

// Now start thinking about the state

/**
 * state is a class? needs a clone method
 * mineral amounts
 * robot amounts
 * minute
 * 
 * every minute, you decide to make 1 of the 4  
 */

document.getElementById("part1-result").innerText = `${aoc.part1}`;
document.getElementById("part2-result").innerText = `${aoc.part2}`;
