/**
 * https://adventofcode.com/2018/day7
 */

const _ = require('underscore'); // Not used?

// Read input into simple array
const arrInput = require('fs').readFileSync('input.txt', 'utf8').split('\n');

// Step 0 - Map Function - Use Regular Expression to parse each row
// Each row is converted to an array [ 0: row, 1:  rule, 2: result ]
const re = /Step ([A-Z]{1}) must be finished before step ([A-Z]{1}) can begin\./;
const step0 = row => re.exec(row);

let lastChar = 'A';
const step1 = row => {
    if (row[1] > lastChar) lastChar = row[1];
    if (row[2] > lastChar) lastChar = row[2];
};

const step2 = row => {
    moveLetter(row[1], row[2]);
}

arrInput
    .map(step0)
    .forEach(step1);

const A = "A".charCodeAt(0);
const lastCharCode = lastChar.charCodeAt(0);

let letters = _.range(A, lastCharCode + 1).map(c => String.fromCharCode(c));
//moveLetter("B", "E");

let lettersChanged = true;
while (lettersChanged) {
    console.log(letters.join(''));
    const pre = letters.join('');
    arrInput
        .map(step0)
        .forEach(step2);
    lettersChanged = pre != letters.join('');
}

console.log(letters.join(''));

//GUTVLKBDJSARMXCOPEWQZHIYNF is wrong
//GUTVLKBDJSARMXCOPEWQZHIYNF
//TLAJPWOZKMSBQCEGHXUVIRNDYF is wrong
//UGTVLKBODJRMXSACYPEIWQZNHF is wrong

function moveLetter(char, afterChar) {
    if (letters.indexOf(char) < letters.indexOf(afterChar)) return;
    letters = _.without(letters, char);
    const insertIndex = letters.indexOf(afterChar);
    const head = _.head(letters, insertIndex);
    const tail = _.tail(letters, insertIndex);
    letters = head.concat([char], tail);
}

// Step 1b - Sorting function for alphabetically sorting an array of strings
const step1b = (a, b) => {
    if (a < b) { return -1; }
    if (a > b) { return 1; }
    return 0;
};

// End Process (gracefully)
process.exit(0);
