/**
 * https://adventofcode.com/2020/day/10
 */

import {multiLine} from '../../common/parser.mjs';

// Parse Input
let inputFilePath = new URL('./input.txt', import.meta.url);
const arrInput = multiLine.toIntArray(inputFilePath);

const sortedAdapters = arrInput.sort((a, b) => a - b);
// Add outlet
sortedAdapters.unshift(0);
// Add built-in adapter
const builtInAdapter = arrInput[arrInput.length - 1] + 3;
sortedAdapters.push(builtInAdapter);

let diff1 = 0;
// Note that diff2 is ignored for part 1
let diff3 = 0;

for (let i = 1; i < sortedAdapters.length; i++) {
    const diff = sortedAdapters[i] - sortedAdapters[i - 1];
    if (diff === 1) diff1++;
    if (diff === 3) diff3++;
}

console.log(`\nYear 2020 Day 10 Part 1 Solution: ${diff1 * diff3}`);

// Add the joltage key to this map only when you're sure that all children joltages are known.
const arrangementCache = new Map();

function findArrangements(joltage) {
    if (arrangementCache.has(joltage)){
        return arrangementCache.get(joltage);
    }
    const nextJoltages = findNextJoltages(joltage);
    if (nextJoltages.length===0) return 1;
    const arrangements = nextJoltages.reduce((acc, j) => acc+ findArrangements(j), 0);

    arrangementCache.set(joltage, arrangements);
    // return the number of arrangements
    return arrangements;
}

const arrangementCount = findArrangements(0);
console.log(`\nYear 2020 Day 10 Part 1 Solution: ${arrangementCount}`);

function findNextJoltages(joltage) {
    const validJoltages = [];
    for (let i = 1; i <= 3; i++) {
        if (sortedAdapters.includes(joltage + i)) validJoltages.push(joltage + i);
    }
    return validJoltages;
}


// End Process (gracefully)
process.exit(0);
