function readInputFile(inputFileName) {
    return require('fs').readFileSync(`${__dirname}/${inputFileName}`, 'utf8')
}

module.exports = {
    singleLine: {
        commaSeparated: {
            toIntArray(inputFileName) {
                return readInputFile(inputFileName)
                    // Remove whitespace
                    .trim()
                    // Remove trailing line return
                    .replace(/\n$/, "")
                    // Split by delimiter
                    .split(',')
                    // Convert to integers. See also parseFloat() and Number()
                    .map(s => parseInt(s, 10));
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
