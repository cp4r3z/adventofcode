/**
 * https://adventofcode.com/2018/day/8
 */

const fs = require('fs');

const input = 'input.txt';
const file = fs.readFileSync(input, 'utf8');
const arrInput = file.split(' ').map(s => parseInt(s, 10));

//console.log(inputArr.join(","));

const test = rChild(0);
const metadata = test.meta.join(' + ');
const checksum = test.meta.reduce((acc, cur) => acc + cur);
console.log(`${metadata} = ${checksum}`);

// take in start index, return metadata and end index
function rChild(_iStart) {

    let workingIndex = _iStart;
    // Store number of children
    const numChild = arrInput[workingIndex];
    const numMeta = arrInput[workingIndex + 1];
    workingIndex += 2; // Start of metadata, child, or next node

    let out = {
        iEnd: workingIndex,
        meta: []
    }

    if (numMeta == 0 && numChild == 0) {
        console.log('no meta' + numMeta);
        return out;
    }
    if (numChild > 0) {
        let i = 0;
        for (; i < numChild; i++) {
            const outChild = rChild(workingIndex);
            workingIndex = outChild.iEnd;
            out.meta = out.meta.concat(outChild.meta);
        }
        out.iEnd = workingIndex;
    }
    if (numMeta > 0) {
        out.iEnd += numMeta;
        out.meta = out.meta.concat(arrInput.slice(0).slice(workingIndex, workingIndex + numMeta))
        return out;
    }
    else if (numMeta == 0) {
        return out;
    }
    else {
        console.log('Should not happen');
    }
}

// End Process (gracefully)
process.exit(0);
