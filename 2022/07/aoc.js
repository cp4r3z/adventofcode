class NodeArr extends Array {
  constructor(...items) {
    super(...items);
  }
}

//var sn = new Node();
//var n = new Node(sn);

class Node extends Map {
  constructor(name, filesize = 0) {
    super(); // Necessary?
    this.Name = name
    this.FileSize = filesize; // if _filesize is 0 it's a directory?
    this.Parent = null;
  }
  Add(node) {
    node.Parent = this;
    this.set(node.Name, node);
    return this.get(node.Name);
  }
  cd(name) {
    if (!name) return this.Parent;
    return this.get(name);
  }
}

const root = new Node('/');

const recd = /\$ cd (.+)/;
const redir = /dir (.+)/;
const refile = /(\d+) (.+)/;

let pwd = root;
for (const line of input.split('\n')) {
  console.log(line);
  if (line === '$ cd /') {
    pwd = root;
    continue;
  }
  if (line === '$ cd ..') {
    pwd = pwd.cd();
    continue;
  }
  if (line === '$ ls') {
    //console.log('what do we do?');
    continue;
  }
  // RegEx
  let found = false;
  found = line.match(recd);
  if (found) {
    //console.log('cd something');
    const name = found[1];
    pwd = pwd.cd(name);
    continue;
  }
  found = line.match(redir);
  if (found) {
    //console.log('dir');
    const name = found[1];
    pwd.Add(new Node(name));
    continue;
  }
  found = line.match(refile);
  if (found) {
    //console.log('file');
    const filesize = parseInt(found[1]);
    const name = found[2];
    pwd.Add(new Node(name, filesize));
    continue;
  }
  console.error(`Failed to Parse ${line}`);
}

document.getElementById("part1-result").innerText = `${part1}`;
//document.getElementById("part2-result").innerText = `${part2}`;
