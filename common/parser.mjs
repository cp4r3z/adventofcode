import {readFileSync} from 'fs';

function readInputFile(inputFilePath) {
    //return fs.readFileSync(`${__dirname}/${inputFileName}`, 'utf8');
    return readFileSync(inputFilePath, 'utf8');
}

function trimAndSplitBy(inputFilePath, delimiter) {
    return readInputFile(inputFilePath)
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

export const singleLine = {
    commaSeparated: {
        toIntArray(inputFilePath) {
            return trimAndSplitBy(inputFilePath, ',').map(mapToInt);
        }
    },
    notSeparated: {
        toIntArray(inputFilePath) {
            return trimAndSplitBy(inputFilePath, '').map(mapToInt);
        },
        toStrArray(inputFilePath){
            return trimAndSplitBy(inputFilePath, '');
        }
    },
    toString(inputFilePath) {
        return readInputFile(inputFilePath);
    }
};
export const multiLine = {
    toStrArray(inputFilePath) {
        return readInputFile(inputFilePath)
            // Remove whitespace
            .trim()
            // Remove trailing line return
            .replace(/\r?\n$/, "")
            // Split by line return
            .split(/\r?\n/);
    },
    // grid.... ?
    toArrayofStrArrays(inputFilePath) {
        const strArrays = readInputFile(inputFilePath)
            // Remove whitespace
            .trim()
            // Remove trailing line return
            .replace(/\r?\n$/, "")
            // Split by line return
            .split(/\r?\n/);
        return strArrays.map(s => s.split(''));
    },
    toIntArray(inputFilePath) {
        return readInputFile(inputFilePath)
            // Remove whitespace
            .trim()
            // Remove trailing line return
            .replace(/\r?\n$/, "")
            // Split by line return
            .split(/\r?\n/)
            .map(mapToInt);
    },
    doubleNewLineSeparated(inputFilePath) {
        return readInputFile(inputFilePath)
            // Remove trailing line return
            .replace(/\n$/, "")
            // Split by double line feed
            .split(/\n\n/);
    }
};
