/**
 * https://adventofcode.com/2017/day/13
 */

function getSeverity(delay) {
    return layers.reduce((acc, cur, i) => acc + ((delay + i) % (cur * 2 - 2) === 0 ? cur * i : 0), 0);
}

const input = 'inputt.txt';

const fs = require('fs'),
    _ = require('underscore');

const file = fs.readFileSync(input, "utf8"),
    lines = file.split("\n"),
    total = 7;

let layers = Array(total).fill(1);

const re = /(\d+): (\d+)/;
for (let line of lines) {
    layers[line.match(re)[1]] = parseInt(line.match(re)[2]);
}

let delay = 0;
let printDelay = 0;
let foundSecurePath = false;

while (!foundSecurePath) {
    //console.log(getSeverity(states, goinup));
    //let test = getSeverity(delay);
    console.log(getSeverity(delay));
    if (getSeverity(delay) === 0) {
        foundSecurePath = true;
    }
    else {
        delay++;
        // if (delay >= printDelay) {
        //     console.log(`Delay: ${delay}`);
        //     printDelay += 10000;
        // }
    }
}
console.log('Delay: ' + delay);
//144 too low
//33199 too low
//33199 * 91 = 3021109 still not right
//171429 is not right.
//171428 is not right.
