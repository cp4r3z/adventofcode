/**
 * https://adventofcode.com/2019/day/16
 */

const parser = require('./parser.mjs');
const fs = require('fs');

// Parse Input
let inputFileName = 'inputtest2.txt';
const arrInput = parser.singleLine.notSeparated.toIntArray(inputFileName);

// Part 1 

// let phasedInput = [...arrInput];
// phasedInput = phaseInput(phasedInput);

// console.log(`Part 1: ${phasedInput.splice(0,8).join('')}`);

// Part 2

// Figure out offset
let part2Offset = arrInput.slice(0, 6).join('');
part2Offset = Number(part2Offset);

// Find array of length 8 with the message (after the input's been multiplied 10,000 times)
let part2Message = Array(8);

const arrInputMultipliedLength = arrInput.length * 10000;
for (let index = 0; index < part2Message.length; index++) {
    const digitIndex = (part2Offset + index) % arrInput.length;
    part2Message[index] = arrInput[digitIndex];
}

console.log(Date());
const phasetest1 = genPhase(arrInput.length * 10000, 1234).slice(1234, 1242);
const phasetest2 = genPhase(arrInput.length * 10000, 1235).slice(1234, 1242);
const phasetest3 = genPhase(arrInput.length * 10000, 1236).slice(1234, 1242);
console.log(Date());

let phasedInput2 = Array(arrInput.length);
phasedInput2.fill(1);

phasedInput2 = phaseInput(phasedInput2);


/*
let phasedInput2 = [];
for (let index = 0; index < 10000; index++) {
    phasedInput2 = phasedInput2.concat(arrInput);
}
console.log(Date());
phasedInput2 = phaseInput(phasedInput2);
console.log(Date());

let offset = phasedInput2.splice(0,7).join('');
offset = parseInt(offset,10); // TEST this
console.log(Date());
console.log(offset);
*/


// for (let index = 0; index < 100; index++) {
//     let output = Array(refInputArray.length);

//     for (let i = 0; i < refInputArray.length; i++) {
//         const phase = genPhase(refInputArray.length, i);
//         const appliedPhase = refInputArray.reduce((acc, digit, j) => acc + digit * phase[j], 0);
//         const str = appliedPhase.toString();
//         const num = str.charAt(str.length - 1);
//         const lastCharToInt = parseInt(num, 10);

//         output[i] = lastCharToInt;
//     }

//     refInputArray = [...output];
// }


//fs.appendFileSync('phases.txt', 'data to append');

//offset = 0;

//console.log(`Part 1: ${phasedInput2.splice(offset,8).join('')}`);

fs.unlinkSync('phases.txt');
for (let i = 0; i < 110; i++) {
    const phase = genPhase(arrInput.length, i);
    const part2 = phase.join(',').replace(/,0/gi, ', 0').replace(/,1/gi, ', 1');
    fs.appendFileSync('phases.txt', part2 + '\n', 'utf8');
}


//fs.unlinkSync('mods.txt');
let mods = [];
for (let i = 0; i < 110; i++) {
    mods.push(i)
}
fs.appendFileSync('mods.txt', mods, 'utf8');

function phaseInput(refInputArray) {



    for (let index = 0; index < 100; index++) {
        let output = Array(refInputArray.length);

        for (let i = 0; i < refInputArray.length; i++) {
            const phase = genPhase(refInputArray.length, i);
            const appliedPhase = refInputArray.reduce((acc, digit, j) => acc + digit * phase[j], 0);
            const str = appliedPhase.toString();
            const num = str.charAt(str.length - 1);
            const lastCharToInt = parseInt(num, 10);

            output[i] = lastCharToInt;
        }

        refInputArray = [...output];

    }

    return refInputArray; // I don't know why this isn't changing the referenced array.
}





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