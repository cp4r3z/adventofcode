/**
 * https://adventofcode.com/2021/day/19
 */

// Math.js library https://mathjs.org/
//import * as Math from 'mathjs';

import { multiLine } from '../../common/parser.mjs';
import Point from '../../common/cartesian/Point.mjs';


class Beacon extends Point {
    constructor(coordinateString) {
        // Store the relative coordinates
        const intArray = coordinateString.split(',').map(s => parseInt(s));
        super(intArray[0], intArray[1], intArray[2]);

        this.BeaconDistances =[];
        // should this have an id?

        // store a transform
        // store the global coordinates
    }
    CalculateDistanceToOtherBeacon(otherBeacon) {
        // Doing some rounding of floats - might not be necessary
        return Math.round(
            10e4 *
            Math.sqrt(
                Math.pow((this.x - otherBeacon.x), 2) +
                Math.pow((this.y - otherBeacon.y), 2) +
                Math.pow((this.z - otherBeacon.z), 2)
            )) / 10e4;
    }
}

class Scanner {
    constructor(id) {
        this.Id = id;
        this.Beacons = [];        
    }

    CalculateBeaconDistances() {
        this.Beacons.forEach((beaconA,beaconAIndex)=>{
            this.Beacons.forEach((beaconB,beaconBIndex)=>{
                if (beaconAIndex==beaconBIndex) return;
                beaconA.BeaconDistances
                    .push(beaconA.CalculateDistanceToOtherBeacon(beaconB));
            });    
        });
    }
}

// Plan

/**
 * for each scanner, for each beacon, find relative distances
 */


// Parse Input
const inputFilePath = new URL('input.txt', import.meta.url);
const arrInput = multiLine.toStrArray(inputFilePath);

const scanners = [];
const scannerParser = line => {
    if (line === '') {
        return;
    }
    if (line.includes('---')) {
        const re = /--- scanner (\d+) ---/;
        const id = parseInt(line.match(re)[1]);
        scanners.push(new Scanner(id));
    }
    else {
        scanners[scanners.length - 1].Beacons.push(new Beacon(line));
    }
};

arrInput.forEach(scannerParser);
scanners.forEach(scanner=>scanner.CalculateBeaconDistances());

process.exit(0);