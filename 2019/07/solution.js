/**
 * https://adventofcode.com/2019/day/7
 */

const run = require('./intcode.mjs').run;
const parser = require('./parser.mjs');

// Parse Input

let inputFileName = 'input.txt';
const arrInput = parser.singleLine.commaSeparated.toIntArray(inputFileName);

// Generate all possible phase combinations

let phaseComb = [];

let test = intArrayExcept([7, 1]);

let test2 = intArrayExcept([]); //0-9

intArrayBuilder([],0);
console.log('done building');

// let testComb = [0, 1, 2, 3, 4];
// let inputtest = 0;
// testComb.forEach(ampPhase => {
//     inputtest = run(ampPhase, inputtest, arrInput);
// });
// console.log('output:' + inputtest);

// const outputs = phaseComb.map(p => {
//     let input = 0;
//     p.forEach(ampPhase => {
//         input = run(ampPhase, input, arrInput);
//     });
//     return {
//         sequence: p.join(','),
//         signal: input // final output
//     };
// });

const highestSignal = phaseComb.sort((o1, o2) => o2.signal - o1.signal)[0];
console.log(`Part 1: Truster signal of ${highestSignal.signal} @ ${highestSignal.sequence}`);

function intArrayBuilder(array, input) {
    //const arraySoFar = [...array];

    const nextPhases = intArrayExcept(array);
    nextPhases.forEach(p => {
        const nextArray = [...array];
        const output = run(p, input, arrInput);
        nextArray.push(p);
        if (nextArray.length === 5) {
            phaseComb.push({
                sequence: nextArray.join(','),
                signal: output
            });
            return;
        } else {
            intArrayBuilder(nextArray, output);
        }

    });
}

// Return 0-9 except those in integer array
function intArrayExcept(intArray) {
    return [...Array(10).keys()]
        .filter(k => {
            let valid = true;
            intArray.forEach(i => {
                valid = valid && k != i;
            });
            return valid;
        });
}

// console.log('\nPart 1...');
// const test1 = run(1, 1, arrInput);
// console.log('\nPart 2...');
// const test2 = run(5, 5, arrInput);

// End Process (gracefully)
process.exit(0);