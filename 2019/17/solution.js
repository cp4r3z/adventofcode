/**
 * https://adventofcode.com/2019/day/17
 */

const parser = require('./parser.mjs');
const grid2D = require('./grid2D.mjs');
const intCode = require('./intcode.mjs');

// Parse Input
let inputFileName = 'input.txt';
const arrInput = parser.singleLine.commaSeparated.toIntArray(inputFileName);

// Instantiate an intCode computer
const computer = intCode(
    {
        intCodes: arrInput, // Use the puzzle input array for initial intCodes
        phase: true // Phase doesn't matter for this puzzle. Careful using 0...
    }
);

// Instantiate a "map" object using a 2D grid
const map = grid2D({}, " ");

// 35 means #, 46 means ., 10 starts a new line

let output = true;
let x = 0;
let y = 0;
do {
    output = computer.run(true, 1);
    switch (output) {
        case 35:
            map.set(x, y, '#');
            x++;
            break;
        case 46:
            map.set(x, y, '.');
            x++;
            break;
        case 10:
            y++;
            x = 0;
            break;
        default:
            if (output!==false){
                //console.log(output);
                map.set(x, y, '?');
            }
            x++;
    }
} while (output !== false);

map.print(true);

let intersections = [];

const yMin = map.rows().min;
const yMax = map.rows().max;
const xMin = map.columns().min;
const xMax = map.columns().max;

for (let y = yMin; y <= yMax; y++) {
    for (let x = xMin; x <= xMax; x++) {
        if (map.get(x, y).value !== '#') continue;
        const lookU = map.get(x, y + 1).value === '#';
        const lookD = map.get(x, y - 1).value === '#';
        const lookL = map.get(x - 1, y).value === '#';
        const lookR = map.get(x + 1, y).value === '#';
        if (lookU && lookD && lookL && lookR) {
            intersections.push({x, y, alignment: x * y});
        }
    }
}

// ASCII Display of final grid

intersections.forEach(i => {
    console.log(JSON.stringify(i));
    map.set(i.x, i.y, 'O');
});

map.print(true);

const alignmentSum = intersections.reduce((sum, intersection) => sum + intersection.alignment, 0);

console.log(`Part 1: ${alignmentSum}`);


// End Process (gracefully)
process.exit(0);