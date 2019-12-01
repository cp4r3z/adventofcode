/**
 * https://adventofcode.com/2018/day20
 */

const _ = require('underscore');

let map = require('fs').readFileSync('./2018/20/input_test2.txt', 'utf8');
map = map.substring(1, map.length - 1);

const test = parens(map);
// const test2 = longestBranch('123');
// const test3 = longestBranch('123|12|1234');
// const test4 = longestBranch('123||12345');
// const test5 = longestBranch('123|123|');
// const test6 = longestBranch('');
// const test7 = longestBranch('1|2|3');

const test8 = recurseParens(map);
// now recurse through... accept string, return (max) length

function recurseParens(_s) {
    let doors = 0;
    const p = parens(_s);
    doors += p.nGroupLength;
    p.groups.forEach(g=>console.log(g.str));
    console.log('nGroups: '+p.nGroups.join(','));
    
    if (p.groups.length > 0) {
        // add all non-paren string length
        //doors += (_s.length - groups.reduce((dLength, g) => dLength + g.closeIndex - g.openIndex + 1, 0));
        p.groups.forEach(g => {
            doors += recurseParens(g.str);
        })
    }
    else {
        //doors = longestBranch(_s); /// no no no.... you need to add up all the non-groups
    }
    return doors;
}

function longestBranch(_s) {
    //assumes no parens
    const branches = _s.split('|').sort((b1, b2) => b2.length - b1.length);
    return branches[0].length;
}

function parens(_s) {
    let groups = [];
    let nGroups = []; // simple strings within level 0;
    const pOpen = '(';
    const pClose = ')';

    let p = {
        level: -1,
        openIndex: -1,
        closeIndex: -1,
        string: ''
    };
    let np = {
        startIndex: 0,
        endIndex: _s.length - 1
    }
    _s.split('').forEach((s, si, sa) => {
        if (s == pOpen) {
            // Parenthesis found
            p.level++;
            if (p.level == 0) {
                // new group started
                p.openIndex = si;
                if (si > np.startIndex) {
                    nGroups.push(_s.substring(np.startIndex, si));
                }
            }
        }
        else if (s == pClose) {
            if (p.level == 0) {
                // group closed
                p.closeIndex = si;
                // Note: This returns the contents of the parentheses, not the outer parentheses
                const group = {
                    openIndex: p.openIndex,
                    closeIndex: p.closeIndex,
                    str: _s.substring(p.openIndex + 1, p.closeIndex)
                }
                groups.push(group);
                // reset
                np.startIndex = si+1;
                p.level = -1;
            }
            else {
                p.level--;
            }
        }
    });
    //if (groups.length == 0) nGroups.push(_s);
    //return groups; //no, return groups and nGroup length
    const nGroupLength = nGroups.reduce((l,ng)=>l+longestBranch(ng),0);
    //nGroups.forEach(ng => nGroupLength += longestBranch(ng));
    return {
        groups,
        nGroups,
        nGroupLength
    }
}
// End Process (gracefully)
process.exit(0);

//8152 is too high
