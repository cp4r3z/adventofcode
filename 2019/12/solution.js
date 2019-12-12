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

const moonsStart = JSON.parse(JSON.stringify(moons));

let steps = 0;

// let frequencyX = false;
// let frequencyY = false;
// let frequencyZ = false;
let freqs = Array(4).fill(false);
let allFrequenciesFound = false;

do {
    for (let i = 0; i < moons.length; i++) {
        for (let j = i + 1; j < moons.length; j++) {
            // TODO: DRY UP

            if (moons[i].pos.x > moons[j].pos.x) {
                moons[i].vel.x = moons[i].vel.x - 1;
                moons[j].vel.x = moons[j].vel.x + 1;
            }
            if (moons[i].pos.x < moons[j].pos.x) {
                moons[i].vel.x = moons[i].vel.x + 1;
                moons[j].vel.x = moons[j].vel.x - 1;
            }
            if (moons[i].pos.y > moons[j].pos.y) {
                moons[i].vel.y = moons[i].vel.y - 1;
                moons[j].vel.y = moons[j].vel.y + 1;
            }
            if (moons[i].pos.y < moons[j].pos.y) {
                moons[i].vel.y = moons[i].vel.y + 1;
                moons[j].vel.y = moons[j].vel.y - 1;
            }
            if (moons[i].pos.z > moons[j].pos.z) {
                moons[i].vel.z = moons[i].vel.z - 1;
                moons[j].vel.z = moons[j].vel.z + 1;
            }
            if (moons[i].pos.z < moons[j].pos.z) {
                moons[i].vel.z = moons[i].vel.z + 1;
                moons[j].vel.z = moons[j].vel.z - 1;
            }
        }
    }

    /// no i think we need to go moon by moon.
    
    // also the initial state might not be at 0....

    let freqsCandidates = Array(4).fill(true);

    for (let i = 0; i < moons.length; i++) {
        moons[i].pos.x = moons[i].pos.x + moons[i].vel.x;

        moons[i].pos.y = moons[i].pos.y + moons[i].vel.y;

        moons[i].pos.z = moons[i].pos.z + moons[i].vel.z;

        if (!freqs[i] &&
            freqsCandidates[i] &&
            moons[i].pos.x === moonsStart[i].pos.x &&
            moons[i].pos.y === moonsStart[i].pos.y &&
            moons[i].pos.z === moonsStart[i].pos.z) {
            freqsCandidates[i] = steps+1;
        } else {
            freqsCandidates[i] = false;
        }

    }

    freqsCandidates.forEach((candidate, i) => {
        if (candidate > 1) freqs[i] = candidate;
    });

    allFrequenciesFound = freqs.reduce((allFound, f) => f > 1 && allFound, true);

    steps++;
} while (!allFrequenciesFound && steps < 3000);

freqs.forEach((f,i)=>console.log(`freq[${i}]: ${f}`));

const energy = moons.reduce((total, moon) => {
    const potential = Math.abs(moon.pos.x) + Math.abs(moon.pos.y) + Math.abs(moon.pos.z);
    const kinetic = Math.abs(moon.vel.x) + Math.abs(moon.vel.y) + Math.abs(moon.vel.z);
    return total + potential * kinetic;
}, 0);
//333494 is too high
//333160 is too high

//console.log(energy)

// End Process (gracefully)
process.exit(0);