/**
 * https://adventofcode.com/2018/day7
 */

const _ = require('underscore'); // Not used?

// Read input into simple array
const arrInput = require('fs').readFileSync('input.txt', 'utf8').split('\n');

// Step 0 - Map Function - Use Regular Expression to parse each row
// Each row is converted to an array [ 0: row, 1:  rule, 2: result ]
const re = /Step ([A-Z]{1}) must be finished before step ([A-Z]{1}) can begin\./;
const step0 = row => re.exec(row);

// Step 1 - This is a bit messy. It's what I came up with to "seed" an object for all letters.
const step1a = row => {
    letters.push(row[1]);
    letters.push(row[2]);
};

// Step 1b - Sorting function for alphabetically sorting an array of strings
const step1b = (a, b) => {
    if (a < b) { return -1; }
    if (a > b) { return 1; }
    return 0;
};

let letters = [];

arrInput
    .map(step0)
    .forEach(step1a);

const A = "A".charCodeAt(0);
const lastCharCode = letters
    .sort(step1b)[letters.length - 1]
    .charCodeAt(0);

let steps = {};

_.range(A, lastCharCode + 1)
    .map(c => String.fromCharCode(c))
    .forEach(s => { steps[s] = { child: [], available: true } });

// Step 2 - Map Function - Convert to objects of objects for ease of use
const step2 = row => steps[row[1]].child.push(row[2]);

arrInput
    .map(step0)
    .forEach(step2);

let solution = [];

// Failed first attempt
/*
while (_.some(steps, s => s.available)) {
    let availableRoots = [];
    _.each(steps, (stepVal, stepInd) => {
        if (stepVal.available) availableRoots.push(findParent(stepInd));
    });
    availableRoots = _.uniq(availableRoots).sort(step1b);
    availableRoots.forEach(root => {
        steps[root].available = false;
        solution.push(root);
    })
}
*/

// First check to see how this thing starts
let roots = [];
_.each(steps, (stepVal, stepInd) => {
    const parent = findParent(stepInd);
    if (parent == stepInd && stepVal.child.length == 0) {
        console.log('Edge Case: Childless Orphan');
    }
    else roots.push(findParent(stepInd));
});

_.uniq(roots).sort(step1b).forEach(root => {
    solution.push(root);
    steps[root].available = false;
})

let levels = [];
let levelIndex = 0;
while (_.some(steps, s => s.available)) {
    levels[levelIndex] = [];
    let availableRoots = [];
    _.each(steps, (stepVal, stepInd) => {
        if (stepVal.available) availableRoots.push(findParent(stepInd));
    });
    availableRoots = _.uniq(availableRoots).sort(step1b);
    availableRoots.forEach(root => {
        steps[root].available = false;
        solution.push(root);
    })
}

console.log(solution.join(''));
// correct sample: CABDFE

// parent is a string
function nextStep(parent) {
    if (steps[parent].child.length > 0) {
        // this needs work!
        nextStep(parent.child);
    }
    else return parent;
}

function findParent(_child) {
    let parent = _child;
    _.each(steps, (stepVal, stepInd) => {
        if (stepInd == _child) return;
        if (!stepVal.available) {
            return;
        }
        const isParent = _.indexOf(stepVal.child, _child) > -1;
        if (isParent) parent = findParent(stepInd);
    });
    return parent;
}

// End Process (gracefully)
process.exit(0);
