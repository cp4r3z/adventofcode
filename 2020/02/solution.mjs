/**
 * https://adventofcode.com/2020/day/2
 */

import {multiLine} from '../../common/parser.mjs';

// Parse Input
let inputFilePath = new URL('./input.txt', import.meta.url);
const arrInput = multiLine.toStrArray(inputFilePath);

const reLine = /(\d+)-(\d+) (\w): (\w+)/;

const validPasswords = arrInput.filter(line => {
    const policy = reLine.exec(line);
    const min = policy[1];
    const max = policy[2];
    const letter = policy[3];
    const password = policy[4];
    const letterCount = [...password].filter(l => l === letter).length;
    const isValid = letterCount >= min && letterCount <= max;
    return isValid;
});

console.log(`\nYear 2020 Day 02 Part 1 Solution: ${validPasswords.length}`);

const validPasswordsOfficial = arrInput.filter(line => {
    const policy = reLine.exec(line);
    const index1 = policy[1] - 1;
    const index2 = policy[2] - 1;
    const letter = policy[3];
    const password = policy[4];
    const isValid1 = [...password][index1] === letter;
    const isValid2 = [...password][index2] === letter;
    return isValid1 ^ isValid2; // Hey, a rare use for bitwise XOR X-)
});

console.log(`\nYear 2020 Day 02 Part 2 Solution: ${validPasswordsOfficial.length}`);

// End Process (gracefully)
process.exit(0);
