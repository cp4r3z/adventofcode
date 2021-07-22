/**
 * https://adventofcode.com/2020/day/25
 */

// Test input
let key0 = 5764801;
let key1 = 17807724;

// My input
key0 = 2959251;
key1 = 4542595;

const key0History = [];
const key1History = [];

// Find the loop sizes of public keys
const loopSize0 = findPublicLoopSize(key0);
const loopSize1 = findPublicLoopSize(key1);

const encryptionKey = loop(key0, loopSize1);

console.log(`Year 2020 Day 25 Part 1 Solution: ${encryptionKey}`);

function loop(subjectNumber, loopSize) {
    let result = 1;
    for (let i = 0; i < loopSize; i++) {
        result *= subjectNumber;
        result = result % 20201227;
    }
    return result;
}

function findPublicLoopSize(key) {
    let loopSize;
    let result = 1;
    const subjectNumber = 7;
    let loopCount = 0;
    while (!loopSize) {
        loopCount++;
        result *= subjectNumber;
        result = result % 20201227;
        if (result === key) loopSize = loopCount;
    }
    return loopCount;
}