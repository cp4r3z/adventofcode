/**
 * https://adventofcode.com/2017/day/13
 */

const input = __dirname + '\\inputt.txt';

const fs = require('fs'),
    _ = require('underscore');

const file = fs.readFileSync(input, "utf8"),
    lines = file.split("\n"),
    total = 7;

let layers = Array(total).fill(1),
    states = Array(total).fill(1),
    caught = _.range(total);

const re = /(\d+): (\d+)/;
for (let line of lines) {
    layers[line.match(re)[1]] = parseInt(line.match(re)[2]);
}
caught = caught.map((a, i) => a * layers[i]);

for (var i = 0; i <= layers.length; i++) {
    // Move packet into layer and determine if you're caught.
    if (states[i] !== 1 || layers[i] === 1) {
        caught[i] = 0;
    } else {
        console.log(`Caught at ${i}!`)
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