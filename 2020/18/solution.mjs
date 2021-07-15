/**
 * https://adventofcode.com/2020/day/18
 */

import { multiLine } from '../../common/parser.mjs';

// Parse Input
const inputFilePath = new URL('./input.txt', import.meta.url);
const arrInput = multiLine.toStrArray(inputFilePath);

let tinput = '1 + 2 * 3 + 4 * 5 + 6';
//tinput = tinput.replace(/\s/g,'');
const arrTinput = tinput.split(' ');

const test = math(arrTinput);

function math(str) {
    // find parens    
    
    
    // if cannot find paren, return result, otherwise, do math on the paren
    return evalExpression(strNoParens);
}

function evalExpression(str){
    const arr  = str.split(' ');
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