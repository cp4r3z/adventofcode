/**
 * https://adventofcode.com/2020/day/24
 */

import { multiLine } from '../../common/parser.mjs';

// Parse Input
const inputFilePath = new URL('./tinput.txt', import.meta.url);
const arrInput = multiLine
    .toStrArray(inputFilePath)
    .map(parseInputMap); // Specific to Puzzle

class Coordinate {
    constructor(x = 0, y = 0, z = 0) {
        this.X = x;
        this.Y = y;
        this.Z = z;
    }

    toKey() {
        return `x${this.X}y${this.Y}z${this.Z}`;
    }
}

class HexTile {
    constructor(coordinate = new Coordinate(), state = false) {
        this.Coordinate = coordinate; // Coordinate object
        this.State = state;
        this.Neighbors = new Set();
        tiles.set(this.Coordinate.toKey(), this);
        if (this.State) this._fillNeighbors();
    }

    // Article on hex coordinates
    // https://www.redblobgames.com/grids/hexagons/
    // https://www.redblobgames.com/grids/hexagons/#neighbors-cube

    /**
     * I suppose it doesn't matter which variable we map to which direction...
     * e, se, sw, w, nw, and ne
     * 
     * e  => +x, -y
     * w  => -x, +y
     * nw => +y, -z
     * se => -y, +z
     * sw => +z, -x
     * ne => -z, +x
     * 
     */

    static get neighborOffsets() {
        const nMap = new Map();
        nMap.set('e', new Coordinate(1, -1, 0));
        nMap.set('w', new Coordinate(-1, 1, 0));
        nMap.set('nw', new Coordinate(0, 1, -1));
        nMap.set('se', new Coordinate(0, -1, 1));
        nMap.set('sw', new Coordinate(-1, 0, 1));
        nMap.set('ne', new Coordinate(1, 0, -1));
        return nMap;
    }

    _fillNeighbors() {
        if (this.Neighbors.size === 6) return;
        HexTile.neighborOffsets.forEach((offset, key) => {
            const nCoordinate = this._offsetCoordinate(offset);
            this.Neighbors.add(tiles.get(nCoordinate.toKey()) || new HexTile(nCoordinate));
        });
    }

    // Takes a Coordinate and returns a Coordinate
    _offsetCoordinate(offset) {
        return new Coordinate(
            this.Coordinate.X + offset.X,
            this.Coordinate.Y + offset.Y,
            this.Coordinate.Z + offset.Z
        );
    }

    get activeNeighborCount() {
        return [...this.Neighbors.values()]
            .reduce((acc, tile) => tile.State ? acc + 1 : acc, 0);
    }

    getNeighbor(str) {
        const offset = HexTile.neighborOffsets.get(str);
        const nCoordinate = this._offsetCoordinate(offset);
        return tiles.get(nCoordinate.toKey()) || new HexTile(nCoordinate);
    }

    toggleState() {
        this.State = !this.State;
        if (this.State) this._fillNeighbors();
    }
}

const tiles = new Map();

// The "reference tile"
// white tile => State = false
const t0 = new HexTile(undefined, false);

arrInput.forEach(line => {
    let currentTile = t0;
    line.forEach(move => {
        currentTile = currentTile.getNeighbor(move);
    });
    currentTile.toggleState();
});

// Count black (true) tiles
const part1 = [...tiles.values()]
    .reduce((acc, tile) => tile.State ? acc + 1 : acc, 0);

console.log(`Year 2020 Day 24 Part 1 Solution: ${part1}`);

// Part 2

for (let i = 0; i < 100; i++) {
    const tilesToToggle = [];
    tiles.forEach(tile => {
        const count = tile.activeNeighborCount;
        if (tile.State) {
            // Black
            if (count === 0 || count > 2) tilesToToggle.push(tile);
        } else {
            // White
            if (count === 2) tilesToToggle.push(tile);
        }
    });
    tilesToToggle.forEach(tile => tile.toggleState());
}

// Count black (true) tiles
const part2 = [...tiles.values()]
    .reduce((acc, tile) => tile.State ? acc + 1 : acc, 0);

console.log(`Year 2020 Day 24 Part 2 Solution: ${part2}`);

function parseInputMap(line) {
    const newLine = [];
    const lineArr = line.split('');
    for (let i = 0; i < lineArr.length; i++) {
        const char = lineArr[i];
        if (char === 'e' || char === 'w') {
            newLine.push(char);
        } else {
            newLine.push(char + lineArr[i + 1]);
            i++;
        }
    }
    return newLine;
}
