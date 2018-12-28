/**
 * https://adventofcode.com/2018/day3
 */

const _ = require('underscore'); // Not used

// Read input into simple array
const file = require('fs').readFileSync('input.txt', 'utf8');
const arrInput = file.split('\n');

// Step 0 - Map Function - Use Regular Expression to parse each row
// Each row is converted to an array [ 0: row, 1: left edge, 2: top edge, 3: width, 4: height ]
const re = /#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/;
const step0 = row => re.exec(row);

// Step 1 - Map Function - Convert to array of objects for ease of use
// x0: left edge, y0: top edge, x: width, y: height
const step1 = row => { return { id: row[1], x0: ~~row[2], y0: ~~row[3], x: ~~row[4], y: ~~row[5] } };

const claims = arrInput
    .map(step0)
    .map(step1);

// Determine max width (x) and max height (y) of array
const arrMax = claims.reduce((max, dim) => {
    max.x = Math.max(max.x, (dim.x0 + dim.x));
    max.y = Math.max(max.y, (dim.y0 + dim.y));
    return max;
}, { x: 0, y: 0 });

// Create a 2D array representing the fabric, addressed as fabric[x][y]
let fabric = Array(arrMax.x).fill(0).map(x => (Array(arrMax.y).fill(0)));

// Fill fabric with claims
claims.forEach(claim => {
    for (var ix = claim.x0; ix < (claim.x0 + claim.x); ix++) {
        for (var iy = claim.y0; iy < (claim.y0 + claim.y); iy++) {
            fabric[ix][iy]++;
        }
    }
});

// Part 1 - Find the amount of overlap
let overlap = 0;
for (var ix = 0; ix < fabric.length; ix++) {
    for (var iy = 0; iy < fabric[0].length; iy++) {
        if (fabric[ix][iy] > 1) overlap++;
    }
}

// Part 2 - Find the claim that does not overlap
let nonoverlapClaimID = "";
claims.forEach(claim => {
    let foundNonOverlap = true;
    for (var ix = claim.x0; ix < (claim.x0 + claim.x); ix++) {
        for (var iy = claim.y0; iy < (claim.y0 + claim.y); iy++) {
            if (fabric[ix][iy] > 1) foundNonOverlap = false;
        }
    }
    if (foundNonOverlap) nonoverlapClaimID = claim.id;
});

console.log(`Part 1 Solution: ${overlap}`);
console.log(`Part 2 Solution: ${nonoverlapClaimID}`);

// End Process (gracefully)
process.exit(0);
