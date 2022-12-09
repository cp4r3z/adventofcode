/**
 *  y
 * x 0123
 *  0....
 *  1....
 *  2....
 *  3....
 */

class Patch extends Map {
    set(x, y, val) {
        var key = `${x},${y}`;
        super.set(key, val);
    }
    get(x, y) {
        var key = `${x},${y}`;
        return super.get(key);
    }
}

class Tree {
    constructor(x, y, h) {
        this.x = x;
        this.y = y;
        this.h = h;
        this.vis = false;
        this.edge = false;
    }

    LookAround() {
        const deltas = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 }
        ];
        deltas.forEach(d => {
            if (this.vis) { return; }
            var atx = this.x;
            var aty = this.y;
            var looking = true;
            while (!this.vis && looking) {
                atx += d.x;
                aty += d.y;
                var at = patch.get(atx, aty);
                if (at.h >= this.h) {
                    looking = false;
                } else if (at.edge) {
                    this.vis = true;
                }
            }
        });
    }

    ViewingDistance() {
        if (this.edge) { return 0; }
        const deltas = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 }
        ];
        const distances = deltas.map(d => {
            if (this.vis) { return; }
            var atx = this.x;
            var aty = this.y;
            var looking = true;
            var distance = 0;
            while (looking) {
                distance++;
                atx += d.x;
                aty += d.y;
                var at = patch.get(atx, aty);
                if (at.h >= this.h || at.edge) {
                    looking = false;
                }
            }
            return distance;
        });
        return distances.reduce((a, b) => a *= b, 1);
    }
}

// Parse Input

var lines = input
    .split("\n")
    .filter(s => s !== "")
    .map(
        s => s.split('')
            .map(s => ~~s));

var dim = lines.length;

var patch = null;

function FillPatch() {
    patch = new Patch();

    for (let y = 0; y < dim; y++) {
        const col = lines[y];
        for (let x = 0; x < col.length; x++) {
            const h = col[x];
            var tree = new Tree(x, y, h);
            if (x === 0 || y === 0 || x === dim - 1 || y === dim - 1) {
                tree.edge = true;
                tree.vis = true;
            }
            patch.set(x, y, tree);
        }
    }
}

const ResetPatch = () => patch.forEach(tree => tree.vis = false);

// Part 1

FillPatch();

for (let y = 1; y < dim - 1; y++) {
    for (let x = 1; x < dim - 1; x++) {
        var tree = patch.get(x, y);
        tree.LookAround();
    }
}

const part1 = Array.from(patch.values()).filter(t => t.vis).length;

// Part 2

let mostVisible = 0;
for (let y = 0; y < dim; y++) {
    for (let x = 0; x < dim; x++) {
        ResetPatch();
        var tree = patch.get(x, y);
        var vd = tree.ViewingDistance();
        if (vd > mostVisible) {
            mostVisible = vd;
        }
    }
}

const part2 = mostVisible;

document.getElementById("part1-result").innerText = `${part1}`;
document.getElementById("part2-result").innerText = `${part2}`;
