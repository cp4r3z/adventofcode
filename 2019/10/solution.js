/**
 * https://adventofcode.com/2019/day/10
 */

const parser = require('./parser.mjs');
const grid2D = require('./grid2D.mjs');

// Parse Input
let inputFileName = 'input.txt';
const arrInput = parser.multiLine.toStrArray(inputFileName);

// Instantiate a "map" object using a 2D grid
const map = grid2D({}, ".");

// Set the coordinates of the asteroids
arrInput.forEach((row, y) => {
    row.split('').forEach((val, x) => val === "#" && map.set(x, y, val))
});

const detectionMap = [];

for (let asteroid in map.grid) {

    const detectedAngles = []; // maybe use a set?
    for (let otheroid in map.grid) {
        if (otheroid === asteroid) continue;
        const deltaX = map.grid[otheroid].x - map.grid[asteroid].x;
        const deltaY = map.grid[otheroid].y - map.grid[asteroid].y;
        const angle = calcAngle(deltaX, deltaY);
        if (!detectedAngles.includes(angle)) {
            detectedAngles.push(angle);
        }
    }

    detectionMap.push(
        {
            detected: detectedAngles.length,
            location: `${map.grid[asteroid].x},${map.grid[asteroid].x}`
        }
    );
}

detectionMap.sort((l1, l2) => l2.detected - l1.detected);
console.log(`Part 1: ${detectionMap[0].detected} detected @ ${detectionMap[0].location}`);

// Calculates angle of a right-angle triangle in radians
function calcAngle(x, y) {
    let angle = Math.atan(y / x);
    if (x < 0) angle += 2 * Math.PI * 1 / 2;
    if (x > 0 && y < 0) angle += 2 * Math.PI * 1 / 1;
    //console.log(angle / (2 * Math.PI) * 360);
    return angle;
}

// End Process (gracefully)
process.exit(0);