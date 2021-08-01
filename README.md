# adventofcode
http://adventofcode.com solutions
## Visualizations
### 3D Cellular Automaton
[2020/17/index.md](2020/17/index.md)
## Interesting Patterns
### Hex Coordinates
[2020/24/HexCoordinates](2020/24/HexCoordinates.png)
### Extending the native map
[2020/20/Puzzle.mjs](2020/20/Puzzle.mjs)
```
export default class Puzzle extends Map {
    constructor(tiles) {
        super();
        this.Tiles = tiles;
        ...
    }
```