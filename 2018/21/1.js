/**
 * https://adventofcode.com/2018/day21
 */

const _ = require('underscore');

// Instruction Pointer
// #ip 4
const ip = 4;

// Read input into simple array
const arrInput = require('fs').readFileSync('2018/21/input.txt', 'utf8').split('\n');

const re = /(\w+) (\d+) (\d+) (\d+)/;
const step0 = row => re.exec(row);

const step1 = row => {
    return {
        opcode: row[1],
        a: ~~row[2],
        b: ~~row[3],
        c: ~~row[4]
    };
};

const program = arrInput
    .map(step0)
    .map(step1);

let arrInstruction28 = []; // Array which holds all the registers[5] values found when instruction is 28

const maxOps = 1e10; // Set some limit on the number of operations.
run_program(maxOps, 0);

console.log(`Part 1 Solution: ${arrInstruction28[0]}`);
console.log(`Part 1 Solution: ${arrInstruction28[arrInstruction28.length-1]}`);

// 202209 (first answer)
// 11777564 (second answer)

function run_program(max, reg0, check) {
    let registers = [reg0, 0, 0, 0, 0, 0];
    let loops = 0;
    let halted = false;

    while (!halted && loops < max) {
        const instruction = registers[ip];
        if (instruction == 28 && registers[2] > 0) {
            const reg = registers[5];

            const found = arrInstruction28.indexOf(reg) > -1;
            if (!found) {

                arrInstruction28.push(reg);
                console.log(arrInstruction28.length);
            } else {
                halted = true;
            }
        }

        registers = op(program[registers[ip]], registers);
        registers[ip]++;
        loops++;
        halted = halted || !(registers[ip] < program.length);
    }

    return halted;
}

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
            r[c] = (r[a] & r[b]);
            break;
        case 'bani':
            // (bitwise AND immediate) stores into register C the result of the bitwise AND of register A and value B
            r[c] = (r[a] & b);
            break;
        case 'borr':
            // (bitwise OR register) stores into register C the result of the bitwise OR of register A and register B
            r[c] = (r[a] | r[b]);
            break;
        case 'bori':
            // (add immediate) stores into register C the result of adding register A and value B
            r[c] = (r[a] | b);
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