/**
 * https://adventofcode.com/2020/day/4
 */

import { multiLine } from '../../common/parser.mjs';

// Parse Input
let inputFilePath = new URL('./input.txt', import.meta.url);
const arrInput = multiLine.doubleNewLineSeparated(inputFilePath);
const passports = arrInput.map(p => {
    // Split each passport string into an array of field strings
    const arrFields = p.split(/\n|\s/);
    let passportObject = {};
    
    // Further parse each field string into a key value pair and add to object
    for (let field of arrFields) {
        const keyValue = field.split(':');
        passportObject[keyValue[0]] = keyValue[1];
    }
    return passportObject;
});

const validPassportCountPart1 = passports.map(validatePassport).filter(p => p).length;

console.log(`Year 2020 Day 04 Part 1 Solution: ${validPassportCountPart1}`);

const validPassportCountPart2 = passports.map(validatePassportPart2).filter(p => p).length;

console.log(`Year 2020 Day 04 Part 2 Solution: ${validPassportCountPart2}`);

function validatePassport(passport) {
    const REQUIRED_FIELDS = [
        'byr',
        'iyr',
        'eyr',
        'hgt',
        'hcl',
        'ecl',
        'pid',
        //'cid' // Optional I guess... for today :-)
    ];

    let valid = true;
    let i = 0;
    while (valid && REQUIRED_FIELDS[i]) {
        valid = passport.hasOwnProperty(REQUIRED_FIELDS[i]);
        i++;
    }

    return valid;
}

// Assume all fields but cid are present? In theory the && should short all invalids
// TODO: You know, this is probably one of those times we should use a class or typescript
function validatePassportPart2(passport) {
    let valid = validatePassport(passport);
    valid = valid && passport.byr.length === 4 && parseInt(passport.byr, 10) >= 1920 && parseInt(passport.byr, 10) <= 2002;
    valid = valid && passport.iyr.length === 4 && parseInt(passport.iyr, 10) >= 2010 && parseInt(passport.iyr, 10) <= 2020;
    valid = valid && passport.eyr.length === 4 && parseInt(passport.eyr, 10) >= 2020 && parseInt(passport.eyr, 10) <= 2030;
    valid = valid && /^\d+(cm|in){1}$/.test(passport.hgt);
    if (valid) {
        const hgt = parseInt(/^\d+/.exec(passport.hgt)[0]);
        const unit = /(cm|in){1}$/.exec(passport.hgt)[0];
        const validHeight = (unit === 'cm' && hgt >= 150 && hgt <= 193) || (unit === 'in' && hgt >= 59 && hgt <= 76);
        valid = valid && validHeight;
    }
    valid = valid && /^#[a-f0-9]{6}$/.test(passport.hcl);
    valid = valid && ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(passport.ecl);
    valid = valid && !isNaN(passport.pid) && passport.pid.length === 9;

    return valid;
}

// End Process (gracefully)
process.exit(0);