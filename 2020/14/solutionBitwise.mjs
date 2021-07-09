/**
 * https://adventofcode.com/2020/day/14
 * 
 * This solution uses bitwise operations which is likely the intent of the challenge
 */

import { multiLine } from '../../common/parser.mjs';

// Parse Input
const inputFilePath = new URL('./input.txt', import.meta.url);
const arrInput = multiLine.toStrArray(inputFilePath);

const memory = {};

// Currently active masks
let maskOn;
let maskOff;

arrInput.forEach(line => {
    if (line.includes('mask')) {
        const reResult = /mask = ([\w\d]+)/.exec(line);
        maskOn = BigInt('0b' + reResult[1].replace(/X/g, '0'));
        maskOff = BigInt('0b' + reResult[1].replace(/X/g, '1'));
    } else {
        const reResult = /mem\[(\d+)\] = (\d+)/.exec(line);
        const address = BigInt(reResult[1]);
        let value = BigInt(reResult[2]);
        // Apply masks and store value
        value = value | maskOn & maskOff;
        memory[address] = value;
    }
});

let total = BigInt(0);
for (const address in memory) {
    total += memory[address];
}

// The functional approach works too but the above is just more readable
//total = Object.values(memory).reduce((acc, val) => acc + val, BigInt(0));

console.log(`Year 2020 Day 14 Part 1 Solution: ${total}`);