/**
 * https://adventofcode.com/2020/day/16
 */

import { multiLine } from '../../common/parser.mjs';

// Parse Input
const inputFilePath = new URL('./input.txt', import.meta.url);
const arrInput = multiLine.toStrArray(inputFilePath);

class MinMax {
    constructor(min, max) {
        this.Min = min;
        this.Max = max;
    }
}

let fields = new Map(); // a map of field to an array of minMax values

const re0 = /(.+): (\d+)-(\d+) or (\d+)-(\d+)/;
let yourTicket = [];
let nearbyTickets = [];

let parseMode = 0; // 0=fields, 1=yours, 2=nearby
arrInput.forEach(line => {
    switch (parseMode) {
        case 0:
            if (line === '') {
                parseMode++;
                break;
            }
            const matches = line.match(re0);
            const key = matches[1];
            const mm0 = new MinMax(parseInt(matches[2]), parseInt(matches[3]));
            const mm1 = new MinMax(parseInt(matches[4]), parseInt(matches[5]));
            fields.set(key, [mm0, mm1]);
            break;
        case 1:
            if (line.includes('ticket')) break;
            if (line === '') {
                parseMode++;
                break;
            }
            yourTicket = line.split(',').map(n => parseInt(n));
            break;
        case 2:
            if (line.includes('ticket')) break;
            nearbyTickets.push(line.split(',').map(n => parseInt(n)));
            break;
        default:
            console.error('bad parsing')
            break;
    }
});

function isValueValid(value) {
    return [...fields.values()].some(field => {        
        return field.some(mm => {
            return value >= mm.Min && value <= mm.Max;
        });
    });
}

let part1 = 0; // ticket scanning error rate
nearbyTickets.forEach(ticket => {
    ticket.forEach(value => {
        const TEST = isValueValid(value);
        if (!isValueValid(value)) { 
            part1 += value;
         }
    });
});

console.log(`Year 2020 Day 16 Part 1 Solution: ${part1}`);