/**
 * https://adventofcode.com/2020/day/19
 */

import { multiLine } from '../../common/parser.mjs';

// Parse Input
const inputFilePath = new URL('./tinput.txt', import.meta.url);
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
    }

    isValid(str) {
        if (this.IsLeaf) {
            let newStr = str.split('');
            const testChar = newStr.shift();
            newStr = newStr.join(''); // This isn't super efficient.
            const valid = testChar === this.RuleString; // last step in recursion
            return valid ? newStr : str; // wish we could return false....
        }

        // Not a leaf
        let workStr = str;
        for (let si = 0; si < this.SubRules.length; si++) {
            const workStrBackup = workStr;
            const rules = this.SubRules[si];
            //const workStrLengthPrev = workStr.length;
            for (let ri = 0; ri < rules.length; ri++) {
                const rule = rules[ri];
                //const workStrLengthPrev = workStr.length;
                workStr = rule.isValid(workStr);
                
            }
            if (workStr.length === str.length) {
                // didn't do anything
                break;
            }
        }

        return workStr;


        //return workStr.length === 0; // ?

        // let workStr = str;

        // const subsValid = this.SubRules.forEach(rules=>{       
        //     let keepGoing = true; 
        //     rules.forEach(rule=>{
        //         if (!keepGoing) return;
        //         workStr = rule.isValid(workStr);
        //         keepGoing = !!workStr; // still chars left
        //     });
        //     // let keepGoing = true;
        //     // while ()
        // });

        // return workStr.length===0;
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

const test0 = rules.get(0).isValid('ababbb'); // good
const test1 = rules.get(0).isValid('bababa');
const test2 = rules.get(0).isValid('abbbab'); // good
const test3 = rules.get(0).isValid('aaabbb');
const test4 = rules.get(0).isValid('aaaabbb');

console.log(`Year 2020 Day 19 Part 1 Solution: ${part1}`);