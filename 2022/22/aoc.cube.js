class Coor {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    Add(coor) {
        return new Coor(this.x + coor.x, this.y + coor.y);
    }
}

aoc.edgeTransform = new Map();

aoc.cube = function (size) {

    // size is base 1
    const max = size - 1;

    //const sides = [0, 1, 2, 3]; // R, D, L, U

    // n is the non-directional position along the edge, starting at 0
    const PlaceInPosition = (n, side, flip) => {
        if (flip) {
            n = Flip(n);
        }
        switch (side) {
            case 0:
                //R
                return {
                    position: new Coor(max, n),
                    direction: 2
                };
            case 1:
                //D
                return {
                    position: new Coor(n, max),
                    direction: 3
                };
            case 2:
                //L
                return {
                    position: new Coor(0, n),
                    direction: 0
                };
            case 3:
                //U
                return {
                    position: new Coor(n, 0),
                    direction: 1
                };
            default:
                break;
        }
    };

    const Flip = (n) => {
        return max - n;
    };

    const et = aoc.edgeTransform;

    // And now we're just going to hard-code the shape of our cube,
    // TODO: Generalize this. You work at a 3D software company, man!

    // W,X,Y,Z (top)
    // W,X,Y,Z (sides)
    // W,X,Y,Z (bottom)
    et.set(JSON.stringify({ s: new Coor(1, 0), side: 0 }), { s: new Coor(2, 0), side: 2, flip: false });
    et.set(JSON.stringify({ s: new Coor(1, 0), side: 1 }), { s: new Coor(1, 1), side: 3, flip: false });
    et.set(JSON.stringify({ s: new Coor(1, 0), side: 2 }), { s: new Coor(0, 2), side: 2, flip: true });
    et.set(JSON.stringify({ s: new Coor(1, 0), side: 3 }), { s: new Coor(0, 3), side: 2, flip: false });
    et.set(JSON.stringify({ s: new Coor(0, 2), side: 3 }), { s: new Coor(1, 1), side: 2, flip: false });
    et.set(JSON.stringify({ s: new Coor(1, 1), side: 0 }), { s: new Coor(2, 0), side: 1, flip: false });
    et.set(JSON.stringify({ s: new Coor(2, 0), side: 3 }), { s: new Coor(0, 3), side: 1, flip: false });
    et.set(JSON.stringify({ s: new Coor(0, 3), side: 3 }), { s: new Coor(0, 2), side: 1, flip: false });
    et.set(JSON.stringify({ s: new Coor(1, 2), side: 0 }), { s: new Coor(2, 0), side: 0, flip: true });
    et.set(JSON.stringify({ s: new Coor(1, 2), side: 3 }), { s: new Coor(1, 1), side: 1, flip: false });
    et.set(JSON.stringify({ s: new Coor(1, 2), side: 2 }), { s: new Coor(0, 2), side: 0, flip: false });
    et.set(JSON.stringify({ s: new Coor(1, 2), side: 1 }), { s: new Coor(0, 3), side: 0, flip: false });

    function addReverseTransform([k, v]) {
        const kp = JSON.parse(k);
        const newKey = JSON.stringify({
            s: v.s,
            side: v.side
        });
        const newValue = {
            s: kp.s,
            side: kp.side,
            flip: v.flip
        };
        et.set(newKey, newValue);
    }

    [...et].forEach(addReverseTransform);

    return {
        PlaceInPosition
    };
};