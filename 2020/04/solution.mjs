/**
 * https://adventofcode.com/2020/day/4
 */

import { multiLine } from '../../common/parser.mjs';

// Parse Input
let inputFilePath = new URL('./input.txt', import.meta.url);
const arrInput = multiLine.doubleNewLineSeparated(inputFilePath);

// End Process (gracefully)
process.exit(0);