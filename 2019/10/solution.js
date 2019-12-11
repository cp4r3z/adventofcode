/**
 * https://adventofcode.com/2019/day/10
 */

const parser = require('./parser.mjs');
const grid2D = require('./grid2D.mjs');



// console.log(calcAngle(0, 1));
// console.log(calcAngle(1, 1));
// console.log(calcAngle(1, 0));
// console.log(calcAngle(1, -1));
// console.log(calcAngle(0, -1));
// console.log(calcAngle(-1, -1));
// console.log(calcAngle(-1, 0));
// console.log(calcAngle(-1, 1));

// process.exit(0);

// Parse Input
let inputFileName = 'input.txt';
const arrInput = parser.multiLine.toStrArray(inputFileName);

// Instantiate a "map" object using a 2D grid
const map = grid2D({}, ".");

// Set the coordinates of the asteroids
arrInput.forEach((row, y) => {
    row.split('').forEach((val, x) => val === "#" && map.set(x, -y, val));
});

const detectionMap = [];

for (let asteroid in map.grid) {

    if (map.grid[asteroid].x === 5 && map.grid[asteroid].y === -8) {
        console.log('hi');
    }

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
            key: asteroid,
            location: `${map.grid[asteroid].x},${map.grid[asteroid].y}`
        }
    );
}

detectionMap.sort((l1, l2) => l2.detected - l1.detected);
const station = detectionMap[0];
console.log(`Part 1: ${station.detected} detected @ ${station.location}`);

let asteroidsAtAngles = {};

for (let otheroid in map.grid) {
    if (otheroid === station.key) continue;
    const deltaX = map.grid[otheroid].x - map.grid[station.key].x;
    const deltaY = map.grid[otheroid].y - map.grid[station.key].y;
    const angle = calcAngle(deltaX, deltaY);
    const angleKey = Math.round(angle * 1e8).toString();
    if (typeof (asteroidsAtAngles[angleKey]) === 'undefined') {
        asteroidsAtAngles[angleKey] = [{
            key: otheroid,
            distance: Math.abs(deltaX) + Math.abs(deltaY)
        }];

    } else {
        asteroidsAtAngles[angleKey].push({
            key: otheroid,
            distance: Math.abs(deltaX) + Math.abs(deltaY)
        });
    }
}

let reverseAngleKeys = Object.keys(asteroidsAtAngles).sort((k1, k2) => k1 - k2);

// Find start angleKey (even though we know it's straight up.)
const up = 0;
let startingKey = false;
let rakIndex = false; // reverseAngleKey index
reverseAngleKeys.forEach((ak, i) => {
    if (!startingKey && ak <= up) {
        startingKey = ak;
        rakIndex = i;
    }
});

let confirmedKills = 0;
do {
    // Vaporize asteroids
    const targetAngleKey = reverseAngleKeys[rakIndex];
    if (asteroidsAtAngles[targetAngleKey].length > 0) {
        // sort them by distance
        // There might be a better way to do this
        let closestIndex = 0;
        let closestDistance = asteroidsAtAngles[targetAngleKey][0].distance;
        asteroidsAtAngles[targetAngleKey].forEach((asteroid, i) => {
            if (asteroid.distance < closestDistance) {
                closestIndex = i;
                closestDistance = asteroid.distance;
            }
        });
        // Vaporize the closest
        // There might be some bugs somewhere around here...
        //console.log('vaporizing: ' + asteroidsAtAngles[targetAngleKey][closestIndex].key);
        if (confirmedKills == 199) {
            console.log(`Part 2: ${asteroidsAtAngles[targetAngleKey][closestIndex].key}`);
            // Part 2 answer: 2732
        }

        // Remove from the array and increment # of kills
        asteroidsAtAngles[targetAngleKey].splice(closestIndex, 1);
        confirmedKills++;

    }
    if (rakIndex == reverseAngleKeys.length - 1) {
        rakIndex = 0;
    } else rakIndex++;
} while (confirmedKills < 200);

// Calculates angle of a right-angle triangle in radians assuming up/y+ is 0
// Probably not the quickest way, but it's correct
function calcAngle(x, y) {
    //console.log(`x:${x},y:${y}`);
    if (x === 0 && y === 0) console.error('x and y are 0');
    if (x === 0 && y > 0) return 0;
    if (x > 0 && y === 0) return Math.PI / 2;
    if (x === 0 && y < 0) return Math.PI;
    if (x < 0 && y === 0) return 3 * Math.PI / 2;
    if (x > 0 && y > 0) {
        return Math.atan(x / y);
    }
    if (x > 0 && y < 0) {
        return Math.atan(Math.abs(y) / Math.abs(x)) + Math.PI / 2;
    }
    if (x < 0 && y < 0) {
        return Math.atan(Math.abs(x) / Math.abs(y)) + Math.PI;
    }
    return Math.atan(Math.abs(y) / Math.abs(x)) + 3 * Math.PI / 2;
}

// End Process (gracefully)
process.exit(0);