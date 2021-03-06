/**
 * https://adventofcode.com/2018/day12
 */

const _ = require('underscore');

// Read input into simple array
let input_state = require('fs').readFileSync('input_state.txt', 'utf8');
let notes = require('fs').readFileSync('input_notes.txt', 'utf8').split('\n');

// Step 0 - Map Function - Use Regular Expression to parse each row
// Each row is converted to an array [ 0: row, 1:  rule, 2: result ]
const re = /([\.#]{5}) => ([\.#]{1})/;
const step0 = row => re.exec(row);

// Step 1 - Map Function - Convert to array of objects for ease of use
const step1 = row => { return { rule: row[1], result: row[2] } };

notes = notes
    .map(step0)
    .map(step1);

let state = {};
input_state.split('').forEach((s, i) => state[i.toString()] = s);

// Track padding for pretty output
let padding = { first: 0, last: 0 };

// This requires knowledge of the end padding state for an existing run
//let knownPadding = { "first": 2, "last": 3 };
// let knownPadding = { "first": 3, "last": 5 }
let knownPadding = { "first": 3, "last": 33 };
padState(knownPadding);

//const generations = 20;


padState();
//printState();
let genLoop = 0;
let stateRecord = [dePad()];
let foundDuplicate = false;
while (!foundDuplicate) {
    genLoop++;
    padState();
    const minMax = getMinMax();
    const nextGenState = _.mapObject(state, s => s = '.');
    for (var s = minMax.min; s <= (minMax.max - 4); s++) {
        const five = getFive(s);
        notes.forEach(note => {
            if (five == note.rule) {
                nextGenState[(s + 2).toString()] = note.result;
            }
        })
        const test = 0;
    }
    state = nextGenState;
    const stateDepadded = dePad();
    if (stateRecord.indexOf(stateDepadded) > -1) {
        const loopStart = stateRecord.indexOf(stateDepadded);
        //genLoop = stateRecord.length-1-loopStart;
        if (genLoop % 160 == 0) {
            foundDuplicate = true;
            console.log(`Generations Loop every ${genLoop} generations.`);
            // each loop adds 5280
            printTotal();
        }
    }
    else {
        stateRecord.push(stateDepadded);
    }
    //printState();
    
//     Solution 2: Pot Sum: 5335
// Generations Loop every 161 generations.
// Solution 2: Pot Sum: 5368
// Generations Loop every 162 generations.
// Solution 2: Pot Sum: 5401
}

console.log("Padding: " + JSON.stringify(padding));

//OK, so... 
const generations = 50000000000;
const loops = generations / 160;
const solution = loops*5280+55;

//1650000000055 was the answer

// 5335 is too low

function printTotal() {
    // Now add up the pot numbers of all plant containing pots
    const total = _.reduce(state, (memo, potState, potNumber) => {
        if (potState == '#') { return memo += parseInt(potNumber, 10); }
        else {
            return memo;
        }
    }, 0);

    console.log(`Solution 2: Pot Sum: ${total}`);
}

function getMinMax() {
    return {
        min: parseInt(_.min(Object.keys(state).map(s => parseInt(s, 10))), 10),
        max: parseInt(_.max(Object.keys(state).map(s => parseInt(s, 10))), 10)
    }
}

function padState(_padding) {
    if (_padding) {
        for (var i = 0; i < _padding.first; i++) {
            const minMax = getMinMax();
            padFirst(minMax);
        }
        for (var i = 0; i < _padding.last; i++) {
            const minMax = getMinMax();
            padLast(minMax);
        }
    }
    else {
        const minMax = getMinMax();
        //if (state[minMax.min.toString()])
        const firstFive = getFive(minMax.min);
        if (firstFive.indexOf('#') > -1) {
            padding.first++;
            padFirst(minMax);
        }
        const lastFive = getFive(minMax.max - 5);
        if (lastFive.indexOf('#') > -1) {
            padding.last++;
            padLast(minMax);
        }
    }

    function padFirst(_minMax) {
        for (var i = 1; i <= 5; i++) {
            state[(_minMax.min - i).toString()] = '.';
        }
    }

    function padLast(_minMax) {
        for (var i = 1; i <= 5; i++) {
            state[(_minMax.max + i).toString()] = '.';
        }
    }
}

function dePad() {
    const minMax = getMinMax();
    let s = [];
    for (var i = minMax.min; i <= minMax.max; i++) {
        s.push(state[i.toString()]);
    }
    const firstPot = _.indexOf(s, '#');
    const lastPot = _.lastIndexOf(s, '#');
    let sDepadded = _.first(s, lastPot + 1);
    sDepadded = _.last(sDepadded, sDepadded.length - firstPot);
    return sDepadded.join('');
}

function getFive(startIndex) {
    let s = "";
    for (var i = 0; i < 5; i++) {
        s += state[(startIndex + i).toString()];
    }
    return s;
}

function getIntFromKey(o) {
    return parseInt(_.keys(0)[0], 10)
}

function printState() {
    const minMax = getMinMax();
    let stateString = "";
    for (var s = minMax.min; s <= (minMax.max); s++) {
        stateString += state[s.toString()];
    }
    console.log(stateString);
}

// End Process (gracefully)
process.exit(0);
