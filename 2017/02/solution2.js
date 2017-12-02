/**
 * https://adventofcode.com/2017/day/2
 */

const input = '2017/02/input.txt';

const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(input)
});

let checksum = 0;
lineReader.on('line', (line) => {
    let numbers = line.split("\t").sort((a, b) => b - a);
    console.log(`Sorted line: ${numbers}`);
    let division;
    a:
        for (var i = 0; i < numbers.length; i++) {
            const numA = numbers[i];
            b:
                for (let j = i + 1; j < numbers.length; j++) {
                    const numB = numbers[j];
                    if (numA % numB === 0) {
                        division = numA / numB;
                        console.log(`Multiple Found: ${numA}/${numB}=${division}`);
                        break a;
                    }
                }
        }
    checksum += division;
    console.log(`Checksum: ${checksum}`);
});