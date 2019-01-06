/**
 * https://adventofcode.com/2018/day13
 */

const _ = require('underscore'); // Not used

// Read input into simple array
const trackWithCarts = require('fs').readFileSync('input.txt', 'utf8').split('\n').map(row => row.split(''));
const track = require('fs').readFileSync('input_track.txt', 'utf8').split('\n').map(row => row.split(''));

const trackLengthY = trackWithCarts.length;
const trackLengthX = trackWithCarts[0].length; // Assumes rectangular track input

let carts = []; // x,y pos, x,y vel, lastIntAct (l,r,s)

// Find carts
for (var y = 0; y < trackLengthY; y++) {
    for (var x = 0; x < trackLengthX; x++) {
        switch (trackWithCarts[y][x]) {
            case '<':
                carts.push({ x, y, vx: -1, vy: 0, lastIntAct: 'r' });
                break;
            case '>':
                carts.push({ x, y, vx: 1, vy: 0, lastIntAct: 'r' });
                break;
            case 'v':
                carts.push({ x, y, vx: 0, vy: 1, lastIntAct: 'r' });
                break;
            case '^':
                carts.push({ x, y, vx: 0, vy: -1, lastIntAct: 'r' });
                break;
        }
    }
}

const heading = {
    rt: _cart => _cart.vx == 1 && _cart.vy == 0,
    lt: _cart => _cart.vx == -1 && _cart.vy == 0,
    up: _cart => _cart.vx == 0 && _cart.vy == -1,
    dn: _cart => _cart.vx == 0 && _cart.vy == 1
};

const go = {
    rt: _cart => {
        _cart.vx = 1;
        _cart.vy = 0;
        _cart.x++;
    },
    lt: _cart => {
        _cart.vx = -1;
        _cart.vy = 0;
        _cart.x--;
    },
    up: _cart => {
        _cart.vx = 0;
        _cart.vy = -1;
        _cart.y--;
    },
    dn: _cart => {
        _cart.vx = 0;
        _cart.vy = 1;
        _cart.y++;
    }
}

let crash = isCrash();

while (carts.length > 1) {
    carts.sort((a, b) => {
        if (a.y > b.y) return 1;
        else if (a.y == b.y) {
            return a.x - b.x;
        }
        else return -1;
    });
    carts.forEach(cart => {
        // can be at a turn, intersection, or straighaway
        const trackChar = track[cart.y][cart.x]
        if (trackChar == '-') {
            if (heading.rt(cart)) go.rt(cart);
            else if (heading.lt(cart)) go.lt(cart);
            else console.log('Disoriented');
        }
        else if (trackChar == '|') {
            if (heading.up(cart)) go.up(cart);
            else if (heading.dn(cart)) go.dn(cart);
            else console.log('Disoriented');
        }
        else if (trackChar == '\\') {
            if (heading.rt(cart)) go.dn(cart);
            else if (heading.lt(cart)) go.up(cart);
            else if (heading.up(cart)) go.lt(cart);
            else if (heading.dn(cart)) go.rt(cart);
            else console.log('Disoriented');
        }
        else if (trackChar == '/') {
            if (heading.rt(cart)) go.up(cart);
            else if (heading.lt(cart)) go.dn(cart);
            else if (heading.up(cart)) go.rt(cart);
            else if (heading.dn(cart)) go.lt(cart);
            else console.log('Disoriented');
        }
        else if (trackChar == '+') {
            if (cart.lastIntAct == 'l') cart.lastIntAct = 's';
            else if (cart.lastIntAct == 's') cart.lastIntAct = 'r';
            else if (cart.lastIntAct == 'r') cart.lastIntAct = 'l';

            if (heading.rt(cart)) {
                if (cart.lastIntAct == 'l') go.up(cart);
                else if (cart.lastIntAct == 's') go.rt(cart);
                else if (cart.lastIntAct == 'r') go.dn(cart);
            }
            else if (heading.lt(cart)) {
                if (cart.lastIntAct == 'l') go.dn(cart);
                else if (cart.lastIntAct == 's') go.lt(cart);
                else if (cart.lastIntAct == 'r') go.up(cart);
            }
            else if (heading.up(cart)) {
                if (cart.lastIntAct == 'l') go.lt(cart);
                else if (cart.lastIntAct == 's') go.up(cart);
                else if (cart.lastIntAct == 'r') go.rt(cart);
            }
            else if (heading.dn(cart)) {
                if (cart.lastIntAct == 'l') go.rt(cart);
                else if (cart.lastIntAct == 's') go.dn(cart);
                else if (cart.lastIntAct == 'r') go.lt(cart);
            }
            else console.log('Disoriented');
        }
        isCrash();
    });
}

console.log(`Solution 2: Last Cart is at ${carts[0].x},${carts[0].y}`);

//32,8

function isCrash() {
    let crash = false;
    carts.forEach((cartA, iA) => {
        carts.forEach((cartB, iB) => {
            if (iA != iB && cartA.x == cartB.x && cartA.y == cartB.y) {
                crash = { x: cartA.x, y: cartA.y };
            }
        })
    });
    carts = _.reject(carts, cart => (cart.x == crash.x && cart.y == crash.y))
    return crash;
}

// End Process (gracefully)
process.exit(0);
