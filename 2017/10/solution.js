const _ = require('underscore');
const input = [206, 63, 255, 131, 65, 80, 238, 157, 254, 24, 133, 2, 16, 0, 1, 3];
//const input = [3, 4, 1, 5];
let data = _.range(256);
//let data = [0, 1, 2, 3, 4]

console.log(data);

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
    if (newi > data.length - 1) {
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
let inputascii = input.join(',');
for (var i = 0; i < inputascii.length; i++) {
    input2[i] = inputascii[i].toString().charCodeAt(0);
}
input2 = input2.concat(trailing);

console.log(input2.join(','));

let index2 = 0;
let skip2 = 0;

//change to 64
for (var i = 0; i < 1; i++) {
    for (var i = 0; i < input2.length; i++) {
        let l = input2[i];
        data2 = reverse(data2, index2, skip2);
        index2 = moveIndex(index2, skip2);
        skip2 = input2[i];
        //console.log(data);
    }
}
console.log(data2.length);
console.log(data2.join(','));

let dense = [];
for (var i = 0; i < data2.length; i+16) {
    let bitwise = getArraySegment(data2,i,16).reduce((a,b)=>a^b);
    dense.push(bitwise);
    
}
console.log(dense.join(','));