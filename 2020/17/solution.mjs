/**
 * https://adventofcode.com/2020/day/17
 */

import { multiLine } from '../../common/parser.mjs'; // TODO: Does this work on GitHub sites?

import * as DataStructures from './DataStructures.mjs';

// Parse Input
const inputFilePath = new URL('./tinput.txt', import.meta.url); // TODO: Is there a way to do this from GitHub? Otherwise, hardcode input.
const arrInput = multiLine.toArrayofStrArrays(inputFilePath);

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

const rule = function(){
    console.log(this);
    const cubeArray = [...this.Vertices].map(([key, value]) => value );
    
    // TODO: A "toggle" logic might save space but be less understandable?

    const activeCubes = cubeArray.filter(v=>v.Active);
    const cubesToSetInactive = [];
    activeCubes.forEach(v=>{
        const activeNeighbors = v.AdjacentVertices.filter(v=>v.Active);
        if (!activeNeighbors.length===2 && !activeNeighbors.length===3) cubesToSetInactive.push(v);
    });
    
    const inactiveCubes = cubeArray.filter(v=>!v.Active);
    const cubesToSetActive = [];
    inactiveCubes.forEach(v=>{
        const activeNeighbors = v.AdjacentVertices.filter(v=>v.Active);
        if (activeNeighbors.length === 3) cubesToSetActive.push(v);
    });

    cubesToSetInactive.forEach(v=>this.setVertexActiveState(v,false));  //TODO: Test
    cubesToSetActive.forEach(v=>this.setVertexActiveState(v,true));  //TODO: Test
};

pocketDimension.runRule(rule);

// End Process (gracefully)
process.exit(0); // TODO: Does this mess things up if it's a module?