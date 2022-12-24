/**
 * https://adventofcode.com/2021/day/19
 */

//#region Imports

// npm modules
import { Vector3, Matrix4, Quaternion, Object3D, Points, BufferGeometry, BufferAttribute } from 'three';

// local modules
import { multiLine } from '../../common/parser.mjs';

//#endregion

//#region Classes

// unused?
class LocatedBeacons extends Map {
    constructor() {
        super();
    }
    static Key(vector){
        const key = `${vector.x},${vector.y},${vector.z}`;
        return key;
    }

    AddScanner(scanner) {
        scanner.Beacons.forEach(beacon => {
            const key = LocatedBeacons.Key(beacon);
            if (!this.has(key)) {
                //TODO: apply transform?        
                this.set(key, beacon);
            }
        });
    }
}

// TODO: Should scanner also extend vector3?
class Scanner {
    constructor(id) {
        this.Id = id;
        this.Beacons = [];        
    }

    CalculateBeaconDistancesOld() {
        this.Beacons.forEach((beaconA,beaconAIndex)=>{
            this.Beacons.forEach((beaconB,beaconBIndex)=>{
                if (beaconAIndex==beaconBIndex) return;
                beaconA.BeaconSquaredDistances
                    .push(beaconA.distanceToSquared(beaconB));
            });    
        });
    }

    CalculateBeaconDistances() {
        this.Beacons.forEach((beaconA,beaconAIndex)=>{
            this.Beacons.forEach((beaconB,beaconBIndex)=>{
                if (beaconAIndex==beaconBIndex) return;
                
                // calculate distance
                // const bAv = new Vector3();
                // beaconA.getWorldPosition(bAv);
                const distanceSquared = beaconA.position.distanceToSquared(beaconB.position);
                
                beaconA.BeaconSquaredDistances
                    .push(distanceSquared);
            });    
        });
    }

    Matches1Beacons(scanner){
        // let matches = 0;
        // for (let thisBeacon of this.Beacons){
        //     for (let thatBeacon of scanner.Beacons){
        //         if (match11(thisBeacon.BeaconSquaredDistances,thatBeacon.BeaconSquaredDistances)){
        //             matches++;
        //         }
        //     }
        // }
        
        
        // this should work...
        
        
        const matchingBeacon = this.Beacons.find(thisBeacon=>{
            return scanner.Beacons.find(thatBeacon=>{
                return match11(thisBeacon.BeaconSquaredDistances, thatBeacon.BeaconSquaredDistances);
            });
        });
        return matchingBeacon;
    }
}

class BeaconOld extends Vector3 {
    constructor(...args) {
        if (args.length === 1) {
            // Store the relative coordinates
            const coordinateString = args[0];
            const intArray = coordinateString.split(',').map(s => parseInt(s));
            super(intArray[0], intArray[1], intArray[2]);
        } else {
            super(...args);
        }


        this.BeaconSquaredDistances =[];
        // should this have an id?

        // store a transform
        // store the global coordinates
    }
}

class Beacon extends Object3D {
    constructor(...args) {
        super(...args);

        this.BeaconSquaredDistances =[];
    }
    
    setFromString(coordinateString) {
        const intArray = coordinateString.split(',').map(s => parseInt(s));
        const v3 = new Vector3(intArray[0], intArray[1], intArray[2]);
        const m4 = new Matrix4().setPosition(v3);
        this.applyMatrix4(m4);
    }
}

//#endregion

// Parse Input
const inputFilePath = new URL('tinput.txt', import.meta.url);
const arrInput = multiLine.toStrArray(inputFilePath);

const scanners = []; // new Scanners();

arrInput.forEach(scannerParser);

scanners.forEach(scanner=>scanner.CalculateBeaconDistances());

// find match

//const scanner0 = scanners.get(0);

// scanners.forEach((scanner,id)=>{

// });

//const arrScanners = [...scanners];
//const arrScanners2 = scanners.entries();
//[...scanners].find(scanner)

const located = new LocatedBeacons();

const test = LocatedBeacons.Key(scanners[0].Beacons[0]);
//located.AddScanner(scanners.pop());

const s_last = scanners.pop();

const matchingScannerTest = scanners.map(s=>{
   return s.Matches1Beacons(s_last);
});

// Now rotate around until all 12 match!

var m = new Matrix4();
m.makeRotationX(Math.PI * 2 / 4);


//test matching - needs a while loop I'm sure



// var q = new Quaternion();
// q.setFromAxisAngle(new Vector3(1,0,0),Math.PI*2/4);



// var mq = new Matrix4();
// mq.makeRotationFromQuaternion(q);

// // test rotation about a point

// var p = scanners[0].Beacons[0];
// var p2 = p.clone();

// p.applyMatrix4(m).ceil();

// var o = new Object3D();
// //o.add(p2);

// const geometry = new BufferGeometry();
// const vertices = new Float32Array([
//     404, -588, - 901
// ]);
// geometry.setAttribute( 'position', new BufferAttribute( vertices, 3 ) );
// const p3 = new Points(geometry);

// //o.add(p3);
// const p4 = new Object3D();
// const p4m = new Matrix4().setPosition(new Vector3(404, -588, - 901));
// p4.applyMatrix4(p4m);
// //p4.position = new Vector3(404, -588, - 901);

// o.add(p4);

// o.applyMatrix4(m);
// var p4vworld = new Vector3();
// o.children[0].getWorldPosition(p4vworld);
// p4vworld = p4vworld.round();

// const b = new Beacon2();
// b.setFromString("404,-588,-901");
// b.applyMatrix4(m);
// const b2 = b.clone();
// const b2worldv= new Vector3();
// b2.getWorldPosition(b2worldv);

process.exit(0); 

// SO, between 12 points there are 11 connections
function match11(arr1, arr2) {
    let matches = 0;
    for (let i of arr1) {
        if (arr2.includes(i)) {
            matches++;
            //console.log(i);
        }
        if (matches >= 11) break;
    }
    if (matches>1){
        //console.log('something');
    }
    console.log(`matches: ${matches}`);
    return matches >= 11;
}

function scannerParser(line) {
    if (line === '') {
        return;
    }
    if (line.includes('---')) {
        const re = /--- scanner (\d+) ---/;
        const id = parseInt(line.match(re)[1]);
        scanners.push(new Scanner(id));
        //scanners.set(id,new Scanner(id));
    }
    else {
        const b = new Beacon();
        b.setFromString(line);
        scanners[scanners.length-1].Beacons.push(b);
        //scanners.get(scanners.size-1).Beacons.push(new Beacon(line));
    }
}