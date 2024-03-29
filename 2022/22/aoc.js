// Testing
//aoc.input = aoc.inputt;

aoc.Directions = [
    new Coor(1, 0),  // R
    new Coor(0, 1),  // D
    new Coor(-1, 0), // L
    new Coor(0, -1)  // U    
];

class Square {
    constructor(squareCoor) {
        this.grid = aoc.grid2D({}, '.');

        this.SquareCoor = squareCoor;

        // maybe store links? LURD
        this.SL = null;
        this.SLSide = null;
        this.SLFlip = false;
        this.SU = null;
        this.SUSide = null;
        this.SUFlip = false;
        this.SR = null;
        this.SRSide = null;
        this.SRFlip = false;
        this.SD = null;
        this.SDSide = null;
        this.SDFlip = false;

        // Default to 0,0 facing right
        this.Position = new Coor();
        this.DirectionIndex = 0;
    }

    Direction() {
        return aoc.Directions[this.DirectionIndex];
    }

    Rotate(by) {
        // by is -1 or 1
        this.DirectionIndex = WrapAdd(this.DirectionIndex, by, 3);
    }

    GetAbsCoor(coor) {
        return new Coor(coor.x + this.SquareCoor.x * aoc.input.size,
            coor.y + this.SquareCoor.y * aoc.input.size);
    }

    GetPassword() {
        const absCoor = this.GetAbsCoor(this.Position);
        const row = absCoor.y + 1;
        const column = absCoor.x + 1;
        const facing = this.DirectionIndex;
        const password = 1000 * row + 4 * column + facing;
        return password;
    }

    SetDefaultLinks() {
        this.SL = this;
        this.SU = this;
        this.SR = this;
        this.SD = this;
    }

    // maybe we don't need a startingCoor!?
    // return a square ("this" if blocked)
    Move(move) {

        // Rotate

        if (move.rotation !== 0) {
            this.Rotate(move.rotation);
            return this;
        }

        // Translate

        let nextPosition = this.Position.Add(this.Direction());

        // Check if it's another square...

        let nextSquare = this;
        let p2 = {};
        if (nextPosition.x < 0) {
            nextSquare = this.SL;

            // If part 2, do the transform
            if (aoc.part2cube) {
                p2 = aoc.part2cube.PlaceInPosition(this.Position.y, this.SLSide, this.SLFlip);
                nextPosition = p2.position;
                nextSquare.DirectionIndex = p2.direction;
            } else {
                nextPosition = new Coor(aoc.input.size - 1, nextPosition.y);    
            }

        } else if (nextPosition.y < 0) {
            nextSquare = this.SU;

            if (aoc.part2cube) {
                p2 = aoc.part2cube.PlaceInPosition(this.Position.x, this.SUSide, this.SUFlip);
                nextPosition = p2.position;
                nextSquare.DirectionIndex = p2.direction;
            } else {
                nextPosition = new Coor(nextPosition.x, aoc.input.size - 1);            
            }

        } else if (nextPosition.x > aoc.input.size - 1) {
            nextSquare = this.SR;

            if (aoc.part2cube) {
                p2 = aoc.part2cube.PlaceInPosition(this.Position.y, this.SRSide, this.SRFlip);
                nextPosition = p2.position;
                nextSquare.DirectionIndex = p2.direction;
            } else {
                nextPosition = new Coor(0, nextPosition.y);
            }

        } else if (nextPosition.y > aoc.input.size - 1) {
            nextSquare = this.SD;

            if (aoc.part2cube) {
                p2 = aoc.part2cube.PlaceInPosition(this.Position.x, this.SDSide, this.SDFlip);
                nextPosition = p2.position;
                nextSquare.DirectionIndex = p2.direction;
            } else {
                nextPosition = new Coor(nextPosition.x, 0);
            }
        }

        if (!aoc.part2cube) {
            nextSquare.DirectionIndex = this.DirectionIndex;
        }

        // check if it's blocked...

        const nextSpace = nextSquare.grid.get(nextPosition.x, nextPosition.y).value;

        if (nextSpace === "#") {
            // if it's blocked, return this
            return this;
        }

        //actually change the position
        nextSquare.Position = nextPosition;
        // build another move and return the next square's Move()    
        const nextDistance = move.distance - 1;
        if (nextDistance === 0) {
            return nextSquare;
        }

        return nextSquare.Move({
            rotation: 0,
            distance: nextDistance
        });
    }
}

// Map "Squares" are the size x size groups on the map.
// Probably cube sides ;-)

// Idea... Wanna do a grid of grids?

function Parse() {
    aoc.trimmedAndSplit = aoc.input.map.trim().split("\n").map(line => line.split(""));

    // Base 0
    aoc.inputMapDimensions = new Coor(
        aoc.trimmedAndSplit[0].length,
        aoc.trimmedAndSplit.length
    );

    // Base 0
    aoc.inputMapSquareDimensions = new Coor(
        aoc.inputMapDimensions.x / aoc.input.size,
        aoc.inputMapDimensions.y / aoc.input.size
    );
}

function ParsePath() {
    let number = "";
    let rotation = 0; // Straight
    let path = [];
    for (const char of aoc.input.path) {
        if (char === "L") {
            path.push({
                distance: parseInt(number),
                rotation: 0
            });
            rotation = -1;
            number = "";
            path.push({
                distance: 0,
                rotation
            });
        } else if (char === "R") {
            path.push({
                distance: parseInt(number),
                rotation: 0
            });
            rotation = 1;
            number = "";
            path.push({
                distance: 0,
                rotation
            });
        } else {
            number += char;
            rotation = 0;
        }
    }
    if (number.length > 0) {
        path.push({
            distance: parseInt(number),
            rotation: 0
        });
    }
    aoc.path = path;
}

function MakeSquare(squareCoor) {
    const dimXStart = squareCoor.x * aoc.input.size;
    const dimXEnd = dimXStart + aoc.input.size - 1;
    const dimYStart = squareCoor.y * aoc.input.size;
    const dimYEnd = dimYStart + aoc.input.size - 1;

    const square = new Square(squareCoor);
    square.SetDefaultLinks();

    let nullSquare = false;
    for (let y = dimYStart; y <= dimYEnd; y++) {
        if (nullSquare) { break; }

        const yRel = y - dimYStart;

        for (let x = dimXStart; x <= dimXEnd; x++) {
            const xRel = x - dimXStart;

            const tile = aoc.trimmedAndSplit[y][x];

            nullSquare = tile === "_";
            if (nullSquare) { break; }

            square.grid.set(xRel, yRel, tile);
        }
    }

    if (nullSquare) { return false; }

    return square;
}

function FillSquares() {
    // A grid for each "square" of the board
    aoc.squares = aoc.grid2D({}, '_', false);

    for (let y = 0; y < aoc.inputMapSquareDimensions.y; y++) {
        for (let x = 0; x < aoc.inputMapSquareDimensions.x; x++) {
            const square = MakeSquare(new Coor(x, y));
            if (square) {
                aoc.squares.set(x, y, square);
            }
        }
    }
}

function WrapAdd(num, add, max) {
    var result = num + add;
    if (result > max) {
        result = result - max - 1;// Why -1?
    }
    if (result < 0) {
        result = result + max + 1; // Why +1?
    }
    return result;
}

function LinkSquares() {
    // Figure out number of squares in each row / column?
    for (const square of Object.values(aoc.squares.grid)) {

        // X Left
        let starting = square.value.SquareCoor.x;
        let x = starting;
        let search = true;

        while (search) {
            x = WrapAdd(x, -1, aoc.inputMapSquareDimensions.x - 1);
            if (x === starting) {
                search = false;
                break;
            }
            var left = aoc.squares.get(x, square.y);
            if (left) {
                square.value.SL = left.value;
                search = false;
                break;
            }
        }

        starting = square.value.SquareCoor.y;
        let y = starting;
        search = true;

        while (search) {
            y = WrapAdd(y, -1, aoc.inputMapSquareDimensions.y - 1);
            if (y === starting) {
                search = false;
                break;
            }
            var up = aoc.squares.get(square.x, y);
            if (up) {
                square.value.SU = up.value;
                search = false;
                break;
            }
        }

        starting = square.value.SquareCoor.x;
        x = starting;
        search = true;

        while (search) {
            x = WrapAdd(x, 1, aoc.inputMapSquareDimensions.x - 1);
            if (x === starting) {
                search = false;
                break;
            }
            var right = aoc.squares.get(x, square.y);
            if (right) {
                square.value.SR = right.value;
                search = false;
                break;
            }
        }

        starting = square.value.SquareCoor.y;
        y = starting;
        search = true;

        while (search) {
            y = WrapAdd(y, 1, aoc.inputMapSquareDimensions.y - 1);
            if (y === starting) {
                search = false;
                break;
            }
            var down = aoc.squares.get(square.x, y);
            if (down) {
                square.value.SD = down.value;
                search = false;
                break;
            }
        }
    }
}

function LinkSquares2() {
    // Figure out number of squares in each row / column?
    for (const square of Object.values(aoc.squares.grid)) {

        // const sides = [0, 1, 2, 3]; // R, D, L, U

        // Right
        const r = aoc.edgeTransform.get(
            JSON.stringify({ s: square.value.SquareCoor, side: 0 })
        );
        square.value.SR = aoc.squares.get(r.s.x, r.s.y).value;
        square.value.SRSide = r.side;
        square.value.SRFlip = r.flip;

        // Down
        const d = aoc.edgeTransform.get(
            JSON.stringify({ s: square.value.SquareCoor, side: 1 })
        );
        square.value.SD = aoc.squares.get(d.s.x, d.s.y).value;
        square.value.SDSide = d.side;
        square.value.SDFlip = d.flip;

        // Left
        const l = aoc.edgeTransform.get(
            JSON.stringify({ s: square.value.SquareCoor, side: 2 })
        );
        square.value.SL = aoc.squares.get(l.s.x, l.s.y).value;
        square.value.SLSide = l.side;
        square.value.SLFlip = l.flip;

        // Up
        const u = aoc.edgeTransform.get(
            JSON.stringify({ s: square.value.SquareCoor, side: 3 })
        );
        square.value.SU = aoc.squares.get(u.s.x, u.s.y).value;
        square.value.SUSide = u.side;
        square.value.SUFlip = u.flip;
    }
}

function GetStartingSquare() {
    let square = false;
    let x = 0;
    while (!square) {
        square = aoc.squares.get(x, 0);
        x++;
    }
    return square.value;
}

function MoveAlongPath() {
    let square = GetStartingSquare();
    for (const move of aoc.path) {
        square = square.Move(move);
    }
    return square;
}

function ResetSquares() {
    for (const square of Object.values(aoc.squares.grid)) {
        square.value.SetDefaultLinks();
        square.value.Position = new Coor(0,0);
        square.value.DirectionIndex = 0;
    }
}

Parse();
ParsePath();
FillSquares();
LinkSquares();
aoc.finalSquare = MoveAlongPath();
aoc.part1 = aoc.finalSquare.GetPassword();

aoc.part2cube = aoc.cube(aoc.input.size);
ResetSquares();
LinkSquares2();

aoc.finalSquare = MoveAlongPath();
aoc.part2 = aoc.finalSquare.GetPassword();

document.getElementById("part1-result").innerText = `${aoc.part1}`;
document.getElementById("part2-result").innerText = `${aoc.part2}`;
