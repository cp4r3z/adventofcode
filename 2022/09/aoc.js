/**
 *  y
 * x -101
 *  -1...
 *   0.s.
 *   1...
 */

var GridH = aoc.grid2D({}, ".");
var H = { x: 0, y: 0 };

const StepH = (dx, dy) => {
    H.x += dx;
    H.y += dy;
    GridH.set(H.x, H.y, "#");    
};
StepH(0,0);

// TODO: DRY
var GridT = aoc.grid2D({});
var T = { x: 0, y: 0 };

const StepT = (dx, dy) => {
    T.x += dx;
    T.y += dy;
    GridT.set(T.x, T.y, "#");
};
StepT(0,0);

const UpdateT = () => {
    let dx = H.x - T.x;
    let dy = H.y - T.y;

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

    StepT(dx, dy);
};

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

moves.forEach(move => {
    for (let step = 0; step < move.steps; step++) {
        StepH(move.dx, move.dy);
        //GridH.print();
        UpdateT();
        //console.log('');
        //GridT.print();
    }
});

var part1 = 0;
for (const key in GridT.dump()) {
    //console.log(`${property}: ${object[property]}`);
    if (GridT.dump()[key].value==="#"){
        part1++;
    }
  }

document.getElementById("part1-result").innerText = `${part1}`;
//document.getElementById("part2-result").innerText = `${part2}`;
