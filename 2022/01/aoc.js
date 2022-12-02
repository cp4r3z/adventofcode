var lines = input.split("\n");
var most = [0, 0, 0]; // 0 = 1st, 1 = 2nd, 2 = 3rd
var total = 0;

for (let index = 0; index < lines.length; index++) {

    const number = parseInt(lines[index]);

    if (Number.isNaN(number)) {
        total = 0;
        continue;
    }

    total += number;

    if (total > most[0]) {
        most.splice(0, 0, total);
        most.pop();
    }
    else if (total > most[1]) {
        most.splice(1, 0, total);
        most.pop();
    }
    else if (total > most[2]) {
        most.splice(2, 0, total);
        most.pop();
    }
}

document.getElementById("part1-result").innerText = `${most[0]}`;
document.getElementById("part2-result").innerText = `${most.reduce((a, b) => a + b, 0)}`;