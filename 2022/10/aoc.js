// Parse Input

var re = /([a-z]+) ([-\d]+)/;
var commands = aoc.input
    .split("\n")
    .filter(s => s !== "")
    .map(s => {
        if (s === "noop") {
            return { instruction: "noop", number: 0 };
        }
        const m = s.match(re);
        const instruction = m[1];
        const number = ~~(m[2]);
        return { instruction, number }
    });

var X = 1;
var cycle = 0;
let part1 = 0;

let crt = (new Array(6)).fill(null).map(x => ((new Array(40)).fill("#")));

function Draw() {
    crt.forEach(row => {
        console.log(row.join(''));
    });
}

function CheckSignal() {
    // Part 1
    //20th, 60th, 100th, 140th, 180th, and 220th 
    if ((cycle - 20) % 40 === 0) {
        part1 += (cycle * X);
    }

    // Part 2
    const line = Math.floor((cycle-1) / 40);
    const position = cycle-1 - (40 * line);
    //console.log(`${line}@${position}`);
    if (Math.abs(X - position) > 1) {
        crt[line][position] = ' '
    }
    //Draw();
}

function Cycle() {
    cycle++;
    CheckSignal();
}

// Part 1
commands.forEach(command => {
    switch (command.instruction) {
        case "noop":
            Cycle();
            break;
        case "addx":
            Cycle();
            Cycle();
            X += command.number;
            break;
    }
});

Draw(); // Part 2

document.getElementById("part1-result").innerText = `${part1}`;
// document.getElementById("part2-result").innerText = `${part2}`;
