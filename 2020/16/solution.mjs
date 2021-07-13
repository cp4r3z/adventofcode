/**
 * https://adventofcode.com/2020/day/16
 */

import { multiLine } from '../../common/parser.mjs'; // Does this work on GitHub sites?

import * as DataStructures from './DataStructures.mjs';

// Parse Input
const inputFilePath = new URL('./tinput.txt', import.meta.url); // Is there a way to do this from GitHub? Otherwise, hardcode input.
const arrInput = multiLine.toStrArray(inputFilePath);

const graph = new DataStructures.Graph();

const testCoor = new DataStructures.Coordinate(0,0,-1);
const vertexTest = graph.addVertex(testCoor, true);

// End Process (gracefully)
process.exit(0);