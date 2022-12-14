/**
 * Nodes contain an array of children nodes.
 * Nodes have a single value on the leaves.
 */
class Node {
    constructor() { // Pass in the parent node?
        this.value = null; // TODO: Is this ok?
        this.children = [];
    }

    Initialize(strInput) {
        // Leaf
        if (strInput === '') {
            return; // Keep value as default
        }

        if (strInput.match(/^([\d+])$/)) {
            // A leaf with a value. Just a number (no commas)            
            this.value = ~~strInput;
            return;
        }

        // Branches
        const innerText = GetInnerText(strInput);

        if (innerText) {
            // [1, 2, [3]]    
            var child = new Node();
            child.Initialize(innerText);
            this.children.push(child);
            return;
        }

        // 1, 2, [3] 
        const childrenStrings = SplitTopLevel(strInput); // strInput.split(',');
        this.children = childrenStrings.map(s => {
            var child = new Node();
            child.Initialize(s);
            return child;
        });
    }
}

function SplitTopLevel(strInput) {
    let splits = [];
    let sub = '';
    let level = 0;
    for (let i = 0; i < strInput.length; i++) {
        const char = strInput[i];
        if (char === ',' && level === 0) {
            splits.push(sub);
            sub = '';
            continue;
        }
        if (char === "[") { level++; }
        if (char === "]") { level--; }
        sub += char;
    }
    splits.push(sub);
    return splits;
}

// Input [[1],[2,3,4]]
// Output [1],[2,3,4]
function GetInnerText(strInput) {
    const re = /^\[(.*)\]$/;

    const match = strInput.match(re);

    if (!match) {
        return "";
    }

    let arr = strInput.split(''); // probably don't have to do this

    let level = 0;
    let hasOuterBrackets = true;
    for (let i = 0; i < arr.length; i++) {
        const char = arr[i];
        if (char === "[") { level++; }
        if (char === "]") { level--; }
        if (i < arr.length - 1 && level === 0) {
            hasOuterBrackets = false;
        }
    }
    if (level !== 0 || !hasOuterBrackets) {
        return "";
    }

    return match[1];
}

// Setup

function Setup() {

    // Parse Input
    const pairs = aoc.inputt
        .split("\n\n")
        .map(pair => {
            const pairArray = pair.split("\n");

            var left = new Node();
            left.Initialize(pairArray[0]);

            var right = new Node();
            right.Initialize(pairArray[1]);

            const test = {
                left, right
            };

            return test;
        });
    return pairs;
}

function CompareNodes(lr) {

    var correctOrder = true;

    while (correctOrder) {
        if (lr.left.value){
            if (lr.right.value){
                return lr.left.value <= lr.right.value;
            } else {
              correctOrder=  CompareNodes({left:lr.left,right:lr.right.children[0]}); //cannot be right
            }

        }
        else{
            for (let i = 0; i < lr.left.children.length; i++) {
                correctOrder = CompareNodes({left:lr.left.children[i],right:lr.right});
    
            }
        }

        

       
        // left should always have fewer elements


    }
    return correctOrder;

    // return a bool (true if in right order)

}

aoc.pairs = Setup();
var test = aoc.pairs.map(pair=> CompareNodes(pair));

document.getElementById("part1-result").innerText = `${aoc.part1}`;
document.getElementById("part2-result").innerText = `${aoc.part2}`;
