/**
 * https://adventofcode.com/2019/day/7
 */

const intCode = require('./intcode.mjs');
const parser = require('./parser.mjs');

// Parse Input
let inputFileName = 'input.txt';
const arrInput = parser.singleLine.commaSeparated.toIntArray(inputFileName);

// Store the signals for all possible phase sequences
let signalsFromSequences = [];

// Part 1 doesn't use a feedback loop
let feedback = false;
// Part 1 uses phases 0-4
let validPhases = [0, 1, 2, 3, 4];

// Determine the signal for each sequence
getSignalFromSequence([], 0);

let highestSignal = signalsFromSequences.sort((o1, o2) => o2.signal - o1.signal)[0];
console.log(`Part 1: Thruster signal of ${highestSignal.signal} @ ${highestSignal.sequence}`);

// Part 2 resets the signalsFromSequences
// Part 2 uses a feedback loop
// Part 2 uses phases 5-9
signalsFromSequences = [];
feedback = true;
validPhases = [5, 6, 7, 8, 9];

// Determine the signal for each sequence
getSignalFromSequence([], 0);

highestSignal = signalsFromSequences.sort((o1, o2) => o2.signal - o1.signal)[0];
console.log(`Part 2: Thruster signal of ${highestSignal.signal} @ ${highestSignal.sequence}`);

function getSignalFromSequence(inputStates, input) {
    const registerPhases = inputStates.map(state => state.phase);

    if (registerPhases.length < 5) {
        // Initial pass finds all phase sequence permutations
        const nextPhases = validPhases.filter(p => !registerPhases.includes(p));
        nextPhases.forEach(p => {
            // Instantiate a new register
            const states = [...inputStates];
            const register = intCode(
                { intCodes: arrInput } // Use the puzzle input array for initial intCodes
            );

            // Using the next phase, store it's initial output and state.
            let output = register.run(p, input);
            states.push(register.getState());

            // Continue recursion
            getSignalFromSequence(states, output);
        });
    } else {
        // All registers have been run once
        if (!feedback) {
            // Part 1
            signalsFromSequences.push({
                sequence: inputStates.map(state => state.phase).join(','),
                signal: input
            });
        } else {
            // Part 2
            const registers = inputStates.map(state => intCode(state));
            let registerIndex = 0;
            let outputE = input;
            let halt = false;
            let output = input;
            do {
                output = registers[registerIndex].run(false, output);
                if (output === false) halt = true;
                if (registerIndex === 4) {
                    outputE = output;
                }
                registerIndex = (registerIndex === 4 ? 0 : registerIndex + 1);
            } while (!halt);

            signalsFromSequences.push({
                sequence: inputStates.map(state => state.phase).join(','),
                signal: outputE
            });
        }
    }
}

// End Process (gracefully)
process.exit(0);