/**
 * https://adventofcode.com/2020/day/14
 */

import { multiLine } from '../../common/parser.mjs';

// Parse Input
const inputFilePath = new URL('./input.txt', import.meta.url);
const arrInput = multiLine.toStrArray(inputFilePath);

const program = [];

let instructionSet = {};
instructionSet.instructions = [];

arrInput.forEach(line => {
    if (line.includes('mask')) {
        if (instructionSet.hasOwnProperty('mask')) program.push(instructionSet);
        const reResult = /mask = ([\w\d]+)/.exec(line);
        instructionSet = {};
        instructionSet.instructions = [];
        instructionSet.mask = reResult[1].split('');
    } else {
        const reResult = /mem\[(\d+)\] = (\d+)/.exec(line);
        const mem = parseInt(reResult[1], 10);
        const value = parseInt(reResult[2]);
        instructionSet.instructions.push({ mem, value });
    }
});

program.push(instructionSet); // push last --- seriously, better logic??

const addresses = {};

let maskRunning;
for (let programIndex = 0; programIndex < program.length; programIndex++) {
    const instructionSetRunning = program[programIndex];
    maskRunning = instructionSetRunning.mask;
    instructionSetRunning.instructions.forEach(processInstruction);
}

const testtest = convertbin36ArrayToDec([0, 0, 0, 1, 0, 1, 1]);


const test829902099 = convertbin36ArrayToDec(convertDectoBin36Array(829902099));

let total = 0;
for (const address in addresses) {

    const addressValue = addresses[address];

    total += convertbin36ArrayToDec(addressValue);

    // for (const i of addressValue) {
    //     if (i === 1) total++;
    // }

}


////// 5896 is too low
/// 11901186698673 is too low

function processInstruction(instruction) {
    addresses[instruction.mem] = valuePlusMask(maskRunning, convertDectoBin36Array(instruction.value));
}

function valuePlusMask(mask, value) {
    let result = getBits();
    for (let i = 0; i < result.length; i++) {
        //const element = result[i];
        if (mask[i] === 'X') {
            result[i] = parseInt(value[i], 10);
        } else {
            result[i] = parseInt(mask[i], 10);
        }
    }
    return result;
}

function getBits() {
    const bits = new Array(36).fill(0);
    return bits;
}

function convertDectoBin36Array(dec) {
    const binArray = dec.toString(2).split('');

    let bin36 = new Array(36).fill(0);

    const binArrayOffset = 36 - binArray.length;

    for (let i = 0; i < binArray.length; i++) {
        //const element = binArray[i];
        const bit = parseInt(binArray[i], 10);
        bin36[i + binArrayOffset] = bit;
    }

    return bin36;
}

function convertbin36ArrayToDec(bin) {
    const binStr = bin.join('');
    const dec = parseInt(binStr, 2);
    return dec;
}


//console.log(`Year 2020 Day 13 Part 1 Solution: ${part1}`);

// End Process (gracefully)
process.exit(0);