/**
 * https://adventofcode.com/2018/day23
 */

const _ = require('underscore');

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

// Find min/max of all
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

// The main "working" array of "octs" or octants, which are subdivisions of the space
let octs = createOcts(min, max);

let octsRemain = octs.length > 0;

while (octsRemain) {

    // for each, determine if it's a single point
    let rangePoints = octs.filter(isOctAPoint);
    let rangeOcts = octs.filter(isOctNotAPoint);

    // Add any points found
    const pointsFound = rangePoints.map(convertOctToPoint);
    allPoints = allPoints.concat(pointsFound);

    // evaluate currect octs

    if (rangeOcts.length > 0) {
        const bestReception = rangeOcts.reduce((best, oo) => {
            const pointsInOO = pointsInOct(oo);
            return pointsInOO > best ? pointsInOO : best;
        }, 0);
        rangeOcts = rangeOcts.filter(oo => pointsInOct(oo) == bestReception);
        rangeOcts.forEach(o => {
            const subOcts = createOcts(o.min, o.max);
            octs = [];
            subOcts.forEach(so => octs.push(so));
        });
    }
    else {
        octsRemain = false;
    }
}

allPoints.sort((p1, p2) => p2.reception - p1.reception);
const mostRange = allPoints[0].reception;
const pointsMostRange = allPoints.filter(p => p.reception == mostRange).map(p => getManhattenDistance([0, 0, 0], p.coor)).sort((d1, d2) => d2 - d1);

console.log(`Solution 2: Shortest Manhatten Distance = ${pointsMostRange[0]}`);
//Answer: 121493971

// Input array of Points And/Or Octs
// Not used attempt at recursion; Got too out of control.
function findBestReception(arrPsOrOs) {
    // for each, determine if it's a single point
    const Ps = arrPsOrOs.filter(isPoint);
    const Os = arrPsOrOs.filter(isOct);

    // i think this is where you filter out the octs that are points.
    let OsOcts = Os.filter(isOctNotAPoint);

    // somewhere in here we've gotta oct the octs
    let more = [];
    if (OsOcts.length > 0) {
        //todo: probably best to map the reception in...
        const bestReception = OsOcts.reduce((best, oo) => {
            const pointsInOO = pointsInOct(oo);
            return pointsInOO > best ? pointsInOO : best;
        }, 0);
        OsOcts = OsOcts.filter(oo => pointsInOct(oo) == bestReception);
        OsOcts.forEach(o => {
            const subOcts = createOcts(o.min, o.max);
            subOcts.forEach(so => more.push(so));
        });
    }
    // now reduce to the highest octs!

    let morePs = [];
    more.forEach(oct => {
        const ps = findBestReception(createOcts(oct.min, oct.max));
        morePs.push(ps);
    });

    const octPoints = Os.filter(isOctAPoint).map(convertOctToPoint);
    Ps = Ps.concat(octPoints).concat(morePs);

    // now only return the highest ps;
    return Ps;



    // then return a list of the best points and octs
}

function getCoorReception(coor) {
    let reception = 0;
    points.forEach(p => {
        if (getManhattenDistance(coor, p.coor) <= p.r) reception++;
    });
    return reception;
}

function pointsInOct(oct) {
    let pointsInRange = 0;
    points.forEach(p => {
        const withinX = p.coor[0] >= oct.min.x && p.coor[0] <= oct.max.x;
        const withinY = p.coor[1] >= oct.min.y && p.coor[1] <= oct.max.y;
        const withinZ = p.coor[2] >= oct.min.z && p.coor[2] <= oct.max.z;
        if (withinX && withinY && withinZ) {
            // The point is within the Oct
            pointsInRange++;
            return;
        }
        else {
            // Find the closest coor on the Oct (octCoor) to the point
            let octCoor = Array(3).fill(0);
            octCoor[0] = (p.coor[0] > oct.max.x) ? oct.max.x : oct.min.x;
            octCoor[1] = (p.coor[1] > oct.max.y) ? oct.max.y : oct.min.y;
            octCoor[2] = (p.coor[2] > oct.max.z) ? oct.max.z : oct.min.z;
            if (getManhattenDistance(octCoor, p.coor) <= p.r) pointsInRange++;
        }
    });
    return pointsInRange;
}

function isOct(_pOrOct) {
    return 'min' in _pOrOct;
}

function isPoint(_pOrOct) {
    return !('min' in _pOrOct);
}

function convertOctToPoint(oct) {
    const coor = [oct.min.x, oct.min.y, oct.min.z];
    const reception = getCoorReception(coor);
    return {
        coor,
        reception
    };
}

//todo. fix this
function isOctAPoint(_min, _max) {
    return _min.x == _max.x && _min.y == _max.y && _min.z == _max.z;
}

function isOctNotAPoint(_oct) {
    return _oct.max.x > _oct.min.x || _oct.max.z > _oct.min.z || _oct.max.z > _oct.min.z;
}

// Assume min and max both have x, y and z params
// There's got to be a better way to do this. I went about it the long way.
function createOcts(_min, _max) {
    let _mid = {};

    _mid.x = (_max.x - _min.x == 1) ? _min.x : Math.floor((_max.x + _min.x) / 2);
    _mid.y = (_max.y - _min.y == 1) ? _min.y : Math.floor((_max.y + _min.y) / 2);
    _mid.z = (_max.z - _min.z == 1) ? _min.z : Math.floor((_max.z + _min.z) / 2);

    let octs = Array(8).fill(0).map(o => {
        return {
            min: { x: 0, y: 0, z: 0 },
            max: { x: 0, y: 0, z: 0 }
        };
    });

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

// Helper function which sums the absolute value of the distance between corresponding coordinates
function getManhattenDistance(coorA, coorB) {
    return coorA.reduce((distance, dimA, i) => distance += Math.abs(coorB[i] - dimA), 0);
}

// End Process (gracefully)
process.exit(0);
