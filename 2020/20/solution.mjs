/**
 * https://adventofcode.com/2020/day/20
 */

import { multiLine } from '../../common/parser.mjs';

// Parse Input
const inputFilePath = new URL('./tinput.txt', import.meta.url);

const arrInput = multiLine.toStrArray(inputFilePath);

class Tile {

//enum

/**
 * flip state (0=original, 1 flipped horizontal, 2 flipped vertical, 3 flipped both)
 * 
 * 0  1
 * 12 21
 * 34 43
 * 
 * 2  3
 * 34 43
 * 12 21
 */

/**
 * rotation state
 * 
 * 0  1
 * 12 31
 * 34 42
 * 
 * 2  3
 * 43 24
 * 21 13
 */

    // content is a size 10 array of strings. we can split it up on construction
    constructor(id, content) {
        this.Id = parseInt(id);
        this.Content = content.map(line => line.split(''));

        // TRBL order: Top, Right, Bottom, Left
        const edgeT = content[0];
        let edgeR = '';
        const edgeB = content[9];
        let edgeL = '';

        for (let i = 0; i < 10; i++) {
            edgeR += this.Content[i][9];
            edgeL += this.Content[9 - i][0];
        }
        this.edges = [edgeT, edgeR, edgeB, edgeL];
    }

    //getRow by id?

}

let tiles = []; // Array of Tile objects

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

console.log('hi charles');
