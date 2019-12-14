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

let score = null;
let blocks = 1;

let pos = {
    paddle: 10,
    ball: 10
};

// TODO: Set mem
computer.set(0, 2);

do {


    do {

        let tilt = pos.ball - pos.paddle;
        if (tilt > 0) tilt = 1;
        if (tilt < 0) tilt = -1;
        //console.log('tilt: ' + tilt)

        output = computer.run(true, tilt);
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
                if (tile.x === -1 && tile.y === 0) {
                    //score
                    score = output;
                    break;
                }
                if (output === 3) pos.paddle = tile.x; //paddle
                if (output === 4) pos.ball = tile.x; //ball
                grid.set(tile.x, tile.y, tile.type);
                break;
        }
        i = i < 2 ? i + 1 : 0;
        blocks = 0;
        for (let coor in grid.grid) {
            if (grid.grid[coor].value === 2) blocks++;
        }
        //console.log('blocks: ' + blocks);

        //grid.print(true);
    } while (output !== false);

    //console.log(Object.keys(grid.dump()).length);

    blocks = 0;
    for (let coor in grid.grid) {
        if (grid.grid[coor].value === 2) blocks++;
    }
    console.log('blocks: ' + blocks);

    grid.print(true);


} while (blocks > 0);
//output score

//new function that takes an input and returns.... score? number of blocks? position of ball and position of paddle



// End Process (gracefully)
process.exit(0);