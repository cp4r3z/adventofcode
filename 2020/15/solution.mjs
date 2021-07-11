/**
 * https://adventofcode.com/2020/day/15
 */

//const arrInput = [0, 3, 6];
const arrInput = [1, 20, 8, 12, 0, 14];

const spoken = arrInput.map((num, i) => {
    return {
        num,
        lastTurn: i + 1
    };
});

const spokenMap = new Map();
arrInput.forEach((num, i) => {
    spokenMap.set(num, {
        lastTurn: i + 1,
        first: true,
        diff: false
    });
});

let turn = arrInput.length;
let lastNumber = arrInput[arrInput.length - 1];

//while (turn < 2020) {
while (turn < 30000000) { // Brute force
    turn++;
    const lastNumberDetails = spokenMap.get(lastNumber);

    // Is it the first time spoken?
    let nextNumber;
    if (lastNumberDetails.first) {
        nextNumber = 0;
    } else {
        nextNumber = lastNumberDetails.diff;
    }

    // Now, is this the first time nextNumber has been spoken?
    const nextNumberDetails = spokenMap.get(nextNumber);
    const first = !nextNumberDetails;

    let diff = false;
    if (!first) {
        diff = turn - nextNumberDetails.lastTurn;
    }

    spokenMap.set(nextNumber, { lastTurn: turn, first, diff });
    lastNumber = nextNumber;

    if (turn % 100000 === 0) {
        console.log(turn);
    }
}

console.log(`Year 2020 Day 15 Part 1/2 Solution: ${lastNumber}`);



// End Process (gracefully)
process.exit(0);