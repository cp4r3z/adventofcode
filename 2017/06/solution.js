/**
 * https://adventofcode.com/2017/day/6
 */

// Clone array
function clone(arr) {
    return arr.slice();
}

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
        if (arraysEqual(arr, seenArray)) {
            const loop = a.length - i;
            console.log(`Found a matching array at ${i}. Loop size is ${loop}.`);
        }
        return !arraysEqual(arr, seenArray);
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

const numberBanks = banks.length;

let seenArrays = [];
seenArrays.push(banks);

let stateNotSeen = true,
    step = 0;

while (stateNotSeen) {
    let newbanks = clone(banks);
    const i = getMaxIndex(newbanks);
    let val = newbanks[i];

    // console.log(`Step: ${step}`);
    // console.log(newbanks);
    // console.log(`Highest value is ${val} @ index ${i}.`);

    // Redistribution
    newbanks[i] = 0;
    // Start looping at the next bank. Or at the beginning if it's the last bank.
    let j = (i == newbanks.length - 1) ? 0 : i + 1;
    while (val > 0) {
        newbanks[j]++;
        val--;
        // Get next index (If at the end of the array, go back to the beginning)
        (j == newbanks.length - 1) ? j = 0: j++;
    }

    step++;
    //console.log(seenArrays);
    if (notSeen(newbanks)) {
        seenArrays.push(newbanks);
    } else {
        console.log(`Last Step: ${step}`);
        console.log(newbanks);
        stateNotSeen = false;
    }
    banks = newbanks;
}