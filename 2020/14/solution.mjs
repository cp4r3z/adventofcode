/**
 * https://adventofcode.com/2020/day/14
 */

import { multiLine } from '../../common/parser.mjs';

// Parse Input
const inputFilePath = new URL('./tinput.txt', import.meta.url);
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

let total = 0;
for (const address in addresses) {

    const addressValue = addresses[address];

    total += convertbin36ArrayToDec(addressValue);
}

console.log(`Year 2020 Day 14 Part 1 Solution: ${total}`);


// part2 . ..

/// last mask

let part2Total = 0;

function subTotal(iProgram) {
    let _subTotal = 0;
    const subMask = program[iProgram].mask;
    program[iProgram].instructions.forEach(instruction => {
        const value = instruction.value;
        const maskedValue = memPlusMask(subMask, convertDectoBin36Array(instruction.mem)); // mem not value
        const numFloatX = maskedValue.filter(b => b === 'X').length;
        _subTotal+= value* Math.pow(2,numFloatX);
    });
    return _subTotal;
}

part2Total += subTotal(program.length - 1);

// Working backwards from the 2nd to last mask...
for (let iMask = program.length - 2; iMask > -1; iMask--) {
    const mask = program[iMask].mask;

    // now go up all the later masks to see if it'll be overwritten. adjust mask accordingly.


    continue;


}


function processInstruction(instruction) {
    addresses[instruction.mem] = valuePlusMask(maskRunning, convertDectoBin36Array(instruction.value));
}

function memPlusMask(mask, mem) {
    let result = getBits();
    for (let i = 0; i < mem.length; i++) {
        // per part2 rules
        if (mask[i] === '0') result[i] = parseInt(mem[i], 10);
        else if (mask[i] === '1') result[i] = 1;
        else if (mask[i] === 'X') result[i] = 'X';
    }
    return result;
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


// End Process (gracefully)
process.exit(0);