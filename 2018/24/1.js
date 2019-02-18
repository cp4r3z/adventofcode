/**
 * https://adventofcode.com/2018/day24
 */

const _ = require('underscore');

// Read input into simple array
// const arrInputImmune = require('fs').readFileSync('input_immune_test.txt', 'utf8').split('\n');
// const arrInputInfect = require('fs').readFileSync('input_infection_test.txt', 'utf8').split('\n');

const arrInputImmune = require('fs').readFileSync('input_immune.txt', 'utf8').split('\n');
const arrInputInfect = require('fs').readFileSync('input_infection.txt', 'utf8').split('\n');

let reMain = /(\d+) units each with (\d+) hit points (\([\w\s,;]+\))?[ ]?with an attack that does (\d+) (\w+) damage at initiative (\d+)/;
let reWeak = /weak to ([\w\s,]+)/;
let reImmu = /immune to ([\w\s,]+)/;

const mapMain = row => reMain.exec(row);

let boost = 39;
// 39 works for Part 2. Good ol manual binary search.

const mapType = (row, rowi) => {
    let weak = [];
    let immu = [];
    const weakMatch = reWeak.exec(row[3]);
    if (weakMatch) weak = csStr2Arr(weakMatch[1]);
    const immuMatch = reImmu.exec(row[3]);
    if (immuMatch) immu = csStr2Arr(immuMatch[1]);

    return {
        groupi: rowi + 1,
        units: ~~row[1],
        hp: ~~row[2],
        dmg: ~~row[4],
        dmgType: row[5],
        init: ~~row[6],
        weak,
        immu,
        ep() { return this.units * this.dmg; }
    };
};

const mapGroupImmune = row => {
    const group = 'immune';
    row.group = group;
    row.groupid = group + row.groupi.toString();
    row.dmg += boost; // Part 2
    return row;
};

const mapGroupInfect = row => {
    const group = 'infect';
    row.group = group;
    row.groupid = group + row.groupi.toString();
    return row;
};

const immune = arrInputImmune
    .map(mapMain)
    .map(mapType)
    .map(mapGroupImmune);

const infect = arrInputInfect
    .map(mapMain)
    .map(mapType)
    .map(mapGroupInfect);

let groups = _.union(immune, infect);

while (!warIsOver()) {
    targetPhase();
    attackPhase();
}
console.log(`Solution 1: Units Remaining: ${warIsOver()}`);

// Part 2

// for (var i = 1000; i--;) {
//     boost = i;
//     while (!warIsOver()) {
//         targetPhase();
//         attackPhase();
//     }
// }

function targetPhase() {
    // TARGET PHASE

    // Sort by effective power and then initiative
    groups.sort((g1, g2) => {
        if (g1.ep() !== g2.ep()) {
            return g2.ep() - g1.ep();
        }
        else {
            return g2.init - g1.init;
        }
    });

    // reset
    groups.forEach(g => g.target = false);
    groups.forEach(g => g.targetted = false);
    groups.forEach(g => g.dmgFromG = false);

    groups.forEach((g, i, a) => {
        let targets = [];
        if (g.group == 'immune') targets = a.filter(g => !g.targetted && g.group == 'infect' && g.units > 0);
        if (g.group == 'infect') targets = a.filter(g => !g.targetted && g.group == 'immune' && g.units > 0);

        targets.forEach(t => {
            t.dmgFromG = calcDamage(g.ep(), t.weak.indexOf(g.dmgType) > -1, t.immu.indexOf(g.dmgType) > -1);
        });
        targets.sort((t1, t2) => t2.dmgFromG - t1.dmgFromG);

        // Find most damage. If tied, target most ep
        targets = targets.filter((t, i, a) => t.dmgFromG == a[0].dmgFromG);
        if (targets.length > 1) {
            targets.sort((t1, t2) => t2.ep() - t1.ep());
            targets = targets.filter((t, i, a) => t.ep() == a[0].ep());
            if (targets.length > 1) {
                targets.sort((t1, t2) => t2.init - t1.init);
            }
        }
        if (targets.length > 0 && targets[0].dmgFromG > 0) {
            const targetGroupId = targets[0].groupid;
            g.target = targetGroupId;
            const targetGroupIdIndex = _.findIndex(a, g => g.groupid == targetGroupId);
            a[targetGroupIdIndex].targetted = true;
            //console.log(`${g.groupid} targets ${g.target}`);
        }
    })
}

function attackPhase() {
    groups.sort((g1, g2) => g2.init - g1.init);
    groups.forEach((g, i, a) => {
        if (g.units > 0 && g.target) {
            const targetGroupIdIndex = _.findIndex(a, ag => ag.groupid == g.target);
            const targetID = a[targetGroupIdIndex].groupid;
            const targetHP = a[targetGroupIdIndex].hp;
            const targetDM = calcDamage(g.ep(), a[targetGroupIdIndex].weak.indexOf(g.dmgType) > -1, a[targetGroupIdIndex].immu.indexOf(g.dmgType) > -1);

            const targetUS = a[targetGroupIdIndex].units;
            const unitsDestroyed = Math.min(Math.floor(targetDM / targetHP), targetUS);
            console.log(`${g.groupid} attacks ${targetID} with ${targetDM} destroying ${unitsDestroyed} units.`);
            a[targetGroupIdIndex].units = a[targetGroupIdIndex].units - unitsDestroyed;
        }
    })
}

function warIsOver() {
    const infect = groups.filter(g => g.units > 0 && g.group == 'infect');
    const immune = groups.filter(g => g.units > 0 && g.group == 'immune');
    if (immune.length > 0 && infect.length > 0) return false;
    if (immune.length == 0) {
        console.log('Infection WINS')
    }
    else {
        console.log('Immune WINS');
    }
    const unitsRemaining = groups.reduce((u, g) => u + g.units, 0);
    return unitsRemaining;
}

function calcDamage(_ep, _isWeak, _isImmune) {
    let dmg = -1;
    if (_isImmune) {
        dmg = 0;
    }
    else if (_isWeak) {
        dmg = 2 * _ep;
    }
    else {
        dmg = _ep;
    }
    return dmg;
}

// Converts a comma-separated string to an array
// Note: This is too complicated. string.split would be better. I just was having fun.
function csStr2Arr(_s) {
    let a = [];
    let reList = /[^,\s]+/g;
    reList.lastIndex = 0;
    let m;
    while ((m = reList.exec(_s)) !== null) { a.push(m[0]); }
    return a;
}

// End Process (gracefully)
process.exit(0);
