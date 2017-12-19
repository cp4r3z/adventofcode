const _ = require('underscore');
let input = [206, 63, 255, 131, 65, 80, 238, 157, 254, 24, 133, 2, 16, 0, 1, 3];
//const input = [3, 4, 1, 5];
let data = _.range(256);
//let data = [0, 1, 2, 3, 4]

function getArraySegment(a, i, l) {
    //take a, double it
    let a2 = a.concat(a);
    return _.first(a2.slice(i), l);
}

function reverseArray(a) {
    let b = [];
    let bi = a.length - 1;
    for (var i = 0; i < a.length; i++) {
        b[bi] = a[i];
        bi--;
    }
    return b;
}

function replaceArraySegment(a, index, sub) {
    let stopAt = index + sub.length
    let ai = index;
    for (var subi = 0; subi < sub.length; subi++) {
        if (ai > a.length - 1) {
            ai = 0
            stopAt -= a.length;
        }
        a[ai] = sub[subi];
        ai++
    }
    return a;
}

function reverse(a, i, l) {
    return replaceArraySegment(a, i, reverseArray(getArraySegment(a, i, l)));
}

function moveIndex(i, n) {
    let newi = i + n;
    while(newi > data.length - 1){
        newi -= data.length;
    }
    return newi;
}

//console.log(reverseArray(getArraySegment(data, 4, 3)));
//console.log(replaceArraySegment(data, 4, reverseArray(getArraySegment(data, 4, 3))));
//console.log(reverse(data, 0, 5));
//console.log(getArraySegment(data,0,5))

let index = 0;
for (var i = 0; i < input.length; i++) {
    let l = input[i];
    data = reverse(data, index, l);
    index = moveIndex(index, l + i);
    //console.log(data);
}

console.log(data[0] * data[1]);

//problem 2

let data2 = _.range(256);
const trailing = [17, 31, 73, 47, 23];

let input2 = [];
let inputascii = input.join(','); //Convert array to a string separated by commas
for (var i = 0; i < inputascii.length; i++) {
    input2[i] = inputascii[i].toString().charCodeAt(0);
}
input2 = input2.concat(trailing);

//console.log(input2.join(','));

let index2 = 0;
let skip2 = 0;

//change to 64
for (var j = 0; j < 64; j++) {
    for (var ii = 0; ii < input2.length; ii++) {
        let l = input2[ii];
        data2 = reverse(data2, index2, l);
        index2 = moveIndex(index2, l + skip2);
        skip2++;
    }
}

let dense = [];
for (var i = 0; i < data2.length;) {
    const reducer = (a, b) => a ^ b;
    let bitwise = getArraySegment(data2, i, 16).reduce(reducer);
    dense.push(bitwise);
    i += 16;
}
//console.log(dense.join(','));
dense = dense.map((a) => a.toString(16));
console.log(dense.join(''));