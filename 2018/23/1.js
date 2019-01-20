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

// Find min/max of all?

let min = {};
let max = {};

points.forEach(p => {
    if (!min.x || p.coor[0] < min.x) min.x = p.coor[0];
    if (!min.y || p.coor[1] < min.y) min.y = p.coor[1];
    if (!min.z || p.coor[2] < min.z) min.z = p.coor[2];
    if (!max.x || p.coor[0] > max.x) max.x = p.coor[0];
    if (!max.y || p.coor[1] > max.y) max.y = p.coor[1];
    if (!max.z || p.coor[2] > max.z) max.z = p.coor[2];
});

let allPoints = [];

// Yeah, this is crazy sauce:
/*
for (var ix = min.x; ix <= max.x; ix++) {
    for (var iy = min.y; iy <= max.y; iy++) {
        for (var iz = min.z; iz <= max.z; iz++) {
            allPoints.push({
                x: ix,
                y: iy,
                z: iz
            })
        }
    }
}
*/

let octs = createOcts(min, max);
let maxOcts = [];

// Assume min and max both have x, y and z params
function createOcts(_min, _max) {
    let _mid = {};
    _mid.x = Math.round((_max.x + _min.x) / 2);
    _mid.y = Math.round((_max.y + _min.y) / 2);
    _mid.z = Math.round((_max.z + _min.z) / 2);

    let octs = Array(8).fill(0).map(o => {
        return {
            min: { x: 0, y: 0, z: 0 },
            max: { x: 0, y: 0, z: 0 }
        };
    });
    //let out = Array(size.ymax - size.ymin + 1).fill(0).map(x => (Array(size.xmax - size.xmin + 1).fill(".")));

    octs[0].min.x = _min.x;
    octs[0].min.y = _min.y;
    octs[0].min.z = _min.z;
    octs[0].max.x = _mid.x;
    octs[0].max.y = _mid.y;
    octs[0].max.z = _mid.z;

    octs[1].min.x = _mid.x + 1; //
    octs[1].min.y = _min.y;
    octs[1].min.z = _min.z;
    octs[1].max.x = _max.x; //
    octs[1].max.y = _mid.y;
    octs[1].max.z = _mid.z;

    octs[2].min.x = _min.x;
    octs[2].min.y = _mid.y + 1; //
    octs[2].min.z = _min.z;
    octs[2].max.x = _mid.x;
    octs[2].max.y = _max.y; //
    octs[2].max.z = _mid.z;

    octs[3].min.x = _min.x;
    octs[3].min.y = _min.y;
    octs[3].min.z = _mid.z + 1; //
    octs[3].max.x = _mid.x;
    octs[3].max.y = _mid.y;
    octs[3].max.z = _max.z; //

    octs[4].min.x = _mid.x + 1; //
    octs[4].min.y = _mid.y + 1; //
    octs[4].min.z = _min.z;
    octs[4].max.x = _max.x; //
    octs[4].max.y = _max.y; //
    octs[4].max.z = _mid.z;

    octs[5].min.x = _mid.x + 1; //
    octs[5].min.y = _min.y;
    octs[5].min.z = _mid.z + 1; //
    octs[5].max.x = _max.x; //
    octs[5].max.y = _mid.y;
    octs[5].max.z = _max.z; //

    octs[6].min.x = _min.x;
    octs[6].min.y = _mid.y + 1; //
    octs[6].min.z = _mid.z + 1; //
    octs[6].max.x = _mid.x;
    octs[6].max.y = _max.y; //
    octs[6].max.z = _max.z; //

    octs[7].min.x = _mid.x + 1; //
    octs[7].min.y = _mid.y + 1; //
    octs[7].min.z = _mid.z + 1; //
    octs[7].max.x = _max.x; //
    octs[7].max.y = _max.y; //
    octs[7].max.z = _max.z; //

    return octs;
}

// End Process (gracefully)
process.exit(0);
