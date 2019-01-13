/**
 * https://adventofcode.com/2018/day22
 */

const _ = require('underscore'); // Not used?

// const depth = 11109;
// const target = { x: 9, y: 731 };

const depth = 510;
const target = { x: 10, y: 10 };

const caveBleed = 5; // extra cave to draw in case you need to move around an obstacle
let cave = Array(target.y + 1 + caveBleed).fill(0).map(y => (Array(target.x + 1 + caveBleed).fill(0)));

for (var y = 0; y < cave.length; y++) {
    for (var x = 0; x < cave[0].length; x++) {
        cave[y][x] = { erosionLevel: erosionLevel(x, y) };
        cave[y][x].type = cave[y][x].erosionLevel % 3;
    }
}

//logCave();

//console.log(`Solution 1: Risk = ${getRisk()}`);

//now... maybe a new object...
// key: x0y0, x10y10 etc...
// props: x, y, type?, array of surrounding tiles
let caveObj = {};

for (var y = 0; y < cave.length; y++) {
    for (var x = 0; x < cave[0].length; x++) {
        const key = `x${x}y${y}`;
        let adj = [];
        if (x > 0) adj.push(`x${x-1}y${y}`); // left
        if (y > 0) adj.push(`x${x}y${y-1}`); // up?
        if (y < cave.length - 1) adj.push(`x${x}y${y+1}`); // down?
        if (x < cave[0].length - 1) adj.push(`x${x+1}y${y}`); //right
        let isTarget = false;
        if (x == target.x && y == target.y) isTarget = true;
        const type = cave[y][x].type;
        const props = { x, y, adj, type, isTarget };

        caveObj[key] = props;
    }
}

// equip can be T=torch, C=climbing gear, N=neither

const testMove = getOptions('x0y0', 'T');

// Start with worst case scenario
let bestTime = (target.x + target.y) * 8;

let routes = [{
    distanceToTarget: target.x + target.y,
    route: ['x0y0'],
    equip: 'T',
    time: 0,
    atTarget: false // todo: maybe we don't actually have to track this. Just delete em.
}];

let foundSolution = false;
let start = true;

const breadth = 40; // To adjust breadth vs depth searching

while (start || (!foundSolution && routes.length > 1)) {
    if (start) start = false;
    // generate a bunch of routes
    // start by sorting by distanceToTarget in ASCENDING order
    routes.sort((ra, rb) => rb.distanceToTarget - ra.distanceToTarget);
    // get the breadth of the closest.
    const closest = _.last(routes, breadth);
    let newRoutes = [];
    // now add all the adjacent routes
    // TODO: NO NO NO, this needs to be done in a for loop because I need the index
    //for (let rIndex = routes.length - breadth; rIndex < routes.length; rIndex++) {
    // const r = routes[rIndex];
    //}
    closest.forEach(r => {
        //get the last of the keys
        const lastKey = r.route[r.route.length - 1];
        const options = getOptions(lastKey, r.equip);
        options.forEach(o => {
            // If we're never been to this key before...
            if (r.route.indexOf(o.key) < 0) {
                const route = r.route.concat([o.key]);
                const time = r.time + o.time;
                const equip = o.equip;
                const distanceToTarget = Math.abs(target.x - caveObj[o.key].x) + Math.abs(target.y - caveObj[o.key].y);
                //console.log(distanceToTarget);
                const atTarget = distanceToTarget == 0; // todo: maybe this isn't necessary. just use distance to target
                // Push new route if we're not there yet and we're under time.
                if (!atTarget && time < bestTime) {
                    newRoutes.push({
                        atTarget,
                        distanceToTarget,
                        equip,
                        route,
                        time
                    });
                }
                // If we're at the target, test to see if we beat our time.
                if (atTarget && time < bestTime) {
                    bestTime = time;
                    console.log(`New Best Time! ${bestTime}`);
                }
            }

        })
        // now delete the original route and add the new options. or maybe delete closest out of this loop...
        // maybe mark for deletion...
        r.deleteMe = true;
        routes = routes.concat(newRoutes);
        //debugger;
    })
    // ALSO, filter out all routes with higher times than the best
    routes = _.filter(routes, r => !r.deleteMe && r.time < bestTime);
    //debugger;


    //TODO: Delete all routes that are longer than bestTime

}

//moving from tile to tile...

// input = caveObj key 1, caveObj key 2, current equip
// output = array of possible keys, equips and times

function getOptions(_keyFrom, _equip) {
    let options = [];
    caveObj[_keyFrom].adj.forEach(key => {
        if (key.x == target.x && key.y == target.y) {
            foundSolution = true;
            options.push({ key, time: _equip == 'T' ? 1 : 8, equip: 'T' });
        }
        else if (caveObj[key].type == 0) {
            // In rocky regions, you can use the climbing gear or the torch.
            if (_equip == 'N') {
                options.push({ key, time: 8, equip: 'C' });
                options.push({ key, time: 8, equip: 'T' });
            }
            else if (_equip == 'C' || _equip == 'T') options.push({ key, time: 1, equip: _equip });
            else console.log('getOptions: badType.0');
        }
        else if (caveObj[key].type == 1) {
            // In wet regions, you can use the climbing gear or neither tool.
            if (_equip == 'T') {
                options.push({ key, time: 8, equip: 'C' });
                options.push({ key, time: 8, equip: 'N' });
            }
            else if (_equip == 'C' || _equip == 'N') options.push({ key, time: 1, equip: _equip });
            else console.log('getOptions: badType.1');
        }
        else if (caveObj[key].type == 2) {
            // In narrow regions, you can use the torch or neither tool.
            if (_equip == 'C') {
                options.push({ key, time: 8, equip: 'N' });
                options.push({ key, time: 8, equip: 'T' });
            }
            else if (_equip == 'N' || _equip == 'T') options.push({ key, time: 1, equip: _equip });
            else console.log('getOptions: badType.2');
        }
        else console.log('getOptions: should not happen');
    })
    return options;
}

function getRisk() {
    let risk = 0;
    for (var y = 0; y <= target.y; y++) {
        for (var x = 0; x <= target.x; x++) {
            risk += cave[y][x].type;
        }
    }
    return risk;
}

function logCave() {
    for (var y = 0; y < cave.length; y++) {
        const ascii = cave[y].map((x, xi) => {
            if (xi == 0 && y == 0) return 'M';
            if (xi == target.x && y == target.y) return 'T';
            //rocky as ., wet as =, narrow as |
            if (x.type == 0) return '.' // rocky
            if (x.type == 1) return '=' // wet
            if (x.type == 2) return '|' // narrow
        });
        console.log(ascii.join(''));
    }
}

function erosionLevel(x, y, a) {
    // The region at 0,0 (the mouth of the cave) has a geologic index of 0.
    // The region at the coordinates of the target has a geologic index of 0.
    // If the region's Y coordinate is 0, the geologic index is its X coordinate times 16807.
    // If the region's X coordinate is 0, the geologic index is its Y coordinate times 48271.
    // Otherwise, the region's geologic index is the result of multiplying the erosion levels of the regions at X-1,Y and X,Y-1.

    if (x == 0 && y == 0) return eLevel(0);
    if (x == target.x && y == target.y) return eLevel(0);
    if (y == 0) return eLevel(x * 16807);
    if (x == 0) return eLevel(y * 48271);
    // Else
    return eLevel(cave[y - 1][x].erosionLevel * cave[y][x - 1].erosionLevel);

    function eLevel(_gIndex) {
        //A region's erosion level is its geologic index plus the cave system's depth, all modulo 20183. 
        return (_gIndex + depth) % 20183;
    }
}

// .=.|=.|.|=.|=|=.
// .|=|=|||..|.=...
// .==|....||=..|==
// =.|....|.==.|==.
// =|..==...=.|==..
// =||.=.=||=|=..|=
// |.=.===|||..=..|
// |..==||=.|==|===
// .=..===..=|.|||.
// .======|||=|=.|=
// .===|=|===T===||
// =|||...|==..|=.|
// =.=|=.=..=.||==|
// ||=|=...|==.=|==
// |=.=||===.|||===
// ||.|==.|.|.||=||


// End Process (gracefully)
process.exit(0);
