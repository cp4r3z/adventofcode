/**
 * https://adventofcode.com/2019/day/5
 */

const run = require('./intcode.mjs').run;
const parser = require('./parser.mjs');

// Parse Input

const inputFileName = 'input.txt';
const arrInput = parser.singleLine.commaSeparated.toIntArray(
    require('fs').readFileSync(`${__dirname}/${inputFileName}`, 'utf8')
);

run(1, 2, arrInput);

// End Process (gracefully)
process.exit(0);