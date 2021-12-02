/**
 * https://adventofcode.com/2021/day/1
 */

import { multiLine } from '../../common/parser.mjs';

// Parse Input
let inputFilePath = new URL('./input.txt', import.meta.url);
const arrInput = multiLine.toIntArray(inputFilePath);

const largerThanPrevious = (total, cur, i, a) => {
    return total += (a[i] > a[i - 1]) ? 1 : 0;
};

const part1 = arrInput.reduce(largerThanPrevious, 0);

console.log(`\nYear 2021 Day 01 Part 1 Solution: ${part1}`);

const part2 = arrInput
    .map((cur, i, a) => {
        return cur + a[i + 1] + a[i + 2];
    })
    .reduce(largerThanPrevious, 0)

console.log(`\nYear 2021 Day 02 Part 2 Solution: ${part2}`);

// End Process (gracefully)
process.exit(0);
