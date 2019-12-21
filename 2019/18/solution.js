/**
 * https://adventofcode.com/2019/day/18
 */

const parser = require('./parser.mjs');
const grid2D = require('./grid2D.mjs');

// Parse Input
let inputFileName = 'inputtest2.txt';
const arrInput = parser.multiLine.toStrArray(inputFileName);

// This should be a shared util enum
let moves = [
    {
        cardinal: 'north',
        udlr: 'up',
        dx: 0,
        dy: 1
    },
    {
        cardinal: 'south',
        udlr: 'down',
        dx: 0,
        dy: -1
    },
    {
        cardinal: 'west',
        udlr: 'left',
        dx: -1,
        dy: 0
    },
    {
        cardinal: 'east',
        udlr: 'right',
        dx: 1,
        dy: 0
    }
];

// Instantiate a "map" object using a 2D grid
const map = grid2D();

const reDoor = /[A-Z]/;
let doors = {};
const reKey = /[a-z]/;
let keys = {};
const reStart = /@/;
let start = {};

arrInput.forEach((line, y) => {
    line.split('').forEach((char, x) => {
        map.set(x, y, char);
        if (/[A-Z]/.test(char)) doors[char] = { x, y };
        if (/[a-z]/.test(char)) keys[char] = { x, y };
        if (/@/.test(char)) start = { x, y };
    });
});

map.set(start.x, start.y, '.'); //?

/**
 * recursive function
 * input: direction?, intended target?, current location, map state, route so far (array), steps taken so far
 * 
 * on each step, compare steps taken vs existing solution
 * 
 * go to destination
 * mark it as "complete"
 * figure out the distance to all available/valid targets
 * spawn functions for each of those targets
 * 
 * output: none?
 *  gradually fill a "route" array
 *  store... path length and full route 
 *
 */

let solution = {
    steps: null,
    path: null
};

floodAndFind(map.dump(), start, 0, doors, keys);

// take in a grid state and door/key state and return a list of keys with their distances
// TODO: This should be an object as it's getting complex
function floodAndFind(gridState, _start, steps, _doors, _keys) {
    // build a grid (top level)
    const grid = grid2D(gridState);
    let keysWithDistance = objCopy(_keys);

    // Mark locked doors as walls
    for (const door in _doors) {
        if (_doors[door].unlocked) {
            grid.set(_doors[door].x, _doors[door].y, '.');
        }
        else {
            grid.set(_doors[door].x, _doors[door].y, '#');
        }
    }

    // Remove all the found keys
    for (const key in _keys) {
        if (_keys[key].found) {
            grid.set(_keys[key].x, _keys[key].y, '.');
        }
    }

    let startPath = [];

    flood(grid.dump(), _start, startPath);
    /**
     * for each key in keys with distance, 
     * store new key and door state
     * key marked as "found", corresponding door marked as "unlocked"
     * if all keys found, set the steps value
     * OR if the path so far is greater than the solution.steps do not continue
     * OTHERWISE keep going: push new values into flood and find
     */

    for (const key in keysWithDistance) {
        console.log(`for const ${key}`);
        // Find all reachable keys
        if (keysWithDistance[key].distance) {
            // Continue finding if the total number of steps is less than the best solution so far
            const totalStepsToNextKey = keysWithDistance[key].distance + solution.steps;
            if (solution.steps === null || totalStepsToNextKey < solution.steps) {
                let newKeys = objCopy(_keys);
                newKeys[key].found = true;
                let newDoors = objCopy(_doors);
                if (key.toUpperCase() in newDoors) {
                    newDoors[key.toUpperCase()].unlocked = true;
                }

                //TODO: I'm not sure about when to do this
                const newSteps = steps + keysWithDistance[key].distance;

                //TODO: If all keys found, mark the solution
                let allKeysFound = true;
                for (const k in newKeys) {
                    allKeysFound = allKeysFound && !!newKeys[k].found;
                }
                if (allKeysFound) {
                    solution.steps = newSteps;
                } else {
                    const newStart = {
                        x: keysWithDistance[key].x,
                        y: keysWithDistance[key].y
                    };
                    floodAndFind(grid.dump(), newStart, newSteps, newDoors, newKeys);
                }

            }
        }
    }

    //TODO: Maybe this should just keep track of the steps?
    function flood(_gridState, _pos, _path) {
        const floodGrid = grid2D(_gridState);

        moves.forEach(move => {
            let path = [..._path];
            let drP = objCopy(_pos);
            drP.x += move.dx;
            drP.y += move.dy;

            const gridAtPosition = floodGrid.get(drP.x, drP.y).value;
            //if (gridAtPosition === '@') return; // going in circles

            // No walls or shorter paths
            if (!(gridAtPosition === '#' || gridAtPosition <= path.length)) {
                // if key found, add to keysWithDistance and return
                if (/[a-z]/.test(gridAtPosition)) {
                    // There MUST be easier logic than this. This is a mess. Math.min?
                    if (keysWithDistance[gridAtPosition].distance) {
                        // already found
                        if (keysWithDistance[gridAtPosition].distance > path.length + 1) {
                            keysWithDistance[gridAtPosition].distance = path.length + 1;
                        }
                    } else {
                        keysWithDistance[gridAtPosition].distance = path.length + 1;
                    }
                    return;
                }

                // if value, set to length and keep flooding
                path.push(`x${drP.x}y${drP.y}`); //maybe do this sooner? maybe record key name
                floodGrid.set(drP.x, drP.y, path.length + 1);
                flood(floodGrid.dump(), drP, path);
            }
        });
    }
}

/**
 * Returns the distance from p1 to p2
 * @param {x, y} p1 
 * @param {x, y} p2 
 * Returns false if there is no valid path
 */
function getPath(p1, p2, grid) {
    // is the grid relative?
}

function explore() {

}

function objCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

console.log(`Part 1: ${solution.steps} steps`);

// End Process (gracefully)
process.exit(0);