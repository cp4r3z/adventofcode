/**
 * https://adventofcode.com/2017/day/2
 */

const input = '2017/02/input.txt';

const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(input)
});

let checksum = 0;

lineReader.on('line', (line) => {
    console.log(`Line from input: ${line}`);
    const inputArray = line.split("\t");
    checksum += inputArray.reduce((a, b) => Math.max(a, b)) - inputArray.reduce((a, b) => Math.min(a, b));
    console.log(`checksum: ${checksum}`);
});