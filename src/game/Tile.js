// Tile class - represents a single tile in the game
export class Tile {
    constructor(position, value) {
        this.x = position.x;
        this.y = position.y;
        this.value = value || 2;

        this.previousPosition = null;
        this.mergedFrom = null; // Tiles this tile was merged from
    }

    savePosition() {
        this.previousPosition = { x: this.x, y: this.y };
    }

    updatePosition(position) {
        this.x = position.x;
        this.y = position.y;
    }

    serialize() {
        return {
            position: {
                x: this.x,
                y: this.y
            },
            value: this.value
        };
    }
}
