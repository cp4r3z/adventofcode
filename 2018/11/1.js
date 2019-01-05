/**
 * https://adventofcode.com/2018/day11
 */

const _ = require('underscore'); // Not used

const input = 3628;

const size = 300;

/**
 * (1,1) . . . (300,1)
 * .
 * .
 * .
 * (1,300) . (300,300)
 */

let grid = Array(size).fill(0).map(x => (Array(size).fill(0)));

// Map each tile
// Remember that the index is off by one of the "index"... so 1,1 is [0][0]
for (var y = 0; y < size; y++) {
    for (var x = 0; x < size; x++) {
        // Find the fuel cell's rack ID, which is its X coordinate plus 10.
        const rackID = (x + 1) + 10;
        // Begin with a power level of the rack ID times the Y coordinate.
        grid[y][x] = rackID * (y + 1);
        // Increase the power level by the value of the grid serial number (your puzzle input).
        grid[y][x] += input;
        // Set the power level to itself multiplied by the rack ID.
        grid[y][x] = grid[y][x] * rackID;
        // Keep only the hundreds digit of the power level (so 12345 becomes 3; numbers with no hundreds digit become 0).
        grid[y][x] = parseInt(grid[y][x].toString().substr(-3, 1), 10);
        // Subtract 5 from the power level.
        grid[y][x] -= 5;
    }
}

function getMost(squareSize) {
    let levels = [];
    for (var y = 0; y < size - (squareSize - 1); y++) {
        for (var x = 0; x < size - (squareSize - 1); x++) {
            let power =0;
            for (var ys = 0; ys < squareSize; ys++) {
                for (var xs = 0; xs < squareSize; xs++) {
                    power+=grid[y+ys][x+xs];
                }
            }
            levels.push({
                topLeft: `${x+1},${y+1}`,
                power
            });
        }
    }
    const mostPower = _.reduce(levels, (max, l) => l.power > max.power ? l : max);
    mostPower.squareSize = squareSize;
    return mostPower;
}

const most = getMost(3);
console.log(most.topLeft);
console.log(most.power);
console.log(most.squareSize);

//216,12

let most2;

for (var i = 1; i <= size; i++) {
    console.log(i);
    const iMost = getMost(i);
    if (!most2 || iMost.power>most2.power) most2 = iMost;
}

console.log(most2.topLeft);
console.log(most2.power);
console.log(most2.squareSize);

// End Process (gracefully)
process.exit(0);
