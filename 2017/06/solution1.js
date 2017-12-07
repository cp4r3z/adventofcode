/**
 * https://adventofcode.com/2017/day/6
 */

// Reduce an array to the index of the first instance of the max value.
function getMaxIndex(arr) {
    return arr.reduce((indexMax, b, indexB, array) => {
        return b > array[indexMax] ? indexB : indexMax;
    }, 0);
}

function notSeen(arr) {
    // Compare every previously seen array with arr
    // This will return true if all arrays are different.
    return seenArrays.every((seenArray, i, a) => {
        return arraysEqual(arr, seenArray) === false;
    });
}

function arraysEqual(arr1, arr2) {
    return arr1.length == arr2.length && arr1.every((v, i) => {
        return v === arr2[i];
    });
}

const input = '2017/06/input.txt';

const fs = require('fs'),
    file = fs.readFileSync(input, "utf8");

let banks = file.split("\t").map(bank => parseInt(bank));
//banks = [0, 2, 7, 0];

const numberBanks = banks.length;

let seenArrays = [];
seenArrays.push(banks);

let stateNotSeen = true,
    step = 0;

while (stateNotSeen) {
    const i = getMaxIndex(banks),
        val = banks[i],
        distRemainder = val % (numberBanks - 1),
        dist = (val - distRemainder) / (numberBanks - 1);

    console.log(`Step: ${step}`);
    console.log(banks);
    console.log(`Highest value is ${val} @ index ${i}, so distributing ${dist} and leaving ${distRemainder}.`);

    banks = banks.map((value, index, array) => {
        return index != i ? value += dist : value;
    });
    banks[i] = distRemainder;
    step++;
    if (notSeen(banks)) {
        seenArrays.push(banks);
    } else {
        console.log(`Last Step: ${step}`);
        console.log(banks);
        stateNotSeen = false;
    }
}