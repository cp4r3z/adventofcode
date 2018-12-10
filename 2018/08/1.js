/**
 * https://adventofcode.com/2018/day/8
 */

const fs = require('fs');

const input = 'input_s.txt';
const file = fs.readFileSync(input, 'utf8');
const inputArr = file.split(' ');

//inputArr.forEach(each => console.log(each));
console.log(inputArr.join(" "));
const test = rChild(inputArr);
console.log(test.childMeta.join(' '));

function rChild(_array) {
    // Store number of children
    const numChild = parseInt(_array[0], 10);



    const numMeta = parseInt(_array[1], 10);

    //const childArray = _array.slice(2);
    console.log(`_array: ${_array.join(' ')}`);
    var childIndex = 2; // Working index for child nodes /// VAR?
    var childLength = 0;
    var childMeta = []; /// VAR?

    if (numChild > 0) {
        for (var i = numChild; i--;) {
            var workingArray = _array.slice(childIndex); /// VAR?
            console.log('Working Array: ' + workingArray.join(' '))
            var work = rChild(workingArray); // Recursion
            //childIndex += work.childLength;
            childIndex += work.childLength;
            childMeta = childMeta.concat(work.childMeta);
        }
        //const meta = childArray.slice(-1 * childLength); //meh
        childLength -= numMeta;

        childMeta = _array.slice(-1 * numMeta).concat(childMeta); //VAR???
    }
    else {
        // No children

        childLength = 2 + numMeta;

        console.log(`No Children: ${_array.join(' ')}`);
        childMeta = childMeta.concat(_array.slice(2, 2 + numMeta));
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
