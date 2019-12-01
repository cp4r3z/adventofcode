/**
 * https://adventofcode.com/2019/day/1
 */

// Read input into simple array
const file = require('fs').readFileSync('input.txt', 'utf8');
const arrInput = file.split('\n');

const fuelRequirement = arrInput
    .map(s => parseInt(s, 10))
    .reduce((sum, mass) => sum + getFuelForMass(mass), 0);

console.log(`Part 1: Fuel Requirement = ${fuelRequirement}`);

const fuelRequirementPlus = arrInput
    .map(s => parseInt(s, 10))
    .reduce((sum, mass) => sum + getFuelForMass(mass) + fuelForFuel(getFuelForMass(mass)), 0);


console.log(`Part 2: Fuel Requirement Plus Added Fuel = ${fuelRequirementPlus}`);

function fuelForFuel(mass) {
    if (mass < 3) return 0;
    const fuelForMass = getFuelForMass(mass);
    return fuelForMass + fuelForFuel(fuelForMass);
}

function getFuelForMass(mass) {
    const fuelMass = Math.floor((mass / 3)) - 2;
    return fuelMass > 0 ? fuelMass : 0;
}

// End Process (gracefully)
process.exit(0);