/**
 * https://adventofcode.com/2019/day/18
 */

const parser = require('./parser.mjs');
const grid2D = require('./grid2D.mjs');

// Parse Input
let inputFileName = 'input.txt';
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
    //steps: null,
    steps: 6048, // "cheating" // 6048 is too high, btw
    path: null
};

floodAndFind(map.dump(), start, 0, doors, keys);

// take in a grid state and door/key state and return a list of keys with their distances
// TODO: This should be an object as it's getting complex
function floodAndFind(gridState, _start, steps, _doors, _keys) {
    console.log(`steps=${steps}`);

    // build a grid (top level)

    const d1a = new Date();

    const grid = grid2D(gridState);
    const floodGrid = grid2D(gridState);
   
    const d2a = new Date();
    const diffa = (d2a-d1a)/1000;
    console.log(`Grid build time: ${diffa} sec`);

    
    let keysWithDistance = objCopy(_keys);

    // Mark locked doors as walls
    for (const door in _doors) {
        if (_doors[door].unlocked) {
            grid.set(_doors[door].x, _doors[door].y, '.');
            floodGrid.set(_doors[door].x, _doors[door].y, '.');
        }
        else {
            grid.set(_doors[door].x, _doors[door].y, '#');
            floodGrid.set(_doors[door].x, _doors[door].y, '#');
        }
    }

    // Remove all the found keys
    for (const key in _keys) {
        if (_keys[key].found) {
            grid.set(_keys[key].x, _keys[key].y, '.');
            floodGrid.set(_keys[key].x, _keys[key].y, '.');
        }
    }

    let startPath = [];

    const d1 = new Date();
    flood(_start, startPath);
    const d2 = new Date();
    const diff = (d2-d1)/1000;
    console.log(`Flood time: ${diff} sec`);
    /**
     * for each key in keys with distance, 
     * store new key and door state
     * key marked as "found", corresponding door marked as "unlocked"
     * if all keys found, set the steps value
     * OR if the path so far is greater than the solution.steps do not continue
     * OTHERWISE keep going: push new values into flood and find
     */

    // TODO: Idea for improvement: convert to array, sort by distance, map just keys

    const keyWDArray = Object.keys(keysWithDistance).map(k => {
        return {
            key: k,
            value: keysWithDistance[k]
        };
    }).sort((k1, k2) => {
        if (!k2.value.distance && !k1.value.distance) return 0;
        if (k1.value.distance && !k2.value.distance) return -1;
        if (k2.value.distance && !k1.value.distance) return 1;
        return k1.value.distance - k2.value.distance;
    }).map(keyValue => keyValue.key);//.slice(0, 2); // !!!! REMOVE SLICE !!!!

    for (const key of keyWDArray) {
        //for (const key in keysWithDistance) {
        // Find all reachable keys
        if (keysWithDistance[key].distance) {
            // Continue finding if the total number of steps is less than the best solution so far
            const totalStepsToNextKey = keysWithDistance[key].distance + steps;
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
                    console.log(`Solution Found @ ${newSteps} steps`);
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
    function flood(_pos, _path) {
        
        //const floodGrid = grid2D(_gridState);
        let totalKeysWithDistance = 0;
        for (const k2 in keysWithDistance){
            if (keysWithDistance[k2].distance) totalKeysWithDistance++;
        }
        //if (totalKeysWithDistance>2) return; // !!!!!!! REMOVE!!!!!!!

        // ok, idea for another algorithm...
        // keep moving in the direction of each key to "seed" the grid

        // another idea... walls don't change. kinda. except doors.
        // so, generate a list of all wall coordinates. check against that list?

        // or, a custom 2dgrid that pre-populates all the walls
        // "grid factory"

        // grid build time is like .007 sec
        // flood time takes up to 4 sec!!!

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
                    // maybe this is where we memo-ize?
                }

                if (solution.steps !== null && path.length + 1 >= solution.steps) return;

                // if value, set to length and keep flooding
                path.push(`x${drP.x}y${drP.y}`); //maybe do this sooner? maybe record key name
                floodGrid.set(drP.x, drP.y, path.length + 1);
                flood(drP, path);
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