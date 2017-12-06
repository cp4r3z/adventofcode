/**
 * https://adventofcode.com/2017/day/4
 */

const input = '2017/04/input.txt';

const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(input)
});

let totalValid = 0;

lineReader.on('line', (line) => {
    console.log(`Line from input: ${line}`);
    let phrase = line.split(' ');
    isValid = true;
    for (let i = 0; i < phrase.length; i++) {
        const wordi = phrase[i];
        for (let j = i + 1; j < phrase.length; j++) {
            const wordj = phrase[j];
            if (wordi == wordj) {
                console.log('FOUND A MATCH!');
                isValid = false;
            }
        }
    }
    if (isValid) totalValid++;
    console.log(totalValid);
});