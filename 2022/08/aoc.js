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
    Look(delta) {
        var atx = this.x + delta.x;
        var aty = this.y + delta.y;
        var at = patch.get(atx, aty);
        if (atx === 1 && aty === 2) {
            console.log('hi');
        }
        if (at.h > this.h) {
            at.vis = true;
        }
        if (at.edge) {
            return;
        }
        at.Look(delta);
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
}

var patch = new Patch();

var lines = input
    .split("\n")
    .filter(s => s !== "")
    .map(
        s => s.split('')
            .map(s => ~~s));

var dim = lines.length;

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

for (let y = 1; y < dim - 1; y++) {
    for (let x = 1; x < dim - 1; x++) {
        var tree = patch.get(x, y);
        tree.LookAround();
    }
}

const part1 = Array.from(patch.values()).filter(t => t.vis).length;

document.getElementById("part1-result").innerText = `${part1}`;
//document.getElementById("part2-result").innerText = `${part2}`;
