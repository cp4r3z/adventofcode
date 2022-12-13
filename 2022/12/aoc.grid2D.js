/**
 * 2D Grid
 * Pre-Written Utility Function
 * aoc.grid2D
 */

/** Create a 2D Grid
 * @param {object} objInitialState - The initial state key/value pairs
 * @param {string} defaultValue - The value to assign to undefined keys
 * */
aoc.grid2D = function (objInitialState, defaultValue = "") {
    let grid = Object.assign({}, objInitialState);
    let minX = false;
    let maxX = false;
    let minY = false;
    let maxY = false;

    function indexesToKey(indexX, indexY) {
        return `X${indexX}Y${indexY}`;
    }

    function get(indexX, indexY) {
        // Create a hash/key
        const key = indexesToKey(indexX, indexY);
        if (typeof (grid[key]) === 'undefined') {
            // Set it with the default value
            set(indexX, indexY, defaultValue);
        }
        return grid[key];
    }

    function getAdjacents(indexX, indexY, includeDiagonals = false, stayInsideGrid = true) {
        const adjacents = [];
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) {
                    continue; // self
                }                
                if (!includeDiagonals) {
                    if (Math.abs(dx) + Math.abs(dy) === 2) {
                        continue;
                    }
                }

                const x = indexX+dx;
                const y = indexY+dy;
                if (stayInsideGrid) {
                    if (x < minX || y < minY || x > maxX || y > maxY) {
                        continue;
                    }
                }                

                adjacents.push(this.get(x, y).value);
            }
        }
        return adjacents;
    }

    function set(indexX, indexY, value) {
        const key = indexesToKey(indexX, indexY);

        // Keep record of the overall dimensions
        if (minX === false || indexX < minX) minX = indexX;
        if (maxX === false || indexX > maxX) maxX = indexX;
        if (minY === false || indexY < minY) minY = indexY;
        if (maxY === false || indexY > maxY) maxY = indexY;

        grid[key] = {};
        grid[key].value = value;
        grid[key].x = indexX;
        grid[key].y = indexY;

    }

    function dump() {
        return grid;
    }

    function rows() {
        // TODO: Return an array of rows?
    }

    function columns() {
        // TODO: Return an array of columns?
    }

    function print(yDown = false) {
        if (yDown) {
            for (let y = minY; y <= maxY; y++) {
                let line = '';
                for (let x = minX; x <= maxX; x++) {
                    //const test = get(x,y)
                    line += get(x, y).value;
                }
                console.log(line);
            }
        } else {
            for (let y = maxY; y >= minY; y--) {
                let line = '';
                for (let x = minX; x <= maxX; x++) {
                    //const test = get(x,y)
                    line += get(x, y).value;
                }
                console.log(line);
            }
        }

        return true;
    }

    return {
        get,
        getAdjacents,
        set,
        grid,
        dump,
        print
    };
};