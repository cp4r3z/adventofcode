/**
 * https://adventofcode.com/2020/day/11
 */

import {multiLine} from '../../common/parser.mjs';

// Parse Input
let inputFilePath = new URL('./input.txt', import.meta.url);
const arrInput = multiLine.toArrayofStrArrays(inputFilePath);

// Maybe this isn't needed, but surround the whole thing with floor
// Honestly, this might make things a bit confusing when debugging. Shrug.
arrInput.unshift(floorRow());
arrInput.push(floorRow());
arrInput.forEach(r => {
    r.unshift('.');
    r.push('.');
});

/**
 *   x --->
 * y ######
 * | ######
 * v ######
 *
 */

const adjacentTransform = [
    //{y, x}
    {y: -1, x: -1},
    {y: -1, x: 0},
    {y: -1, x: 1},
    {y: 0, x: -1},
    {y: 0, x: 1},
    {y: 1, x: -1},
    {y: 1, x: 0},
    {y: 1, x: 1},
];

let seats = JSON.parse(JSON.stringify(arrInput));

let changed;
let rounds = 0;
let MAX_OCCUPIED = 4;

do {
    rounds++;
    changed = false;
    seats = nextState(seats);
} while (changed);

console.log(`Year 2020 Day 11 Part 1 Solution: ${countOccupied(seats)}`);

// Create a map of first visible seats

const visibleSeats = new Map();
mapSeatsToFirstVisibleSeats();

// Reset the seats
seats = JSON.parse(JSON.stringify(arrInput));
rounds = 0;
MAX_OCCUPIED = 5;

do {
    rounds++;
    changed = false;
    seats = nextState(seats, true);
} while (changed);

console.log(`Year 2020 Day 11 Part 2 Solution: ${countOccupied(seats)}`);

// Adding bool "useNextVisibleForAdjacent" for Part 2
function nextState(_seats, useNextVisibleForAdjacent) {
    const nextSeats = JSON.parse(JSON.stringify(_seats));
    for (let y = 0; y < _seats.length; y++) {
        const row = _seats[y];
        for (let x = 0; x < row.length; x++) {
            const seat = _seats[y][x];
            const nextSeat = nextSeatState(y, x, useNextVisibleForAdjacent);
            if (seat !== nextSeat) changed = true;
            nextSeats[y][x] = nextSeat;
        }
    }
    return nextSeats;
}

// Adding bool "useNextVisibleForAdjacent" for Part 2
function nextSeatState(y, x, useNextVisibleForAdjacent) {
    if (seats[y][x] === '.') return '.'; // floor
    let adjacentSeatCoors;
    if (useNextVisibleForAdjacent) {
        adjacentSeatCoors = visibleSeats.get(JSON.stringify({y, x}));
    } else {
        adjacentSeatCoors = adjacentTransform.map(t => {
            return {y: y + t.y, x: x + t.x};
        });
    }
    const adjacentSeatStates = adjacentSeatCoors.map(c => {
        return seats[c.y][c.x];
    });
    const occupiedCount = adjacentSeatStates.reduce((prev, curr) => {
        return curr === '#' ? prev + 1 : prev;
    }, 0);
    if (seats[y][x] === 'L') {
        if (occupiedCount === 0) return '#';
        return 'L';
    } else {
        // assume #
        if (occupiedCount >= MAX_OCCUPIED) return 'L';
        return '#';
    }
}

function floorRow() {
    return new Array(arrInput[0].length).fill('.');
}

function countOccupied(_seats) {
    let occupied = 0;
    for (let y = 0; y < _seats.length; y++) {
        const row = _seats[y];
        for (let x = 0; x < row.length; x++) {
            if (_seats[y][x] === '#') occupied++;
        }
    }
    return occupied;
}

// Returns an array of all the first seats visible from a given seat
function firstSeatsVisible(y, x) {
    let visibleSeats = [];

    if (arrInput[y][x] === '.') return visibleSeats;

    const seatTEST = seats[y][x];

    adjacentTransform.forEach(transform => {
        let seatVisibleFound = false;

        let seatTestIndexX = x;
        let seatTestIndexY = y;
        let seatTestIndexIsValid = true;

        function seatIndexValid(_y, _x) {
            return _y >= 0 && _y < arrInput.length && _x >= 0 && _x < arrInput[0].length;
        }

        // apply the transform until a seat is found
        while (!seatVisibleFound && seatTestIndexIsValid) {
            //apply transform
            seatTestIndexX += transform.x;
            seatTestIndexY += transform.y;
            seatTestIndexIsValid = seatIndexValid(seatTestIndexY, seatTestIndexX);
            if (!seatTestIndexIsValid) break;
            seatVisibleFound = seats[seatTestIndexY][seatTestIndexX] !== '.';
        }

        if (seatVisibleFound) visibleSeats.push({y: seatTestIndexY, x: seatTestIndexX});
    });

    return visibleSeats;
}

function mapSeatsToFirstVisibleSeats() {
    for (let y = 0; y < seats.length; y++) {
        const row = seats[y];
        for (let x = 0; x < row.length; x++) {

            // Fun fact: You can't use objects as map keys. Boo.
            visibleSeats.set(JSON.stringify({y, x}), firstSeatsVisible(y, x));
        }
    }
}

// End Process (gracefully)
process.exit(0);
