/**
 * https://adventofcode.com/2017/day/5
 */

const input = '2017/05/input.txt';

let instructions = [];
const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(input)
});

lineReader.on('line', (line) => {
    //console.log(`Line from input: ${line}`);
    instructions.push(parseInt(line));
}).on('close', () => {
    let pos = 0;
    let steps = 0;
    while (pos < instructions.length) {
        const instruction = instructions[pos];
        //console.log(`Step ${steps}: instructions[${pos}]=${instruction}`);
        const posold = pos;
        pos += instructions[pos];
        instructions[posold]++;
        steps++;
    }
    console.log(`Exited on Step ${steps}.`);
});