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

const test0 = rules.get(0).run('ababbb'); // good
const test1 = rules.get(0).run('bababa');
const test2 = rules.get(0).run('abbbab'); // good
const test3 = rules.get(0).run('aaabbb');
const test4 = rules.get(0).run('aaaabbb');

const rule0 = rules.get(0);
rule0.getPossible();

const part1 = messages.filter(message => {
    //return rules.get(0).run(message).length === 0; // This is much faster, but more complicated.
    return rules.get(0).getPossible().includes(message);
}).length;

console.log(`Year 2020 Day 19 Part 1 Solution: ${part1}`);