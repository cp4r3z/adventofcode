/**
 * https://adventofcode.com/2017/day/22
 */

const fs = require('fs'),
    _ = require('underscore');

const input = 'input.txt',
    file = fs.readFileSync(input, "utf8"),
    lines = file.split("\n"),
    size = lines.length;

// Populate the layer object
let grid = {};

for (let i = 0; i < lines.length; i++) {
    //lines[i]
    for (let j = 0; j < lines[i].length; j++) {
        
    }
}
console.log('test')