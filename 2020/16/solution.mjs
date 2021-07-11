/**
 * https://adventofcode.com/2020/day/16
 */

import { multiLine } from '../../common/parser.mjs'; // Does this work on GitHub sites?

// Parse Input
const inputFilePath = new URL('./input.txt', import.meta.url); // Is there a way to do this from GitHub? Otherwise, hardcode input.
const arrInput = multiLine.toStrArray(inputFilePath);

// End Process (gracefully)
process.exit(0);