/**
 * https://adventofcode.com/2020/day/17
 */

import * as DataStructures from './DataStructures.mjs';

//import { multiLine } from '../../../../common/parser.mjs'; // TODO: Does this work on GitHub sites? It uses fs module which needs to be bundled. :-(

// Parse Input
//const inputFilePath = new URL('../inputs/input.txt', import.meta.url); // TODO: Is there a way to do this from GitHub? Otherwise, hardcode input.
//const arrInput = multiLine.toArrayofStrArrays(inputFilePath);

// console.log(JSON.stringify(arrInput)); // Used to generate input string.

const inputJSON = `[
    ["#",".","#",".",".","#","#","#"],
    [".","#",".",".",".",".","#","#"],
    [".","#","#","#",".",".",".","#"],
    [".",".","#","#","#","#",".","."],
    [".",".",".",".","#","#","#","."],
    ["#","#",".","#",".","#",".","#"],
    [".",".","#",".",".","#","#","."],
    ["#",".",".",".",".",".","#","#"]
]`;
const arrInput = JSON.parse(inputJSON);

/**
 * Note on the "coordinate system"
 * Traditionally, Y is "up" and Z is "out", 
 * so we're not following the puzzle's "Z-UP" coordinate system. TODO?
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

// Record of the states for each cycle
const states = [];

const rule = function () {
    // Determine cubes to toggle based on the active neighbors
    const cubesToToggle = [];

    // TODO: Use async map of promises (maybe that will increase performance?)

    this.toValueArray().forEach(cube => {
        const activeNeighbors = cube.countActiveAdjacents();

        if (cube.Active) {
            // If a cube is active and exactly 2 or 3 of its neighbors are also active,
            // the cube remains active. Otherwise, the cube becomes inactive.
            if (!(activeNeighbors === 2 || activeNeighbors === 3)) cubesToToggle.push(cube);
        } else {
            // If a cube is inactive but exactly 3 of its neighbors are active,
            // the cube becomes active. Otherwise, the cube remains inactive.
            if (activeNeighbors === 3) cubesToToggle.push(cube);
        }
    });

    // Now toggle the active state of the determined cubes
    cubesToToggle.forEach(cube => this.setVertexActiveState(cube, !cube.Active));
};

const start = Date.now();
let cycle = 0;
while (cycle <= 6) {
    const startCycle = Date.now();
    // Record the current state (an array of objects {key, active})
    // TODO: Consider only recording changes to increase performance
    states.push(pocketDimension.getVertexKeyAndState());
    // Log the number of active cubes (for puzzle solution)
    const numberActiveCubes = pocketDimension.getActiveVertexCount();
    console.log(`Cycle: ${cycle}: Active: ${numberActiveCubes}`);
    // Run the rule for this cycle
    pocketDimension.runRule(rule); // TODO: This is run an extra cycle!
    cycle++;
    const endCycle = Date.now();
    console.log(`${endCycle - startCycle}ms | ${Math.round(1000 / (endCycle - startCycle))}FPS ... FYI, 60 FPS is 16.6 ms`);
}
const end = Date.now();
console.log(`${end - start}ms TOTAL`);

// End Process (gracefully)
//process.exit(0); // TODO: Does this mess things up if it's a module?

export { states }; // TODO: As of now, this only runs after all cycles computed. Maybe use events to load dynamically?