/**
 * https://adventofcode.com/2017/day/13
 */

const input = 'input.txt';

const fs = require('fs'),
    _ = require('underscore');

const file = fs.readFileSync(input, "utf8"),
    lines = file.split("\n");

let layers = Array(91).fill(1),
    states = Array(91).fill(1),
    caught = _.range(91);

const re = /(\d+): (\d+)/;
for (let line of lines) {
    layers[line.match(re)[1]] = parseInt(line.match(re)[2]);
}

//console.log(layers);

for (var i = 0; i <= 90; i++) {
    if (states[i] == 1 && layers[i] != 1) {
        // caught on line one
        caught[i] = i * layers[i];
    }
    else {
        caught[i] = 0;
    }
    for (var j = 0; j < states.length; j++) {
        states[j] = states[j] + 1;
        if (states[j] > layers[j] || layers[j] == 1) {
            states[j] = 1;
        }
    }
}

console.log(caught.join(','));

console.log(caught.reduce((a, b) => a + b));

//4168 is too high
//236 too low