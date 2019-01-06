/**
 * https://adventofcode.com/2018/day14
 */

const _ = require('underscore');

const input = 74501;
const inputString = '074501';

let scores = [3, 7];

let elf1 = 0;
let elf2 = 1;

while ((scores.length - 10) < input) {
    research();
    //console.log(scores.join(','));
}

console.log('Solution 1: ' + _.first(_.rest(scores, input), 10).join('')); // I guess you can use .subarray for this too.

// Reset
scores = [3, 7];
elf1 = 0;
elf2 = 1;

while (_.last(scores, 7).join('').indexOf(inputString) < 0) {
    research();
    //if (scores.length%100000==0) console.log(scores.length.toString());
}

console.log('Solution 2: ' + (scores.join('').indexOf(inputString)).toString());

// Answer: 20288091

function research(){
    add();
    elf1 = move(elf1, scores[elf1] + 1);
    elf2 = move(elf2, scores[elf2] + 1);
}

function add() {
    const sum = scores[elf1] + scores[elf2];
    const sumArray = sum.toString().split('');
    sumArray.forEach(s => scores.push(parseInt(s, 10)));
}

function move(_i, _n) {
    let iFinal = _i;
    _.times(_n, () => { iFinal = (iFinal < scores.length - 1) ? iFinal + 1 : 0; });
    return iFinal;
}

// End Process (gracefully)
process.exit(0);
