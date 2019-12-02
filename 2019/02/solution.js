/**
 * https://adventofcode.com/2019/day/2
 */

// Read input into an array (arrInput)
const input = require('fs').readFileSync('input.txt', 'utf8');
const arrInput = input
    .trim()                     // Remove whitespace
    .replace(/\n$/, "")         // Remove trailing line return
    .split(',')                 // Split by delimiter
    .map(s => parseInt(s, 10)); // Convert to integers. See also parseFloat() and Number()

let intCodes = [...arrInput];

// "1202 program alarm" state
intCodes[1] = 12;
intCodes[2] = 2;

let pos = 0;
let posOpCode = intCodes[pos];

while (posOpCode !== 99 && pos <= intCodes.length) {
    const intList = intCodes.slice(pos, pos + 4);
    switch (intList[0]) {
        case 1:
            // Addition
            intCodes[intList[3]] = intCodes[intList[1]] + intCodes[intList[2]];
            break;
        case 2:
            //Multiplication
            intCodes[intList[3]] = intCodes[intList[1]] * intCodes[intList[2]];
            break;
        default:
            console.error("Unknown Command");
    }
    pos = pos + 4;
    posOpCode = intCodes[pos];
}

console.log(`Part 1: position 0 = ${intCodes[0]}`);

// End Process (gracefully)
process.exit(0);