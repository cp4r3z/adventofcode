/**
 * https://adventofcode.com/2019/day/15
 */

const parser = require('./parser.mjs');
const grid2D = require('./grid2D.mjs');
const intCode = require('./intcode.mjs');

// Parse Input
let inputFileName = 'input.txt';
const arrInput = parser.singleLine.commaSeparated.toIntArray(inputFileName);

// Instantiate an intCode computer
const computer = intCode(
    {
        intCodes: arrInput, // Use the puzzle input array for initial intCodes
        phase: true // Phase doesn't matter for this puzzle. Careful using 0...
    }
);

let path = [];

let droidPosition = {
    x: 0,
    y: 0
};

// north (1), south (2), west (3), and east (4)
let moves = [
    {
        input: 1,
        text: 'north',
        dx: 0,
        dy: 1
    },
    {
        input: 2,
        text: 'south',
        dx: 0,
        dy: -1
    },
    {
        input: 3,
        text: 'west',
        dx: -1,
        dy: 0
    },
    {
        input: 4,
        text: 'east',
        dx: 1,
        dy: 0
    }
];

// Instantiate a "map" object using a 2D grid
const grid = grid2D({}, ".");

const pathToStation = findStation({
    intCodes: arrInput, // Use the puzzle input array for initial intCodes
    phase: true // Phase doesn't matter for this puzzle. Careful using 0...
}, droidPosition, []);
/**
 * So... a recursive function...
 * init an intcode computer
 * Explore.
 * Find available routes (anything that is unexplored ('.'))
 * OR if the explored route has a longer (higher) path length / number
 * Set each option to the pathLength +1, and then for each option, explore
 * For each route, explore.
 * Input:
 * Path so far?
 * Dump of intcode state
 * 
 * 
 * Return :
 * Path?
 * Distance ( length of path? )
 * 
 */

function findStation(_intCodeState, _droidPosition, _pathSoFar) {

    // find available moves
    moves.forEach(move => {
        let path = [..._pathSoFar];
        let drP = objCopy(_droidPosition);
        drP.x += move.dx;
        drP.y += move.dy;

        const gridAtPosition = grid.get(drP.x, drP.y).value;
        if (gridAtPosition <= path.length) return false; // also check output.

        // Instatiate intCode
        const computer = intCode(
            {
                intCodes: objCopy(_intCodeState.intCodes), // Use the puzzle input array for initial intCodes
                phase: true // Phase doesn't matter for this puzzle. Careful using 0...
            }
        );

        //move
        const output = computer.run(true, move.input);

        // wall
        if (output === 0) {
            grid.set(drP.x, drP.y, '#');
            //return false;
        }
        // otherwise valid
        path.push(`x${drP.x}y${drP.y}`);

        if (output === 1) {
            grid.set(drP.x, drP.y, path.length + 1);
            return findStation(computer.getState(), drP,path );
        }

        if (output == 2) {
            return path;
        }

    });


}

function objCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// End Process (gracefully)
process.exit(0);