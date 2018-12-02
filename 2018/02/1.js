/**
 * https://adventofcode.com/2018/day/2
 */

const fs = require('fs');

const input = 'input.txt';
const file = fs.readFileSync(input, 'utf8');
let lines = file.split('\n');
lines = lines.map(line => {
    return line.split('');
});

function matchesCount(multiple) {
    return lines
        .map(line => {
            return line.reduce((has, curChar, i, lineArray) => {
                // Return either a true accumulator (already found a match) or filter down the list to characters with a match
                return has == true || lineArray.filter(c => c == curChar).length == multiple;
            });
        })
        .reduce((count, line) => count + (line ? 1 : 0));
}

console.log(`Answer: ${matchesCount(2) * matchesCount(3)}`);
