/**
 * https://adventofcode.com/2018/day/8
 */

const file = require('fs').readFileSync('input.txt', 'utf8');

// Process input into usable data object
const arrInput = file.split(' ').map(s => parseInt(s, 10));

const result = rChild(0);
const metadata = result.meta.join(' + ');
const checksum = result.meta.reduce((acc, cur) => acc + cur);
//console.log(`${metadata} = ${checksum}`);
console.log(`Part 1 - Checksum: ${checksum}`);

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

    if (numMeta == 0 && numChild == 0) return out; // No metadata nor child nodes

    if (numChild > 0) {
        // For each child node, get the metadata and shift the end index accordingly
        let i = 0;
        for (; i < numChild; i++) {
            const outChild = rChild(workingIndex);
            workingIndex = outChild.iEnd;
            out.meta = out.meta.concat(outChild.meta);
        }
        out.iEnd = workingIndex;
    }

    if (numMeta == 0) return out; // No metadata

    if (numMeta > 0) {
        out.iEnd += numMeta;
        out.meta = out.meta.concat(arrInput.slice(0).slice(workingIndex, workingIndex + numMeta));
        return out;
    }
    else { console.log('Should not happen'); } // Report out of ordinary circumstance
}

// End Process (gracefully)
process.exit(0);
