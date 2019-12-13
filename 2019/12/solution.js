/**
 * https://adventofcode.com/2019/day/12
 */

const parser = require('./parser.mjs');

// Parse Input
let inputFileName = 'inputtest.txt';
const arrInput = parser.multiLine.toStrArray(inputFileName);

// Populate an array of moon objects with the initial positions and velocities
let moons = arrInput.map(s => {
    const regex = /<x=([-\d]+), y=([-\d]+), z=([-\d]+)>/g;
    const positions = regex.exec(s);
    return {
        pos: {
            x: parseInt(positions[1], 10),
            y: parseInt(positions[2], 10),
            z: parseInt(positions[3], 10)
        },
        vel: {
            x: 0, y: 0, z: 0 // Assume no initial velocity
        }
    }
});

let moonStates = [];
const moonsStart = JSON.parse(JSON.stringify(moons));

let steps = 0;

// let frequencyX = false;
// let frequencyY = false;
// let frequencyZ = false;
let freqs = Array(4).fill(0);
freqs = freqs.map(f=>Array(1));

let allFrequenciesFound = false;

do {
    for (let i = 0; i < moons.length; i++) {
        for (let j = i + 1; j < moons.length; j++) {
            for (let xyz of ['x', 'y', 'z']) {
                if (moons[i].pos[xyz] > moons[j].pos[xyz]) {
                    moons[i].vel[xyz] = moons[i].vel[xyz] - 1;
                    moons[j].vel[xyz] = moons[j].vel[xyz] + 1;
                }
                if (moons[i].pos[xyz] < moons[j].pos[xyz]) {
                    moons[i].vel[xyz] = moons[i].vel[xyz] + 1;
                    moons[j].vel[xyz] = moons[j].vel[xyz] - 1;
                }
            }
        }
    }

    /// no i think we need to go moon by moon.
    // oh, and you have to match velocity!!!
    // also the initial state might not be at 0....

    /// you need to:
    // a: figure out if there are regular periods "freqs". hope to god there are.
    // b: record the period and an offset
    // c: take the largest period, and start multiplying. checking the modulos of the others as you go

    // store the state
    moonStates.push(JSON.parse(JSON.stringify(moons)));

    let freqsCandidates = Array(4).fill(true);

    for (let i = 0; i < moons.length; i++) {
        moons[i].pos.x = moons[i].pos.x + moons[i].vel.x;

        moons[i].pos.y = moons[i].pos.y + moons[i].vel.y;

        moons[i].pos.z = moons[i].pos.z + moons[i].vel.z;

        // frequency not yet found -- maybe there are multiples???
        if (freqs[i].length===0) {
            // and there's a candidate possible
            if (freqsCandidates[i]) {
                // go through all previous states...
                let candidateFound = false;
                let imState = 0;
                do {
                    if (moonEqualsmoon(moons[i], moonStates[imState][i])) {
                        freqsCandidates[i] = steps + 1 ;//- imState;
                        candidateFound = true;
                    }
                    imState++;
                } while (!candidateFound && imState < moonStates.length);
                if (candidateFound === false) freqsCandidates[i] = false;

            }
        }
    }

    freqsCandidates.forEach((candidate, i) => {
        if (candidate > 1) {
            freqs[i].push(candidate);
            console.log('candidate found: freq' + i + ' ' + candidate);
        }
    });

    allFrequenciesFound = freqs.reduce((allFound, f) => f.length>0 && allFound, true);

    steps++;
} while (!allFrequenciesFound); // && steps < 3000);

freqs.forEach((f, i) => console.log(`freq[${i}]: ${f}`));

const energy = moons.reduce((total, moon) => {
    const potential = Math.abs(moon.pos.x) + Math.abs(moon.pos.y) + Math.abs(moon.pos.z);
    const kinetic = Math.abs(moon.vel.x) + Math.abs(moon.vel.y) + Math.abs(moon.vel.z);
    return total + potential * kinetic;
}, 0);
//333494 is too high
//333160 is too high

//console.log(energy)

function stateEqualsState(state1, state2) {

}

function moonEqualsmoon(moon1, moon2) {
    return moon1.pos.x === moon2.pos.x &&
        moon1.pos.y === moon2.pos.y &&
        moon1.pos.z === moon2.pos.z &&
        moon1.vel.x === moon2.vel.x &&
        moon1.vel.y === moon2.vel.y &&
        moon1.vel.z === moon2.vel.z;
}

// End Process (gracefully)
process.exit(0);