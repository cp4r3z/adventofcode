/**
 * https://adventofcode.com/2018/day23
 */

const _ = require('underscore'); // Not used?

// Read input into simple array
const arrInput = require('fs').readFileSync('input.txt', 'utf8').split('\n');

// Step 0 - Map Function - Use Regular Expression to parse each row
// Each row is converted to an array [ 0: row, 1:  px, 2: py, 3: vx, 4: vy ]
const re = /pos=<(-*\d+),(-*\d+),(-*\d+)>,\sr=(-*\d+)/;
const step0 = row => re.exec(row);

// Step 1 - Map Function - Convert to array of objects for ease of use
//const step1 = row => { return { x: ~~row[1], y: ~~row[2], z: ~~row[3], r: ~~row[4] } };
const step1 = row => { return { coor: [~~row[1], ~~row[2], ~~row[3]], r: ~~row[4] } };

let points = arrInput
    .map(step0)
    .map(step1);

const largestSignal = _.max(points, p => p.r);

const inRange = points.reduce((total, p) => {
    const inRange = getManhattenDistance(largestSignal.coor, p.coor) <= largestSignal.r;
    return total += inRange ? 1 : 0;
}, 0);

console.log(`Solution 1: Risk = ${inRange}`);

// Helper function which sums the absolute value of the distance between corresponding coordinates
function getManhattenDistance(coorA, coorB) {
    return coorA.reduce((distance, dimA, i) => distance += Math.abs(coorB[i] - dimA), 0);
}

// End Process (gracefully)
process.exit(0);
