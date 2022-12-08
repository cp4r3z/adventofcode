class Node extends Map {
  constructor(name, filesize = 0) {
    super();
    this.Name = name
    this.FileSize = filesize; // if Filesize is 0 it's a directory
    this.DirSize = 0; // if DirSize is 0 it's a file
    this.Parent = null;
  }
  AddToDirSize(size) {
    this.DirSize += size;
    this.Parent?.AddToDirSize(size);
  }
  Add(node) {
    if (this.FileSize > 0) { console.error('Cannot add to file'); }
    node.Parent = this;
    this.set(node.Name, node);
    this.AddToDirSize(node.FileSize);
    return this.get(node.Name);
  }
  cd(name) {
    if (!name) return this.Parent;
    return this.get(name);
  }
  Traverse() {
    var dirs = Array.from(this)
      .filter(([k, v]) => !v.FileSize) // Only directories
      .map((([k, v]) => this.get(k))); // Map back to the Node
    dirs.forEach(d => {
      const dt = d.Traverse();
      dirs = dirs.concat(dt);
    });
    return dirs;
  }
}

// Part 1

const fs = BuildFileSystem();
let dirs = fs.Traverse();
const part1 = dirs.filter(n => n.DirSize <= 100000).reduce((a, b) => a + b.DirSize, 0);

// Part 2

const used = fs.DirSize;
const available = 70000000 - used;
const needed = 30000000 - available;
const sorted = dirs.sort((an, bn) => an.DirSize - bn.DirSize); // Ascending
let part2 = '';
for (const n of sorted) {
  if (n.DirSize >= needed) {
    part2 = n.DirSize;
    break;
  }
}

function BuildFileSystem() {
  const root = new Node('/');

  const recd = /\$ cd (.+)/;
  const redir = /dir (.+)/;
  const refile = /(\d+) (.+)/;

  let pwd = root;
  for (const line of input.split('\n')) {
    //console.log(line);
    if (line === '$ cd /') {
      pwd = root;
      continue;
    }
    if (line === '$ cd ..') {
      pwd = pwd.cd();
      continue;
    }
    if (line === '$ ls') {
      continue;
    }

    // RegEx
    let found = false;
    found = line.match(recd);
    if (found) {
      const name = found[1];
      pwd = pwd.cd(name);
      continue;
    }
    found = line.match(redir);
    if (found) {
      const name = found[1];
      pwd.Add(new Node(name));
      continue;
    }
    found = line.match(refile);
    if (found) {
      const filesize = parseInt(found[1]);
      const name = found[2];
      pwd.Add(new Node(name, filesize));
      continue;
    }
    console.error(`Failed to Parse ${line}`);
  }

  return root;
}

document.getElementById("part1-result").innerText = `${part1}`;
document.getElementById("part2-result").innerText = `${part2}`;
