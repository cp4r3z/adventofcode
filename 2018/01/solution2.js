/**
 * https://adventofcode.com/2018/day/1
 */
const fs = require('fs');

const input = 'input.txt';
const file = fs.readFileSync(input, "utf8");
const lines = file.split("\n");

let frequency = 0;
let freqs = [];
let go = true;

while (go) {
    lines.forEach(line => {
        freqs.push(frequency);
        //console.log(`Line from input: ${line}`);
        const operator = line.substring(0, 1);
        const value = parseInt(line.substr(1));
        if (operator == '+') {
            frequency += value;
        }
        else {
            frequency -= value;
        }
        //console.log(freqs)
        //console.log(frequency);
        if (freqs.indexOf(frequency) > -1 && go) {
            console.log(frequency);
            console.log('SEEN BEFORE');
            go = false;
        }
    })
}
