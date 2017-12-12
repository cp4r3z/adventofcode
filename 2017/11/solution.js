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

function getSteps() {
    //console.log(offset);
    let up = Math.abs(offset.ns);
    const over = Math.abs(offset.we);
    if (up > over) {
        up -= over / 2
        return up;
    }
    else {
        return over;
    }

}

let offset = { ns: 0, we: 0 };
let lastSteps = 0;
let maxSteps = 0;

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
    lastSteps = getSteps();
    if (lastSteps > maxSteps) maxSteps = lastSteps;
});

// console.log(offset);
// console.log(lastSteps);
// console.log(maxSteps);

console.log(`Part 1: The child was last ${lastSteps} steps away from the start.\nPart 2: The child had traveled as much as ${maxSteps} steps.`)