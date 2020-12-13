import Orientation from '../../common/orientation.mjs';

// Describe each quadrant by the sign of each coordinate
const QUADRANTS = [
    { x: 1, y: 1 },
    { x: -1, y: 1 },
    { x: -1, y: -1 },
    { x: 1, y: -1 }
];

const OrientationInstance = new Orientation();

class Waypoint {

    constructor() {
        this.position = { x: 10, y: 1 }; // Hard coding the start point
    }

    move(command) {
        const move = OrientationInstance.convertCardinalTo2D(command.action);
        this.position.x += move.x * command.value;
        this.position.y += move.y * command.value;
    }

    rotate(action) {
        // find the quadrant
        const coorSignX = Math.sign(this.position.x) || 1; // remember 0...
        const coorSignY = Math.sign(this.position.y) || 1; // remember 0...
        let positionQuadrantIndex;

        for (let index = 0; index < QUADRANTS.length; index++) {
            const quadrant = QUADRANTS[index];
            if (coorSignX === quadrant.x && coorSignY === quadrant.y) {
                positionQuadrantIndex = index;
                break;
            }
        }

        let positionQuadrantIndexNext;

        switch (action) {
            case 'L':
                positionQuadrantIndexNext = positionQuadrantIndex + 1;
                if (positionQuadrantIndexNext > 3) positionQuadrantIndexNext = 0;
                break;
            case 'R':
                positionQuadrantIndexNext = positionQuadrantIndex - 1;
                if (positionQuadrantIndexNext < 0) positionQuadrantIndexNext = 3;
                break;
            default:
                throw new Error('Invalid turn direction. Use R or L');
        }

        // now swap x and y and apply quadrant signs
        this.position = {
            x: parseInt(Math.abs(this.position.y) * QUADRANTS[positionQuadrantIndexNext].x, 10),
            y: parseInt(Math.abs(this.position.x) * QUADRANTS[positionQuadrantIndexNext].y, 10),
        };

    }
}

export default Waypoint;