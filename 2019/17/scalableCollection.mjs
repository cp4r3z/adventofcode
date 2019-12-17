module.exports = function (objInitialState, defaultValue = 0) {
    let collection = Object.assign({}, objInitialState);

    function get(index) {
        if (typeof (collection[index]) !== 'undefined') {
            return collection[index];
        } else {
            // Set it and return that value.
            this.set(index, defaultValue);
            return collection[index];
        }
    }

    function set(index, value) {
        collection[index.toString()] = value;
    }

    function dump() {
        return collection;
    }

    function sliceToArray(startIndex, endIndex) {
        let outArray = [];
        for (let index = startIndex; index <= endIndex; index++) {
            outArray.push(this.get(index));
        }
        return outArray;
    }

    function setFromArray(arr) {
        arr.forEach((value, index) => this.set(index, value));
    }

    return {
        get,
        set,
        setFromArray,
        sliceToArray,
        dump
    };
};