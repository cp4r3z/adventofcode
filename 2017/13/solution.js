/**
 * https://adventofcode.com/2017/day/13
 */

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

for (var i = 0; i <= layers.length; i++) {
    // Move packet into layer and determine if you're caught.
    if (states[i] !== 1 || layers[i] === 1) {
        caught[i] = 0;
    }
    else {
        console.log(`Caught at ${i}!`)
    }
    for (var j = 0; j < states.length; j++) {
        if (layers[j] !== 1) {
            if (goinup[j]) {
                if (states[j] == 1) {
                    //go down
                    goinup[j] = false;
                    states[j] = states[j] + 1;
                }
                else {
                    states[j] = states[j] - 1;
                }
            }
            else {
                //goindown
                if (states[j] == layers[j]) {
                    //go up
                    goinup[j] = true;
                    states[j] = states[j] - 1;
                }
                else {
                    states[j] = states[j] + 1;
                }
            }
        }
    }
}

console.log(caught.join(','));

console.log(caught.reduce((a, b) => a + b));