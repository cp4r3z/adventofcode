/**
 * https://adventofcode.com/2018/day24
 */

const _ = require('underscore');

// Read input into simple array
const arrInputImmune = require('fs').readFileSync('input_immune.txt', 'utf8').split('\n');
const arrInputInfect = require('fs').readFileSync('input_infection.txt', 'utf8').split('\n');

let reMain = /(\d+) units each with (\d+) hit points (\([\w\s,;]+\))?[ ]?with an attack that does (\d+) (\w+) damage at initiative (\d+)/;
let reWeak = /weak to ([\w\s,]+)/;
let reImmu = /immune to ([\w\s,]+)/;

const mapMain = row => reMain.exec(row);

const mapType = row => {
    let weak = [];
    let immu = [];
    const weakMatch = reWeak.exec(row[3]);
    if (weakMatch) weak = csStr2Arr(weakMatch[1]);
    const immuMatch = reImmu.exec(row[3]);
    if (immuMatch) immu = csStr2Arr(immuMatch[1]);

    return {
        units: ~~row[1],
        hp: ~~row[2],
        dmg: ~~row[4],
        dmgType: row[5],
        init: ~~row[6],
        weak,
        immu
    };
};

const mapWeek = row => {
    return {
        opcode: row[1],
        a: ~~row[2],
        b: ~~row[3],
        c: ~~row[4]
    };
};

let immune = arrInputImmune
    .map(mapMain)
    .map(mapType);

let infect = arrInputInfect
    .map(mapMain)
    .map(mapType);

// Converts a comma-separated string to an array
// Note: This is too complicated. string.split would be better. I just was having fun.
function csStr2Arr(_s) {
    let a = [];
    let reList = /[^,\s]+/g;
    reList.lastIndex = 0;
    let m;
    while ((m = reList.exec(_s)) !== null) { a.push(m[0]); }
    return a;
}

// End Process (gracefully)
process.exit(0);
