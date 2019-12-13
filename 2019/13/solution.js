/**
 * https://adventofcode.com/2019/day/11
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

let i = 0;
let output = true;
let tile = {
    x: null,
    y: null,
    type: null
};
do {

    output = computer.run(true,1); // Unsure of input signal
    switch (i) {
        case 0:
            //x pos
            tile.x = output;
            break;
        case 1:
            //y pos
            tile.y = output;
            break;
        case 2:
            //type
            tile.type = output;
            grid.set(tile.x,tile.y,tile.type);
            break;
    }
    i = i < 2 ? i + 1 : 0;
} while (output!==false);

//console.log(Object.keys(grid.dump()).length);

let blocks=0;

for (let coor in grid.grid){
    if (grid.grid[coor].value===2) blocks++;
}
console.log(blocks);

// End Process (gracefully)
process.exit(0);