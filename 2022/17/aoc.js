//    0123456
// 4 |..@@@@.|
// 3 |.......|
// 2 |.......|
// 1 |.......|
// 0 +-------+

class Coor {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Shape {
    // shapes have a bounding box min / max x and ys
    // relative 0,0 is top left
    // honestly the Shape could also be a 2dgrid !
    constructor() {
        this.MinX = 0;
        this.MaxX = 0;
        this.MinY = 0;
        this.MaxY = 0;
        this.Coors = []; // [<Coor>]    

        // position on board
        this.OffsetX = 0;
        this.OffsetY = 0;
    }

    AddCoor(coor) {
        if (coor.x > this.MaxX) {
            this.MaxX = coor.x;
        }
        if (coor.y > this.MaxY) {
            this.MaxY = coor.y;
        }
        this.Coors.push(coor);
    }

    ResetOffsets() {
        this.OffsetX = 0;
        this.OffsetY = 0;
    }

    SetOffsets(x, y) {
        this.OffsetX = x;
        this.OffsetY = y;
    }

    GetAbsCoors() {
        return this.Coors.map(c => new Coor(c.x + this.OffsetX, c.y + this.OffsetY));
    }

    GetAbsMinX() {
        return this.MinX + this.OffsetX;
    }

    GetAbsMaxX() {
        return this.MaxX + this.OffsetX;
    }

    U() { this.OffsetY++; } // Up is pos Y
    D() { this.OffsetY--; }
    L() { this.OffsetX--; }
    R() { this.OffsetX++; }
}

function MakeShape(arr2D) {
    var shape = new Shape();
    for (let y = 0; y < arr2D.length; y++) {
        const row = arr2D[y]; // first row is the "highest"
        const cols = row.split('');
        for (let x = 0; x < cols.length; x++) {
            const s = cols[x];
            if (s === "#") {
                shape.AddCoor(new Coor(x, arr2D.length - 1 - y));
            }
        }
    }
    return shape;
}

function DeclareShapes() {
    aoc.Shapes = [];
    aoc.Shapes.push(MakeShape([
        '####'
    ]));

    aoc.Shapes.push(MakeShape([
        '.#.',
        '###',
        '.#.'
    ]));

    aoc.Shapes.push(MakeShape([
        '..#',
        '..#',
        '###'
    ]));

    aoc.Shapes.push(MakeShape([
        '#',
        '#',
        '#',
        '#'
    ]));

    aoc.Shapes.push(MakeShape([
        '##',
        '##'
    ]));
}

function PlaceShapeInGrid(shape) {
    var offsetY = aoc.map.highestRock + 3 + 1; // MaxY is 0 index
    shape.SetOffsets(2, offsetY); // offset is 0 index, and -y is up
    //aoc.map.print();
}

function MakeFloor() {
    for (let i = 0; i <= 6; i++) {
        SetRock({ x: i, y: 0 }, '#');
    }
}

function SetRock(coor) {
    aoc.map.set(coor.x, coor.y, "#");
    if (coor.y > aoc.map.highestRock) {
        aoc.map.highestRock = coor.y;
    }

    // Part 2
    if (coor.y > aoc.map.highestRocks[coor.x]) {
        aoc.map.highestRocks[coor.x] = coor.y;
    }

}

function SetShape(shape) {
    for (const coor of shape.GetAbsCoors()) {
        SetRock(coor);
    }
}

function DetectCollision(shape) {
    if (shape.GetAbsMinX() < 0 || shape.GetAbsMaxX() > 6) {
        return true;
    }

    for (const coor of shape.GetAbsCoors()) {
        var gridAtXY = aoc.map.get(coor.x, coor.y);
        if (gridAtXY.value === "#") {
            return true;
        }
    }
    return false;
}

// Setup

function Setup() {

    // Height Map Object
    aoc.map = aoc.grid2D({}, '.');
    aoc.map.highestRock = 0;

    aoc.map.highestRocks = new Array(7).fill(0);
    aoc.hashMap = new Map();

    MakeFloor();

    DeclareShapes();

    // Parse Input
    aoc.jets = aoc.input.split("");

}

function GetHash(shapeId, jetIndex) {
    var hash = `${shapeId}|${jetIndex}|`;
    var relativeHighestHash = aoc.map.highestRocks.map(h => aoc.map.highestRock - h).join('|');
    hash += relativeHighestHash;
    return hash;
}

function Simulate(part2 = false) {
    var stoppedRocks = 0;

    var shapeId = 0;
    var shape = aoc.Shapes[shapeId];
    PlaceShapeInGrid(shape);

    var jetIndex = 0;

    const maxRocks = !part2 ? 2022 : 1000000000000;

    var part2AdditionalHeight = 0;
    var part2Skipped = false;

    while (stoppedRocks < maxRocks) {
        // jets
        var jet = aoc.jets[jetIndex];

        if (jet === "<") {
            shape.L();
            if (DetectCollision(shape)) {
                shape.R();
            }
        } else {
            shape.R();
            if (DetectCollision(shape)) {
                shape.L();
            }
        }

        jetIndex++;
        if (jetIndex > aoc.jets.length - 1) {
            jetIndex = 0;
        }

        // down

        shape.D();
        if (DetectCollision(shape)) {
            shape.U();
            SetShape(shape);
            stoppedRocks++;
            if (stoppedRocks === maxRocks) {
                break;
            }

            // console.clear();
            // aoc.map.print();

            shapeId++;
            if (shapeId > 4) {
                shapeId = 0;
            }
            shape = aoc.Shapes[shapeId];
            PlaceShapeInGrid(shape);

            // Part 2

            if (part2) {
                // Before we do anything, have we been here before?
                var hash = GetHash(shapeId, jetIndex);

                var check = aoc.hashMap.get(hash);

                if (check && !part2Skipped) {
                    // so... it repeats at this interval...
                    const cycle = stoppedRocks - check.stoppedRocks;
                    const remaining = maxRocks - stoppedRocks;
                    const remainderToSimulate = remaining % cycle;
                    const cycles = Math.floor(remaining / cycle);
                    const test = stoppedRocks + cycles * cycle + remainderToSimulate; // should be maxRocks?

                    stoppedRocks = maxRocks - remainderToSimulate;

                    const heightPerCycle = aoc.map.highestRock - check.highestRock;
                    part2AdditionalHeight = heightPerCycle * cycles;
                    part2Skipped = true;

                } else {
                    const store = {
                        stoppedRocks, highestRock: aoc.map.highestRock
                    }
                    aoc.hashMap.set(hash, store);
                }
            }

        }

        //debug

        /*

        var debugmap = aoc.grid2D(aoc.map.dump(), '.');

        for (const coor of shape.GetAbsCoors()) {
            debugmap.set(coor.x, coor.y, "@");
        }
        console.log('---------');
        debugmap.print();

        */

    }

    aoc.map.highestRock += part2AdditionalHeight;
}

// Part 1
Setup();

Simulate();

aoc.part1 = aoc.map.highestRock;

Setup();

Simulate(true);

aoc.part2 = aoc.map.highestRock;

document.getElementById("part1-result").innerText = `${aoc.part1}`;
document.getElementById("part2-result").innerText = `${aoc.part2}`;
