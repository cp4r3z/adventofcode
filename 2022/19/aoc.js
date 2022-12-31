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

function AvailableRobots(blueprint, minerals) {
    const available = [];

    if (SufficientMinerals(minerals, blueprint.robots[Mineral.Clay].costs)) {
        available.push([Mineral.Clay]);
    }
    if (SufficientMinerals(minerals, blueprint.robots[Mineral.Geode].costs)) {
        available.push([Mineral.Geode]);
    }
    if (SufficientMinerals(minerals, blueprint.robots[Mineral.Obsidian].costs)) {
        available.push([Mineral.Obsidian]);
    }
    if (SufficientMinerals(minerals, blueprint.robots[Mineral.Ore].costs)) {
        available.push([Mineral.Ore]);
    }

    return available;
}

// Pass in a choice?

function Choose() {

    // if we're at the finish...

    //TODO:  or we can't possibly create enough geodes

    // Create new state
    const state = new State(aoc.StateStack[aoc.StateStack.length - 1]);

    // Collect    
    state.minerals[Mineral.Clay] += state.robots[Mineral.Clay];
    state.minerals[Mineral.Geode] += state.robots[Mineral.Geode];
    state.minerals[Mineral.Obsidian] += state.robots[Mineral.Obsidian];
    state.minerals[Mineral.Ore] += state.robots[Mineral.Ore];

    // Figure out available robots

    const availableRobots = AvailableRobots(aoc.Blueprint, state.minerals);

    for (const choice of availableRobots) {
        // build the robot and continue...  

    }

    aoc.StateStack.push(state);

    console.log('choose');





    // Build Robots at the end of the minute

}


function Setup() {
    aoc.Blueprints = aoc.input.split("\n").map(BluePrintCostParser);
}

function Run(lastMinute) {
    aoc.LastMinute = lastMinute;

    for (const blueprint of aoc.Blueprints) {

        // Globabls outside of recursion
        aoc.Blueprint = blueprint;
        aoc.StateStack = [new State()];        
        aoc.MostGeodes = 0;

        Choose();
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
