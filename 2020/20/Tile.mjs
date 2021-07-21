import { default as GU } from "./GridUtils.mjs";
export default class Tile {
    // content is a size 10 array of strings. we can split it up on construction
    constructor(id, content) {
        this.Id = parseInt(id);
        this.Content = content.map(line => line.split(''));
        this.Edges = this.getEdgesFromContent(this.Content);
        this.State = {
            Flip: 0,
            Rotation: 0
        };

        // Find all possible edge strings (should be 8 at most)
        this.PossibleEdges = []; // Maybe a set would be better?
        [this.Edges.T, this.Edges.R, this.Edges.B, this.Edges.L].forEach(edge => {
            if (!this.PossibleEdges.includes(edge)) this.PossibleEdges.push(edge);
        });

        this.PossibleEdges
            .forEach(edge => {
                const reversedEdge = edge.split('').reverse().join(''); // poor man's string reverse
                if (!this.PossibleEdges.includes(reversedEdge)) this.PossibleEdges.push(reversedEdge);
            });

        this.UniqueEdgeCount = -1; // This can be populated after all other tiles are instantiated

        this.StateContentMap = new Map();
        this.StateContentMap.set(this.createStateKey(), {
            Edges: this.Edges,
            Content: this.Content
        });

        this.PotentialAdjacentTiles = new Set();
        this.IsEdge = false; // or this could be derived from "UniqueEdgeCount"
        this.IsCorner = false; // or this could be derived from "UniqueEdgeCount"
    }

    createStateKey(state = { Flip: 0, Rotation: 0 }) {
        return `F${state.Flip}R${state.Rotation}`;
    }

    getEdgesFromContent(content) {
        // TRBL order: Top, Right, Bottom, Left
        const edgeT = content[0].join('');
        let edgeR = '';
        const edgeB = content[9].join('');
        let edgeL = '';

        for (let i = 0; i < 10; i++) {
            // Read top to bottom 
            edgeR += content[i][9];
            edgeL += content[i][0];
        }

        return {
            T: edgeT,
            R: edgeR,
            B: edgeB,
            L: edgeL
        };
    }

    // takes a state object
    setState(state = { Flip: 0, Rotation: 0 }) {
        // checks
        const newState = state;
        if (newState.Flip > 3) {
            console.warn('bad Flip');
            newState.Flip = 0;
        }
        if (newState.Rotation > 3) {
            console.warn('bad Rotation');
            newState.Rotation = 0;
        }

        this.State = newState;

        const storedStateContent = this.StateContentMap.get(this.createStateKey(newState));
        if (storedStateContent) {
            // Load stored content
            this.Content = storedStateContent.Content;
            this.Edges = storedStateContent.Edges;
        } else {
            // Determine new content
            // Reset the content to original state if changes are being made
            if (state.Rotation > 0 || state.Flip > 0) {
                this.Content = this.StateContentMap.get(this.createStateKey()).Content; // TODO: Why is this working?
            }

            this._doRotation(state);
            this._doFlips(state);

            // update edges
            this.Edges = this.getEdgesFromContent(this.Content);

            // store content
            //this.printContent();
            this.StateContentMap.set(this.createStateKey(this.State), {
                Edges: this.Edges,
                Content: this.Content
            });
        }
    }

    // Note: In Node 14, we can use private prefix # 
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields#browser_compatibility

    _doRotation(state) {
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

        for (let x = 0; x < state.Rotation; x++) {
            // TODO: Maybe the individual rotations could be stored? Remember flips haven't been performed yet.
            this.Content = GU.Rotate90CW(this.Content);
        }
    }

    _doFlips(state) {
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

        switch (state.Flip) {
            case 1:
                this.Content = GU.FlipH(this.Content);
                break;
            case 2:
                this.Content = GU.FlipV(this.Content);
                break;
            case 3:
                this.Content = GU.FlipH(this.Content);
                this.Content = GU.FlipV(this.Content);
                break;
            default:
                break;
        }
    }

    //getRow by id?
    printContent() {
        console.log('');
        for (let i = 0; i < this.Content.length; i++) {
            const row = this.Content[i];
            console.log(row.join(''));
        }
    }
}