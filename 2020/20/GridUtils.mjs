// TODO: Make this into a more generic module for reuse

function createEmpty2DArray(original2DArray) {
    const dim1Size = original2DArray.length;
    const dim2Size = original2DArray[0].length;
    return new Array(dim1Size).fill(0).map(() => new Array(dim2Size));

}

export default {
    // Must be a square array
    Rotate90CW(square2DArray) {

        const newArraySize = square2DArray.length;
        const newArraySizeMaxIndex = newArraySize - 1;
        let newArray = createEmpty2DArray(square2DArray);

        for (let i = 0; i <= newArraySizeMaxIndex; i++) {
            for (let j = 0; j <= newArraySizeMaxIndex; j++) {
                const item = square2DArray[i][j];
                newArray[j][newArraySizeMaxIndex - i] = item;
            }
        }
        return newArray;
    },

    FlipH(square2DArray) {

        const newArraySize = square2DArray.length;
        const newArraySizeMaxIndex = newArraySize - 1;
        let newArray = createEmpty2DArray(square2DArray);

        for (let i = 0; i <= newArraySizeMaxIndex; i++) {
            for (let j = 0; j <= newArraySizeMaxIndex; j++) {
                newArray[i][newArraySizeMaxIndex - j] = square2DArray[i][j];
            }
        }

        return newArray;
    },

    FlipV(square2DArray) {

        const newArraySize = square2DArray.length;
        const newArraySizeMaxIndex = newArraySize - 1;
        let newArray = createEmpty2DArray(square2DArray);

        for (let i = newArraySizeMaxIndex; i >= 0; i--) {
            const newRow = square2DArray[i]; // Start from last row and push it
            newArray[newArraySizeMaxIndex - i] = newRow;
        }

        return newArray;
    }
}

