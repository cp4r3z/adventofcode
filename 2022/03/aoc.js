var lines = input.split("\n").filter(s => s !== "");

var halved = lines.map(l => {
    var size = l.length / 2;
    var s1 = l.substr(0, size);
    var s2 = l.substr(size);

    let common = s1.split('').filter(x => s2.split('').includes(x))[0];

    var score = common.charCodeAt(0) - 96;
    if (score <= 0) { score += (32 +26); }

    return [s1, s2, common, score];
});

var part1 = halved.reduce((a, b) => a + b[3], 0);

var elfGroups = [];

var elf=0;
var elfGroup=[];
for (let i = 0; i < lines.length; i++) {    
    const element = lines[i];
    elfGroup.push(element);
    elf++;
    
    if (elf===3)    {
        // Find commons
        let common = elfGroup[0].split('')
        .filter(x => elfGroup[1].split('').includes(x))
        .filter(y => elfGroup[2].split('').includes(y))
        [0];
        
        var score = common.charCodeAt(0) - 96;
        if (score <= 0) { score += (32 +26); }

        elfGroups.push(score);
        elfGroup=[];
        elf=0;
    }        
}

var part2 = elfGroups.reduce((a,b)=>a+b,0);

document.getElementById("part1-result").innerText = `${part1}`;
document.getElementById("part2-result").innerText = `${part2}`;
