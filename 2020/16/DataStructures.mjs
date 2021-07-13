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

    addVertex(coordinate, active = false) {
        const key = coordinate.toKey();
        let vertex = this.Vertices.get(key);
        if (!vertex) {
            vertex = new Vertex(coordinate, active);
            this.Vertices.set(key, vertex); // Add new Vertex to the graph's map of Vertices

            if (vertex.Active && vertex.AdjacentVertices.length < 26) {
                this.addAdjacentVertices(coordinate);
            }
        }
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
        const sourceVertex = this.addVertex(sourceCoordinate);
        const destinationVertex = this.addVertex(destinationCoordinate);

        sourceVertex.addAdjacent(destinationVertex);
        destinationVertex.addAdjacent(sourceVertex);

        return [sourceVertex, destinationVertex];
    }

    // Performed from graph because adjacent vertices might need to be created
    setVertexActiveState(coordinate, active) {
        const key = coordinate.toKey();
        const vertex = this.Vertices.get(key);
        if (!vertex) throw `No Vertex at ${key}`;

        vertex.Active = active;

        // Logic could be moved down into Vertex, but it then Vertex would need a reference back to Graph.
        if (vertex.Active && vertex.AdjacentVertices.length < 26) {
            this.addAdjacentVertices(coordinate);
        }
    }

    // TODO: Delete! Only use coor.toKey()
    // createKey(x, y, z) {
    //     return `x${x}y${y}z${z}`;
    // }

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

    // ////////TODO! getAdjacentCoordinates!
    // getAdjacentKeys(coordinate) {
    //     const offsets = [-1, 0, 1];
    //     const adjacentKeys = [];
    //     offsets.forEach(ix => {
    //         offsets.forEach(iy => {
    //             offsets.forEach(iz => {
    //                 const [dx, dy, dz] = [coordinate.x + ix, coordinate.y + iy, coordinate.z + iz];
    //                 if (dx === coordinate.x && dy === coordinate.y && dz === coordinate.z) return;
    //                 adjacentKeys.push(this.createKey(dx, dy, dz));
    //             });
    //         });
    //     });
    //     return adjacentKeys;
    // }

    createCoor(key) {
        //TODO ?
    }
    //TODO
    // runRule (can this accept a function?)

    // printGraph()
}

export { Coordinate, Vertex, Graph };
