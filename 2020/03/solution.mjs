/**
 * https://adventofcode.com/2020/day/3
 */

import {multiLine} from '../../common/parser.mjs';

// Parse Input
let inputFilePath = new URL('./input.txt', import.meta.url);
const arrInput = multiLine.toArrayofStrArrays(inputFilePath);

console.log(`\nYear 2020 Day 03 Part 1 Solution: ${calculateArborealStops(3, 1)}`);

const slopes = [
    {x: 1, y: 1},
    {x: 3, y: 1},
    {x: 5, y: 1},
    {x: 7, y: 1},
    {x: 1, y: 2}
];

const part2 = slopes
    .map(slope => calculateArborealStops(slope.x, slope.y))
    .reduce((prev, curr) => prev * curr, 1);

console.log(`\nYear 2020 Day 03 Part 2 Solution: ${part2}`);

function calculateArborealStops(slopeX, slopeY) {

    let currentPosition = {
        x: 0, y: 0
    };

    let treesHit = 0;

    while (currentPosition.y < arrInput.length - 1) {

        for (let i = 0; i < slopeX; i++) {
            currentPosition.x++;
            if (currentPosition.x === arrInput[0].length) currentPosition.x = 0;
        }

        for (let j = 0; j < slopeY; j++) {
            currentPosition.y++;
            if (currentPosition.y === arrInput.length) break;
        }

        if (arrInput[currentPosition.y][currentPosition.x] === '#') treesHit++;
    }

    return treesHit;
}


// End Process (gracefully)
process.exit(0);
