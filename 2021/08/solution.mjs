/**
 * https://adventofcode.com/2021/day/8
 */

// Notes

// Investigate other prebuilt bit array options:
// http://bitwiseshiftleft.github.io/sjcl/doc/

import { multiLine } from '../../common/parser.mjs';

// Parse Input
let inputFilePath = new URL('./tinput1.txt', import.meta.url);
const arrInput = multiLine.toStrArray(inputFilePath);

let tests = arrInput.map(line=>{
    const signalAndOutput = line.split('|');
    const signals = signalAndOutput[0].trim().split(' ');
    const outputs = signalAndOutput[1].trim().split(' ');
    return { signals, outputs };
});

const part1 = tests.reduce((prevTestCount, test) => {
    return prevTestCount += test.outputs.reduce((prevOutputCount, output) => {
        return prevOutputCount += ([2, 3, 4, 7].includes(output.length)) ? 1 : 0;
    }, 0);
}, 0);

// part 2

// Let's do some bit mapping!

/**
 *  AAAA
 * F    B
 * F    B
 *  GGGG
 * E    C
 * E    C
 *  DDDD
 */

/**
 * ABCDEFG
 * abcdefg
 * 0000000
 * 
 * 0 -> 1111110 (ABCDEF )
 * 1 -> 0110000 ( BC    )
 * 2 -> 1101101 (AB DE G)
 * 3 -> 1111001 (ABCD  G)
 * 4 -> 0110011 ( BC  FG)
 * 5 -> 1011011 (A CD FG)
 * 6 -> 1011111 (A CDEFG)
 * 7 -> 1110000 (ABC    )
 * 8 -> 1111111 (ABCDEFG)
 * 9 -> 1111011 (ABCD FG)
 */


// Create a Seven Digit Display with all possible signal for each segment

class SSD {
    constructor(signals) {
        this.Signals = signals;

        this.Segments = new Map();
        //                segment  , possible signals
        this.Segments.set(0b1000000, 0b1111111); // A
        this.Segments.set(0b0100000, 0b1111111); // B
        this.Segments.set(0b0010000, 0b1111111); // C
        this.Segments.set(0b0001000, 0b1111111); // D
        this.Segments.set(0b0000100, 0b1111111); // E
        this.Segments.set(0b0000010, 0b1111111); // F
        this.Segments.set(0b0000001, 0b1111111); // G

        this.knownSegments = 0;
        this.knownSignals = new Array(10); // stored as binary
    }

    Solve(){
        // do 1,4,7 eliminations
        // TODO: DRY up ?
        this.eliminate1();
        this.eliminate4();
        this.eliminate7();
        this.eliminate8();

        // now we should know segment A
        this.findKnownSegments(); /// TODO: Are you working?

        this.eliminate235();

        this.eliminate069();

        const solved = this.knownSignals.map(SSD.BinaryToSignal);

        return;

        // brute force?
    }

    eliminate1() {
        this.knownSignals[1] = SSD.SignalToBinary(
            this.Signals.find(s => s.length === 2)
        );
        //this.eliminate(SSD.Numbers[1], ~this.knownSignals[1]);
        //this.eliminate(~SSD.Numbers[1],this.knownSignals[1]);
    }

    eliminate4() {
        this.knownSignals[4] = SSD.SignalToBinary( 
            this.Signals.find(s => s.length === 4)
        );
        //this.eliminate(SSD.Numbers[4], ~this.knownSignals[4]);
        //this.eliminate(~SSD.Numbers[4], this.knownSignals[4]);
    }

    eliminate7() {
        this.knownSignals[7] = SSD.SignalToBinary(
            this.Signals.find(s => s.length === 3)
        );
        //this.eliminate(SSD.Numbers[7], ~this.knownSignals[7]);
        //this.eliminate(~SSD.Numbers[7], this.knownSignals[7]);
    }

    eliminate8() {
        this.knownSignals[8] = SSD.SignalToBinary(
            this.Signals.find(s => s.length === 7)
        );
    }

    eliminate235(){
        //find all 5 length and convert to binary
        let s5 = this.Signals
            .filter(s => s.length === 5)
            .map(s => {
                const original = s;
                const diff = SSD.SignalToBinary(original) & ~this.knownSignals[1];
                const bitCount = SSD.CountSetBits(diff);
                return {
                    original,
                    diff,
                    bitCount
                };
            })
            .sort((a, b) => a.bitCount - b.bitCount);
        // find the index of 3
        const i3 = 0;
        
        this.knownSignals[3] = SSD.SignalToBinary(s5[i3].original); 
        //this.eliminate(SSD.Numbers[5], ~this.knownSignals[5]);
        //this.eliminate(~SSD.Numbers[5], this.knownSignals[5]);

        // but now we have 2 and 5
        s5.splice(i3,1);

        // diff with 4
        let s25 = s5.map(s => {
            const original = s.original;
            const diff = SSD.SignalToBinary(original) & ~this.knownSignals[4];
            const bitCount = SSD.CountSetBits(diff);
            return {
                original,
                diff,
                bitCount
            };
        })
        .sort((a, b) => a.bitCount-b.bitCount);
        
        this.knownSignals[5] = SSD.SignalToBinary(s25[0].original);
        this.knownSignals[2] = SSD.SignalToBinary(s25[1].original);
    }

    eliminate069() {
        //there is a 5 in both 6 and 9 but not 0
        let s6 = this.Signals
            .filter(s => s.length === 6)
            .map(s => {
                const original = s;
                const diff = SSD.SignalToBinary(original) & ~this.knownSignals[5];
                const bitCount = SSD.CountSetBits(diff);
                return {
                    original,
                    diff,
                    bitCount
                };
            })
            .sort((a, b) => a.bitCount - b.bitCount);

        const i0 = 2;
        this.knownSignals[0] = SSD.SignalToBinary(s6[i0].original);

         // and now we have 6 and 9
         s6.splice(i0,1);

         // diff with 1
        let s69 = s6.map(s => {
            const original = s.original;
            const diff = SSD.SignalToBinary(original) & ~this.knownSignals[1];
            const bitCount = SSD.CountSetBits(diff);
            return {
                original,
                diff,
                bitCount
            };
        })
        .sort((a, b) => a.bitCount-b.bitCount);
        
        this.knownSignals[9] = SSD.SignalToBinary(s69[0].original);
        this.knownSignals[6] = SSD.SignalToBinary(s69[1].original);
        
    }

    // for each segment, eliminate the following signals
    // Takes two binary numbers
    eliminate(bSegments, bSignals) {
        let segmentKey = 1;
        while (segmentKey <= 64) {
            if (segmentKey & bSegments) {
                const newSignals = this.Segments.get(segmentKey) & ~bSignals;
                this.Segments.set(segmentKey, newSignals);
            }
            segmentKey <<= 1; // Left shift
        }
    }

    findKnownSegments() {
        let found;
        do {
            found = false;
            this.Segments.forEach((signal, segment) => {
                if (SSD.IsOnlySignal(signal)) {
                    if (this.knownSegments & segment) return;
                    // eliminate the signal in all other segments
                    this.eliminate(~segment, signal);
                    this.knownSegments += segment;
                    found = true;
                }
            });
        } while (found);
    }

    static get Numbers() {
        return [
            0b1111110, // 0 -> (ABCDEF )
            0b0110000, // 1 -> ( BC    )
            0b1101101, // 2 -> (AB DE G)
            0b1111001, // 3 -> (ABCD  G)
            0b0110011, // 4 -> ( BC  FG)
            0b1011011, // 5 -> (A CD FG)
            0b1011111, // 6 -> (A CDEFG) 
            0b1110000, // 7 -> (ABC    )
            0b1111111, // 8 -> (ABCDEFG)
            0b1111011  // 9 -> (ABCD FG)
        ];
    }
    
    // static generatePossibleSignals(){ // TODO: Maybe not needed?
    //     return { a: true, b: true, c: true, d: true, e: true, f: true, g: true };
    // }

    static IsOnlySignal(bSignal) {
        // Essentially, is the possible signal a power of 2
        // O(1) solution discussed here: http://goo.gl/17Arj
        return !!(bSignal && !(bSignal & (bSignal - 1)));
    }    

    static get LetterEnum() {
        return {
            a: 0b1000000,
            b: 0b0100000,
            c: 0b0010000,
            d: 0b0001000,
            e: 0b0000100,
            f: 0b0000010,
            g: 0b0000001
        };
    }

    // TODO: binary enum?
    static SignalToBinary(signal) {
        let bin = 0;
        for (const c in SSD.LetterEnum){
            bin += signal.includes(c) ? SSD.LetterEnum[c] : 0;
        }
        return bin;


        // return 0b0 +
        //     (signal.includes('a') ? 0b1000000 : 0) +
        //     (signal.includes('b') ? 0b0100000 : 0) +
        //     (signal.includes('c') ? 0b0010000 : 0) +
        //     (signal.includes('d') ? 0b0001000 : 0) +
        //     (signal.includes('e') ? 0b0000100 : 0) +
        //     (signal.includes('f') ? 0b0000010 : 0) +
        //     (signal.includes('g') ? 0b0000001 : 0);
    }

    static BinaryToSignal(bin){
        let signal ='';

        for (const c in SSD.LetterEnum){
            signal += bin &SSD.LetterEnum[c] ? c : '';
        }
        return signal;
    }

    // Stolen from: https://www.geeksforgeeks.org/find-position-of-the-only-set-bit/
    //todo: remove?
    static Log2n(n){
        if (n > 1)
            return (1 + Log2n(n / 2));
        else
            return 0;
    }

    // https://www.geeksforgeeks.org/count-set-bits-in-an-integer/
    static CountSetBits(b) {
        let n = b;
        var count = 0;
        while (n) {
            count += n & 1;
            n >>= 1;
        }
        return count;
    }
}

let test = tests[0]; //for now
let display = new SSD(test.signals);
display.Solve();

// const test = SSD.IsSignalKnown(0b000100);
// const test2 = SSD.IsSignalKnown(0b00000);
// const test3 = SSD.IsSignalKnown(0b0001100);
const test4 = SSD.IsOnlySignal(SSD.SignalToBinary('a'));

const testB = SSD.Numbers[0];



console.log(`\nYear 2021 Day 01 Part 1 Solution: ${part1}`);


// End Process (gracefully)
process.exit(0);
