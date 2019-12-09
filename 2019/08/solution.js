/**
 * https://adventofcode.com/2019/day/8
 */

const parser = require('./parser.mjs');

// Parse Input
let inputFileName = 'input.txt';
const inputString = parser.singleLine.toString(inputFileName);

// Layout
const rows = 6;
const columns = 25;
const layerArea = rows * columns;

// Extend the default String class to include a method for counting characters
String.prototype.howMany = function (c) {
    const reNotS = new RegExp(`([^${c}])`, "g");
    return this.replace(reNotS, "").length;
};

// Split long strings into strings for each layer
const reAreaString = new RegExp(`(.{${layerArea}})`);
const layerStrings = inputString.split(reAreaString).filter(s => s);

const part1 = layerStrings.map(s => {
    return {
        original: s,
        zeros: s.howMany(0),
        ones: s.howMany(1),
        twos: s.howMany(2)
    };
}).sort((o1, o2) => o1.zeros - o2.zeros)[0];
console.log(`Part 1: ${part1.ones * part1.twos}`);

const flattenedLayers = layerStrings.reduce((flat, l) => {
    return l.split("").map((s, i) => {
        return flat[i] == 2 ? s : flat[i];
    }).join("");
}, layerStrings[0]);

// Print out the rows
console.log(`Part 2:`);
let row = "";
flattenedLayers.split("").forEach((pixel, column) => {
    row += pixel === "1" ? "█" : " ";
    if (row.length === columns) {
        console.log(row);
        row = "";
    }
});

// End Process (gracefully)
process.exit(0);