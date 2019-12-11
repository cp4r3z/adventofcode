/**
 * https://adventofcode.com/2019/day/11
 */

const parser = require('./parser.mjs');
const grid2D = require('./grid2D.mjs');
const intCode = require('./intcode.mjs');

// Parse Input
let inputFileName = 'input.txt';
const arrInput = parser.singleLine.commaSeparated.toIntArray(inputFileName);

const computer = intCode(
    {
        intCodes: arrInput, // Use the puzzle input array for initial intCodes
        phase: 2 // Phase doesn't matter for this puzzle. Careful using 0...
    }
);

// Instantiate a "map" object using a 2D grid
const map = grid2D({}, ".");

//let outputs = {color: false, direction: false};
const outputEnum = {0: 'color', 1: 'direction'};
let outputEnumIndex = 0;

let input = 0; // 0=black, 1=white
let output = false;

let coor = {x: 0, y: 0};
let heading = 'U'; //TODO: make an object for this too. 'U' 'D' 'L' 'R'

let paintedPanels = {};

do {
    const previousColor = map.get(coor.x, coor.y).value;
    input = (previousColor === '#') ? 1 : 0;
    //console.log(`x:${coor.x}, y:${coor.y} = ${input}`);

    // Get output from computer
    output = computer.run(input, 2);


    if (previousColor==='.'){

    } else {
    }

    // Figure out which output we're getting
    const outputType = outputEnum[outputEnumIndex];
    //console.log(outputType);

    if (outputType === 'color') {
        const val = output === 1 ? '#' : ' ';



        console.log(previousColor);
        console.log(val);
        console.log(val!==previousColor && previousColor!=='.');

        map.set(coor.x, coor.y, val); //TODO: Change to a block character for readability
        if (previousColor==='.') {
            paintedPanels[`X${coor.x}Y${coor.y}`] = true;
        } else if(previousColor!==val){
            // console.log(previousColor);
            // console.log(val);
            paintedPanels[`X${coor.x}Y${coor.y}`] = true;
        }


        //97?

        //map.print();
    } else if (outputType === 'direction') {
        // Left
        if (output === 0) {
            if (heading === 'U') heading = 'L';
            else if (heading === 'D') heading = 'R';
            else if (heading === 'L') heading = 'D';
            else if (heading === 'R') heading = 'U';
        }
        // Right
        if (output === 1) {
            if (heading === 'U') heading = 'R';
            else if (heading === 'D') heading = 'L';
            else if (heading === 'L') heading = 'U';
            else if (heading === 'R') heading = 'D';
        }
        if (heading === 'U') coor.y = coor.y + 1;
        else if (heading === 'D') coor.y = coor.y - 1;
        else if (heading === 'L') coor.x = coor.x - 1;
        else if (heading === 'R') coor.x = coor.x + 1;
    } else console.error('Error: outputType');

    //console.log(output); // debugging
    //outputs[outputKey] = output;
    outputEnumIndex = outputEnumIndex === 1 ? 0 : 1;

} while (output !== false);

map.print();
console.log(Object.keys(paintedPanels).length);
// Part 1: 11 and 12 and 96 and 97 and 250 are wrong

// End Process (gracefully)
process.exit(0);