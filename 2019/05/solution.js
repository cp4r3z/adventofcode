/**
 * https://adventofcode.com/2019/day/5
 */

const run = require('./intcode.mjs').run;
const parser = require('./parser.mjs');

// Parse Input

let inputFileName = 'input.txt';
const arrInput = parser.singleLine.commaSeparated.toIntArray(
    require('fs').readFileSync(`${__dirname}/${inputFileName}`, 'utf8')
);

console.log('\nPart 1...');
run(1, arrInput);
console.log('\nPart 2...');
run(5, arrInput);

// End Process (gracefully)
process.exit(0);