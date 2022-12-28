// Testing
//aoc.input = aoc.inputt2;

// Valley
// Y down is negative

aoc.valleyCycles = [];
aoc.valleyDims = {};
aoc.valleyStepsAtCycle = []; // It turns out this was a bit of an over-think. Oh well.

aoc.BPs = [];

aoc.goals = [];
aoc.goalsIndex = 0;

class Coor {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class BP {
    // takes two coors, position and velocity
    constructor(p, v) {
        this.pos = p;
        this.velocity = v;
    }
    move() {
        this.pos.x += this.velocity.x;

        if (this.pos.x === 0) {
            this.pos.x = aoc.valleyDims.x - 1 - 1;
        }
        else if (this.pos.x === aoc.valleyDims.x - 1) {
            this.pos.x = 1;
        }

        this.pos.y += this.velocity.y;

        if (this.pos.y === 0) {
            this.pos.y = aoc.valleyDims.y - 1 - 1;
        }
        else if (this.pos.y === aoc.valleyDims.y - 1) {
            this.pos.y = 1;
        }
    }
}

function Parse() {
    // A valley grid for each cycle
    //aoc.map = aoc.grid2D({}, '.');

    aoc.valleyInitial = aoc.grid2D({}, '.');

    // Parse Input
    aoc.valley = aoc.input.split("\n").map(line => line.split(""));

    // Get valley dims

    aoc.valleyDims.x = aoc.valley[0].length;
    aoc.valleyDims.y = aoc.valley.length;
    aoc.numCycles = (aoc.valleyDims.x - 2) * (aoc.valleyDims.y - 2);
    // Note  : Actually, what we want here is the "least common multiple"
    // Note 2: It was a waste of time anyway.

    aoc.goals.push(new Coor(aoc.valleyDims.x - 2, aoc.valleyDims.y - 1));
    aoc.goals.push(new Coor(1, 0));
    aoc.goals.push(new Coor(aoc.valleyDims.x - 2, aoc.valleyDims.y - 1));

    // Generate Blizzard Pieces (BPs)

    for (let y = 0; y < aoc.valley.length; y++) {
        const row = aoc.valley[y];
        for (let x = 0; x < row.length; x++) {
            const space = row[x];
            let walkable = true;
            const pos = new Coor(x, y);
            switch (space) {
                case "#":
                    walkable = false;
                    break;
                case "<":
                    // Left
                    aoc.BPs.push(new BP(pos, new Coor(-1, 0)));
                    break;
                case "^":
                    // Up
                    aoc.BPs.push(new BP(pos, new Coor(0, -1)));
                    break;
                case ">":
                    // Right
                    aoc.BPs.push(new BP(pos, new Coor(1, 0)));
                    break;
                case "v":
                    // Down
                    aoc.BPs.push(new BP(pos, new Coor(0, 1)));
                    break;
                default:
                    break;
            }

            aoc.valleyInitial.set(x, y, walkable ? "." : "#");
        }
    }

    //aoc.valleyInitial.print(true);
}

// Interesting idea, but... it turns out that this actually _wastes time_.
function SimulateCycles() {
    for (let i = 0; i < aoc.numCycles; i++) {
        const newValley = aoc.grid2D(aoc.valleyInitial.dump(), '.');

        aoc.BPs.forEach(bp => {
            newValley.set(bp.pos.x, bp.pos.y, "#");
        });

        //newValley.print(true);

        aoc.valleyCycles.push(newValley);

        aoc.BPs.forEach(bp => bp.move());

        aoc.valleyStepsAtCycle.push(aoc.grid2D({}, -1));
    }
    console.log('Simulated');
}

function There(pos) {
    const goal = aoc.goals[aoc.goalsIndex];
    if (pos.x === goal.x && pos.y === goal.y) {
        aoc.goalsIndex++;

        // clear out things...
        aoc.valleyStepsAtCycle = [];
        for (let i = 0; i < aoc.numCycles; i++) {
            aoc.valleyStepsAtCycle.push(aoc.grid2D({}, -1));
        }

        return true;
    }
    return false;
}

function PathFinding() {

    // Our BFS "queue"
    let steps = [];
    steps.push(new Coor(1, 0));
    steps.push(new Coor(1, 1));
    let nextSteps = [];

    let stepsTaken = 0;
    let thereYet = false;

    while (steps.length > 0 && !thereYet) {
        stepsTaken++;

        const cycle = (stepsTaken % aoc.numCycles);
        const valleyCycle = aoc.valleyCycles[cycle];
        //valleyCycle.print(true);
        const stepsAtCycle = aoc.valleyStepsAtCycle[cycle];

        for (const step of steps) {
            // Am I there yet?
            if (There(step)) {
                //thereYet = true;
                if (aoc.goalsIndex === 1) {
                    aoc.part1 = stepsTaken;
                    nextSteps = [];
                    nextSteps.push(step);
                    nextSteps.push(new Coor(step.x, step.y - 1));
                    break;
                } else if (aoc.goalsIndex === 2) {
                    nextSteps = [];
                    nextSteps.push(new Coor(1, 0));
                    nextSteps.push(new Coor(1, 1));
                    break;
                }
                else if (aoc.goalsIndex === 3) {
                    thereYet = true;
                    aoc.part2 = stepsTaken;
                    break;
                }
            }

            // Is this a valid space?
            const space = valleyCycle.get(step.x, step.y).value;
            if (space === '#') {
                continue;
            }

            // Have I been here before?
            const prev = stepsAtCycle.get(step.x, step.y).value;
            if (prev > -1 && stepsTaken >= prev) {
                // there's a faster way of getting here...
                continue;
            }

            // Mark the number of steps and add adjacents to nextSteps
            stepsAtCycle.set(step.x, step.y, stepsTaken);

            nextSteps.push(new Coor(step.x, step.y));
            nextSteps.push(new Coor(step.x + 1, step.y));
            nextSteps.push(new Coor(step.x - 1, step.y));
            if (step.y < aoc.valleyDims.y - 1) {
                nextSteps.push(new Coor(step.x, step.y + 1));
            }
            if (step.y > 0) {
                nextSteps.push(new Coor(step.x, step.y - 1));
            }
        }

        // find next steps
        steps = nextSteps;
        nextSteps = [];
    }
}

// Find cycle repeat
// Generate cycles
// Simple BDS

Parse();
SimulateCycles();
PathFinding();

document.getElementById("part1-result").innerText = `${aoc.part1}`;
document.getElementById("part2-result").innerText = `${aoc.part2}`;
