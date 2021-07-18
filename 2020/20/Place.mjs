export default class Place {
    constructor(x, y) {
        this.X = x;
        this.Y = y;
        this.Id = `x${x}y${y}`;

        this.IsEdge = false; // only known by puzzle
        this.IsCorner = false;
        this.Tile = null; //Tile object
        this.PlaceT = null; // ref to place to the top
        this.PlaceR = null;
        this.PlaceB = null;
        this.PlaceL = null;
    }
}