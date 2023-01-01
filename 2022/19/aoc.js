// Testing
//aoc.input = aoc.inputt;

// "Enum-like" frozen object
const Mineral = Object.freeze({
    Clay: "Clay",
    Geode: "Geode",
    Obsidian: "Obsidian",
    Ore: "Ore",
});

// It would have been very useful to create a useful forEach Object extension...
function MineralObject(fromObject = {}) {
    const mineralObject = {
        [Mineral.Clay]: fromObject[Mineral.Clay] || 0,
        [Mineral.Geode]: fromObject[Mineral.Geode] || 0,
        [Mineral.Obsidian]: fromObject[Mineral.Obsidian] || 0,
        [Mineral.Ore]: fromObject[Mineral.Ore] || 0
    };

    return mineralObject;
}

class State {

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

// While this reduces the time by ~30%, the "FindPotential" pruning below is much more useful.
function SortAvailable(available, state) {

    let priority = available.includes(Mineral.Ore) ? Mineral.Ore : "NONE";

    if (available.includes(Mineral.Geode)) {
        priority = Mineral.Geode;
    } else if (state.minerals[Mineral.Obsidian] < aoc.Blueprint.robots[Mineral.Geode].costs[Mineral.Obsidian]
        && available.includes(Mineral.Obsidian)) {
        priority = Mineral.Obsidian;
    } else if (state.minerals[Mineral.Clay] < aoc.Blueprint.robots[Mineral.Obsidian].costs[Mineral.Clay]
        && available.includes(Mineral.Clay)) {
        priority = Mineral.Clay;
    }

    let sorted = [priority];
    for (const a of available) {
        if (!sorted.includes(a)) {
            sorted.push(a);
        }
    }

    return sorted;
}

// Branch pruning 
function FindPotential(state) {

    // Assume we can build robots EVERY DAY.

    let clyRobots = state.robots[Mineral.Clay];
    let geoRobots = state.robots[Mineral.Geode];
    let obsRobots = state.robots[Mineral.Obsidian];
    let oreRobots = state.robots[Mineral.Ore];

    let cly = state.minerals[Mineral.Clay];
    let geo = state.minerals[Mineral.Geode];
    let obs = state.minerals[Mineral.Obsidian];
    let ore = state.minerals[Mineral.Ore];

    for (let minute = state.minute + 1; minute <= aoc.LastMinute; minute++) {

        cly += clyRobots;
        if (ore >= aoc.Blueprint.robots[Mineral.Clay].costs[Mineral.Ore]) {
            clyRobots++;
            // ore -= aoc.Blueprint.robots[Mineral.Clay].costs[Mineral.Ore];
        }
        geo += geoRobots;
        if (ore >= aoc.Blueprint.robots[Mineral.Geode].costs[Mineral.Ore] &&
            obs >= aoc.Blueprint.robots[Mineral.Geode].costs[Mineral.Obsidian]) {
            geoRobots++;
            ore -= aoc.Blueprint.robots[Mineral.Geode].costs[Mineral.Ore];
            obs -= aoc.Blueprint.robots[Mineral.Geode].costs[Mineral.Obsidian];
        }
        obs += obsRobots;
        if (ore >= aoc.Blueprint.robots[Mineral.Obsidian].costs[Mineral.Ore] &&
            cly >= aoc.Blueprint.robots[Mineral.Obsidian].costs[Mineral.Clay]) {
            obsRobots++;
            // ore -= aoc.Blueprint.robots[Mineral.Obsidian].costs[Mineral.Ore];
            cly -= aoc.Blueprint.robots[Mineral.Obsidian].costs[Mineral.Clay];
        }
        ore += oreRobots;
        if (ore >= aoc.Blueprint.robots[Mineral.Ore].costs[Mineral.Ore]) {
            oreRobots++;
            // ore -= aoc.Blueprint.robots[Mineral.Ore].costs[Mineral.Ore];
        }
    }

    return geo;
}

function Choose(choice = "NONE") {

    // Create new state
    const state = new State(aoc.StateStack[aoc.StateStack.length - 1]);
    state.minute++;
    aoc.StateStack.push(state);

    // Build your choice of robots
    if (choice !== 'NONE') {
        BuildRobot(state.minerals, aoc.Blueprint.robots[choice].costs);
    }

    // Collect    
    state.minerals[Mineral.Clay] += state.robots[Mineral.Clay];
    state.minerals[Mineral.Geode] += state.robots[Mineral.Geode];
    state.minerals[Mineral.Obsidian] += state.robots[Mineral.Obsidian];
    state.minerals[Mineral.Ore] += state.robots[Mineral.Ore];

    if (choice !== 'NONE') {
        state.robots[choice]++;
    }

    if (state.minute === aoc.LastMinute) {
        if (state.minerals[Mineral.Geode] > aoc.MostGeodes) {
            aoc.MostGeodes = state.minerals[Mineral.Geode];
            // console.log(aoc.MostGeodes);
        }
        aoc.StateStack.pop();
        return;
    }

    const maxPotentialGeodes = FindPotential(state);
    if (maxPotentialGeodes <= aoc.MostGeodes) {
        aoc.StateStack.pop();
        return;
    }

    // Figure out available robots

    let availableRobots = AvailableRobots(aoc.Blueprint, state.minerals);
    availableRobots = SortAvailable(availableRobots, state);

    for (const choice of availableRobots) {
        Choose(choice);
    }

    aoc.StateStack.pop(); // As the last thing we do
    // console.log('popped'); // yay, stack overflow
}


function Setup() {
    aoc.Blueprints = aoc.input.split("\n").map(BluePrintCostParser);
}

function Run(lastMinute, part1 = true) {
    aoc.LastMinute = lastMinute;

    let b = 1;

    let bMax = part1 ? aoc.Blueprints.length : 3;

    for (const blueprint of aoc.Blueprints) {

        if (b > bMax) {
            break;
        }

        console.log(`Blueprint ${b}`);

        // Globals outside of recursion
        aoc.Blueprint = blueprint;
        aoc.StateStack = [new State()];
        aoc.MostGeodes = 0;
        aoc.GeodesAtMinute = new Array(lastMinute + 1).fill(0);

        Choose();

        console.log(`Most Geodes: ${aoc.MostGeodes}`);

        if (part1) {
            aoc.part1 += (b * aoc.MostGeodes)
        } else {
            aoc.part2 *= aoc.MostGeodes;
        }

        b++;
    }
}

aoc.part1 = 0;
aoc.part2 = 1;

let start = Date.now();

Setup();
Run(24);

Setup();
Run(32, false);

let end = Date.now();

// Echo the interval it took to run. For fun. Final result was ~250ms. Not bad for single threaded JS!
console.log(`${end - start}ms`);

document.getElementById("part1-result").innerText = `${aoc.part1}`;
document.getElementById("part2-result").innerText = `${aoc.part2}`;
