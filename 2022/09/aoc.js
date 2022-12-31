/**
 *  y
 * x -101
 *  -1...
 *   0.s.
 *   1...
 */

class RopePart {
    constructor(parent) {
        this.grid = aoc.grid2D({}, ".");
        this.pos = { x: 0, y: 0 };
        this.next = null;
        if (parent) {
            this.parent = parent;
            parent.next = this;
        }
        this.Step(0, 0);
    }

    Step(dx, dy) {
        this.pos.x += dx;
        this.pos.y += dy;
        this.grid.set(this.pos.x, this.pos.y, "#");
        this.next.Update();
    }

    Update() {
        let dx = this.parent.pos.x - this.pos.x;
        let dy = this.parent.pos.y - this.pos.y;

        // Only move if stretched
        if (Math.abs(dx) < 2 && Math.abs(dy) < 2) { return; }

        // Only move max of 1 in x and y
        if (dx > 1) {
            dx = 1;
        }
        if (dy > 1) {
            dy = 1;
        }
        if (dx < -1) {
            dx = -1;
        }
        if (dy < -1) {
            dy = -1;
        }

        this.Step(dx, dy);
    };
}

// Parse Input

var reInput = /([UDLR]{1}) (\d+)/;
var moves = aoc.input
    .split("\n")
    .filter(s => s !== "")
    .map(s => {
        const m = s.match(reInput);
        let steps = m[2];
        let dx = 0;
        let dy = 0;
        switch (m[1]) {
            case "U": dy++; break;
            case "D": dy--; break;
            case "L": dx--; break;
            case "R": dx++; break;
        }
        return { dx, dy, steps };
    });

function FindSolution(length) {
    var rope = [];
    const ropeLength = length;

    for (let i = 0; i < ropeLength; i++) {
        var parent = i > 0 ? rope[i - 1] : null;
        var part = new RopePart(parent);
        rope.push(part);
    }

    var head = rope[0];
    var tail = rope[ropeLength - 1];

    moves.forEach(move => {
        for (let step = 0; step < move.steps; step++) {
            head.Step(move.dx, move.dy);
        }
    });

    var solution = 0;
    for (const key in tail.grid.dump()) {
        if (tail.grid.dump()[key].value === "#") {
            solution++;
        }
    }

    return solution;
}

const part1 = FindSolution(2);
const part2 = FindSolution(10);

document.getElementById("part1-result").innerText = `${part1}`;
document.getElementById("part2-result").innerText = `${part2}`;
