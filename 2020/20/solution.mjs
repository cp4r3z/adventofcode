/**
 * https://adventofcode.com/2020/day/20
 */

import { multiLine } from '../../common/parser.mjs';

import Tile from './Tile.mjs';
import Puzzle from './Puzzle.mjs';

// Parse Input
const inputFilePath = new URL('./input.txt', import.meta.url);

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

// TODO: Remember PossibleAdjacentTiles and IsEdge, IsCorner

console.log('Part 1 Solution is ' + product);

// tiles[0].printContent();
// tiles[0].setState({ Flip: 3, Rotation: 0 });
// tiles[0].setState({ Flip: 3, Rotation: 1 });

// Build a puzzle using Places that contain Tiles (tiles will swap/change as puzzle is solved)

const puzzle = new Puzzle(tiles);

/**
 * so, start by placing a tile in a place
 * check to see that the known edges all agree
 *   - for each place, all tile edges should be equal
 * if false, change tile (rotate/flip). if all possible combinations are evaluated, remove the tile and return false?
 * if valid, contiue placing placement(tileState) - remember that only "edge" tiles can go in edges, "corners" can only go in corners
 * if all tiles are placed (and valid) return true?
 */

//const testValid = puzzle.isValid();

const placeIds = [...puzzle.keys()];
//let puzzleDepth = 0; //index of currently evaluated puzzle place id
const possibleFlips = [0, 1, 2, 3];
const possibleRotations = [0, 1, 2, 3];

let solutionFound = false;

placement(0);

function placement(depth) {
    if (solutionFound) return;
    const puzzleDepth = depth;
    const place = puzzle.get(placeIds[puzzleDepth]);
    const unplacedTileIds = puzzle.getUnplacedTileIds();
    // if (unplacedTileIds.length === 0) {
    //     console.log('solved!');
    //     return;
    // }
    unplacedTileIds.forEach(tileId => {
        if (solutionFound) return;
        //place.Tile = puzzle.Tiles.get(tileId); // TODO: Make Tiles a map.

        // TODO: This isn't at all efficient. We need to know which tiles can actually belong in place based on surrounding tiles
        place.Tile = puzzle.Tiles.find(tile => tile.Id === tileId);
        possibleFlips.forEach(Flip => {
            if (solutionFound) return;
            possibleRotations.forEach(Rotation => {
                if (solutionFound) return;
                place.Tile.setState({ Flip, Rotation });
                if (puzzle.isValid()) {
                    
                    const unplacedTileIds = puzzle.getUnplacedTileIds();
                    if (unplacedTileIds.length === 0) {
                        console.log('solved!');
                        solutionFound = true; // TODO: Find a better way to break out of all these loops.
                        return;
                    }
                    
                    //if keep going, increment puzzledepth
                    
                    console.log(puzzleDepth);
                    if (puzzleDepth > placeIds.length - 1) {
                        console.log('solved???');
                    }
                    placement(puzzleDepth+1);
                }
            });
        });
        // OK, if we're here, remove the tile
        if (!solutionFound) place.Tile = null;
    });
}

console.log('hi charles');