/**
 * https://adventofcode.com/2017/day/8
 */

const input = 'input.txt';

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

// Populate a command array
let instructions = [];
for (let line of lines) {
    const re = /(\w+) ([dec,inc]+) ([-\d]+) if (\w+) ([><!=]+) ([-\d]+)/;
    const parsedLine = line.match(re);
    console.log(parsedLine);
    const instruction = {};
    
    instruction.target = parsedLine[1];
    instruction.operation = parsedLine[2];
    instruction.amount= parseInt(parsedLine[3]);
    instruction.compareTarget = parsedLine[4];
    instruction.comparator = parsedLine[5];
    instruction.compareAmount = parseInt(parsedLine[6]);
    
    instructions.push(instruction);
}

console.log(instructions);