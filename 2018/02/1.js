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

console.log(`Solution 1: ${matchesCount(2) * matchesCount(3)}`);

function arraysOffByOne(targetArray, compareArray) {
    const matchArray = targetArray
        // Compare both arrays and reduce to number of matches
        .map((cur, i, a) => cur != compareArray[i])
        .reduce((acc, cur) => acc + (cur ? 1 : 0));
    if (matchArray == 1) {
        return targetArray.reduce((acc, cur, i) => acc + ((cur == compareArray[i]) ? cur : ''));
    }
    else return false;
}

for (var i = 0; i < lines.length; i++) {
    for (var j = i + 1; j < lines.length; j++) {
        const box = arraysOffByOne(lines[i], lines[j]);
        if (box) {
            console.log(`Solution 2: ${box}`);
            break;
        }
    }
}
