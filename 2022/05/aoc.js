class Stack {
    constructor(stackArr) {
        this.stack = stackArr;
    }
    push(crate) {
        this.stack.push(crate); // Returns array length
    }
    pop() {
        return this.stack.pop();
    }
    multiPop(num) {
        var multiPop = this.stack.slice(-num);
        this.stack = this.stack.slice(0,-num);
        return multiPop;
    }
    concat(arr){
        this.stack= this.stack.concat(arr);
    }
}

var lines = input.split("\n").filter(s => s !== "");
var stacks = stacksinput.split("\n").filter(s => s !== "").map(s => new Stack(s.split('')));
var stacks2 = stacksinput.split("\n").filter(s => s !== "").map(s => new Stack(s.split('')));

let re = /move (\d+) from (\d+) to (\d+)/;
lines.forEach(act => {
    var parsed = act.match(re);
    var move = parseInt(parsed[1]);
    var from = parseInt(parsed[2]) - 1;
    var to = parseInt(parsed[3]) - 1;
    for (let i = 0; i < move; i++) {
        const popped = stacks[from].pop();
        stacks[to].push(popped);
    }

    const popped2 = stacks2[from].multiPop(move);
    stacks2[to].concat(popped2);
});

let part1 = "";
stacks.forEach(s=>part1+=s.pop());

let part2 = "";
stacks2.forEach(s=>part2+=s.pop());

document.getElementById("part1-result").innerText = `${part1}`;
document.getElementById("part2-result").innerText = `${part2}`;
