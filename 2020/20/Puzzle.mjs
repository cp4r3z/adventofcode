import Place from './Place.mjs';

/**
 *     x --->
 *     0   1   2
 * y 0 0,0 1,0 2,0
 * | 1 0,1 1,1 2,1
 * v 2 0,2 1,2 2,2
 */

export default class Puzzle extends Map {
    constructor(tiles) {
        super();
        this.Tiles = tiles;
        this.PuzzleDim = Math.sqrt(tiles.length); // This is not an index!
        const puzzleDimIndex = this.PuzzleDim - 1;
        for (let y = 0; y <= puzzleDimIndex; y++) {
            for (let x = 0; x <= puzzleDimIndex; x++) {
                const p = new Place(x, y);
                if (x === 0 || y === 0 || x === puzzleDimIndex || y === puzzleDimIndex) {
                    // Mark place as edge
                    p.IsEdge = true;
                }
                if (x === 0 && y === 0 ||
                    x === 0 && y === puzzleDimIndex ||
                    x === puzzleDimIndex && y === 0 ||
                    x === puzzleDimIndex && y === puzzleDimIndex
                ) {
                    // Mark place as corner
                    p.IsEdge = false;
                    p.IsCorner = true;
                }
                this.set(p.Id, p);
            }
        }

        // And now loop through again to assign neighbors
        for (let y = 0; y <= puzzleDimIndex; y++) {
            for (let x = 0; x <= puzzleDimIndex; x++) {
                let assignT = y !== 0;
                let assignR = x !== puzzleDimIndex;
                let assignB = y !== puzzleDimIndex;
                let assignL = x !== 0;

                if (assignT) this.get(`x${x}y${y}`).PlaceT = this.get(`x${x}y${y - 1}`);
                if (assignR) this.get(`x${x}y${y}`).PlaceR = this.get(`x${x + 1}y${y}`);
                if (assignB) this.get(`x${x}y${y}`).PlaceB = this.get(`x${x}y${y + 1}`);
                if (assignL) this.get(`x${x}y${y}`).PlaceL = this.get(`x${x - 1}y${y}`);
            }
        }
    }

    isValid() {
        return [...this.values()].every(place => {
            if (!place.Tile) return true;

            // for debugging
            const tile = place.Tile;
            const TileT = place.PlaceT && place.PlaceT.Tile;
            const TileR = place.PlaceR && place.PlaceR.Tile;
            const TileB = place.PlaceB && place.PlaceB.Tile;
            const TileL = place.PlaceL && place.PlaceL.Tile;

            if (place.PlaceT && place.PlaceT.Tile) {
                if (place.PlaceT.Tile.Edges.B !== place.Tile.Edges.T) return false;
            }

            if (place.PlaceR && place.PlaceR.Tile) {
                if (place.PlaceR.Tile.Edges.L !== place.Tile.Edges.R) return false;
            }

            if (place.PlaceB && place.PlaceB.Tile) {
                if (place.PlaceB.Tile.Edges.T !== place.Tile.Edges.B) return false;
            }

            if (place.PlaceL && place.PlaceL.Tile) {
                if (place.PlaceL.Tile.Edges.R !== place.Tile.Edges.L) return false;
            }

            return true;
        });
    }

    getUnplacedTileIds() {
        const placedTileIds = [...this.values()]
            .map(place => place.Tile && place.Tile.Id)
            .filter(id => id);
        return this.Tiles
            .map(tile => tile.Id)
            .filter(id => !placedTileIds.includes(id));
    }

}