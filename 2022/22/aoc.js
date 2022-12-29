// Testing
//aoc.input = aoc.inputt;

class Coor {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    Add(coor) {
        return new Coor(this.x + coor.x, this.y + coor.y);
    }
}

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
        this.SU = null;
        this.SR = null;
        this.SD = null;

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
        if (nextPosition.x < 0) {
            nextSquare = this.SL;
            nextPosition = new Coor(aoc.input.size - 1, nextPosition.y);
        } else if (nextPosition.y < 0) {
            nextSquare = this.SU;
            nextPosition = new Coor(nextPosition.x, aoc.input.size - 1);
        } else if (nextPosition.x > aoc.input.size - 1) {
            nextSquare = this.SR;
            nextPosition = new Coor(0, nextPosition.y);
        } else if (nextPosition.y > aoc.input.size - 1) {
            nextSquare = this.SD;
            nextPosition = new Coor(nextPosition.x, 0);
        }

        nextSquare.DirectionIndex = this.DirectionIndex;

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
                rotation:0
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
                rotation:0
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
    if (number.length>0){
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

Parse();
ParsePath();
FillSquares();
LinkSquares();
aoc.finalSquare = MoveAlongPath();
aoc.part1 = aoc.finalSquare.GetPassword();

document.getElementById("part1-result").innerText = `${aoc.part1}`;
document.getElementById("part2-result").innerText = `${aoc.part2}`;
