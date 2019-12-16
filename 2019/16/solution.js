/**
 * https://adventofcode.com/2019/day/16
 */

const parser = require('./parser.mjs');

// Parse Input
let inputFileName = 'input.txt';
const arrInput = parser.singleLine.notSeparated.toIntArray(inputFileName);

// Part 1 

let phasedInput = [...arrInput];


for (let index = 0; index < 100; index++) {
    let output = Array(phasedInput.length);

    for (let i = 0; i < phasedInput.length; i++) {
        const phase = genPhase(phasedInput.length, i);
        const appliedPhase = phasedInput.reduce((acc, digit, j) => acc + digit * phase[j], 0);
        const str = appliedPhase.toString();
        const num = str.charAt(str.length - 1);
        const lastCharToInt = parseInt(num, 10);
    
        output[i] = lastCharToInt;
    }
    
    phasedInput = [...output];
}

console.log(`Part 1: ${phasedInput.join('')}`);

// Phase Generator

// const test0 = genPhase(8, 0);
// const test1 = genPhase(8, 1);
// const test2 = genPhase(8, 2);

function genPhase(len, pos) {
    const basePattern = [0, 1, 0, -1];
    const repeat = pos + 1; // if repeat=2, there will be 2 digits

    let phase = [];
    let bpi = 0; // Base Pattern index

    do {
        for (let i = 0; i < repeat; i++) {
            if (phase.length < len + 1) phase.push(basePattern[bpi]);
        }
        bpi = bpi >= basePattern.length - 1 ? 0 : bpi + 1;
    } while (phase.length < len + 1);

    return phase.splice(1);

}

// End Process (gracefully)
process.exit(0);