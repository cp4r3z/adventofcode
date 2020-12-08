/**
 * https://adventofcode.com/2020/day/7
 */

import { multiLine } from '../../common/parser.mjs';

// Parse Input
let inputFilePath = new URL('./input.txt', import.meta.url);
const arrInput = multiLine.toStrArray(inputFilePath);

const luggageRegulations = {}; // Could have also used a map?

// Further Parse the input into the luggageRules object
const reParentAndChildren = /([\w\s]+)\sbags* contain\s([\w\s,]+)/;
const reChild = /(\d+)\s([\w\s]+)\sbag/;

arrInput.forEach(regulation => {
    const parentAndChildren = reParentAndChildren.exec(regulation);
    const parentColorKey = parentAndChildren[1];
    const childrenStrings = parentAndChildren[2].split(',');
    const children = [];
    childrenStrings.forEach(childString => {
        const child = reChild.exec(childString.trim());
        if (!child) return;
        const qty = parseInt(child[1], 10);
        const colorKey = child[2];
        children.push({ qty, colorKey });
    });
    luggageRegulations[parentColorKey] = { children };
});

let canContainShinyGoldBag = [];
for (const regColor in luggageRegulations) {
    if (regColor === 'bright green') {
        console.log('bg');
    }
    if (canContain(regColor, 'shiny gold')) canContainShinyGoldBag.push(regColor);
}

console.log(`Year 2020 Day 07 Part 1 Solution: ${canContainShinyGoldBag.length}`);

const shinyGoldContainsQty = qtyContains('shiny gold');

console.log(`Year 2020 Day 07 Part 2 Solution: ${shinyGoldContainsQty}`);

function canContain(parentColorKey, childColorKey) {
    const children = luggageRegulations[parentColorKey].children;
    if (children.length === 0) return false;
    let contains = false;
    for (const child of children) {
        if (contains) break;
        if (child.colorKey === childColorKey) {
            contains = true;
        } else {
            contains = contains || canContain(child.colorKey, childColorKey);
        }
    }
    return contains;
}

function qtyContains(colorKey) {
    const children = luggageRegulations[colorKey].children;
    if (children.length === 0) return 0; // Empty bag
    let qty = 0;
    for (const child of children) {
        qty += child.qty * (1 + qtyContains(child.colorKey));
    }
    return qty;
}

// End Process (gracefully)
process.exit(0);