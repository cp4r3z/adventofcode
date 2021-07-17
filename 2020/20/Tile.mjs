export default class Tile {

    //enum

    /**
     * flip state (0=original, 1 flipped horizontal, 2 flipped vertical, 3 flipped both)
     * 
     * 0  1
     * 12 21
     * 34 43
     * 
     * 2  3
     * 34 43
     * 12 21
     */

    /**
     * rotation state
     * 
     * 0  1
     * 12 31
     * 34 42
     * 
     * 2  3
     * 43 24
     * 21 13
     */

    // content is a size 10 array of strings. we can split it up on construction
    constructor(id, content) {
        this.Id = parseInt(id);
        this.Content = content.map(line => line.split(''));
        this.State = {
            Flip: 0,
            Rotation: 0
        };

        // TRBL order: Top, Right, Bottom, Left
        const edgeT = content[0];
        let edgeR = '';
        const edgeB = content[9];
        let edgeL = '';

        for (let i = 0; i < 10; i++) {
            // Read top to bottom 
            edgeR += this.Content[i][9];
            edgeL += this.Content[i][0];
        }

        this.Edges = {
            T: edgeT,
            R: edgeR,
            B: edgeB,
            L: edgeL
        };

        // Find all possible edge strings (should be 8 at most)
        this.PossibleEdges = []; // Maybe a set would be better?
        [edgeT, edgeR, edgeB, edgeL].forEach(edge => {
            if (!this.PossibleEdges.includes(edge)) this.PossibleEdges.push(edge);
        });

        this.PossibleEdges
            .forEach(edge => {
                const reversedEdge = edge.split('').reverse().join(''); // poor man's string reverse
                if (!this.PossibleEdges.includes(reversedEdge)) this.PossibleEdges.push(reversedEdge);
            });
        
        this.UniqueEdgeCount = -1; // This can be populated after all other tiles are instantiated
    }

    //getRow by id?

}