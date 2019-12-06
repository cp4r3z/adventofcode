/**
 * https://adventofcode.com/2019/day/6
 */

const parser = require('./parser.mjs');

// Parse Input

let inputFileName = 'input.txt';
const arrInput = parser.multiLine.toStrArray(inputFileName);
const relationships = arrInput.map(mapToRelationships);

let objects = {
    'COM': {
        parent: '',
        children: []
    }
};

// Walk the orbital relationships to link parent objects to their children

getChildren('COM');

// Part 1 asks to find the sum of all node trees

const orbits = getOrbits(0, 'COM');

console.log(`Part 1: ${orbits}`);

// Part 2 asks to find the distance from one node to another

let transfersDown = 0;
let transfersLinked = false;
let currentObject = 'YOU';

// Starting from 'YOU', keep searching higher parents for the presence of 'SAN'
do {
    const parent = objects[currentObject].parent;
    transfersLinked = isObjectInOrbitTree(transfersDown, parent, 'SAN');
    if (!transfersLinked) {
        transfersDown++;
        currentObject = parent;
    } else transfersLinked--;   // Because you don't want to orbit Santa, you want to be co-orbital
                                // We could also have searched for 'SAN's parent.

} while (!transfersLinked);

console.log(`Part 2: ${transfersLinked}`);

function mapToRelationships(str) {
    // Examples
    // COM)7FQ
    // RFX)9P9
    const parentAndChild = str.split(')');
    return {
        parentId: parentAndChild[0],
        childId: parentAndChild[1]
    }
}

function getChildren(parentId) {
    const children = relationships.filter(r => r.parentId == parentId);
    children.forEach(c => {
        objects[c.parentId].children.push(c.childId);
        if (!objects[c.childId]) {
            objects[c.childId] = {
                parent: parentId,
                children: []
            }
        }
        getChildren(c.childId);
    });
}

function getOrbits(orbitalLevel, parentId) {
    const level = orbitalLevel + 1;

    const children = objects[parentId].children;
    const orbits = level * children.length;

    let childOrbits = 0;
    children.forEach(c => {
        childOrbits += getOrbits(level, c);
    });
    return orbits + childOrbits;
}

function isObjectInOrbitTree(orbitalLevel, parentId, id) {
    const level = orbitalLevel + 1;

    // If you've found the 'id', return the length of the trip to get there
    const children = objects[parentId].children;
    if (children.filter(c => c === id).length > 0) return level;

    // If there are no children, return early
    if (children.length === 0) return false;

    // Otherwise keep looking
    let foundLevel = false;
    children.forEach(c => {
        const found = isObjectInOrbitTree(level, c, id);
        if (found) foundLevel = found;
    });

    return foundLevel;
}

// End Process (gracefully)
process.exit(0);