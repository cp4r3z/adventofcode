/**
 * https://adventofcode.com/2015/day/1
 */

import { singleLine } from '../../common/parser.mjs';

// Parse Input
let inputFilePath = new URL('./input.txt', import.meta.url);
const arrInput = singleLine.notSeparated.toStrArray(inputFilePath);

const part1 = arrInput
    .map(paren => paren === '(' ? 1 : -1)
    .reduce((prev, curr) => prev + curr, 0);

console.log(`Year 2015 Day 01 Part 1 Solution: ${part1}`);

const part2Arr = arrInput
    .map(paren => paren === '(' ? 1 : -1);

let part2;
let floor = 0;

for (let i = 0; i < part2Arr.length; i++) {
    floor += part2Arr[i];
    if (floor < 0) {
        part2 = i + 1;
        break;
    }
}

console.log(`Year 2015 Day 01 Part 2 Solution: ${part2}`);

// End Process (gracefully)
process.exit(0);