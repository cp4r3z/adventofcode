/**
 * https://adventofcode.com/2020/day/11
 */

import { multiLine } from '../../common/parser.mjs';

// Parse Input
let inputFilePath = new URL('./input.txt', import.meta.url);
const arrInput = multiLine.toArrayofStrArrays(inputFilePath);

// Maybe this isn't needed, but surround the whole thing with floor
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
    { y: -1, x: -1 },
    { y: -1, x: 0 },
    { y: -1, x: 1 },
    { y: 0, x: -1 },
    { y: 0, x: 1 },
    { y: 1, x: -1 },
    { y: 1, x: 0 },
    { y: 1, x: 1 },
];

let seats = JSON.parse(JSON.stringify(arrInput));

let changed;
let rounds = 0;

do {
    rounds++;
    changed = false;
    seats = nextState(seats);
} while (changed);

console.log(`Year 2020 Day 11 Part 1 Solution: ${countOccupied(seats)}`);

function nextState(_seats){
    const nextSeats = JSON.parse(JSON.stringify(_seats));
    for (let y = 0; y < _seats.length; y++) {
        const row = _seats[y];
        for (let x = 0; x < row.length; x++) {
            //const col = row[x];
            const seat = _seats[y][x];
            const nextSeat = nextSeatState(y,x);
            if (seat !== nextSeat) changed = true;
            nextSeats[y][x] = nextSeat;
        }
        
    }
    return nextSeats;
}

function nextSeatState(y, x) {
    if (seats[y][x] === '.') return '.'; // floor
    const adjacentSeatCoors = adjacentTransform.map(t => {
        return { y: y + t.y, x: x + t.x };
    });
    const adjacentSeatStates = adjacentSeatCoors.map(c => {
        return seats[c.y][c.x];
    });
    const occupiedCount = adjacentSeatStates.reduce((prev, curr) => {
        return curr === '#' ? prev + 1 : prev;
    }, 0);
    if (seats[y][x] === 'L') {
        if (occupiedCount===0) return '#';
        return 'L';
    } else {
        // assume #
        if (occupiedCount>3) return 'L';
        return '#';
    }
}

function floorRow() {
    return new Array(arrInput[0].length).fill('.');
}

function countOccupied(_seats){
    let occupied=0;
    for (let y = 0; y < _seats.length; y++) {
        const row = _seats[y];
        for (let x = 0; x < row.length; x++) {
            if (_seats[y][x]==='#')occupied++;
        }        
    }
    return occupied;
}

// End Process (gracefully)
process.exit(0);