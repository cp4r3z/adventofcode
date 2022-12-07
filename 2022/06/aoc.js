class Marker {
    constructor(numDistinct) {
        this.N = numDistinct;
        this.Position = 0;
        this.str = '';
    }
    Add(s) {
        this.Position++;
        this.str += s;
        if (this.str.length > this.N) {
            this.str = this.str.substring(1);
        }
    }
    Found() {
        if (this.Position < this.N) { return false; }
        // aww, I forgot how much I love Sets!
        return (new Set(this.str.split(''))).size === this.N;
    }
}

var m4 = new Marker(4);
var m14 = new Marker(14);

part1 = undefined;
for (var i = 0; i < input.length; i++) {
    m4.Add(input[i])
    if (m4.Found()) {
        part1 = m4.Position;
        break;
    }
}

part2 = undefined;
for (var i = 0; i < input.length; i++) {
    m14.Add(input[i])
    if (m14.Found()) {
        part2 = m14.Position;
        break;
    }
}

document.getElementById("part1-result").innerText = `${part1}`;
document.getElementById("part2-result").innerText = `${part2}`;
