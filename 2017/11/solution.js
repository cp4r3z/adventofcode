/**
 * https://adventofcode.com/2017/day/11
 */

const input = 'input.txt';

const fs = require('fs'),
    _ = require('underscore'),
    file = fs.readFileSync(input, "utf8"),
    directions = file.split(",");

/* Hex Grid
  \ n  /
nw +--+ ne
  /    \
-+      +-
  \    /
sw +--+ se
  / s  \
*/

let offset = {ns: 0, we: 0};

_.each(directions, (direction) => {
    switch (direction) {
        case 'n':
            offset.ns += 1;
            break;
        case 'nw':
            offset.ns += 0.5;
            offset.we -= 1;
            break;
        case 'ne':
            offset.ns += 0.5;
            offset.we += 1;
            break;
        case 's':
            offset.ns -= 1;
            break;
        case 'sw':
            offset.ns -= 0.5;
            offset.we -= 1;
            break;
        case 'se':
            offset.ns -= 0.5;
            offset.we += 1;
            break;
        default:
            console.error('Here there be monsters.');
    }
});

console.log(offset);