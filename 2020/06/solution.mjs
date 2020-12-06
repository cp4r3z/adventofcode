/**
 * https://adventofcode.com/2020/day/6
 */

import _ from 'underscore'; // Monolithic import

// Interesting read on ESM here: https://github.com/jashkenas/underscore/issues/2874
//import intersection from 'underscore/modules/intersection.js';
//import _, { intersection } from 'underscore';

import { multiLine } from '../../common/parser.mjs';

// Parse Input
let inputFilePath = new URL('./input.txt', import.meta.url); // Careful, input's got a trailing line return...
const arrInput = multiLine.doubleNewLineSeparated(inputFilePath);
const answers = arrInput.map(group => group.split('\n'));
const answerSets = answers.map(groupAnswers => {
    const answerSet = new Set();
    groupAnswers.forEach(personAnswer => {
        [...personAnswer].forEach(question => {
            answerSet.add(question);
        });
    });
    return answerSet;
});
const answerSetCountSum = answerSets.reduce((prev, curr) => prev + curr.size, 0);

console.log(`Year 2020 Day 06 Part 1 Solution: ${answerSetCountSum}`);

// Implementing my own intersection. It works

/*
const answerIntersectionSets = answers.map(groupAnswers => {
    const answerSet = new Set();
    const firstPersonsAnswers = groupAnswers[0];
    [...firstPersonsAnswers].forEach(question => {
        
            let consensus = true;
            groupAnswers.forEach(personAnswer => {
                if (![...personAnswer].includes(question)) consensus = false;
            });
            if (consensus) answerSet.add(question);
        
    });
    return answerSet;
});

const answerIntersectionSetCountSum = answerIntersectionSets.reduce((prev, curr) => prev + curr.size, 0);
*/

// Cheating using underscore for intersection
const answerIntersectionSets = answers.map(groupAnswers => {
    const arrGroupAnswers = groupAnswers.map(s => [...s]);
    const intersectingAnswers = _.intersection(...arrGroupAnswers);
    const answerSet = new Set(intersectingAnswers);
    return answerSet;
});

const answerIntersectionSetCountSum = answerIntersectionSets.reduce((prev, curr) => prev + curr.size, 0);

console.log(`Year 2020 Day 06 Part 2 Solution: ${answerIntersectionSetCountSum}`);

// End Process (gracefully)
process.exit(0);