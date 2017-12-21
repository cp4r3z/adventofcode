/**
 * https://adventofcode.com/2017/day/13
 */

function scan(states, goinup, index) {
    let states2 = states.slice();
    let goinup2 = goinup.slice();
    if (layers[index] !== 1) {
        if (goinup2[index]) {
            if (states2[index] == 1) {
                //go down
                goinup2[index] = false;
                states2[index] = states2[index] + 1;
            }
            else {
                states2[index] = states2[index] - 1;
            }
        }
        else {
            //goindown
            if (states2[index] == layers[index]) {
                //go up
                goinup2[index] = true;
                states2[index] = states2[index] - 1;
            }
            else {
                states2[index] = states2[index] + 1;
            }
        }
    }
    let out = {};
    out.states = states2;
    out.goinup = goinup2;
    return out;
}

function getSeverity(states, goinup) {

    let caught2 = _.range(total);
    caught2 = caught2.map((a, i) => a * layers[i]);

    let goinup2 = goinup.slice();
    let states2 = states.slice();

    for (let i = 0; i < total; i++) {
        // Move packet into layer and determine if you're caught.
        if (states2[i] !== 1 || layers[i] === 1) {
            caught2[i] = 0;
        }
        else {
            //console.log(`Caught at ${i}!`)
            break; // Doesn't matter the exact severity in solution 2.
        }
        // Increment scanner
        for (let j = 0; j < total; j++) {
            let scanned = scan(states2, goinup2, j);
            states2 = scanned.states;
            goinup2 = scanned.goinup;
        }
    }

    //return severity
    return caught2.reduce((a, b) => a + b);
}

const input = 'input.txt';

const fs = require('fs'),
    _ = require('underscore');

const file = fs.readFileSync(input, "utf8"),
    lines = file.split("\n"),
    total = 91;

let layers = Array(total).fill(1),
    states = Array(total).fill(1),
    caught = _.range(total),
    goinup = Array(total).fill(false);

const re = /(\d+): (\d+)/;
for (let line of lines) {
    layers[line.match(re)[1]] = parseInt(line.match(re)[2]);
}
caught = caught.map((a, i) => a * layers[i]);

let delay = 0;
let printDelay = 0;
let foundSecurePath = false;

while (!foundSecurePath) {
    if (getSeverity(states, goinup) > 0) {
        // Increment scanner
        for (let j = 0; j < total; j++) {
            let scanned = scan(states, goinup, j);
            states = scanned.states;
            goinup = scanned.goinup;
        }
        delay++;
        if (delay >= printDelay) {
            console.log(`Delay: ${delay}`);
            printDelay += 10000;
        }
    }
    else {
        foundSecurePath = true;
    }
}
console.log('Delay: ' + delay);
//144 too low
//33199 too low
//33199 * 91 = 3021109 still not right
