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
            fields.set(key,
                {
                    ticketIndex: undefined, // position of value on ticket
                    mms: [mm0, mm1]
                }
            );
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
        return field.mms.some(mm => {
            return value >= mm.Min && value <= mm.Max;
        });
    });
}

let part1 = 0; // ticket scanning error rate
const invalidTickets = [];
nearbyTickets.forEach((ticket,i) => {
    ticket.forEach(value => {
        const TEST = isValueValid(value);
        if (!isValueValid(value)) {
            part1 += value;
            invalidTickets.push(i);
        }
    });
});

console.log(`Year 2020 Day 16 Part 1 Solution: ${part1}`);

let positions = new Array(fields.size).fill(0).map(()=>new Set());

// REMOVE BAD tickets!

const validNearbyTickets = nearbyTickets.filter((v,i)=>invalidTickets.indexOf(i)===-1);

function allPositionsFound(){
    return positions.reduce((acc,cur)=>acc&&(cur.size>0),true);
}

while (!allPositionsFound()) {
    fields.forEach((data, fieldName) => {
        //if (data.ticketIndex) return; // Already known
        positions.forEach((pos, i) => {
            const fieldValidAtPos = validNearbyTickets.every(ticket => {
                const value = ticket[i];
                const isValid = data.mms.some(mm => {
                    return value >= mm.Min && value <= mm.Max;
                });
                return isValid;
            });
            if (fieldValidAtPos) {
                pos.add(fieldName);
                //data.ticketIndex = i;
            }
        });
    });
}

function allPositionsSize1(){
    return positions.reduce((acc,cur)=>acc&&(cur.size===1),true);
}

while (!allPositionsSize1()){
    positions.forEach((posi,i)=>{
        if (posi.size===1){
            const val = posi.values().next().value;
            // remove from others
            positions.forEach((posj,j)=>{
                if (j===i) return;
                posj.delete(val);
            });
        }
    });
}

positions.forEach((pos,i)=>{
    const val = pos.values().next().value;
    fields.get(val).ticketIndex=i;
});

let part2=1;
fields.forEach((data,fieldName)=>{
    if (fieldName.includes('departure')){
        part2*= yourTicket[data.ticketIndex];
    }
});

console.log(`Year 2020 Day 16 Part 2 Solution: ${part2}`);