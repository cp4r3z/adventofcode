/**
 * https://adventofcode.com/2018/day25
 */

const _ = require('underscore');

// Read input into simple array
const file = require('fs').readFileSync('input.txt', 'utf8');
const arrInput = file.split('\n');

// Process input into usable data object
const stars = arrInput
    .map(step0)
    .map(step1)
    .map(step2);

// Generate constellations
let constellations = makeConstellations(stars);

// Write Solution 1
console.log(`Solution: ${constellations.length}`);

/**
 * Functions
 */

// Step 0 - Map Callback Function - Processes the array into an array of arrays of decimals
function step0(row) {
    return row.split(',').map(p => ~~p); // double unary operator ~~ instead of p => parseInt(p, 10)
}

// Step 1 - Map Callback Function - Converts the arrays of decimals into "star" objects
function step1(row, i) {
    return {
        index: i,
        coor: row, // Not necessary
        links: []
    };
}

// Step 2 - Map Callback Function - Find links between "stars" based on Manhatten Distance
function step2(rowA, _i, a) {
    for (let i = 0; i < a.length; i++) {
        if (getManhattenDistance(rowA.coor, a[i].coor) <= 3) rowA.links.push(i);
    }
    return rowA;
}

// Helper function which sums the absolute value of the distance between corresponding coordinates
function getManhattenDistance(coorA, coorB) {
    let distance = 0;
    coorA.forEach((a, i) => distance += Math.abs(coorB[i] - a));
    return distance;
}

// Final function which converts star object array to an array of constellations (indexes)
function makeConstellations(_stars) {

    let constellations = [];
    let cIndex = 0;

    while (getUnplaced()) {

        // "Seed" constellation with a star and mark as placed
        const seed = getUnplaced();
        constellations[cIndex] = _.union([seed.index], seed.links);
        _stars[seed.index].placed = true;

        // Now fill constellation by searching for unplaced stars that link to the stars already in the constellation
        let keepSearching = true;
        while (keepSearching) {
            keepSearching = false;
            _stars.forEach((s, i) => {
                if (!s.placed) {
                    if (_.intersection(constellations[cIndex], [s.index]).length > 0) {
                        constellations[cIndex] = _.union(constellations[cIndex], [s.index], s.links);
                        _stars[s.index].placed = true;
                        keepSearching = true;
                    }
                }
            });
        }
        cIndex++; // Move on to the next constellation
    }

    return constellations;

    // Helper function which finds an unplaced star
    function getUnplaced() {
        return _.find(_stars, s => !s.placed);
    }
}

// End Process (gracefully)
process.exit(0);
