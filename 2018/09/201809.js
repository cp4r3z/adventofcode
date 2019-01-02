/**
 * https://adventofcode.com/2018/day9
 */

// Puzzle Input: 470 players; last marble is worth 72170 points

// Number of Players
const p = 470;



// Last marble / Number of marbles
const l = 7217000;

// const p = 9;
// const l = 25;

// const p = 10;
// const l = 1618;

const _ = require('underscore'); // Not used

// "List" or... Set? ... Map?

// object of "nodes", containing key, next, previous, can these be functions?

let circle = { "0": { nxt: "0", prv: "0" } };
let scores = new Array(p).fill(0);

let current = "0";

let turn = 1;

for (var i = 1; i <= l; i++) {
    //console.log(i);
    if(i%100000==0) console.log(i);

    if (i % 23 == 0) {
        const ccw1 = circle[current].prv;
        const ccw2 = circle[ccw1].prv;
        const ccw3 = circle[ccw2].prv;
        const ccw4 = circle[ccw3].prv;
        const ccw5 = circle[ccw4].prv;
        const ccw6 = circle[ccw5].prv;
        const ccw7 = circle[ccw6].prv;
        const ccw8 = circle[ccw7].prv;
        scores[turn-1] += i + parseInt(ccw7, 10); // stupid off by one thing...

        // remove ccw9
        circle[ccw6].prv = ccw8;
        circle[ccw8].nxt = ccw6;
        current = ccw6;
        //console.log('point scored');

    }
    else {
        const iString = i.toString();

        const prv = circle[current].nxt;
        const nxt = circle[prv].nxt;

        // change prev
        circle[prv].nxt = iString;
        circle[nxt].prv = iString;

        circle[iString] = { nxt, prv };

        current = iString;
    }

    turn++;
    if (turn > p) turn = 1;
}

const highScore = scores.reduce((max, b) => Math.max(max, b));
console.log(highScore);

// End Process (gracefully)
process.exit(0);
