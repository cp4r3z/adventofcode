var lines = input.split("\n").filter(s => s !== "");

var pairs = lines.map(x => {
    var s = x.split(',');
    var s0s = s[0].split('-');
    var s1s = s[1].split('-');
    return {
        elf0: {
            min: parseInt(s0s[0]),
            max: parseInt(s0s[1])
        },
        elf1: {
            min: parseInt(s1s[0]),
            max: parseInt(s1s[1])
        }
    };
});

part1 = 0;
pairs.forEach(pair => {
    // elf0 in elf1
    if (pair.elf0.max <= pair.elf1.max && pair.elf0.min >= pair.elf1.min) { return part1++; }
    // elf1 in elf0
    if (pair.elf1.max <= pair.elf0.max && pair.elf1.min >= pair.elf0.min) { return part1++; }
});

part2 = 0;
pairs.forEach(pair => {
    // elf0 in elf1
    if (pair.elf0.max <= pair.elf1.max && pair.elf0.min >= pair.elf1.min) { return part2++; }
    // elf1 in elf0
    if (pair.elf1.max <= pair.elf0.max && pair.elf1.min >= pair.elf0.min) { return part2++; }
    // elf0 more than elf1 (but overlap)
    if (pair.elf0.max > pair.elf1.max && pair.elf0.min <= pair.elf1.max) { return part2++; }
    // elf1 more than elf0 (but overlap)
    if (pair.elf1.max > pair.elf0.max && pair.elf1.min <= pair.elf0.max) { return part2++; }
});

document.getElementById("part1-result").innerText = `${part1}`;
document.getElementById("part2-result").innerText = `${part2}`;
