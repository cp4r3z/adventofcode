/**
 * https://adventofcode.com/2018/day/8
 */

const _ = require('underscore');
const file = require('fs').readFileSync('input.txt', 'utf8');

// Process input into usable data object
// Create a 2D array of square/position objects

let arrInput = file.split('\n').map(row => row.split(''));
// The following assumes a square map
const xy = {
    min: 0,
    max: arrInput.length - 1
}

// Generate Square Array
let arrSquares = [];
forXY(i => {
    const position = {
        x: i.x,
        y: i.y,
        sym: arrInput[i.y][i.x]
    };
    const Square = squareFactory(position);
    if (Square) arrSquares.push(Square);
});

const goblins = arrSquares.filter(s => s.sym == 'G');
const testCoor = arrSquares.find(s => s.x == 25 && s.y == 16);
testCoor.goToNearest('G');


// _position expects sym, x, y
function squareFactory(_position) {
    if (_position.sym === '#') return null;
    let Square = _position;
    Square.moves = getMoves();
    Square.goToNearest = goToNearest;
    return Square;

    // Ideas
    // Array of distances (only need to calculate once...)
    // Might need a second pass though.

    function getMoves() {

        const moves = {
            up: _position.y > xy.min && arrInput[_position.y - 1][_position.x + 0] !== '#',
            dn: _position.y < xy.max && arrInput[_position.y + 1][_position.x + 0] !== '#',
            lt: _position.x > xy.min && arrInput[_position.y + 0][_position.x - 1] !== '#',
            rt: _position.x < xy.max && arrInput[_position.y + 0][_position.x + 1] !== '#'
        };
        return moves;
    }

    function goToNearest(_sym) {
        console.log(_sym)
        //let arrDistances = Array(arrInput.length).fill(Array(arrInput.length).fill(-1));
        let arrRange = [];
        let arrNearest = [];
        arrRange.push({
            x: Square.x,
            y: Square.y,
            range: 0
        })
        let range = 0;
        // Generate arrRange
        while ((arrRange.filter(r => r.range === range)).length > 0) {
            arrRange
                .filter(r => r.range === range)
                .forEach(r => {
                    // Look around
                    let d = {};
                    // Up
                    d = { x: r.x + 0, y: r.y + 1 };
                    if (!arrRange.find(r => r.x === d.x && r.y === d.y) && r.y > xy.min) pushArr();
                    // Down
                    d = { x: r.x + 0, y: r.y - 1 };
                    if (!arrRange.find(r => r.x === d.x && r.y === d.y) && r.y < xy.max) pushArr();
                    // Left
                    d = { x: r.x - 1, y: r.y + 0 };
                    if (!arrRange.find(r => r.x === d.x && r.y === d.y) && r.x > xy.min) pushArr();
                    // Right
                    d = { x: r.x + 1, y: r.y + 0 };
                    if (!arrRange.find(r => r.x === d.x && r.y === d.y) && r.x < xy.max) pushArr();

                    function pushArr() {
                        if (arrInput[d.y][d.x] === '.') pushArrRange();
                        else if (arrInput[d.y][d.x] === _sym) pushArrNearest();
                    }

                    function pushArrRange() {
                        arrRange.push({
                            x: d.x,
                            y: d.y,
                            range: range + 1
                        });
                    }

                    function pushArrNearest() {
                        arrNearest.push({
                            x: d.x,
                            y: d.y,
                            range: range + 1
                        });
                    }
                });
            if (arrNearest.length > 0) break;
            range++;
        }
    }

    function getDistances() {}
}

function forXY(cb) {
    let y = 0;
    for (; y < arrInput.length; y++) {
        let x = 0;
        for (; x < arrInput.length; x++) {
            cb({ x, y });
        }
    }
}

// function? map w/ cb -- NOT USED
function mapArr(inArr, cb) {
    let outArr = [];
    let x = 0;
    let y = 0;
    for (; y < inArr.length; y++) {
        let outArrX = [];
        for (; x < inArr.length; x++) {
            outArrX.push(cb({ x, y }));
        }
        outArr.push(outArrX);
    }
    return outArr;
}

// End Process (gracefully)
process.exit(0);
