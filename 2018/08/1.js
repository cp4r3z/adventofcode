/**
 * https://adventofcode.com/2018/day/8
 */

const fs = require('fs');

const input = 'input.txt';
const file = fs.readFileSync(input, 'utf8');
const inputArr = file.split(' ');

console.log(inputArr.join(","));
const test = rChild(inputArr);
const metadata = test.childMeta.join(' + ');
const checksum = test.childMeta.reduce((acc, cur) => parseInt(acc, 10) + parseInt(cur, 10));
console.log(`${metadata} = ${checksum}`);

function rChild(_array) {
    //console.log('rchild')
    // Store number of children
    const numChild = parseInt(_array[0], 10);
    const numMeta = parseInt(_array[1], 10);

    if (numMeta <= 0) {
        console.log('no meta' + numMeta);
        //debugger;
    }

    //console.log(`_array: ${_array.join(' ')}`);
    let childIndex = 2; // Working index for child nodes /// VAR?
    var childLength = 0;
    let childMeta = []; /// VAR?

    if (numChild > 0) {

        for (var i = numChild; i--;) {
            var workingArray = _array.slice(childIndex); /// VAR?
            //console.log('Working Array: ' + workingArray.join(' '))
            var work = rChild(workingArray); // Recursion
            childIndex += work.childLength;
            childLength += work.childLength;
            if (work.childMeta.length > 0) {
                childMeta = childMeta.concat(work.childMeta);
            }
        }
        childLength = childLength - numMeta - 2;
        //childLength -= numMeta;
        if (numMeta > 0) {
            childMeta = _array.slice(-1 * numMeta).concat(childMeta);
        }
    }
    else {
        // No children
        childLength = 2 + numMeta;
        //console.log(`No Children: ${_array.join(' ')}`);
        if (numMeta > 0) {
            childMeta = childMeta.concat(_array.slice(2, 2 + numMeta));
        }
    }

    // Return length and metadata
    return {
        childLength,
        childMeta
    }
}

// Answer: 1+1+2+10+11+12+2+99=138.
// End Process (gracefully)
process.exit(0);
