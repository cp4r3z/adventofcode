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
        this.PossibleStrings = [];
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

    // complete list of possible strings
    build(possibleStringsPtr, str = '', isEnd=true) {
        
        if (this.IsLeaf) {
            //return possibles.map(p => p += this.RuleString);
            if (!this.RuleString) {
                console.error('no rulestring??');
            }
            return  this.RuleString;
        }

        //let morePossibles = [];

        for (let si = 0; si < this.SubRules.length; si++) {
            //let possibleSub = JSON.parse(JSON.stringify(possibles));    

            let workStr = str;

            const rules = this.SubRules[si];

            for (let ri = 0; ri < rules.length; ri++) {
                const rule = rules[ri];

                const test = rule.build(possibleStringsPtr, workStr, ri===rules.length-1);
                if (!test){
                    console.error('no build?');
                }
                workStr += rule.build(possibleStringsPtr, workStr, ri===rules.length-1);
            }

            if (isEnd) {
                //morePossibles.push(possibleSub);
                possibleStringsPtr.push(workStr);
            } else {
                return workStr;
            }

        }


        // if (depth === 0) {
        //     this.PossibleStrings.push(morePossibles);
        // } else {
        //     return morePossibles;
        // }
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

const rule42 = rules.get(42);
rule42.build(rule42.PossibleStrings);


//rules.get(42).build(possible31);


const part1 = messages.filter(message => {
    return rules.get(0).run(message).length === 0;
}).length;

console.log(`Year 2020 Day 19 Part 1 Solution: ${part1}`);