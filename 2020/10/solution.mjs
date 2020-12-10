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

const joltageToIndex = new Map();
sortedAdapters.forEach((adapterJoltage, index) => {
    joltageToIndex[adapterJoltage] = index;
});

// Add the voltage key to this map only when you're sure that all children joltages are known.
const arrangementCache = new Map();

function findArrangements(joltage) {
    if (arrangementCache.has(joltage)){
        return arrangementCache.get(joltage);
    }
    const nextJoltages = findChildren(joltage);
    if (nextJoltages.length===0) return 1;
    const arrangements = nextJoltages.reduce((acc, j) => acc+ findArrangements(j), 0);

    arrangementCache.set(joltage, arrangements);
    // return the number of arrangements
    return arrangements;
}

const arrangementCount = findArrangements(0);

console.log(`\nYear 2020 Day 10 Part 1 Solution: ${arrangementCount}`);

function findChildren(fromJoltage) {
    const validJoltages = [];
    //TODO: Is there a better way to do this?
    if (sortedAdapters.includes(fromJoltage + 1)) validJoltages.push(fromJoltage + 1);
    if (sortedAdapters.includes(fromJoltage + 2)) validJoltages.push(fromJoltage + 2);
    if (sortedAdapters.includes(fromJoltage + 3)) validJoltages.push(fromJoltage + 3);
    return validJoltages;
}


// End Process (gracefully)
process.exit(0);
