/**
 * https://adventofcode.com/2018/day16
 */

const _ = require('underscore');

// Read input into simple array
const arrInput = require('fs').readFileSync('input1.txt', 'utf8').split('\n\n');

// Step 0 - Map Function - Use Regular Expression to parse each row

const re = /Before: \[(\d+), (\d+), (\d+), (\d+)\]\n(\d+) (\d+) (\d+) (\d+)\nAfter:  \[(\d+), (\d+), (\d+), (\d+)\]/m;
const step0 = row => re.exec(row);
const step1 = row => {
    return {
        before: [~~row[1], ~~row[2], ~~row[3], ~~row[4]],
        instruction: {
            opcode: ~~row[5],
            a: ~~row[6],
            b: ~~row[7],
            c: ~~row[8]
        },
        after: [~~row[9], ~~row[10], ~~row[11], ~~row[12]]
    }
};

const samples = arrInput
    .map(step0)
    .map(step1);

let registers = [0, 0, 0, 0];

// const testIn = {
//     opcode: 'addi',
//     a: 0,
//     b: 7,
//     c: 3
// };

// op(testIn);

const opcodes = [
    'addr',
    'addi',
    'mulr',
    'muli',
    'banr',
    'bani',
    'borr',
    'bori',
    'setr',
    'seti',
    'gtir',
    'gtri',
    'gtrr',
    'eqir',
    'eqri',
    'eqrr'
];

let opIndices = Array(16).fill(0).map(r => []);

// for each sample, test against all possible opcodes, and evaluate if the after state is valid
const validCodes = samples.map(s => {
    let count = 0;
    opcodes.forEach(o => {
        const before = s.before.slice(0);
        const after = s.after.slice(0);
        let instruction = _.clone(s.instruction);
        const opIndex = ~~instruction.opcode;
        instruction.opcode = o;
        const testAfter = op(instruction, before);
        if (_.isEqual(testAfter, after)) {
            //console.log('hi');
            opIndices[opIndex].push(o);
            count++;
        }
    });
    return count;
});

const moreThanThree = validCodes.reduce((count, code) => code >= 3 ? count + 1 : count, 0);

console.log(`Solution 1: Samples w/ >=3 opcodes: ${moreThanThree}`);

opIndices = opIndices.map(i => _.uniq(i));

let unsolved = true;
// there's gotta be a better way to do this
while (unsolved) {
    // find an array with only one entry
    const single = _.find(opIndices, oi => oi.length == 1 && !oi.solved);
    if (single) {
        //op[single[0]]=
        let singleIndex = false;
        opIndices = opIndices.map((oi, i) => {
            if (oi.length == 1 && !oi.solved) singleIndex = i;
            if (oi.length > 1) {
                const what = _.without(oi, single[0]);
                return _.without(oi, single[0]);
            }
            else return oi;
        });
        opIndices[singleIndex].solved = true;

        let oUniq = {};
        opIndices.forEach(oi => {
            if (!oi.solved) {
                oi.forEach(o => {
                    if (!oUniq[o]) {
                        oUniq[o] = 1;
                    }
                    else oUniq[o]++;
                });
            }
        });
        //const uniq = _.findKey(oUniq, (o,i) => i == 1);
        const uniq = _.findKey(oUniq, o => o == 1);
        
        let singleIndex2 = false;
        if (uniq) {
            opIndices = opIndices.map((oi,i) => {
                if (oi.indexOf(uniq) > -1) {
                    singleIndex2 =i;
                    return [uniq]
                }
                else return oi;
            });
            opIndices[singleIndex2].solved = true;
        }
        
    }
    else {
        unsolved = false;
    }
}

opIndices = opIndices.map(oi=>oi[0]);

// instruction (or _in) take an object, containing:
// opcode, a, b, c
function op(_in, _r) {
    const opcode = _in.opcode;
    const a = _in.a;
    const b = _in.b;
    const c = _in.c;
    let r = _r.slice(0);

    switch (opcode) {
        case 'addr':
            // (add register) stores into register C the result of adding register A and register B
            r[c] = r[a] + r[b];
            break;
        case 'addi':
            // (add immediate) stores into register C the result of adding register A and value B
            r[c] = r[a] + b;
            break;
        case 'mulr':
            // (multiply register) stores into register C the result of multiplying register A and register B
            r[c] = r[a] * r[b];
            break;
        case 'muli':
            // (multiply immediate) stores into register C the result of multiplying register A and value B
            r[c] = r[a] * b;
            break;
        case 'banr':
            // (bitwise AND register) stores into register C the result of the bitwise AND of register A and register B.
            r[c] = r[a] & r[b];
            break;
        case 'bani':
            // (bitwise AND immediate) stores into register C the result of the bitwise AND of register A and value B
            r[c] = r[a] & b;
            break;
        case 'borr':
            // (bitwise OR register) stores into register C the result of the bitwise OR of register A and register B
            r[c] = r[a] | r[b];
            break;
        case 'bori':
            // (add immediate) stores into register C the result of adding register A and value B
            r[c] = r[a] | b;
            break;
        case 'setr':
            // (set register) copies the contents of register A into register C. (Input B is ignored.)
            r[c] = r[a];
            break;
        case 'seti':
            // (set immediate) stores value A into register C. (Input B is ignored.)
            r[c] = a;
            break;
        case 'gtir':
            // (greater-than immediate/register) sets register C to 1 if value A is greater than register B. Otherwise, register C is set to 0.
            r[c] = a > r[b] ? 1 : 0;
            break;
        case 'gtri':
            // (greater-than register/immediate) sets register C to 1 if register A is greater than value B. Otherwise, register C is set to 0.
            r[c] = r[a] > b ? 1 : 0;
            break;
        case 'gtrr':
            // (greater-than register/register) sets register C to 1 if register A is greater than register B. Otherwise, register C is set to 0.
            r[c] = r[a] > r[b] ? 1 : 0;
            break;
        case 'eqir':
            // (equal immediate/register) sets register C to 1 if value A is equal to register B. Otherwise, register C is set to 0.
            r[c] = a == r[b] ? 1 : 0;
            break;
        case 'eqri':
            // (equal register/immediate) sets register C to 1 if register A is equal to value B. Otherwise, register C is set to 0.
            r[c] = r[a] == b ? 1 : 0;
            break;
        case 'eqrr':
            // (equal register/register) sets register C to 1 if register A is equal to register B. Otherwise, register C is set to 0.
            r[c] = r[a] == r[b] ? 1 : 0;
            break;
        default:
            // should not happen
            console.log('Operation Not Found.');
    }
    return r;
}

// End Process (gracefully)
process.exit(0);
