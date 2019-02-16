/**
 * https://adventofcode.com/2018/day19
 */

const _ = require('underscore');

// Start IP: #ip 3
let ip = 3;

// Read input into simple array
const arrInput = require('fs').readFileSync('input.txt', 'utf8').split('\n');

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

//let registers = [1, 0, 0, 0, 0, 0];

//factors  = 1, 3, 71, 213, 49537, 148611, 3517127, 10551381,
// add em all toghether : 14266944

//let registers = [4, 1, 3517127, 8, 3, 10551381];
//let registers = [4, 1, 10551382, 10, 70,10551381 ];
//let registers = [75,1,10551382,10,71,10551381];
let registers = [75,1,10551382,10,212,10551381];


//let registers = [4, 0, 10551382, 2, 6, 10551381];

//let registers = [4, 1, 10551382, 10, 2000000, 10551381];

//let registers = [4, 0, 10551382, 12, 10551378, 10551381]; //fake
//let registers = [4, 1, 10551382, 10, 10, 10551381]; //fake

//let registers = [7, 0, 10551382, 1, 10551380, 10551381];
//let registers = [7, 1, 10551382, 1, 10551380, 10551381];

let stored0 = false;

const ignore = [3, 4, 5, 6, 8, 9, 10, 11];
let extras = 0;
do {
    //console.log(registers[ip]);
    //console.log(`[${registers.join(',')}]`);
    //console.log(`${program[registers[ip]].opcode} ${program[registers[ip]].a} ${program[registers[ip]].b} ${program[registers[ip]].c}`);
    const beforeReg = registers.slice(0);
    const bip = registers[ip];
    //console.log(`${bip} - ${program[bip].opcode} ${program[bip].a} ${program[bip].b} ${program[bip].c}`);

    //bypass
    // if (registers[3] == 3 && (registers[2] * registers[4]+1) < registers[5]) {
    //     registers = loop3_11(registers);
    // }
    if (registers[3] == 300) {
        registers = loop3_11_2(registers);
    }
    else {
        registers = op(program[registers[ip]], registers);
        registers[ip]++;
    }


    //registers = op(program[registers[ip]], registers);
    //registers[ip]++;

    //if (registers[0] != stored0 || (registers[ip] != 3 && registers[ip] != 4 && registers[ip] != 5 && registers[ip] != 6 && registers[ip] != 8 && registers[ip] != 9 && registers[ip] != 10 && registers[ip] != 11)) {
    if (registers[0] != stored0 || ignore.indexOf(registers[ip]) == -1 || extras > 0) {
        if (extras == 0) { extras += 6; }
        else extras--;
        //if (registers[0] != stored0) {
        console.log(extras);
        console.log(`[${beforeReg.join(',')}]`);
        console.log(`${program[bip].opcode} ${program[bip].a} ${program[bip].b} ${program[bip].c}`);
        console.log(`[${registers.join(',')}]`);
        console.log('\n');
        stored0 = registers[0];
    }

}
while (registers[ip] < program.length);

console.log(`Solution 1: Register 0 is ${registers[0]}`);

// 10551385 is wrong too low
// 10551388 is too low

// instruction (or _in) take an object, containing:
// opcode, a, b, c

function loop3_11(_r) {
    let r = _r.slice(0);
    const sim = Math.floor(r[5] / r[4]) - 1;
    r[2] += sim;
    //r[3]+=sim;
    return r;
}

function loop3_11_2(_r) {
    let r = _r.slice(0);
    //const sim = Math.floor(r[5] / r[4]) - 1;
    r[2] = r[5] + 1;
    r[3] = 12;
    //r[3]+=sim;
    return r;
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
