/**
 * https://adventofcode.com/2020/day/14
 * 
 * This solution uses bitwise operations which is likely the intent of the challenge
 */

import { multiLine } from '../../common/parser.mjs';

// Parse Input
const inputFilePath = new URL('./input.txt', import.meta.url);
const arrInput = multiLine.toStrArray(inputFilePath);

let memory = {};

// Currently active masks
let maskOn;
let maskOff;

arrInput.forEach(line => {
    if (line.includes('mask')) {
        const reResult = /mask = ([\w\d]+)/.exec(line);
        maskOn = BigInt('0b' + reResult[1].replace(/X/g, '0'));
        maskOff = BigInt('0b' + reResult[1].replace(/X/g, '1'));
    } else {
        const reResult = /mem\[(\d+)\] = (\d+)/.exec(line);
        const address = BigInt(reResult[1]);
        let value = BigInt(reResult[2]);
        // Apply masks and store value
        value = value | maskOn & maskOff;
        memory[address] = value;
    }
});

let total = BigInt(0);
for (const address in memory) {
    total += memory[address];
}

// The functional approach works too but the above is just more readable
//total = Object.values(memory).reduce((acc, val) => acc + val, BigInt(0));

console.log(`Year 2020 Day 14 Part 1 Solution: ${total}`);

memory = {}; // Reset the memory

let maskString; // Used to store the current mask

arrInput.forEach(line => {
    if (line.includes('mask')) {
        const reResult = /mask = ([\w\d]+)/.exec(line);
        maskString = reResult[1];
    } else {
        const reResult = /mem\[(\d+)\] = (\d+)/.exec(line);
        let addressOptions = [];

        // Create a 36 character string representing the binary address from the program
        const address = BigInt(reResult[1]).toString(2);
        const address36 = Array(36 - address.length).fill('0').join('') + address;
        const value = BigInt(reResult[2]);

        // Apply the current mask to the 36 char binary address
        const maskedAddress = ApplyAddressXMask(address36);

        // Find all possible address options from the X mask
        FindAddressOptions(maskedAddress, addressOptions);

        addressOptions.forEach(iAddress => {
            memory[iAddress] = value;
        });
    }
});

total = BigInt(0);
for (const address in memory) {
    total += memory[address];
}

console.log(`Year 2020 Day 14 Part 2 Solution: ${total}`);

function ApplyAddressXMask(addressString) {
    let maskedAddress = '';
    for (var i = 0; i < addressString.length; i++) {
        // If the mask string at i is X or 1, use that, otherwise use the address string at i
        maskedAddress += (maskString.charAt(i) === 'X' || maskString.charAt(i) === '1') ?
            maskString.charAt(i) : addressString.charAt(i);
    }
    return maskedAddress;
}

function FindAddressOptions(s, outArray) {
    if (!s.includes('X')) return outArray.push(s);
    FindAddressOptions(s.replace('X', '0'), outArray);
    FindAddressOptions(s.replace('X', '1'), outArray);
}
