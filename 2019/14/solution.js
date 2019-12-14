/**
 * https://adventofcode.com/2019/day/14
 */

const parser = require('./parser.mjs');

// Parse Input
let inputFileName = 'input.txt';
const arrInput = parser.multiLine.toStrArray(inputFileName);

let reactions = [];
let reserves = {
    'ORE':0
};

reYields = /(.+) => (.+)/g;

arrInput.forEach(fillReactions);

const oneFuel = getOreRequirement('FUEL', 1);

console.log(oneFuel);
// recursive function 

function getOreRequirement(requestedChem, requestedQty) {
    const chemsTest = reactions.filter(r => r.out.chem === requestedChem);
    if (chemsTest.length !== 1) console.error('Error: Must be exactly 1 way to create a chemical');
    const chemical = reactions.filter(r => r.out.chem === requestedChem)[0];
    //TODO: maybe check here for multiple reactions?


    //todo: figure out qty of IN needed to make OUT requested in quantity

    //requested / out < math.ceiling
    const multipleOut = Math.ceil((requestedQty-reserves[requestedChem]) / chemical.out.qty);
    const reserveOut = chemical.out.qty*multipleOut-requestedQty;
    reserves[requestedChem]=reserves[requestedChem]+reserveOut;

    if (chemical.ore !== null) { //chemical.in[0].chem==='ORE'
        return chemical.ore * multipleOut;
    }
    const reduction = chemical.in.reduce((oreRequirement, reactant) => {
        return oreRequirement + getOreRequirement(reactant.chem, reactant.qty * multipleOut);
    }, 0);

    return reduction;
}

function fillReactions(s) {
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
    reserves[product.chem]=0;
}

function mapQuantityChemical(strQtyChem) {
    const reQtyChem = /(\d+) (\w+)/g;
    const qtyChem = reQtyChem.exec(strQtyChem);
    return {
        qty: parseInt(qtyChem[1], 10),
        chem: qtyChem[2]
    };
}

//Part 1: 609232 is too high

// End Process (gracefully)
process.exit(0);