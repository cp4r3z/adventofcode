/**
 * https://adventofcode.com/2018/day24
 */

const _ = require('underscore');

// Read input into simple array
const arrInputImmune = require('fs').readFileSync('input_immune_test.txt', 'utf8').split('\n');
const arrInputInfect = require('fs').readFileSync('input_infection_test.txt', 'utf8').split('\n');

let reMain = /(\d+) units each with (\d+) hit points (\([\w\s,;]+\))?[ ]?with an attack that does (\d+) (\w+) damage at initiative (\d+)/;
let reWeak = /weak to ([\w\s,]+)/;
let reImmu = /immune to ([\w\s,]+)/;

const mapMain = row => reMain.exec(row);

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

// console.log(immune[0].ep());
// immune[0].units--;
// console.log(immune[0].ep());

// sort by ep
//groups.sort((g1, g2) => g2.ep() - g1.ep());

// check ep
//groups.forEach(g => console.log(g.ep()))

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
console.log('Sort By EP+Init');
groups.forEach((g, i) => console.log(`${g.group} ${g.groupi} - ep:${g.ep()}`));

// reset taken
groups.forEach(g => g.targetted = false);

groups.forEach((g, i, a) => {
    //aquire target
    //calc damage against each target
    let targets = [];
    if (g.group == 'immune') targets = a.filter(g => !g.targetted && g.group == 'infect');
    if (g.group == 'infect') targets = a.filter(g => !g.targetted && g.group == 'immune');
    console.log(`Finding target for ${g.groupid}`)
    //console.log(targets.length);
    targets.forEach(t => {
        t.dmgFromG = 10;
        if (t.immu.indexOf(g.dmgType) > -1) {
            t.dmgFromG = 0;
        }
        else if (t.weak.indexOf(g.dmgType) > -1) {
            t.dmgFromG = 2 * g.ep();
        }
        else {
            t.dmgFromG = g.ep();
        }
    });
    targets.sort((t1, t2) => t2.dmgFromG - t1.dmgFromG);
    //sort by damage
    //assign g.target
    // Find most damage. If tied, target most ep
    targets = targets.filter((t, i, a) => t.dmgFromG == a[0].dmgFromG);
    if (targets.length > 1) {
        //console.log('oo, larger than 1')
        targets.sort((t1, t2) => t2.ep() - t1.ep());
        targets = targets.filter((t, i, a) => t.ep() == a[0].ep());
        if (targets.length > 1) {
            //console.log('ooooo, larger than 1')
            targets.sort((t1, t2) => t2.init - t1.init);
            //targets = targets.filter((t, i, a) => t.init == a[0].init;
        }
    }

    const targetGroupId = targets[0].groupid;
    g.target = targetGroupId;
    const targetGroupIdIndex = _.findIndex(a, g => g.groupid == targetGroupId);
    a[targetGroupIdIndex].targetted = true;
    //console.log(`${g.groupid} targets ${g.target}`);
})


groups.forEach((g, i) => console.log(`${g.groupid} targets ${g.target}`));

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
