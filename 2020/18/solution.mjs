/**
 * https://adventofcode.com/2020/day/18
 */

import { multiLine } from '../../common/parser.mjs';

// Parse Input
const inputFilePath = new URL('./input.txt', import.meta.url);
const arrInput = multiLine.toStrArray(inputFilePath);

// let tinput = '1 + 2 * 3 + 4 * 5 + 6';

// const test = math(tinput);
// console.log(test);

const part1 = arrInput.reduce((acc, cur) => { return acc + math(cur); }, 0);
console.log(`Year 2020 Day 18 Part 1 Solution: ${part1}`);

function math(str) {
    // strip off leading parens
    str = sliceExtraOuterParens(str);

    // Regular Expression for finding all parenthetical expressions
    const re = /\(([^\(\)]*)\)/g;

    const newStr = str.replace(re, math); // <== Recursion
    if (newStr === str) return evalExpression(str); //<= Part 2 change this to evalExpression2(str)
    return math(newStr); // <== Recursion again?
}

function sliceExtraOuterParens(str) {
    const parensFrontAndBack = str.charAt(0) === '(' && str.charAt(str.length - 1) === ')';
    if (!parensFrontAndBack) return str;
    const newStr = str.slice(1, -1);
    let open = 0; // Because of first paren

    for (let i = 0; i < newStr.length; i++) {
        if (newStr[i] === "(") open++;
        else if (newStr[i] === ")") open--;
        if (open < 0) {
            return str;
        }
    }
    if (open === 0) return newStr;
    throw "something bad happened";
}

function evalExpression(str) {
    const arr = str.split(' ');
    let result = parseInt(arr[0]);
    let mode;
    for (let i = 1; i < arr.length; i++) {
        const a = arr[i];
        if (a === "*") {
            mode = "*";
            continue;
        }
        if (a === "+") {
            mode = "+";
            continue;
        }
        if (mode === "*") {
            result *= parseInt(a);
            continue;
        }
        if (mode === '+') {
            result += parseInt(a);
            continue;
        }
    }
    return result;
}

function evalExpression2(str) {
    const arr = str.split('*'); // split by * for groups to be multiplied later
    //let result = parseInt(arr[0]);

    const result = arr
        .map(addStr)
        .reduce((acc, cum) => acc * cum, 1);

    return result;

    function addStr(strAddends) {
        const arrAddends = strAddends.split(' ');
        let addition = 0;
        for (let i = 0; i < arrAddends.length; i++) {
            const a = arrAddends[i];
            if (Number.isInteger(parseInt(a))) addition += parseInt(a);
        }
        return addition;
    }
}
