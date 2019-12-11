/**
 * https://adventofcode.com/2019/day/11
 */

const parser = require('./parser.mjs');
const grid2D = require('./grid2D.mjs');
const intCode = require('./intcode.mjs');

// Parse Input
let inputFileName = 'input.txt';
const arrInput = parser.singleLine.commaSeparated.toIntArray(inputFileName);

const part1 = registrationIdentifier(0);
console.log(`Part 1: ${part1} panels were painted.`);
console.log('Part 2:')
registrationIdentifier(1, true);

function registrationIdentifier(startInput, print) {

    // Instantiate an intCode computer
    const computer = intCode(
        {
            intCodes: arrInput, // Use the puzzle input array for initial intCodes
            phase: true // Phase doesn't matter for this puzzle. Careful using 0...
        }
    );

    // Instantiate a "map" object using a 2D grid
    const map = grid2D({}, ".");

    const outputEnum = { 0: 'color', 1: 'direction' };
    let outputEnumIndex = 0;

    let firstInput = true;
    let input = startInput; // 0=black, 1=white
    let output = false;

    let coor = { x: 0, y: 0 };
    let heading = 'U'; //TODO: make an object for this too. 'U' 'D' 'L' 'R'

    // Keep track of the number of painted panels
    let paintedPanels = 0;

    do {
        const previousColor = map.get(coor.x, coor.y).value;
        input = (previousColor === '#') ? 1 : 0; // 0 if '.' or ' '
        if (firstInput) {
            input = startInput;
            firstInput = false;
        }
        //console.log(`x:${coor.x}, y:${coor.y} = ${input}`);
        output = computer.run(true, input);
        if (output === false) break;

        // Figure out which output we're getting
        const outputType = outputEnum[outputEnumIndex];

        if (outputType === 'color') {
            const val = output === 1 ? '#' : ' ';

            // If this is the first time the panel was painted, increment
            if (previousColor === '.') paintedPanels++;

            map.set(coor.x, coor.y, val); //TODO: Change to a block character for readability

        } else if (outputType === 'direction') {
            if (previousColor === '.') {
                console.error('Error: Previous panel was not painted.');
            }

            // Left
            if (output === 0) {
                if (heading === 'U') heading = 'L';
                else if (heading === 'D') heading = 'R';
                else if (heading === 'L') heading = 'D';
                else if (heading === 'R') heading = 'U';
            }
            // Right
            if (output === 1) {
                if (heading === 'U') heading = 'R';
                else if (heading === 'D') heading = 'L';
                else if (heading === 'L') heading = 'U';
                else if (heading === 'R') heading = 'D';
            }
            if (heading === 'U') coor.y = coor.y + 1;
            else if (heading === 'D') coor.y = coor.y - 1;
            else if (heading === 'L') coor.x = coor.x - 1;
            else if (heading === 'R') coor.x = coor.x + 1;
        } else console.error('Error: outputType');

        outputEnumIndex = outputEnumIndex === 1 ? 0 : 1;

    } while (output !== false);

    if (print) map.print();
    return paintedPanels;
}

// End Process (gracefully)
process.exit(0);