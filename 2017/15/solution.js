// let genA = 634,
//     genB = 301,
let genA = 65,
    genB = 8921,
    count = 0,
    iterations = 0;
const fA = 16807,
    fB = 48271,
    dv = 2147483647;

let judgeA, judgeB;
let cA = 0,
    cB = 0;
while (cA <= 5e6 || cB <= 5e6) {
    const a = ((genA * fA) % dv),
        b = ((genB * fB) % dv);


    //console.log(binA == binB);
    if (a % 4 === 0 || b % 8 === 0) {
        // console.log(a);
        // console.log(b);
        if (a % 4 === 0) {
            judgeA = a.toString(2).slice(-16);
            cA++;
        }
        if (b % 8 === 0) {
            judgeB = b.toString(2).slice(-16);
            cB++;
        }
        if (judgeA == judgeB && cA==cB) count++;
    }

    genA = a;
    genB = b;
    if (cA >= iterations) {
        console.log(`Iteration ${cA}... Count: ${count}`);
        iterations += 1e6;
    }
}
console.log(`Final Count: ${count}`)
