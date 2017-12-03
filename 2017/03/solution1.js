/**
 * http://adventofcode.com/2017/day/3
 */

/**
 * NORTH = 1000 = 8
 * EAST  = 0100 = 4
 * SOUTH = 0010 = 2
 * WEST  = 0001 = 1
 */

// Start facing East
var nesw = 4;

// Start at 0,0
var coor = {
    x: 0,
    y: 0
};

const data = 289326;
let sideLength = 1;

// Spiral Pattern
// 1,1,2,2,3,3,4,4,5

let i = 1;
while (i <= data) {
    // Do twice
    for (let j = 0; j < 2; j++) {
        for (let k = 0; k < sideLength; k++) {
            if (i == data) {
                console.log("i=" + i);
                console.log(coor);
                console.log("Steps=" + parseInt(Math.abs(coor.x) + Math.abs(coor.y)));
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
            i++; // End of turn
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