/**
 * https://adventofcode.com/2020/day/22
 */

import { multiLine } from '../../common/parser.mjs';
import inputArrMjs from './inputArr.mjs';
import tinputArrMjs from './tinputArr.mjs';

// Parse Input
//const inputFilePath = new URL('./input.txt', import.meta.url);
//const arrInput = multiLine.toStrArray(inputFilePath);

const input = inputArrMjs;

let player1 = input.player1;
let player2 = input.player2;

while (player1.length > 0 && player2.length > 0) {
    const p1Turn = player1.shift();
    const p2Turn = player2.shift();

    if (p1Turn > p2Turn) {
        player1 = player1.concat([p1Turn, p2Turn]);
    } else {
        player2 = player2.concat([p2Turn, p1Turn]);
    }
}

const winner = (player1.length > player2.length) ? player1 : player2;

let part1 = 0;

for (let i = 1; i <= winner.length; i++) {
    part1 += i * winner[winner.length - i];
}

console.log(`Year 2020 Day 22 Part 1 Solution: ${part1}`);