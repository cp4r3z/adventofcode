/**
 * https://adventofcode.com/2021/day/8
 */

// Notes

// Investigate other prebuilt bit array options:
// http://bitwiseshiftleft.github.io/sjcl/doc/

import { multiLine } from '../../common/parser.mjs';
import SSD from './SSD.mjs';

// Parse Input
let inputFilePath = new URL('./input.txt', import.meta.url);
const arrInput = multiLine.toStrArray(inputFilePath);

// Part 1

let tests = arrInput.map(line => {
    const signalAndOutput = line.split('|');
    const signals = signalAndOutput[0].trim().split(' ');
    const outputs = signalAndOutput[1].trim().split(' ');
    return { signals, outputs };
});

const part1 = tests.reduce((prevTestCount, test) => {
    return prevTestCount += test.outputs.reduce((prevOutputCount, output) => {
        return prevOutputCount += ([2, 3, 4, 7].includes(output.length)) ? 1 : 0;
    }, 0);
}, 0);

console.log(`\nYear 2021 Day 08 Part 1 Solution: ${part1}`);

// Part 2

const part2 = tests
    .map(test => {
        let display = new SSD(test.signals);
        display.Solve();
        const output = parseInt(
            test.outputs
                .map(o => display.GetOutputDigit(o))
                .join('')
        );
        return output;
    })
    .reduce((total, cur) => total + cur, 0);

console.log(`\nYear 2021 Day 08 Part 2 Solution: ${part2}`);

// End Process (gracefully)
process.exit(0);
