/**
 * https://adventofcode.com/2020/day/14
 */

import { multiLine } from '../../common/parser.mjs';

// Parse Input
const inputFilePath = new URL('./input.txt', import.meta.url);
const arrInput = multiLine.toStrArray(inputFilePath);

const program = [];

let instructionSet = {};
instructionSet.instructions = [];

arrInput.forEach(line => {
    if (line.includes('mask')) {
        if (instructionSet.hasOwnProperty('mask')) program.push(instructionSet);
        const reResult = /mask = ([\w\d]+)/.exec(line);
        instructionSet = {};
        instructionSet.instructions = [];
        instructionSet.mask = reResult[1].split('');
    } else {
        const reResult = /mem\[(\d+)\] = (\d+)/.exec(line);
        const mem = parseInt(reResult[1], 10);
        const value = parseInt(reResult[2]);
        instructionSet.instructions.push({ mem, value });
    }
});

//console.log(`Year 2020 Day 13 Part 1 Solution: ${part1}`);

// End Process (gracefully)
process.exit(0);