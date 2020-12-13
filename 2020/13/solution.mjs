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

// Create an array representing the bus schedule with the intervals between arrivals. Order is important.
const busIDs = [];

arrInput[1]
    .split(',').forEach((id, i) => {
        if (id === 'x') return;
        busIDs.push({
            id: parseInt(id, 10),
            offset: i
        });
    });

let t = 0;
let interval = busIDs[0].id; // Interval for testing whether the current arrivals meet the requirements
let busEvalIndex = 1; // this is the index of busID that you're currently evaluating

function isBusOffsetCorrect() {
    const tPlusOffset = t + busIDs[busEvalIndex].offset;
    const tModID = tPlusOffset % busIDs[busEvalIndex].id; // Offset time is a multiple of the bus ID
    return tModID === 0;
}

do {
    t += interval;

    // is the offset to the next arrival correct?
    if (isBusOffsetCorrect()) {
        const lastBus = busEvalIndex === busIDs.length - 1;
        if (lastBus) break;

        // have we seen it before?
        const hasAlignedBefore = busIDs[busEvalIndex].firstAlignmentTime;
        if (hasAlignedBefore) {

            const alignmentInterval = t - busIDs[busEvalIndex].firstAlignmentTime;
            interval = alignmentInterval;

            // Increment the bus being evaluated
            busEvalIndex++;
        } else {
            // ok, it's aligning. Now we store the time and wait for it to happen again
            busIDs[busEvalIndex].firstAlignmentTime = t;
        }
    }

} while (busEvalIndex < busIDs.length);

console.log(`Year 2020 Day 13 Part 1 Solution: ${t}`);

// End Process (gracefully)
process.exit(0);