/**
 * https://adventofcode.com/2019/day/2
 */

// Read input into an array (arrInput)
const input = require('fs').readFileSync('input.txt', 'utf8');
const arrInput = input
    .trim()                     // Remove whitespace
    .replace(/\n$/, "")         // Remove trailing line return
    .split(',')                 // Split by delimiter
    .map(s => parseInt(s, 10)); // Convert to integers. See also parseFloat() and Number()


// "1202 program alarm" state
const part1 = runProgram(12, 2, 1e12);
console.log(`Part 1: position 0 = ${part1}`);

let part2Target = 19690720;
let keepGoing = true;
for (let noun = 0; noun < 100; noun++) {
    for (let verb = 0; verb < 100; verb++) {
        const output = runProgram(noun, verb, part2Target);
        if (output === part2Target) {
            console.log(`Part 2: Input = ${noun * 100 + verb}`);
            keepGoing = false;
            break;
        }
    }
    if (!keepGoing) break;
}

function runProgram(noun, verb, max) {
    let intCodes = [...arrInput];
    intCodes[1] = noun; // noun
    intCodes[2] = verb;  // verb

    let pos = 0;
    let posOpCode = intCodes[pos];

    while (posOpCode !== 99 && pos <= intCodes.length && intCodes[0] < max) {
        const intList = intCodes.slice(pos, pos + 4);
        switch (intList[0]) {
            case 1:
                // Addition
                intCodes[intList[3]] = intCodes[intList[1]] + intCodes[intList[2]];
                break;
            case 2:
                //Multiplication
                intCodes[intList[3]] = intCodes[intList[1]] * intCodes[intList[2]];
                break;
            default:
                console.error("Unknown Command");
        }
        pos = pos + 4;
        posOpCode = intCodes[pos];
    }
    return intCodes[0];
}

// End Process (gracefully)
process.exit(0);