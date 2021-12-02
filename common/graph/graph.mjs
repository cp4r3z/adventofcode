/**
 * Graph
 * @module Graph
 */


/**
 * Charles: Really just a structure that contains...
 * list of nodes (can this be a generic type?)
 * edges connecting the graph nodes (with weight?) - does an edge have direction?
 * 
 */

export default class Graph {
    constructor() {
        this.Vertices = new Map();
        // this.Min = new Coordinate();
        // this.Max = new Coordinate();
    }

    // Add new Vertex to the graph's map of Vertices
    mapVertex(vertex) {
        this.Vertices.set(vertex.Coordinate.toKey(), vertex);

        // Adjust min/max
        ['x', 'y', 'z', 'w'].forEach(dim => {
            if (vertex.Coordinate[dim] < this.Min[dim]) this.Min[dim] = vertex.Coordinate[dim];
            else if (vertex.Coordinate[dim] > this.Max[dim]) this.Max[dim] = vertex.Coordinate[dim];
        });
    }

    getVertex(coordinate) {
        return this.Vertices.get(coordinate.toKey());
    }

   

   
    getGraphExtents() {
        return { min: this.Min, max: this.Max };
    }

    addVertex(coordinate, active = false) {
        let vertex = this.getVertex(coordinate);
        if (!vertex) {
            vertex = new Vertex(coordinate, active);
            this.mapVertex(vertex);
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
        if (vertex.Active && vertex.AdjacentVertices.length < 80) {
            this.addAdjacentVertices(vertex.Coordinate);
        }
    }

    getAdjacentCoordinates(coordinate) {
        const offsets = [-1, 0, 1]; // Vary each dimension to get neighbor coordinates
        const adjacentCoordinates = [];
        
        // TODO: This is understandable, but there's probably a shorter way to do this using recursion.
        offsets.forEach(ix => {
            offsets.forEach(iy => {
                offsets.forEach(iz => {
                    offsets.forEach(iw => {
                        const [dx, dy, dz, dw] = [coordinate.x + ix, coordinate.y + iy, coordinate.z + iz, coordinate.w + iw];
                        if (dx === coordinate.x && dy === coordinate.y && dz === coordinate.z && dw === coordinate.w) return;
                        adjacentCoordinates.push(new Coordinate(dx, dy, dz, dw));
                    });
                });
            });
        });
        return adjacentCoordinates;
    }

    // Executes a callback function with this Graph as a the caller
    runRule(cb) {
        cb.call(this); //func.call(this, arg1, arg2)
        //TODO
        // Return active state ?
    }

    toValueArray() {
        return [...this.Vertices].map(([key, value]) => value);
    }

    // printGraph()
}