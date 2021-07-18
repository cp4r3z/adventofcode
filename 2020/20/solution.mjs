/**
 * https://adventofcode.com/2020/day/20
 */

import { multiLine } from '../../common/parser.mjs';

import Tile from './Tile.mjs';
import Puzzle from './Puzzle.mjs';

// Parse Input
const inputFilePath = new URL('./tinput.txt', import.meta.url);

const arrInput = multiLine.toStrArray(inputFilePath);

let tiles = []; // Array of Tile objects

// Process the input line by line to generate Tiles
let tempTileIdString;
let tempTileContent = [];
arrInput.forEach(line => {
    if (line.length === 0) return;
    const id = line.match(/(\d+)/);
    if (id) {
        tempTileIdString = id[0];
        return;
    }
    tempTileContent.push(line);
    if (tempTileContent.length === 10) {
        tiles.push(new Tile(tempTileIdString, tempTileContent));
        tempTileContent = [];
    }
});

// Figure out first how "unique" the sides are. Maybe this is easier than you'd expect?

// Important hint: the outermost edges won't line up with any other tiles

for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    let uniqueEdgeCount = 0;

    for (let edgeI = 0; edgeI < tile.PossibleEdges.length; edgeI++) {
        const edge = tile.PossibleEdges[edgeI];
        let isUnique = true;
        for (let j = 0; j < tiles.length; j++) {
            if (j == i) continue;
            const otherTile = tiles[j];
            if (otherTile.PossibleEdges.includes(edge)) {
                isUnique = false;
                break;
            }
        }
        if (isUnique) uniqueEdgeCount++;
    }
    tile.UniqueEdgeCount = uniqueEdgeCount / 2; // kind of a hack i guess 
}

let product = 1;

tiles.forEach(tile => {
    if (tile.UniqueEdgeCount === 2) product *= tile.Id;
});

console.log('Part 1 Solution is ' + product);

tiles[0].printContent();
tiles[0].setState({ Flip: 3, Rotation: 0 });
tiles[0].setState({ Flip: 3, Rotation: 1 });

// Build a puzzle using Places that contain Tiles (tiles will swap/change as puzzle is solved)

const puzzleDim = Math.sqrt(tiles.length);

const puzzle = new Puzzle(puzzleDim);

console.log('hi charles');