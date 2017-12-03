/**
 * http://adventofcode.com/2017/day/3
 */

const data = 289326;

// Initialize "Spiral Storage" Array
let storage = [];

function store(x, y, value) {
    if (storage[x] === undefined) storage[x] = [];
    storage[x][y] = value;
}

function getValue(x, y) {
    if (storage[x] !== undefined) {
        if (storage[x][y] !== undefined) {
            return storage[x][y];
        } else return 0;
    } else return 0;
}

function getSumOfAdjacent(x, y) {
    return [
        getValue(x + 1, y),
        getValue(x - 1, y),
        getValue(x, y + 1),
        getValue(x, y - 1),
        getValue(x + 1, y + 1),
        getValue(x + 1, y - 1),
        getValue(x - 1, y + 1),
        getValue(x - 1, y - 1)
    ].reduce((accumulator, currentValue) => accumulator + currentValue);
}

store(0, 0, 1); // Center value

/**
 * NORTH = 1000 = 8
 * EAST  = 0100 = 4
 * SOUTH = 0010 = 2
 * WEST  = 0001 = 1
 */

// Start facing East
let nesw = 4;

// Start at 0,0
let coor = {
    x: 0,
    y: 0
};

let sideLength = 1;

let currentValue = 1;
while (currentValue <= data) {
    // Do twice
    for (let j = 0; j < 2; j++) {
        for (let k = 0; k < sideLength; k++) {
            if (currentValue > data) {
                console.log('CURRENT POSITION');
                console.log(`Current Value: ${currentValue}`);
                console.log(coor);
                console.log("Steps=" + parseInt(Math.abs(coor.x) + Math.abs(coor.y)));
                break;
            }
            // Move / Update Cartesian Coordinates
            if (nesw == 1) {
                coor.x--;
            } else if (nesw == 2) {
                coor.y--;
            } else if (nesw == 4) {
                coor.x++;
            } else {
                coor.y++;
            }
            // Store new value
            const value = getSumOfAdjacent(coor.x, coor.y)
            store(coor.x, coor.y, value);
            currentValue = value;
        }
        // Turn Left
        if (nesw == 8) {
            nesw = 1;
        } else {
            nesw = nesw << 1;
        }
    }
    sideLength++;
}