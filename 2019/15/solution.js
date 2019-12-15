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

// Instantiate a "map" object using a 2D grid
const grid = grid2D({}, ".");

// End Process (gracefully)
process.exit(0);