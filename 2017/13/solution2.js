/**
 * https://adventofcode.com/2017/day/13
 */

const fs = require('fs');

// Not needed for Solution 2
function getSeverity(delay) {
    return layers.reduce((acc, len, pos) => acc + ((delay + pos) % (len * 2 - 2) === 0 ? len * pos : 0), 0);
}

// Determines whether or not you're caught at a given delay
function gotCaught(delay) {
    return layers.reduce((acc, len, pos) => acc + ((delay + pos) % (len * 2 - 2) === 0 ? true : false), 0);
}

const input = 'input.txt',
    file = fs.readFileSync(input, "utf8"),
    lines = file.split("\n"),
    total = 91; // Explicitly set to the last value of the input, because it's just easier.

// Populate the layer array
let layers = Array(total).fill(1);

const re = /(\d+): (\d+)/;
for (let line of lines) {
    layers[line.match(re)[1]] = parseInt(line.match(re)[2], 10);
}

// Loop until you find a delay in which you're not caught
let delay = 0,
    foundSecurePath = false;

while (!foundSecurePath) {
    //console.log(getSeverity(delay));
    if (!gotCaught(delay)) {
        foundSecurePath = true;
    }
    else delay++;
}
console.log('Delay: ' + delay);
