/**
 * NORTH = 1000 = 8
 * EAST  = 0100 = 4
 * SOUTH = 0010 = 2
 * WEST  = 0001 = 1
 */

// Start facing North
var nesw = 8;

// Start at 0,0
var coor = {
    x: 0,
    y: 0
};

const input = "R4, R5, L5, L5, L3, R2, R1, R1, L5, R5, R2, L1, L3, L4, R3, L1, L1, R2, R3, R3, R1, L3, L5, R3, R1, L1, R1, R2, L1, L4, L5, R4, R2, L192, R5, L2, R53, R1, L5, R73, R5, L5, R186, L3, L2, R1, R3, L3, L3, R1, L4, L2, R3, L5, R4, R3, R1, L1, R5, R2, R1, R1, R1, R3, R2, L1, R5, R1, L5, R2, L2, L4, R3, L1, R4, L5, R4, R3, L5, L3, R4, R2, L5, L5, R2, R3, R5, R4, R2, R1, L1, L5, L2, L3, L4, L5, L4, L5, L1, R3, R4, R5, R3, L5, L4, L3, L1, L4, R2, R5, R5, R4, L2, L4, R3, R1, L2, R5, L5, R1, R1, L1, L5, L5, L2, L1, R5, R2, L4, L1, R4, R3, L3, R1, R5, L1, L4, R2, L3, R5, R3, R1, L3";

var inputArray = input.split(", ");
inputArray.forEach(function(direction) {
    var turnRight = direction.slice(0, 1) == "R";
    var distance = parseInt(direction.slice(1));
    //console.log(turn);
    console.log(distance);

    if (nesw == 1 && turnRight) {
        nesw = 8;
    } else if (nesw == 8 && !turnRight) {
        nesw = 1;
    } else {
        nesw = turnRight ? nesw >> 1 : nesw << 1;
    }

    if (nesw == 1) {
        coor.x -= distance;
    } else if (nesw == 2) {
        coor.y -= distance;
    } else if (nesw == 4) {
        coor.x += distance;
    } else {
        coor.y += distance;
    }

    console.log(coor);
    console.log(Math.abs(coor.x) + Math.abs(coor.y));

});

//console.log(nesw);