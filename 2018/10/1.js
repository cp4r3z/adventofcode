/**
 * https://adventofcode.com/2018/day10
 */

const _ = require('underscore'); // Not used

// Read input into simple array
const file = require('fs').readFileSync('input.txt', 'utf8');
const arrInput = file.split('\n');

// Step 0 - Map Function - Use Regular Expression to parse each row
// Each row is converted to an array [ 0: row, 1:  px, 2: py, 3: vx, 4: vy ]
const re = /position=<\s*(-*\d+),\s*(-*\d+)>\s+velocity=<\s*(-*\d+),\s*(-*\d+)>/;
const step0 = row => re.exec(row);

// Step 1 - Map Function - Convert to array of objects for ease of use
const step1 = row => { return { px: ~~row[1], py: ~~row[2], vx: ~~row[3], vy: ~~row[4] } };

let points = arrInput
    .map(step0)
    .map(step1);

let smallestSize;
let smallestI;

for (var i = 0; i < 110000; i++) {
    const size = getSize().size;
    if (size < smallestSize || !smallestSize) {
        smallestSize = size;
        smallestI = i;
    }
    _.each(points, p => {
        p.px += p.vx;
        p.py += p.vy;
    })
}

//reset
points = arrInput
    .map(step0)
    .map(step1);

for (var i = 0; i < smallestI; i++) {
    _.each(points, p => {
        p.px += p.vx;
        p.py += p.vy;
    })
}

const size = getSize();

let out = Array(size.ymax - size.ymin + 1).fill(0).map(x => (Array(size.xmax - size.xmin + 1).fill(".")));


_.each(points, p => {
    out[p.py - size.ymin][p.px - size.xmin] = '#';
})

out.forEach(y => {
    console.log(y.join(''));
});

function getSize() {
    const xmin = points.reduce((m, p) => p.px < m.px ? p : m);
    const xmax = points.reduce((m, p) => p.px > m.px ? p : m);
    const ymin = points.reduce((m, p) => p.py < m.py ? p : m);
    const ymax = points.reduce((m, p) => p.py > m.py ? p : m);
    const size = (xmax.px - xmin.px) * (ymax.py - ymin.py);
    //console.log(size)
    return {
        xmin: xmin.px,
        xmax: xmax.px,
        ymin: ymin.py,
        ymax: ymax.py,
        size
    };
}
// End Process (gracefully)
process.exit(0);
