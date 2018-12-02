/**
 * https://adventofcode.com/2018/day/1
 */

const input = 'input1.txt';
const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(input)
});

let frequency = 0;

lineReader.on('line', (line) => {
    console.log(`Line from input: ${line}`);
    const operator = line.substring(0,1);
    const value = parseInt(line.substr(1));
    if(operator=='+'){
        frequency+= value;
    } else {
        frequency -=value;
    }
    console.log(frequency);
});
