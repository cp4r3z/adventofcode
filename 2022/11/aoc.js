class Monkey {
    // param is an object
    constructor(param) {
        Object.assign(this, param);
        this.inspected = 0;
    }
    Inspect(part2 = false) {
        for (let i = 0; i < this.items.length; i++) {
            let worry = this.items[i];

            //Operation
            worry = this.operation.func(worry, this.operation.operand);
            if (part2) {
                // We only need to track the "remainder" for factors.
                // Like an "offset" from a large multiple of the product of all divisors
                worry = worry % aoc.divisorProduct;
            }
            else {
                worry = Math.floor(worry / 3);
            }

            //Test
            const testResult = worry % this.test === 0;

            // Throw
            const throwTo = testResult ? this.testTrue : this.testFalse;
            aoc.monkeys[throwTo].items.push(worry);

            this.inspected++;
        }
        this.items = [];
    }
}

// Parse Input

aoc.res = [
    /(\d)/, // Not really necessary
    /: ([\d\s,]+)/,
    /old ([\*\+]) ([old\d]+)/,
    /(\d+)/,
    /(\d)/,
    /(\d)/
];

aoc.add = (a, b) => a + b;
aoc.multiply = (a, b) => b === 'old' ? a * a : a * b;

function ParseLines(lines, iMap) {
    var attributes = lines.split('\n');
    var o = {};
    for (let i = 0; i < 6; i++) {
        var match = attributes[i].match(aoc.res[i]);
        switch (i) {
            case 0:
                o.number = iMap;
                break;
            case 1:
                o.items = match[1]
                    .replaceAll(' ', '')
                    .split(',')
                    .map(s => ~~s);
                break;
            case 2:
                o.operation = {
                    func: match[1] === '+' ? aoc.add : aoc.multiply,
                    operand: match[2] === 'old' ? match[2] : ~~match[2]
                }
                break;
            case 3:
                o.test = ~~match[1];
                break;
            case 4:
                o.testTrue = ~~match[1];
                break;
            case 5:
                o.testFalse = ~~match[1];
                break;
            default:
                break;
        }
    }
    return new Monkey(o);
}

function CalculateSolution() {
    aoc.monkeys = aoc.monkeys.sort((a, b) => b.inspected - a.inspected);
    return aoc.monkeys[0].inspected * aoc.monkeys[1].inspected;
}

aoc.monkeys = aoc.input
    .split("\n\n")
    .map(ParseLines);

for (let i = 0; i < 20; i++) {
    aoc.monkeys.forEach(monkey => monkey.Inspect());
}

const part1 = CalculateSolution();

// Part 2

// (Inefficient) reset
aoc.monkeys = aoc.input
    .split("\n\n")
    .map(ParseLines);

// Find a number that all monkeys can divide by
aoc.divisorProduct = aoc.monkeys.reduce((a, b) => a * b.test, 1);

for (let i = 0; i < 10000; i++) {
    aoc.monkeys.forEach(monkey => monkey.Inspect(true));
}

const part2 = CalculateSolution();

document.getElementById("part1-result").innerText = `${part1}`;
document.getElementById("part2-result").innerText = `${part2}`;
