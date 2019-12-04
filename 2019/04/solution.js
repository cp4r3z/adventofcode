const range = {min: 246515, max: 739105};

let passwords = [];
let passwords2 = [];

// Quick and dirty
for (let pw = range.min; pw <= range.max; pw++) {
    if (check(pw)) passwords.push(pw);
    if (check(pw,true)) passwords2.push(pw);
}

console.log(`Part 1: ${passwords.length} passwords`);
console.log(`Part 2: ${passwords2.length} passwords`);

function check(pw,triplesNotAllowed) {
    //if (pw < range.min || pw > range.max) return false;
    const pwArray = Array.from(String(pw), Number);
    if (pwArray.length !== 6) return false;
    let doubleFound = false;
    for (let i = 1; i < pwArray.length; i++) {
        if (pwArray[i - 1] > pwArray[i]) return false;
        if (!doubleFound) {
            if (triplesNotAllowed){
                if (i === 1) {
                    doubleFound = pwArray[i - 1] === pwArray[i] && pwArray[i] !== pwArray[i + 1];
                } else if (i == pwArray.length - 1) {
                    doubleFound = pwArray[i - 1] === pwArray[i] && pwArray[i] !== pwArray[i - 2];
                } else {
                    doubleFound = pwArray[i - 1] === pwArray[i] && pwArray[i] !== pwArray[i - 2] && pwArray[i] !== pwArray[i + 1];
                }
            } else {
                doubleFound = pwArray[i - 1] === pwArray[i];
            }
        }
    }
    return doubleFound;
}