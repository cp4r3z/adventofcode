/**
 * https://adventofcode.com/2019/day/5
 */

const run = require('./intcode.mjs').run;
const parser = require('./parser.mjs');

// Parse Input

const inputFileName = 'inputFrom2.txt';
const arrInput = parser.singleLine.commaSeparated.toIntArray(
    require('fs').readFileSync(`${__dirname}/${inputFileName}`, 'utf8')
);

const test = run(12, 2, arrInput);
console.log(test);