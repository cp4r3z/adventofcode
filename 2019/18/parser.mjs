function readInputFile(inputFileName) {
    return require('fs').readFileSync(`${__dirname}/${inputFileName}`, 'utf8');
}

function trimAndSplitBy(inputFileName, delimiter) {
    return readInputFile(inputFileName)
        // Remove whitespace
        .trim()
        // Remove trailing line return
        .replace(/\n$/, "")
        // Split by delimiter
        .split(delimiter);
}

function mapToInt(s) {
    // Convert to integers. See also parseFloat() and Number()
    return parseInt(s, 10);
}

module.exports = {
    singleLine: {
        commaSeparated: {
            toIntArray(inputFileName) {
                return trimAndSplitBy(inputFileName, ',').map(mapToInt);
            }
        },
        notSeparated: {
            toIntArray(inputFileName) {
                return trimAndSplitBy(inputFileName, '').map(mapToInt);
            }
        },
        toString(inputFileName) {
            return readInputFile(inputFileName);
        }
    },
    multiLine: {
        toStrArray(inputFileName) {
            return readInputFile(inputFileName)
                // Remove whitespace
                .trim()
                // Remove trailing line return
                .replace(/\r?\n$/, "")
                // Split by line return
                .split(/\r?\n/)
        }
    }
};
