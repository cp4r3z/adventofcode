/**
 * https://adventofcode.com/2020/day/23
 */

let DEBUG = false;
//DEBUG = true;
const input = '523764819';
const tinput = '389125467';
const arrInput = input.split('').map(s => parseInt(s));

class Cup {
    constructor(label) {
        this.Label = label;
    }

    arrange(next, prev) {
        this.Next = next;
        this.Prev = prev;
    }
}

class Cups extends Map {
    constructor(arr, part2 = false) {
        super();

        this.Part2 = part2;
        // Loop once to create cups
        arr.forEach((label, i) => {
            this.set(label, new Cup(label));
        });

        // Note: This probably is not efficient. We need some kind of "virtual" on-demand cup.
        if (this.Part2) {
            for (let i = 10; i <= 1e6; i++) {
                this.set(i, new Cup(i));
            }
        }

        this.CurrentCup = this.get(arr[0]);

        // Loop again to arrange them
        arr.forEach((label, i) => {
            const cup = this.get(label);

            let iPrev = i - 1;
            let iNext = i + 1;
            if (i === 0) {
                iPrev = arr.length - 1;
            }
            else if (i === arr.length - 1) {
                iNext = 0;
            }

            const cupPrev = this.get(arr[iPrev]);
            const cupNext = this.get(arr[iNext]);
            cup.arrange(cupNext, cupPrev);
        });

        if (this.Part2) {
            // Join the original list with the continuation
            const arrStartCup = this.get(arr[0]);
            const arrEndCup = this.get(arr[arr.length - 1]);

            arrStartCup.Prev = this.get(1e6);
            arrEndCup.Next = this.get(10);

            for (let label = 10; label <= 1e6; label++) {
                const cup = this.get(label);
                if (label === 10) {
                    cup.arrange(this.get(label + 1), arrEndCup);
                }
                else if (label === 1e6) {
                    cup.arrange(arrStartCup, this.get(label - 1));
                } else {
                    cup.arrange(this.get(label + 1), this.get(label - 1));
                }
            }
        }
    }

    takeTurn() {
        DEBUG && console.log(`this turn: (${this.CurrentCup.Label})`);

        // Pick up cups

        const upCup1 = this.CurrentCup.Next;
        const upCup2 = upCup1.Next;
        const upCup3 = upCup2.Next;

        DEBUG && console.log(`pick up: ${upCup1.Label}, ${upCup2.Label}, ${upCup3.Label}`)

        const nextCupAfterPickup = upCup3.Next;
        this.CurrentCup.Next = nextCupAfterPickup;
        nextCupAfterPickup.Prev = this.CurrentCup;

        // Find destination

        let destination = this.CurrentCup.Label - 1;

        let validDestination;
        do {
            if (destination === 0) {
                destination = this.Part2 ? 1e6 : 9;
            }

            validDestination = destination !== upCup1.Label &&
                destination !== upCup2.Label &&
                destination !== upCup3.Label;

            if (!validDestination) {
                destination--;
            }
        } while (!validDestination);
        DEBUG && console.log(`destination: ${destination}`);

        // Place cups

        const destCup = this.get(destination);
        // upCups go between destination cup and it's next cup
        const destCupNext = destCup.Next;

        // Change links between upCup1 and upCup3

        destCup.Next = upCup1;
        upCup1.Prev = destCup;
        destCupNext.Prev = upCup3;
        upCup3.Next = destCupNext;

        // Increment current position
        this.CurrentCup = nextCupAfterPickup;
    }

    print(forSolution = false) {
        const arr = [];
        let cup = this.get(1);
        for (let i = 0; i < this.size; i++) {
            if (!(i === 0 && forSolution)) {
                arr.push(cup.Label);
            }
            cup = cup.Next;
        }
        if (forSolution) {
            return arr.join('');
        } else {
            DEBUG && console.log(`cups: ${arr.join(' ')}`);
        }
    }

}

const cups = new Cups(arrInput);

cups.print();
for (let i = 0; i < 100; i++) {
    cups.takeTurn();
    cups.print();
}

console.log(`Part 1 Solution is ${cups.print(true)}`);

const cups2 = new Cups(arrInput, true);
for (let i = 0; i < 10e6; i++) {
    cups2.takeTurn();
    if (DEBUG && i % 10e5 === 0) console.log(i);
}

const cw1 = cups2.get(1).Next;
const cw2 = cw1.Next;
const part2 = cw1.Label * cw2.Label;

console.log(`Part 2 Solution is ${part2}`);