import Place from './Place.mjs';

/**
 *     x --->
 *     0   1   2
 * y 0 0,0 1,0 2,0
 * | 1 0,1 1,1 2,1
 * v 2 0,2 1,2 2,2
 */

export default class Puzzle extends Map {
    constructor(puzzleDim) {
        super();
        this.PuzzleDim = puzzleDim; // This is not an index!
        for (let y = 0; y < puzzleDim; y++) {
            for (let x = 0; x < puzzleDim; x++) {
                const p = new Place(x, y);
                if (x === 0 || y === 0 || x === puzzleDim - 1 || y === puzzleDim - 1) {
                    // Mark place as edge
                    p.IsEdge = true;
                }
                if (x === 0 && y === 0 ||
                    x === 0 && y === puzzleDim - 1 ||
                    x === puzzleDim - 1 && y === 0 ||
                    x === puzzleDim - 1 && y === puzzleDim - 1
                ) {
                    // Mark place as corner
                    p.IsEdge = false;
                    p.IsCorner = true;
                }
                this.set(p.Id, p);
            }
        }

        // And now loop through again to assign neighbors
        for (let y = 0; y < puzzleDim; y++) {
            for (let x = 0; x < puzzleDim; x++) {
                let assignT = y !== 0;
                let assignR = x !== this.PuzzleDim - 1;
                let assignB = y !== this.PuzzleDim - 1;
                let assignL = x !== 0;

                if (assignT) this.get(`x${x}y${y}`).PlaceT = this.get(`x${x}y${y - 1}`);
                if (assignR) this.get(`x${x}y${y}`).PlaceR = this.get(`x${x + 1}y${y}`);
                if (assignB) this.get(`x${x}y${y}`).PlaceB = this.get(`x${x}y${y + 1}`);
                if (assignL) this.get(`x${x}y${y}`).PlaceL = this.get(`x${x - 1}y${y}`);
            }
        }

    }

    isValid() {
        // const arr = Array.from(this, ([id, place]) => place);
        // const arr = this.values();
        return [...this.values()].every(place => {
            let valid = true;

            if (valid && place.Tile && place.PlaceT && place.PlaceT.Tile) {
                valid = place.PlaceT.Tile.EdgeB === place.Tile.EdgeT;
            }

            if (valid && place.Tile && place.PlaceR && place.PlaceR.Tile) {
                valid = place.PlaceR.Tile.EdgeL === place.Tile.EdgeR;
            }

            if (valid && place.Tile && place.PlaceB && place.PlaceB.Tile) {
                valid = place.PlaceB.Tile.EdgeT === place.Tile.EdgeB;
            }

            if (valid && place.Tile && place.PlaceL && place.PlaceL.Tile) {
                valid = place.PlaceL.Tile.EdgeR === place.Tile.EdgeL;
            }

            return valid;
        });
    }
}