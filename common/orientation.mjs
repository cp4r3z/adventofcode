const CARDINALS = ['E', 'S', 'W', 'N'];

class Orientation {
    //create an enum?
    static get CARDINALS() {
        return CARDINALS;
    }

    constructor() {
        //if (!['N', 'S', 'E', 'W'].includes(starting)) throw new Error('Invalid starting orientation');
        this.index = 0; // East
    }

    get current() {
        return CARDINALS[this.index];
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
        return this.CARDINALS[this.index];
    }
}

export default Orientation;