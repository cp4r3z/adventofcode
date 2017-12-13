/**
 * https://adventofcode.com/2017/day/9
 */

const input = 'input.txt';

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
            //console.log(`Found a ! @ position ${i}.`);
            cleanup = true;
            file = file.slice(0, i) + file.slice(i + 2);
            // poor man's for loop break
            i = file.length;
        }
    }
}
//console.log('! symbols removed');
//console.log(file);

// remove garbage
let totalGarbage =0;
cleanup = true;
while (cleanup) {
    cleanup = false;
    let garbageStart;
    let garbageEnd;
    for (let i = 0; i < file.length; i++) {
        if (garbageStart === undefined && file.substr(i, 1) === '<') {
            //console.log(`Found a < @ position ${i}.`);
            garbageStart = i;
        }
        else if (garbageStart !== undefined && file.substr(i, 1) === '>') {
            //console.log(`Found a > @ position ${i}.`);
            garbageEnd = i;
            file = file.slice(0, garbageStart) + file.slice(garbageEnd + 1);
            totalGarbage += garbageEnd-garbageStart-1;
            cleanup = true;
            // poor man's for loop break
            i = file.length;
        }
    }
}
//console.log('garbage removed')
//console.log(file);
console.log(`Total Garbage: ${totalGarbage}`)
// count groups
let count = 1;
const re = /\{(.+)\}/

function getInnerObjs(str) {
    let pos = {};
    pos.start = 0;
    pos.end = 0;
    let depth = 0;
    let innerObjs = [];

    for (let i = 0; i < str.length; i++) {
        if (str[i] == "}") {
            if (depth == 2) {
                pos.end = i;
                innerObjs.push(str.substr(pos.start, (pos.end - pos.start + 1)));
            }
            depth--;
        }
        if (str[i] == "{") {
            if (depth == 1) {
                pos.start = i;
            }
            depth++;
        }

    }
    return innerObjs;
}

function addToCount(lev, str) {
    const groups = getInnerObjs(str);
    if (groups.length > 0) {
        for (let group of groups) {
            //console.log(group);
            count += lev;
            addToCount(lev + 1, group);
        }
    }
}

let level = 2;
addToCount(level, file);
console.log(`Count: ${count}`);
