/**
 * https://adventofcode.com/2018/day21
 */

const _ = require('underscore');

// #ip 4
const ip = 4;

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

//1361411
//14514182
// for (var i = 14514182; i < 14515182; i++) {
//     const halted = run_program(80000+i, i);
//     if (halted) {
//         console.log(`halted: ${halted}`);
//     }
// }
//let bip28 = [{ loop: 0, reg: 1105013081417 }, { loop: 0, reg: 1104296363893 }, { loop: 0, reg: 1101653155003 }, { loop: 0, reg: 1092633163479 }, { loop: 0, reg: 713604125745 }, { loop: 0, reg: 713589298470 }];
let bip28 = [];
let bip8 = [];
let bipgrr = [];
//const max = 17059512;
const max = 407059512;
// look at  172860175... reg = 53
//const max = 7059512;
// largest max = 16735068
let largestReg5 = 0;
// 1101653155003
// 1105013081417
// largestReg5=713589298470
// largestReg5=713604125745
// largestReg5=1092633163479
// largestReg5=1101653155003
// largestReg5=1104296363893
// largestReg5=1105013081417

//found this one... 14590535
// and this one...14656071
//genReg();
// 202209 (first answer)
run_program(max, 202209);
//run_program(max, 0);
// WRONG: 15298415 halts after ~ 172860175 loops
//16738346
//run_program(max, 0);


//const tebip = _.intersection(bip28, bipgrr);
bip8 = bip8.filter(r => r.reg > 10358142);
bip8.sort((a, b) => a.loops - b.loops);
bipgrr = bipgrr.filter(r => r.reg > 10358142);
bipgrr.sort((a, b) => a.loops - b.loops);
let lowestReg0 = bip28[bip28.length - 1].reg;
let mostLoops = 0;
let backupReg = [0, 0, 0, 0, 0, 0];
let backupLoops = 0;
//bip28.forEach((r, i) => {
bipgrr.forEach((r, i) => {
    run_program(r.loops + 10000, r.reg, true)
    console.log(bipgrr.length - 1 - i);
});

function run_program(max, reg0, check) {
    let registers = [reg0, 0, 0, 0, 0, 0];
    let loops = 0;
    let halted = false;
    let max2 = 0;

    if (check) {
        registers = backupReg.slice(0);
        registers[0] = reg0;
    }

    do {
        const beforeReg = registers.slice(0);
        const bip = registers[ip];
        //console.log(`${bip} - ${program[bip].opcode} ${program[bip].a} ${program[bip].b} ${program[bip].c}`);
        if (bip == 28) {
            // 127181 too low
            // 6911292 too low
            // 10358142 too low
            // 16777215 is wrong
            // 16738346 is wrong
            // 16711317 is wrong //(16777215 * 65899) & 16777215;
            // Lowest Reg 0: 11153993 Loops: 2688935
            // 11153993 is wrong
            // 1105013081417 is wrong
            //console.log(`loops=${loops} registers[5]=${registers[5]}`)
            if (!check) {
                const reg = registers[5];// //& 16777215;
                const found = _.findWhere(bip28, { reg: reg });
                if (!found) {
                    bip28.push({
                        reg: reg,
                        loops: loops
                    });
                }
                else{
                    console.log('ooo');
                }

            }
            //registers[0]=registers[5];
            if (check && registers[5] == registers[0]) {
                backupReg = registers.slice(0);
                backupLoops = loops;
            }

        }
        //console.log(`[${beforeReg.join(',')}]`);
        if (registers[ip] == 8 && registers[3] <= 256) {
            //console.log(`8 [${beforeReg.join(',')}]`);
            // console.log(`${registers[3].toString(2)}`)
            const reg = ((((registers[3] & 255) + registers[5]) & 16777215) * 65899) & 16777215;
            //console.log(reg)
            const found = _.findWhere(bip8, { reg: reg });
            if (!found) {
                bip8.push({
                    reg: reg,
                    loops: loops
                });
            }
            if (found) {
                console.log('oo a repeat!')
            }
        }
        registers = op(program[registers[ip]], registers);
        registers[ip]++;
        // if (!check && registers[5] != largestReg5) {
        //     largestReg5 = registers[5];
        //     console.log(`largestReg5=${largestReg5} loops ${loops}`);
        //     console.log(`${largestReg5.toString(2)}`)
        // }

        //if (false && loops > 172860175) {
        if (loops > 1820) {
            //if (registers[1] > registers[3]) {
            //if (registers[5] == 16777215) {
            if (!check) {
                bipgrr.push({
                    reg: registers[5],
                    loops: loops
                });
                // if (!check && registers[5] > largestReg5) {
                //     largestReg5 = registers[5];
                //     console.log(`largestReg5=${largestReg5}`);
                // }
            }
            console.log(`[${beforeReg.join(',')}]`);
            console.log(`${bip} - ${program[bip].opcode} ${program[bip].a} ${program[bip].b} ${program[bip].c}`);
            console.log(`[${registers.join(',')}]`);
            // console.log('\n');
        }
        loops++;
        halted = !(registers[ip] < program.length)
        if (halted) {
            //console.log('loop')
            //registers[ip]=0
            //registers = backupReg;
            //registers[5]++;
            //registers[0]++;
            //halted=false;
        }
        //if (registers[2] > max2) max2 = registers[2];

    }
    while (!halted && loops < max);
    //console.log(`Max registers[5]=${registers[5]}`)
    if (halted) {
        // console.log(`[${registers.join(',')}]`);
        // console.log(`reg0=${reg0}, loops=${loops}`)
        // console.log(`Max registers[2]=${registers[2]}`)
        if (check) {
            if (loops > mostLoops) {
                mostLoops = loops;
                lowestReg0 = reg0;
                console.log(`new mostLoops=${mostLoops} reg0=${reg0}`);
            }
        }
        console.log('halt')
    }

    return halted;
}
console.log(`Lowest Reg 0: ${lowestReg0} Loops: ${mostLoops}`);

function genReg() {

    //     ni 5 16777215 5
    // [202209,1,1,1,11,883939]


    // [202209,1,1,1,11,883939]
    // 11 - muli 5 65899 5
    //const a = (16777215 * 65899) & 16777215;

    const max = 20000;
    let i = 0;
    let reges = [];
    while (i < max) {
        const ireg = i * 65899;
        const reg = ireg & 16777215;
        if (reg > 10358142) {
            const found = _.findWhere(reges, { reg: reg });
            if (!found) {
                reges.push({
                    reg: reg
                });
            }
        }
        i++;
    }
    //reges = reges.filter(r => r.reg > 10358142);
    //bipgrr.sort((a, b) => a.loops - b.loops);
    console.log('reges ready ' + reges.length);
    return reges;
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
