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
    constructor(active = false) {
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
        if (this.Vertices.has(key)) {
            return this.Vertices.get(key);
        } else {
            const vertex = new Vertex(active);
            this.Vertices.set(key, vertex);

            return vertex;
            // TODO: IF ACTIVE, create all the neighbors - you can do this recursively here :-)
            // After creating the neighbors, remember to add edges to them.
        }
    }

    addAdjacentVertices(coordinate) {
        const adjacentCoordinates = this.getAdjacentCoordinates(coordinate);
        adjacentCoordinates.forEach(adjacentCoordinate => {
            //this.addVertex(coor, false); // TODO: Is this necessary?
            this.addEdge(coordinate, adjacentCoordinate);
        });

        return adjacentCoordinates; //?
    }

    // "source" and "destination" terms imply direction. This does not matter for an UNDIRECTED edge
    addEdge(sourceCoordinate, destinationCoordinate) {
        const sourceVertex = this.addVertex(sourceCoordinate);
        const destinationVertex = this.addVertex(destinationCoordinate);

        sourceVertex.addAdjacent(destinationVertex);
        destinationVertex.addAdjacent(sourceVertex);

        return [sourceVertex, destinationVertex];
    }

    setVertexActiveState(key, active) {
        //TODO ?
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
