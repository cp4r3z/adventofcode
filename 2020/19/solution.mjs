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


    // takes array of strings (partial possibilties)
    getPossibilities(arrayFrom) {

        // remember you're IN a rule

        if (this.IsLeaf) {
            // add this.RuleString to all and return
            return arrayFrom.map(str => str + this.RuleString);
        }

        const arrayMore = arrayFrom.map(str => {

            // each subrule contains rules, but the subrules are independent (parallel)
            const arrSubRulesPossibilities = this.SubRules.map(rules => {
                // now apply these rules one after the other (serial)


                const nextStr = rules.reduce((accArr, rule) => {

                    //accArr = accumulated array of possibilities

                    const arrayRules = rule.getPossibilities(accArr); // These get added to each of the current possibilites in accArr

                    let nextAccArr = [];
                    accArr.forEach(str => {
                        arrayRules.forEach(str2 => {
                            nextAccArr.push(str + str2);
                        });
                    });
                    return nextAccArr;

                }, [str]);
                return nextStr;
            });
            return arrSubRulesPossibilities; // just return it up top?


            // returns an array (even if it's just one?)

        });

        // return arrayMore (flattened with .flat)
        return arrayMore.flat();
    }

    build3(){
        this.PossibleStrings = this.getPossibilities(['']);
    }

    // complete list of possible strings

    build(str = '', nextRules = [], rulesFollowed = []) {
        const nextRulesFollowed = JSON.parse(JSON.stringify(rulesFollowed));
        nextRulesFollowed.push(this.Key);

        if (this.IsLeaf) {
            const newStr = str += this.RuleString;

            if (nextRules.length === 0) {
                // we're at an end!
                console.log(`${newStr} ... ${nextRulesFollowed} `);
                return;
            } else {
                // const nextRule2 = nextRules[0];
                // const nextRules2 = nextRules.slice(1, nextRules.length );
                nextRules[0].build(newStr, nextRules.slice(1, nextRules.length), nextRulesFollowed);
            }
        }

        // Not a leaf

        for (let si = 0; si < this.SubRules.length; si++) { // OR

            const rules = this.SubRules[si];

            // const nextRule = rules[0];
            // const nextRules = rules.slice(1, rules.length);

            rules[0].build(
                str,
                nextRules.concat(rules.slice(1, rules.length)), // !!! Or should it be the other way around?
                nextRulesFollowed
            );
        }

    }


    buildold(possibleStringsPtr, str = '', isEnd = true) {

        if (this.IsLeaf) {
            //return possibles.map(p => p += this.RuleString);
            if (!this.RuleString) {
                console.error('no rulestring??');
            }
            return this.RuleString;
        }

        //let morePossibles = [];

        for (let si = 0; si < this.SubRules.length; si++) {
            //let possibleSub = JSON.parse(JSON.stringify(possibles));    

            let workStr = str;

            const rules = this.SubRules[si];

            for (let ri = 0; ri < rules.length; ri++) {
                const rule = rules[ri];

                const test = rule.build(possibleStringsPtr, workStr, ri === rules.length - 1);
                if (!test) {
                    console.error('no build?');
                }
                workStr += rule.build(possibleStringsPtr, workStr, ri === rules.length - 1);
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
//rule42.build();
rule42.build3();


//rules.get(42).build(possible31);


const part1 = messages.filter(message => {
    return rules.get(0).run(message).length === 0;
}).length;

console.log(`Year 2020 Day 19 Part 1 Solution: ${part1}`);