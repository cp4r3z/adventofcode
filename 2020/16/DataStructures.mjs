// class Graph {
//     // defining vertex array and
//     // adjacent list
//     constructor(noOfVertices)
//     {
//         this.noOfVertices = noOfVertices;
//         this.AdjList = new Map();
//     }

//     // functions to be implemented

//     // addVertex(v)
//     // addEdge(v, w)
//     // printGraph()

//     // bfs(v)
//     // dfs(v)
// }

// todo: exports

class Coordinate {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    toKey() {
        return `x${this.x}y${this.y}z${this.z}`;
    }
}

class Vertex {
    constructor(coordinate, active = false) {
        this.Coordinate = coordinate; // Coordinate object
        this.AdjacentVertices = []; // Neighbors
        this.Active = active; // bool
    }

    addAdjacent(vertex) {
        if (this.AdjacentVertices.some(v => v.Coordinate.toKey() === vertex.Coordinate.toKey())) return; // What if it's already in the array?
        this.AdjacentVertices.push(vertex);
    }

    //TODO: maybe just delete this setter and assign directly.
    // set Active(active) {
    //     this.Active = !!active;
    //     // IF ACTIVE is true, we should create all the neighbors. Done with Graph though.
    //     // maybe return the adjacentVertices length? that can be easily done from the graph though.
    // }

    runRule() {
        //TODO
        // Pass in function for rule?
        // Return active state
    }

    //TODO
    //getAdjacents ?
    //removeAdjacent ?
}

class Graph {
    constructor() {
        this.Vertices = new Map();
    }

    getVertex(coordinate) {
        return this.Vertices.get(coordinate.toKey());
    }

    addVertex(coordinate, active = false) {
        let vertex = this.getVertex(coordinate);
        if (!vertex) {
            vertex = new Vertex(coordinate, active);
            this.Vertices.set(coordinate.toKey(), vertex); // Add new Vertex to the graph's map of Vertices
        }

        // This has to be done because "adjacent vertices" can be created as inactive before the vertices are initiated
        if (active) this.setVertexActiveState(vertex, active); // This must be done after the vertex is actually added
        return vertex; // This is an existing or new vertex
    }

    addAdjacentVertices(coordinate) {
        const adjacentCoordinates = this.getAdjacentCoordinates(coordinate);
        adjacentCoordinates.forEach(adjacentCoordinate => {
            this.addEdge(coordinate, adjacentCoordinate);
        });

        return adjacentCoordinates; // Not used
    }

    // "source" and "destination" terms imply direction. This does not matter for an UNDIRECTED edge
    addEdge(sourceCoordinate, destinationCoordinate) {
        const sourceVertex = this.getVertex(sourceCoordinate);
        if (!sourceVertex) throw `sourceVertex not found at ${sourceCoordinate.toKey()}`;
        const destinationVertex = this.getVertex(destinationCoordinate) || this.addVertex(destinationCoordinate);

        sourceVertex.addAdjacent(destinationVertex);
        destinationVertex.addAdjacent(sourceVertex);

        return [sourceVertex, destinationVertex];
    }

    // Performed from graph because adjacent vertices might need to be created
    setVertexActiveState(vertex, active) {
        vertex.Active = active;

        // Logic could be moved down into Vertex, but it then Vertex would need a reference back to Graph.
        if (vertex.Active && vertex.AdjacentVertices.length < 26) {
            this.addAdjacentVertices(vertex.Coordinate);
        }
    }

    getAdjacentCoordinates(coordinate) {
        const offsets = [-1, 0, 1];
        const adjacentCoordinates = [];
        offsets.forEach(ix => {
            offsets.forEach(iy => {
                offsets.forEach(iz => {
                    const [dx, dy, dz] = [coordinate.x + ix, coordinate.y + iy, coordinate.z + iz];
                    if (dx === coordinate.x && dy === coordinate.y && dz === coordinate.z) return;
                    adjacentCoordinates.push(new Coordinate(dx, dy, dz));
                });
            });
        });
        return adjacentCoordinates;
    }

    createCoor(key) {
        //TODO ?
    }
    //TODO
    // runRule (can this accept a function?)

    // printGraph()
}

export { Coordinate, Vertex, Graph };
