class Square {
    constructor(x, y, letter) {
        this.x = x;
        this.y = y;
        this.letter = letter;
        this.onEdge = x === 0 || y === 0 || x === aoc.mapDimX - 1 || y === aoc.mapDimY - 1;
        this.steps = -1; // Steps to reach from the start
        this.isStart = false;
        this.isEnd = false;
        if (letter === "S") {
            this.height = 0; //a
            this.steps = 0;
            this.isStart = true;
        } else if (letter === "E") {
            this.height = 25; //z
            this.isEnd = true;
        } else {
            this.height = letter.charCodeAt(0) - 97; // convert to int, starting at 0
        }
    }
}

// Setup

function Setup() {

    // Height Map Object
    aoc.map = aoc.grid2D({}, null);

    // Parse Input
    aoc.lines = aoc.input.split("\n");
    aoc.mapDimY = aoc.lines.length;
    aoc.mapDimX = aoc.lines[0].length;

    aoc.start = null;
    aoc.end = null;

    for (let y = 0; y < aoc.lines.length; y++) {
        for (let x = 0; x < aoc.lines[0].length; x++) {
            const letter = aoc.lines[y][x];
            const square = new Square(x, y, letter);
            aoc.map.set(x, y, square);
            if (letter === 'S') {
                aoc.start = square
            } else if (letter === 'E') {
                aoc.end = square;
            }
        }
    }
}

// square is the square we're on
function Climb(square) {
    if (square.isEnd) {
        return;
    }

    // Get adjacents
    var adjacents = aoc.map.getAdjacents(square.x, square.y);
    for (let i = 0; i < adjacents.length; i++) {
        const adjSquare = adjacents[i];

        if (adjSquare.isStart) {
            continue;
        }

        const heightDiff = adjSquare.height - square.height;
        if (heightDiff > 1) {
            continue;
        }

        const nextStep = square.steps + 1;
        if (adjSquare.steps !== -1 && adjSquare.steps <= nextStep) {
            continue;
        }

        adjSquare.steps = nextStep;
        Climb(adjSquare);
    }
}

// For Part 2, find the distances from E, starting at E
function Descend(square) {
    // Get adjacents
    var adjacents = aoc.map.getAdjacents(square.x, square.y);
    for (let i = 0; i < adjacents.length; i++) {
        const adjSquare = adjacents[i];

        if (adjSquare.isEnd) {
            continue;
        }

        // Can only go down one at a time, but we can go up many
        const heightDiff = square.height - adjSquare.height;
        if (heightDiff > 1) {
            continue;
        }

        const nextStep = square.steps + 1;

        if (adjSquare.steps !== -1) {

            if (adjSquare.height === 0 && adjSquare.steps > nextStep) {
                adjSquare.steps = nextStep;
                continue;
            }

            if (adjSquare.steps <= nextStep) {
                continue;
            }
        }

        adjSquare.steps = nextStep;
        Descend(adjSquare);
    }
}

// Part 1
Setup();
Climb(aoc.start);

aoc.part1 = aoc.end.steps;

// Part 2
Setup();
aoc.start.steps = -1;
aoc.end.steps = 0;
Descend(aoc.end);

aoc.part2 = Object.values(aoc.map.grid)
    .map(el => el.value)
    .filter(sq => sq.height === 0 && sq.steps !== -1)
    .sort((a, b) => a.steps - b.steps)[0]
    .steps;

document.getElementById("part1-result").innerText = `${aoc.part1}`;
document.getElementById("part2-result").innerText = `${aoc.part2}`;
