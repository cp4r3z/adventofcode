/**
 * https://adventofcode.com/2020/day/17
 */

import { multiLine } from '../../common/parser.mjs'; // Does this work on GitHub sites?

import * as DataStructures from './DataStructures.mjs';

// Parse Input
const inputFilePath = new URL('./tinput.txt', import.meta.url); // Is there a way to do this from GitHub? Otherwise, hardcode input.
const arrInput = multiLine.toArrayofStrArrays(inputFilePath);

/**
 * Note on the "coordinate system"
 * Traditionally, Y is "up" and Z is "out"
 *  x 012
 * z0 .#.
 * z1 ..#
 * z2 ###
 */

const pocketDimension = new DataStructures.Graph();

// Initial State
const y0 = 0; //Input "slice" is assumed to be on the XZ plane.
arrInput.forEach((xArr, z) => {
    xArr.forEach((str, x) => {
        const coordinate = new DataStructures.Coordinate(x, y0, z);
        const active = str === "#";
        pocketDimension.addVertex(coordinate, active);
    });
});

// End Process (gracefully)
process.exit(0);