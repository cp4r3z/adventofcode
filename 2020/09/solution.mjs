/**
 * https://adventofcode.com/2020/day/9
 */

import { multiLine } from '../../common/parser.mjs';

// Parse Input
let inputFilePath = new URL('./input.txt', import.meta.url);
const arrInput = multiLine.toIntArray(inputFilePath);

const PREAMBLE = 25;

let sumMissing = false;

// workingValidSums is a pass of sets representing 
// the valid sums in the last <PREAMBLE> lines in the array.
// I would suppose this saves memory and reduces duplicate calculations.
let workingValidSums = [];

let i = 0;
while (!sumMissing) {
    sumMissing = true;
    const number = arrInput[i];

    if (workingValidSums.length === PREAMBLE) workingValidSums.shift();

    for (let set = 0; set < workingValidSums.length; set++) {
        const validSet = workingValidSums[set];
        if (validSet.has(number)) {
            sumMissing = false;
            break;
        }
    }

    workingValidSums.push(validSums(i, PREAMBLE));
    if (i < PREAMBLE) sumMissing = false;
    if (!sumMissing) i++;
}

const part1 = arrInput[i];
console.log(`Year 2020 Day 08 Part 1 Solution: ${part1}`);

let contiguousFound = false;
let jStart = 0;
let jEnd;
while (!contiguousFound && jStart < arrInput.length) {
    jEnd = jStart;
    let jSum = 0;
    while (!contiguousFound && jSum <= part1) {
        jSum += arrInput[jEnd];
        contiguousFound = jSum === part1;
        if (contiguousFound) break;
        jEnd++;
    }
    if (contiguousFound) break;
    jStart++;
}

const part2SubArr = arrInput.slice(jStart,jEnd).sort();
const part2 = part2SubArr[0] + part2SubArr[part2SubArr.length-1];

console.log(`Year 2020 Day 08 Part 2 Solution: ${part2}`);

// fromIndex is the row for which we generate sums
// preamble is the number of indices to search back
// returns a set
function validSums(fromIndex, preamble) {
    const number = arrInput[fromIndex];
    const indexStart = Math.max(fromIndex - preamble, 0);
    const sums = new Set();
    for (let i = indexStart; i < fromIndex; i++) {
        sums.add(number + arrInput[i]);
    }
    return sums;
}

// End Process (gracefully)
process.exit(0);