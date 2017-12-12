/**
 * https://adventofcode.com/2017/day/9
 */

const input = 'input0.txt';

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
        }
        else if (garbageStart !== undefined && file.substr(i, 1) === '>') {
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
let count = 1;
const re = /\{(.+)\}/

function addToCount(lev, str) {

    const inner = str.substr(1, str.length - 2);
    console.log(inner);
    if (inner.length > 0) {
        const groups = inner.split(',');
        if (groups.length > 0) {
            for (let group of groups) {
                console.log(group);
                count += lev;
                addToCount(lev + 1, group);
            }
        }
    }
}

let level = 2;
addToCount(level, file);
console.log(count)