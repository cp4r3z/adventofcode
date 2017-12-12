/**
 * https://adventofcode.com/2017/day/9
 */

const input = '2017/09/input0.txt';

const fs = require('fs'),
    _ = require('underscore');

let file = fs.readFileSync(input, "utf8");

// DO YOU NEED UNDERSCORE?

// take care of !
let cleanup = true;
while (cleanup) {
    cleanup = false;
    for (let i = 0; i < file.length; i++) {
        if (file.substr(i, 1) === '!') {
            console.log(`Found a ! @ position ${i}.`);
            cleanup = true;
            file = file.slice(0, i) + file.slice(i + 2);
            // poor man's for loop break
            i = file.length;
        }
    }    
}
console.log('! symbols removed');
console.log(file);

// remove garbage
cleanup = true;
while (cleanup) {
    cleanup = false;
    let garbageStart;
    let garbageEnd;
    for (let i = 0; i < file.length; i++) {
        if (garbageStart === undefined && file.substr(i, 1) === '<') {
            console.log(`Found a < @ position ${i}.`);
            garbageStart = i;
        } else if (garbageStart !== undefined && file.substr(i, 1) === '>') {
            console.log(`Found a > @ position ${i}.`);
            garbageEnd = i;
            file = file.slice(0, garbageStart) + file.slice(garbageEnd + 1);
            cleanup = true;
            // poor man's for loop break
            i = file.length;
        }
    }    
}
console.log('garbage removed')
console.log(file);

// count groups
