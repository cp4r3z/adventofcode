// Seven Digit Display
export default class SSD {
    constructor(signals) {
        this.Signals = signals;
        this.SolvedSignals = new Array(10); // stored as binary
    }

    Solve() {
        // TODO: DRY up ?
        this.solve1();
        this.solve4();
        this.solve7();
        this.solve8();
        this.solve235();
        this.solve069();

        // For verification
        const solved = this.SolvedSignals.map(SSD.BinaryToSignal);
    }

    GetOutputDigit(signal){
        return this.SolvedSignals.findIndex(s=> SSD.SignalToBinary(signal)===s);
    }

    solve1() {
        this.SolvedSignals[1] = SSD.SignalToBinary(
            this.Signals.find(s => s.length === 2)
        );
    }

    solve4() {
        this.SolvedSignals[4] = SSD.SignalToBinary(
            this.Signals.find(s => s.length === 4)
        );

    }

    solve7() {
        this.SolvedSignals[7] = SSD.SignalToBinary(
            this.Signals.find(s => s.length === 3)
        );
    }

    solve8() {
        this.SolvedSignals[8] = SSD.SignalToBinary(
            this.Signals.find(s => s.length === 7)
        );
    }

    solve235() {
        //find all 5 length and convert to binary
        let s5 = this.Signals
            .filter(s => s.length === 5)
            .map(s => {
                const original = s;
                const diff = SSD.SignalToBinary(original) & ~this.SolvedSignals[1];
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

        this.SolvedSignals[3] = SSD.SignalToBinary(s5[i3].original);

        // but now we have 2 and 5
        s5.splice(i3, 1);

        // diff with 4
        let s25 = s5.map(s => {
            const original = s.original;
            const diff = SSD.SignalToBinary(original) & ~this.SolvedSignals[4];
            const bitCount = SSD.CountSetBits(diff);
            return {
                original,
                diff,
                bitCount
            };
        })
            .sort((a, b) => a.bitCount - b.bitCount);

        this.SolvedSignals[5] = SSD.SignalToBinary(s25[0].original);
        this.SolvedSignals[2] = SSD.SignalToBinary(s25[1].original);
    }

    solve069() {
        //there is a 5 in both 6 and 9 but not 0
        let s6 = this.Signals
            .filter(s => s.length === 6)
            .map(s => {
                const original = s;
                const diff = SSD.SignalToBinary(original) & ~this.SolvedSignals[5];
                const bitCount = SSD.CountSetBits(diff);
                return {
                    original,
                    diff,
                    bitCount
                };
            })
            .sort((a, b) => a.bitCount - b.bitCount);

        const i0 = 2;
        this.SolvedSignals[0] = SSD.SignalToBinary(s6[i0].original);

        // and now we have 6 and 9
        s6.splice(i0, 1);

        // diff with 1
        let s69 = s6.map(s => {
            const original = s.original;
            const diff = SSD.SignalToBinary(original) & ~this.SolvedSignals[1];
            const bitCount = SSD.CountSetBits(diff);
            return {
                original,
                diff,
                bitCount
            };
        })
            .sort((a, b) => a.bitCount - b.bitCount);

        this.SolvedSignals[9] = SSD.SignalToBinary(s69[0].original);
        this.SolvedSignals[6] = SSD.SignalToBinary(s69[1].original);
    }

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

    static SignalToBinary(signal) {
        let bin = 0;
        for (const c in SSD.LetterEnum) {
            bin += signal.includes(c) ? SSD.LetterEnum[c] : 0;
        }
        return bin;
    }

    static BinaryToSignal(bin) {
        let signal = '';
        for (const c in SSD.LetterEnum) {
            signal += bin & SSD.LetterEnum[c] ? c : '';
        }
        return signal;
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
