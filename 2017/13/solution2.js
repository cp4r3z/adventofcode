/**
 * https://adventofcode.com/2017/day/13
 */

function scan(state, goinup, index) {
    if (layers[index] !== 1) {
        if (goinup) {
            if (state == 1) {
                //go down
                goinup = false;
                state++;
            }
            else {
                state--;
            }
        }
        else {
            //goindown
            if (state == layers[index]) {
                //go up
                goinup = true;
                state--;
            }
            else {
                state++;
            }
        }
    }
    let out = {};
    out.state = state;
    out.goinup = goinup;
    return out;
}

function getSeverity2(i) {
    return layers.reduce((acc, cur, ind) => {
        let caught = 0;
        if ((i + ind) % (cur * 2 - 2) === 0) {
            console.log(`Sev2 Caught at ${ind}!`);
            caught = cur * ind;
        }
        return acc + caught;
    }, 0)
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
            console.log(`Caught at ${i}!`)
            //break; // Doesn't matter the exact severity in solution 2.
        }
        // Increment scanner
        for (let j = 0; j < total; j++) {
            const scanned = scan(states2[j], goinup2[j], j);
            states2[j] = scanned.state;
            goinup2[j] = scanned.goinup;
        }
    }

    //return severity
    return caught2.reduce((a, b) => a + b);
}

const input = 'inputt.txt';

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
    console.log(getSeverity(states, goinup));
    console.log(getSeverity2(delay));
    if (getSeverity(states, goinup) > 0) {
        // Increment scanner
        for (let j = 0; j < total; j++) {
            const scanned = scan(states[j], goinup[j], j);
            states[j] = scanned.state;
            goinup[j] = scanned.goinup;
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
