/**
 * https://adventofcode.com/2020/day/13
 */

import { multiLine } from '../../common/parser.mjs';

// Parse Input
const inputFilePath = new URL('./input.txt', import.meta.url);
const arrInput = multiLine.toStrArray(inputFilePath);

const timeYouDepart = parseInt(arrInput[0]);

const busIDsNoX = arrInput[1]
    .split(',')
    .filter(id => id !== 'x')
    .map(id => parseInt(id, 10));

const busIDsNoXWithNextDeparture = busIDsNoX
    .map(id => {
        const mod = timeYouDepart % id;
        const nextDeparture = id - mod;
        return { id, nextDeparture };
    })
    .sort((a, b) => a.nextDeparture - b.nextDeparture);

const part1 = busIDsNoXWithNextDeparture[0].id * busIDsNoXWithNextDeparture[0].nextDeparture;

console.log(`Year 2020 Day 13 Part 1 Solution: ${part1}`);

// End Process (gracefully)
process.exit(0);