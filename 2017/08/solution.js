/**
 * https://adventofcode.com/2017/day/8
 */

const input = '2017/08/input.txt';

const fs = require('fs'),
    _ = require('underscore'),
    file = fs.readFileSync(input, "utf8"),
    lines = file.split("\n");

/*
 * b inc 5 if a > 1
 * b      inc       5   if a       >          1
 * 1      2         3      4             5          6
 * target operation amount compareTarget comparator compareAmount
 */

let instructions = [];
for (let line of lines) {
    const re = /(\w+) ([dec,inc]+) ([-\d]+) if (\w+) ([><!=]+) ([-\d]+)/;
    const parsedLine = line.match(re);
    //console.log(parsedLine);
    const instruction = {};

    instruction.target = parsedLine[1];
    instruction.operation = parsedLine[2];
    instruction.amount = parseInt(parsedLine[3]);
    instruction.compareTarget = parsedLine[4];
    instruction.comparator = parsedLine[5];
    instruction.compareAmount = parseInt(parsedLine[6]);

    instructions.push(instruction);
}

let registers = {};
let highest = 0;

for (let instruction of instructions) {
    if (registers[instruction.compareTarget] === undefined) {
        registers[instruction.compareTarget] = 0;
    }
    let follow = false;
    switch (instruction.comparator) {
        case '>':
            follow = registers[instruction.compareTarget] > instruction.compareAmount;
            break;
        case '>=':
            follow = registers[instruction.compareTarget] >= instruction.compareAmount;
            break;
        case '<':
            follow = registers[instruction.compareTarget] < instruction.compareAmount;
            break;
        case '<=':
            follow = registers[instruction.compareTarget] <= instruction.compareAmount;
            break;
        case '==':
            follow = registers[instruction.compareTarget] == instruction.compareAmount;
            break;
        case '!=':
            follow = registers[instruction.compareTarget] != instruction.compareAmount;
            break;
        default:
            // code
            console.error(instruction.comparator + ' not found!');
    }
    if (follow) followInstruction(instruction);

    function followInstruction(instruction) {
        if (registers[instruction.target] === undefined) {
            registers[instruction.target] = 0;
        }
        switch (instruction.operation) {
            case 'inc':
                //console.log(`Increasing ${instruction.target} by ${instruction.amount}...`);
                registers[instruction.target] += instruction.amount;
                break;
            case 'dec':
                //console.log(`Decreasing ${instruction.target} by ${instruction.amount}...`);
                registers[instruction.target] -= instruction.amount;
                break;
            default:
                console.error('Cannot find instruction.')
        }
        if (registers[instruction.target] > highest) highest = registers[instruction.target];
    }
}

//console.log(registers);

const max = _.max(_.values(registers));
console.log(`Part 1: What is the largest value in any register after completing the instructions in your puzzle input? Answer: ${max}`);
console.log(`Part 2: The highest value held in any register during this process. Answer: ${highest}`);