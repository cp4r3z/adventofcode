/**
 * https://adventofcode.com/2020/day/8
 */

import { multiLine } from '../../common/parser.mjs';

// Parse Input
let inputFilePath = new URL('./input.txt', import.meta.url);
const arrInput = multiLine.toStrArray(inputFilePath);

let instructions = arrInput.map(line => {
    let [operation, value] = line.split(' ');
    value = parseInt(value, 10);
    return { operation, value };
});

const accumulatorPart1 = runProgram(instructions).accumulator;

console.log(`Year 2020 Day 08 Part 1 Solution: ${accumulatorPart1}`);

let corrupt = true;
let alteredOperationIndex = 0;
let accumulatorPart2;
while (corrupt) {
    const newInstructions = JSON.parse(JSON.stringify(instructions));
    const instruction = newInstructions[alteredOperationIndex];
    let swapped = true;
    switch (instruction.operation) {
        case 'jmp':
            instruction.operation = 'nop';
            break;
        case 'nop':
            instruction.operation = 'jmp';
            break;
        default:
            swapped = false;
            break;
    }
    if (swapped) {
        const result = runProgram(newInstructions);
        if (result.exit) {
            corrupt = false;
            accumulatorPart2 = result.accumulator;
        }
    }
    alteredOperationIndex++;
}

console.log(`Year 2020 Day 08 Part 2 Solution: ${accumulatorPart2}`);

function runProgram(instructions) {
    let position = 0;
    let accumulator = 0;

    let revisited = false;
    const visitedIndices = new Set();
    let exit = false;
    while (!revisited && !exit) {
        visitedIndices.add(position);
        const instruction = instructions[position];
        switch (instruction.operation) {
            case 'acc':
                accumulator += instruction.value;
                position += 1;
                break;
            case 'jmp':
                position += instruction.value;
                break;
            case 'nop':
                position += 1;
                break;
            default:
                console.error('BAD OPERATION');
                break;
        }
        revisited = visitedIndices.has(position);
        if (position === instructions.length) {
            exit = true;
        }
    }
    return { accumulator, exit };
}

// End Process (gracefully)
process.exit(0);