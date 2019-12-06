/**
 * https://adventofcode.com/2019/day/5
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

getChildren('COM');

const orbits = getOrbits(0, 'COM');
console.log(orbits)

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

// End Process (gracefully)
process.exit(0);