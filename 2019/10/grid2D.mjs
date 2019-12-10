/**
 * 2D Grid
 * @module grid2D
 */

/** Create a 2D Grid
 * @param {object} objInitialState - The initial state key/value pairs
 * @param {string} defaultValue - The value to assign to undefined keys
 * */
module.exports = function (objInitialState, defaultValue = "") {
    let grid = Object.assign({}, objInitialState);
    let minX = maxX = minY = maxY = false;

    function indexesToKey(indexX, indexY) {
        return `X${indexX}Y${indexY}`
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

    function set(indexX, indexY, value) {
        const key = indexesToKey(indexX, indexY);

        // Keep record of the overall dimensions
        if (this.minX === false || indexX < this.minX) this.minX = indexX;
        if (this.maxX === false || indexX > this.maxX) this.maxX = indexX;
        if (this.minY === false || indexY < this.minY) this.minY = indexY;
        if (this.maxY === false || indexY > this.maxY) this.maxY = indexY;

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

    return {
        get,
        set,
        grid,
        dump
    };
};