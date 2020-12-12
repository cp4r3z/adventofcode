const CARDINALS = ['E', 'S', 'W', 'N'];
const CARDINALS_2D = [
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: -1, y: 0 },
    { x: 0, y: 1 }
];

class Orientation {
    //create an enum?
    static get CARDINALS() {
        return CARDINALS;
    }

    constructor(starting) {
        if (starting) {
            if (!CARDINALS.includes(starting)) throw new Error('Invalid starting orientation');
            this.index = CARDINALS.indexOf(starting);
        } else {
            this.index = 0; // East
        }
    }

    get current() {
        return CARDINALS[this.index];
    }

    to2D() {
        return CARDINALS_2D[this.index];
    }

    turn(direction) {
        switch (direction.toLowerCase()) {
            case 'cw':
                this.index++;
                if (this.index > 3) this.index = 0;
                break;
            case 'ccw':
                this.index--;
                if (this.index < 0) this.index = 3;
                break;
            default:
                throw new Error('Invalid turn direction. Use cw or ccw');
        }

        //TODO: Can you do chaining by returning this?
        return CARDINALS[this.index];
    }
}

export default Orientation;