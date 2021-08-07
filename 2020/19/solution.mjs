/**
 * https://adventofcode.com/2020/day/19
 */

import { multiLine } from '../../common/parser.mjs';

// Parse Input
const inputFilePath = new URL('./input.txt', import.meta.url);
const arrInput = multiLine.toStrArray(inputFilePath);

class Rule {
    // arrSubs must be an array of int arrays. The outer array is an "or", the inners are "sequences"
    /**
     * 1: 2 3 | 4 5 => [ [2,3], [4,5] ]
     * 2: 1 => [ [1] ]
     * 3: 1 2 => [ [1,2] ]
     */

    constructor(key, strRule, arrSubs) {
        this.Key = key; // Probably shouldn't use this, but it's good for debugging
        this.RuleString = strRule;
        this.SubRules = arrSubs;
        this.IsLeaf = arrSubs.length === 0;
        this.PossibleStrings = false;
        if (this.IsLeaf) this.PossibleStrings = [this.RuleString];
    }

    run(str) {
        if (this.IsLeaf) {
            let newStr = str.split('');
            const testChar = newStr.shift();
            newStr = newStr.join(''); // This isn't super efficient.
            const valid = testChar === this.RuleString; // last step in recursion
            const warningStr = 'c' + str;
            return valid ? newStr : warningStr; // wish we could return false....
        }

        // Not a leaf
        let workStr = str;
        const subruleResults = [];

        for (let si = 0; si < this.SubRules.length; si++) {
            const workStrBackup = workStr;
            const rules = this.SubRules[si];

            for (let ri = 0; ri < rules.length; ri++) {
                const rule = rules[ri];
                workStr = rule.run(workStr);
            }

            subruleResults.push(workStr);
            workStr = workStrBackup;
        }

        workStr = subruleResults.sort()[0];

        return workStr; // But we don't know which rule was the best.
    }

    // Get complete list of all possible strings
    getPossible() {

        // Note: If this.IsLeaf, PossibleStrings is already an array of the value ['a'] for example

        if (this.PossibleStrings) return this.PossibleStrings; // Don't Repeat Yourself

        let subruleResults = this.SubRules.map(rules => {

            // 2D Array of arrays of possible strings
            const rulesPossibles = rules.map(rule => rule.getPossible());

            // Flatten to array of possible strings
            const possibles = this._permutePossibles(rulesPossibles);

            return possibles;

        });

        this.PossibleStrings = subruleResults.flat();
        return this.PossibleStrings;
        //TODO: For debugging it might be nice to return the rule number too
    }

    // Builds up all combinations of an array or arrays, but in the order of the parent array.
    _permutePossibles(arrOfArrs) {
        let possibles = [''];
        arrOfArrs.forEach(arr => {
            possibles = possibles
                .map(p1 => {
                    return arr.map(p2 => {
                        return p1 + p2;
                    });
                })
                .flat();
        });
        return possibles;
    }
}

const rules = new Map();
const messages = [];

const reKeyAndRule = /(\d+): (.+)/;
const reSplitSubs = /([^\|]+) \| ([^\|]+)/;

let parseMode = 0; // 0=rule, 1=messages
arrInput.forEach(line => {
    switch (parseMode) {
        case 0:
            if (line === '') {
                parseMode++;
                break;
            }
            // let's parse out the key and rule
            const matchesKR = line.match(reKeyAndRule);
            const key = parseInt(matchesKR[1]);
            let rule = matchesKR[2];

            let arrRule = []; // outer rule. needs inner arrays to be pushed in.
            if (rule.includes('|')) {
                // split the two sub rules (thankfully there are always 2);
                const matchesSubs = rule.match(reSplitSubs);
                const sub1 = matchesSubs[1].split(' ').map(s => parseInt(s.trim()));
                const sub2 = matchesSubs[2].split(' ').map(s => parseInt(s.trim()));
                arrRule.push(sub1);
                arrRule.push(sub2);
            } else if (rule.includes('\"')) {
                rule = rule.match(/\"(\w)\"/)[1];
                // leave arrRule empty
            }
            else {
                // no subs, only sequence
                arrRule.push(rule.split(' ').map(s => parseInt(s.trim())));
            }
            rules.set(key, new Rule(key, rule, arrRule));
            break;
        case 1:
            messages.push(line);
            break;
        default:
            console.error('bad parsing');
            break;
    }
});

// Now go through again and create subrule pointers
rules.forEach(rule => {
    const ptrSubRules = [];
    rule.SubRules.forEach(sr => {
        const ptrSubRule = [];
        sr.forEach(r => {
            // "r" should be the integer key for the sub-rule.
            ptrSubRule.push(rules.get(r));
        });
        ptrSubRules.push(ptrSubRule);
    });
    rule.SubRules = ptrSubRules;
});

// There are a couple ways to solve Part 1, using Rule.run() and Rule.getPossible()
const part1 = messages.filter(message => {
    //return rules.get(0).run(message).length === 0; // This is much faster, but more complicated.
    return rules.get(0).getPossible().includes(message);
}).length;

console.log(`Year 2020 Day 19 Part 1 Solution: ${part1}`);

// Part 2

// Use what we know of the possible values of rule 31 and 41 to start slicing down each message.
// It's not elegant, but it's what I thought of.

const rule31 = rules.get(31);
//const rule42 = rules.get(42); // The PossibleString lengths are confirmed to be the same as rule 31

const rule3142Length = rule31.PossibleStrings[0].length; // Mercifully all possible string lengths are the same

const part2 = messages.filter(message => {
    // If it satisfies the existing possible strings, no need for more work!
    const isValid = rules.get(0).getPossible().includes(message);
    // if (isValid) console.log(message);
    if (isValid) return true;

    let workingMessage = message; // pass by value

    let keepSlicing = true;
    let isValidForPart2 = false;

    let mode = 11;
    let rule11Satisfied = false;
    let rule8Satisfied = false;

    while (keepSlicing) {

        // TODO: Doesn't string have these operations???

        const wMArr = workingMessage.split('');
        const wmStart = wMArr.slice(0, rule3142Length).join('');
        const wmEnd = wMArr.slice(-1 * rule3142Length).join('');

        const startWith42 = rules.get(42).getPossible().includes(wmStart);
        const endsWith31 = rules.get(31).getPossible().includes(wmEnd);

        switch (mode) {
            case 11:
                // trim rule31 from end... and you MUST trim rule42 from beginning

                if (startWith42 && endsWith31) {
                    if (!rule11Satisfied) rule11Satisfied = true; // must get hit once to be valid for part 2
                    workingMessage = wMArr.slice(rule3142Length, -1 * rule3142Length).join('');
                    if (workingMessage.length === 0) {
                        keepSlicing = false;
                    }
                    //keep going
                } else {
                    //otherwise keep going with rule 8
                    mode = 8; // we don't know if it's actually ok at this point
                }

                break;

            case 8:
                // then trim rule42 from beginning until the message is ''
                if (!startWith42) {
                    keepSlicing = false;
                    isValidForPart2 = false;
                    break;
                } else {
                    if (!rule8Satisfied) rule8Satisfied = true; // must get hit once to be valid for part 2
                    workingMessage = wMArr.slice(rule3142Length).join('');
                    if (workingMessage.length === 0) {
                        keepSlicing = false;
                        isValidForPart2 = true;
                    }
                    //otherwise keep going
                }

                break;
            default:
                console.error('should never happen');
                break;
        }

        // stop slicing if length is < rule3142Length
        // mercifully, this is never hit
        if (workingMessage.length < rule3142Length && workingMessage.length > 0) {
            keepSlicing = false;
            isValidForPart2 = false;
        }

    }

    if (!rule11Satisfied || !rule8Satisfied) {
        isValidForPart2 = false;
    }

    //if (isValidForPart2) console.log(message);
    return isValidForPart2;

}).length;

console.log(`Year 2020 Day 19 Part 2 Solution: ${part2}`);
