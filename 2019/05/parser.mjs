module.exports = {
    singleLine: {
        commaSeparated: {
            toIntArray(input) {
                return input
                // Remove whitespace
                    .trim()
                    // Remove trailing line return
                    .replace(/\n$/, "")
                    // Split by delimiter
                    .split(',')
                    // Convert to integers. See also parseFloat() and Number()
                    .map(s => parseInt(s, 10));
            }
        }
    }
};