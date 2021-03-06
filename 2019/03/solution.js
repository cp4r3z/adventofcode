/**
 * https://adventofcode.com/2019/day/3
 */

// Read input into an array (arrInput)
const input = require('fs').readFileSync(__dirname + '/' + 'input.txt', 'utf8');
const arrInputPaths = input
    .trim()                     // Remove whitespace
    .replace(/\n$/, "")         // Remove trailing line return
    .split('\n');               // Split by delimiter
const pathA = arrInputPaths[0]
    .split(',')
    .map(mapToVector);
const pathB = arrInputPaths[1]
    .split(',')
    .map(mapToVector);

let pointsA = [{x: 0, y: 0, walkDist: 0}];
let pointsB = [{x: 0, y: 0, walkDist: 0}];

// Define a bounding box for the path max extents
let boxA = {U: 0, D: 0, L: 0, R: 0};
let boxB = {U: 0, D: 0, L: 0, R: 0};

const walkPath = function (arrPath, arrPoints, box) {
    let currentPos = {x: 0, y: 0};
    let walkDist = 0;
    arrPath.forEach(vector => {
        currentPos.x += vector.dir.x * vector.dist;
        currentPos.y += vector.dir.y * vector.dist;
        walkDist += vector.dist;
        arrPoints.push({
            x: currentPos.x,
            y: currentPos.y,
            walkDist
        });
        if (currentPos.y > box.U) box.U = currentPos.y;
        if (currentPos.y < box.D) box.D = currentPos.y;
        if (currentPos.x < box.L) box.L = currentPos.x;
        if (currentPos.x > box.R) box.R = currentPos.x;
    });
};

walkPath(pathA, pointsA, boxA);
walkPath(pathB, pointsB, boxB);

// Bounding Box intersection
const boxInt = {
    U: Math.min(boxA.U, boxB.U),
    D: Math.max(boxA.D, boxB.D),
    L: Math.max(boxA.L, boxB.L),
    R: Math.min(boxA.R, boxB.R),
};

// Find intersections
let intersections = [];

for (let indexA = 0; indexA < pointsA.length - 1; indexA++) {
    const pointA1 = pointsA[indexA];
    const pointA2 = pointsA[indexA + 1];
    if (!isSegmentInBox(pointA1, pointA2, boxInt)) continue;
    for (let indexB = 0; indexB < pointsB.length - 1; indexB++) {
        const pointB1 = pointsB[indexB];
        const pointB2 = pointsB[indexB + 1];
        if (!isSegmentInBox(pointB1, pointB2, boxInt)) continue;
        let int = segmentsIntersection(pointA1, pointA2, pointB1, pointB2);
        if (int) {
            intersections.push({
                x: int.x,
                y: int.y,
                wd: int.walkDist,
                md: Math.abs(int.x) + Math.abs(int.y)
            });
        }
    }
}

// Sort by Manhattan distance
intersections = intersections.sort((p1, p2) => p1.md - p2.md);

console.log(`Part 1: Distance = ${intersections[0].md}`);

// Sort by walking distance
intersections = intersections.sort((p1, p2) => p1.wd - p2.wd);

console.log(`Part 2: Distance = ${intersections[0].wd}`);

// Helper functions

function isSegmentInBox(point1, point2, box) {
    //Horizontal
    if (point1.y === point2.y) {
        const testY = point1.y <= box.U && point1.y >= box.D;
        const testX = point1.x >= box.L && point1.x <= box.R || point2.x >= box.L && point2.x <= box.R;
        return testY && testX;
    }
    // Vertical
    if (point1.x === point2.x) {
        const testX = point1.x <= box.R && point1.x >= box.L;
        const testY = point1.y >= box.D && point1.y <= box.U || point2.y >= box.D && point2.y <= box.U;
        return testY && testX;
    }
}

function segmentsIntersection(pointA1, pointA2, pointB1, pointB2) {
    const minAx = Math.min(pointA1.x, pointA2.x);
    const maxAx = Math.max(pointA1.x, pointA2.x);
    const minAy = Math.min(pointA1.y, pointA2.y);
    const maxAy = Math.max(pointA1.y, pointA2.y);
    const minBx = Math.min(pointB1.x, pointB2.x);
    const maxBx = Math.max(pointB1.x, pointB2.x);
    const minBy = Math.min(pointB1.y, pointB2.y);
    const maxBy = Math.max(pointB1.y, pointB2.y);
    // If A is horizontal and B is vertical
    if (minBx === maxBx && minAy === maxAy) {
        if (minAx < minBx && maxAx > minBx && minBy < minAy && maxBy > minAy) {
            const walkDist = pointA1.walkDist + Math.abs(pointA1.x - minBx) + pointB1.walkDist + Math.abs(pointB1.y - minAy);
            return {x: minBx, y: minAy, walkDist};
        }
    }
    // If A is vertical and B is horizontal
    if (minAx === maxAx && minBy === maxBy) {
        if (minBx < minAx && maxBx > minAx && minAy < minBy && maxAy > minBy) {
            const walkDist = pointA1.walkDist + Math.abs(pointB1.x - minAx) + pointB1.walkDist + Math.abs(pointA1.y - minBy);
            return {x: minAx, y: minBy, walkDist};
        }
    }
    return false;
}

function mapToVector(s) {
    const dist = parseInt(s.substr(1), 10);
    let dir = {x: 0, y: 0};
    switch (s[0]) {
        case "U":
            dir.y++;
            break;
        case "D":
            dir.y--;
            break;
        case "R":
            dir.x++;
            break;
        case "L":
            dir.x--;
            break;
        default:
            console.error('mapToVector: Unknown direction');
    }
    // Return a direction and distance
    return {dir, dist};
}

// End Process (gracefully)
process.exit(0);