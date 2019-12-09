/**
 * https://adventofcode.com/2019/day/9
 */

const intCode = require('./intcode.mjs');
const parser = require('./parser.mjs');
const sc = require('./scalableCollection.mjs');

// Parse Input
let inputFileName = 'input.txt';
const arrInput = parser.singleLine.commaSeparated.toIntArray(inputFileName);
const colInput = sc();
colInput.setFromArray(arrInput);

const register = intCode(
    {
        intCodes: colInput.dump(), // Use the puzzle input array for initial intCodes
        phase: 1 // Phase doesn't matter for this puzzle. Careful using 0...
    }
);

let output = false;
do {
    output = register.run(1, 1);
    if (output) console.log(`Part 1: ${output}`);
}
while (output !== false);

output=false;
do {
    output = register.run(1, 2);
    if (output) console.log(`Part 2: ${output}`);
}
while (output !== false);

// End Process (gracefully)
process.exit(0);