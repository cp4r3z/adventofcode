/**
 * https://adventofcode.com/2017/day/16
 */
let dancers = 'abcdefghijklmnop'.split('');

const dancersStart = 'kgdchlfniambejop';
dancers = 'kgdchlfniambejop'.split('');

const input = 'input.txt';

const fs = require('fs'),
    _ = require('underscore');

let file = fs.readFileSync(input, "utf8");

// DO YOU NEED UNDERSCORE?

let moves = file.split(',');

const re = /^([sxp]{1})(.+)$/;
const reSlash = /([\d\w]+)\/([\d\w]+)/;

let i = 0;
let go = true;

function dance() {
    _.each(moves, (move => {

        const mover = move.match(re);
        const moveType = mover[1];
        const moveInstruction = mover[2];
        let ab, a, b, valA, valB;

        //swtich statement

        switch (moveType) {
            case 's':
                dancers = _.last(dancers, moveInstruction).concat(_.first(dancers, 16 - moveInstruction));
                break;
            case 'x':
                ab = moveInstruction.match(reSlash);
                a = parseInt(ab[1]);
                b = parseInt(ab[2]);
                valA = dancers[a];
                valB = dancers[b];
                dancers[a] = valB;
                dancers[b] = valA;
                break;
            case 'p':
                ab = moveInstruction.match(reSlash);
                valA = ab[1];
                valB = ab[2];
                a = _.indexOf(dancers, valA);
                b = _.indexOf(dancers, valB);
                dancers[a] = valB;
                dancers[b] = valA;
                break;
            default:
                // code
                console.error('Move Instruction not found. This should not happen.');
        }
    }));
}

while (go){
    i++;
    dance();
    go = !(dancers.join('') === dancersStart);
}

// Report the repeat pattern of the dancing.
console.log(i);
console.log(dancers.join(''));

// Now dance a bilion times.
let mod = (1e9-1)%i; // Minus 1 because we already danced once.
console.log(mod);

for (var j = 0; j < mod; j++) {
    dance();
}

console.log(dancers.join(''));