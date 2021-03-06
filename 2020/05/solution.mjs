/**
 * https://adventofcode.com/2020/day/5
 */

import { multiLine } from '../../common/parser.mjs';

// Parse Input
let inputFilePath = new URL('./input.txt', import.meta.url);
const arrInput = multiLine.toStrArray(inputFilePath);

// Decode the seat position by converting to binary. Maybe this is cheating?
const decodedSeats = arrInput.map(line => {
    const lineBin = line.replace(/F/g, '0').replace(/B/g, '1').replace(/L/g, '0').replace(/R/g, '1');
    const lineDec = parseInt(lineBin, 2);
    return { line, seatID: lineDec };
});

const sortedSeats = decodedSeats.sort((seatA, seatB) => seatB.seatID - seatA.seatID);
const highestSeatID = sortedSeats[0].seatID;

console.log(`Year 2020 Day 05 Part 1 Solution: ${highestSeatID}`);

// Find a "missing" seat ID
let yourSeat;
for (let index = 0; index < sortedSeats.length; index++) {
    if (sortedSeats[index + 1].seatID !== sortedSeats[index].seatID - 1) {
        yourSeat = sortedSeats[index].seatID - 1;
        break;
    }
}

console.log(`Year 2020 Day 05 Part 2 Solution: ${yourSeat}`);