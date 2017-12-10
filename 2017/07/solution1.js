/**
 * https://adventofcode.com/2017/day/7
 */

const input = '2017/07/input.txt';

const fs = require('fs'),
    _ = require('underscore'),
    file = fs.readFileSync(input, "utf8"),
    lines = file.split("\n");

// Populate an object tower
let tower = {};
for (let line of lines) {
    const re = /(\w+) \((\d+)\)(?: -> )?(.*)?/;
    const parsedLine = line.match(re);
    //console.log(parsedLine);
    const subTower = {};
    subTower.weight = parseInt(parsedLine[2]);
    if (parsedLine[3] !== undefined) {
        const subElements = parsedLine[3].replace(/ /g, '').split(',');
        for (let element of subElements) {
            subTower[element] = { weight: 0 };
        }
    }
    tower[parsedLine[1]] = subTower;
}

function organize(sub, key, obj) {
    let omit = false;
    _.each(_.omit(obj, key), (subsub, subkey) => {
        if (subkey != 'weight' && subsub !== undefined && Object.keys(subsub).length > 1) {
            if (_.has(subsub, key)) {
                subsub[key] = sub;
                delete obj[key];
                //console.log(`Moved ${key} to ${subkey}.`);
                //console.log(obj);
                omit = true;
            } else {
                organize(sub, key, subsub);
            }
        }
    });
    if (omit) {
        tower = _.omit(tower, key);
    }
}

// Solution 1
_.each(tower, (sub, key) => organize(sub, key, tower));
console.log(tower);

function findUnbal(obj) {
    let keys = _.keys(obj);
    let weightObjArray = [];
    _.each(_.omit(obj, "weight"), (subsub, subkey,subobj) => {
        weightObjArray.push({ "subkey": subkey, "subparentweight": subobj[subkey].weight, "subweight": getSubWeight(subsub) });        
    });
    
    if (!_.every(weightObjArray, (weightObj) => weightObj.subweight == weightObjArray[0].subweight)) {
        console.log("Imbalance Found!");
        console.log(weightObjArray);
    } 
    _.each(_.omit(obj, "weight"), (subsub, subkey) => {
        findUnbal(subsub);
    });
}

function getSubWeight(obj) {
    let subweights = _.reduce(_.omit(obj, 'weight'), (accumulator, sub) => {
        return accumulator + getSubWeight(sub);
    }, 0);
    let weight = obj.weight + subweights;
    const keys = _.allKeys(_.omit(obj, 'weight')).join(', ');
    //console.log(`Sub Weight Total = ${weight} ; Parent weight (${obj.weight}) Keys (${keys}) weigh ${subweights}`);
    return weight;
}

// Solution 2
//getSubWeight(tower);
findUnbal(tower);

// Note, this will give you the tree that's imbalanced. It's up to you to walk the tree manually and do some subtraction.