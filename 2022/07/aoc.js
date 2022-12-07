class NodeArr extends Array {
    constructor(...items) {
        super(...items);
    }    
}

//var sn = new Node();
//var n = new Node(sn);

class Node extends Map {
    constructor() {
        // Not necessary?
        super();        
      }
}

var sn = new Node();
var n = new Node();
n.set("sn",sn);

document.getElementById("part1-result").innerText = `${part1}`;
//document.getElementById("part2-result").innerText = `${part2}`;
