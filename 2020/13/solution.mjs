/**
 * https://adventofcode.com/2020/day/13
 */

import { multiLine } from '../../common/parser.mjs';

// Parse Input
const inputFilePath = new URL('./tinput.txt', import.meta.url);
const arrInput = multiLine.toStrArray(inputFilePath);

const timeYouDepart = parseInt(arrInput[0]);

const busIDsNoX = arrInput[1]
    .split(',')
    .filter(id => id !== 'x')
    .map(id => parseInt(id, 10));

const busIDsNoXWithNextDeparture = busIDsNoX
    .map(id => {
        const mod = timeYouDepart % id;
        const nextDeparture = id - mod;
        return { id, nextDeparture };
    })
    .sort((a, b) => a.nextDeparture - b.nextDeparture);

const part1 = busIDsNoXWithNextDeparture[0].id * busIDsNoXWithNextDeparture[0].nextDeparture;

console.log(`Year 2020 Day 13 Part 1 Solution: ${part1}`);


// Create an array representing the bus schedule with the intervals between arrivals. Order is important.
const busIDs = [];

let intervalToNext = 1;


/// TOODO: NEEDS TO BE OFFSET FROM 0

// arrInput[1]
//     .split(',')
//     .forEach(id => {
//         if (id === 'x') {
//             intervalToNext++;
//         } else {
//             busIDs.push({
//                 id: parseInt(id, 10),
//                 offset: intervalToNext
//             });
//             intervalToNext = 1;
//         }
//     });

arrInput[1]
    .split(',').forEach((id, i) => {
        if (id === 'x') return;
        busIDs.push({
            id: parseInt(id, 10),
            offset: i
        });
    });

let t = 0;
let interval = busIDs[0].id; // Interval for testing whether the current arrivals meet the requirements
//let requirementsMet = false;
let testIndex = 0; // this is the index of busID that you're currently evaluating

function nextBusHasCorrectOffset() {

    if (testIndex + 1 > busIDs.length - 1) {
        console.log('problem.')
    }
    const tPlusOffset = t + busIDs[testIndex + 1].offset;
    const nextBusID = busIDs[testIndex + 1].id;
    const tModID = tPlusOffset % nextBusID; // Determine if the next bus will arrive at the offset time
    if (tModID === 0) {
        console.log('ok')
    }
    return tModID === 0;
}

do {
    t += interval;

    // is the offset to the next arrival correct?
    // test --- so.... ( busId[n+1] + busId[n].offset ) / interval  is mod 0
    // no... try (t+offset) % interval = 0

    // const testremoveme = (t + busIDs[testIndex].offset) % busIDs[testIndex + 1].id;

    // const nextBusHasCorrectOffset_old = (t + busIDs[testIndex].offset) % busIDs[testIndex + 1].id === 0;



    //TODO: Isn't it possible for the next N busses to also be in the correct offset?
    // while (nextBusHasCorrectOffset()) {
    //     testIndex++;
    // }

    const lastBus = testIndex === busIDs.length - 1;


    // if (!lastBus) {
    if (nextBusHasCorrectOffset()) {

        // have we seen it before?
        const hasAlignedBefore = busIDs[testIndex].firstAlignmentTime;
        if (hasAlignedBefore) {
            const alignmentInterval = t - busIDs[testIndex].firstAlignmentTime;
            interval = alignmentInterval;

            //while (nextBusHasCorrectOffset()) {
                testIndex++;
            //}

            //testIndex++;
        } else {
            busIDs[testIndex].firstAlignmentTime = t;
        }

        // ok, it's matching. Now we store the time and wait for it to happen again



        // then multiple the interval and increment the test index

        //interval = t; //???
        //testIndex++;
    }


    // else {
    //     // Last bus!
    //     console.log('last bus!');

    //     if ((t + busIDs[testIndex].offset) % busIDs[testIndex].id === 0) {
    //         break;
    //     }
    //     //once solution found, increment testIndex to escape or break


    // }

} while (testIndex + 1 < busIDs.length - 1); //TODO: Double check that condition....

// End Process (gracefully)
process.exit(0);