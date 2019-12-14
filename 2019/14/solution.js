/**
 * https://adventofcode.com/2019/day/14
 */

const parser = require('./parser.mjs');

// Parse Input
let inputFileName = 'input.txt';
const arrInput = parser.multiLine.toStrArray(inputFileName);

let reactions = [];

reYields = /(.+) => (.+)/g;

arrInput.forEach(s => {
    const yields = reYields.exec(s);
    const reactantsString = yields[1]; //reagents
    const productString = yields[2];
    let product = [productString].map(mapQuantityChemical)[0];
    let reactants = reactantsString.split(', ').map(mapQuantityChemical);
    reYields.lastIndex = 0; // Or maybe just change the scope of the regex?
    // Assumes, I think correctly, that ore is the only reactant.
    const ore = reactants[0].chem === 'ORE' ? reactants[0].qty : null;
    reactions.push({
        in: reactants,
        out: product,
        ore
    });
});

function mapQuantityChemical(strQtyChem) {
    const reQtyChem = /(\d+) (\w+)/g;
    const qtyChem = reQtyChem.exec(strQtyChem);
    return {
        qty: qtyChem[1],
        chem: qtyChem[2]
    };
}

// End Process (gracefully)
process.exit(0);