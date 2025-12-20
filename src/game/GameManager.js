import { Grid } from './Grid';
import { Tile } from './Tile';

// GameManager class - core game logic
export class GameManager {
    constructor(size = 4) {
        this.size = size;
        this.startTiles = 2;

        this.grid = new Grid(this.size);
        this.score = 0;
        this.over = false;
        this.won = false;
        this.keepPlaying = false;

        this.addStartTiles();
    }

    // Restart the game
    restart() {
        this.grid = new Grid(this.size);
        this.score = 0;
        this.over = false;
        this.won = false;
        this.keepPlaying = false;
        this.addStartTiles();
    }

    // Keep playing after winning
    continueGame() {
        this.keepPlaying = true;
    }

    // Check if game is terminated
    isGameTerminated() {
        return this.over || (this.won && !this.keepPlaying);
    }

    // Add initial tiles
    addStartTiles() {
        for (let i = 0; i < this.startTiles; i++) {
            this.addRandomTile();
        }
    }

    // Add a random tile (2 or 4)
    addRandomTile() {
        if (this.grid.cellsAvailable()) {
            const value = Math.random() < 0.9 ? 2 : 4;
            const tile = new Tile(this.grid.randomAvailableCell(), value);
            this.grid.insertTile(tile);
            return tile;
        }
    }

    // Save tile positions and remove merger info
    prepareTiles() {
        this.grid.eachCell((x, y, tile) => {
            if (tile) {
                tile.mergedFrom = null;
                tile.savePosition();
            }
        });
    }

    // Move a tile
    moveTile(tile, cell) {
        this.grid.cells[tile.x][tile.y] = null;
        this.grid.cells[cell.x][cell.y] = tile;
        tile.updatePosition(cell);
    }

    // Move tiles in the specified direction
    move(direction) {
        // 0: up, 1: right, 2: down, 3: left
        if (this.isGameTerminated()) return false;

        const vector = this.getVector(direction);
        const traversals = this.buildTraversals(vector);
        let moved = false;

        this.prepareTiles();

        // Traverse the grid in the right direction and move tiles
        traversals.x.forEach((x) => {
            traversals.y.forEach((y) => {
                const cell = { x, y };
                const tile = this.grid.cellContent(cell);

                if (tile) {
                    const positions = this.findFarthestPosition(cell, vector);
                    const next = this.grid.cellContent(positions.next);

                    // Only one merger per row traversal
                    if (next && next.value === tile.value && !next.mergedFrom) {
                        const merged = new Tile(positions.next, tile.value * 2);
                        merged.mergedFrom = [tile, next];

                        this.grid.insertTile(merged);
                        this.grid.removeTile(tile);

                        tile.updatePosition(positions.next);

                        // Update score
                        this.score += merged.value;

                        // Check for win
                        if (merged.value === 2048) this.won = true;
                    } else {
                        this.moveTile(tile, positions.farthest);
                    }

                    if (!this.positionsEqual(cell, tile)) {
                        moved = true;
                    }
                }
            });
        });

        if (moved) {
            this.addRandomTile();

            if (!this.movesAvailable()) {
                this.over = true;
            }
        }

        return moved;
    }

    // Get the vector representing the chosen direction
    getVector(direction) {
        const map = {
            0: { x: 0, y: -1 }, // Up
            1: { x: 1, y: 0 },  // Right
            2: { x: 0, y: 1 },  // Down
            3: { x: -1, y: 0 }  // Left
        };
        return map[direction];
    }

    // Build a list of positions to traverse in the right order
    buildTraversals(vector) {
        const traversals = { x: [], y: [] };

        for (let pos = 0; pos < this.size; pos++) {
            traversals.x.push(pos);
            traversals.y.push(pos);
        }

        // Always traverse from the farthest cell in the chosen direction
        if (vector.x === 1) traversals.x = traversals.x.reverse();
        if (vector.y === 1) traversals.y = traversals.y.reverse();

        return traversals;
    }

    // Find the farthest position in the vector direction
    findFarthestPosition(cell, vector) {
        let previous;

        do {
            previous = cell;
            cell = { x: previous.x + vector.x, y: previous.y + vector.y };
        } while (this.grid.withinBounds(cell) && this.grid.cellAvailable(cell));

        return {
            farthest: previous,
            next: cell
        };
    }

    // Check if any moves are available
    movesAvailable() {
        return this.grid.cellsAvailable() || this.tileMatchesAvailable();
    }

    // Check for available matches between tiles
    tileMatchesAvailable() {
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                const tile = this.grid.cellContent({ x, y });

                if (tile) {
                    for (let direction = 0; direction < 4; direction++) {
                        const vector = this.getVector(direction);
                        const cell = { x: x + vector.x, y: y + vector.y };
                        const other = this.grid.cellContent(cell);

                        if (other && other.value === tile.value) {
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    }

    // Check if two positions are equal
    positionsEqual(first, second) {
        return first.x === second.x && first.y === second.y;
    }

    // Serialize game state
    serialize() {
        return {
            grid: this.grid.serialize(),
            score: this.score,
            over: this.over,
            won: this.won,
            keepPlaying: this.keepPlaying
        };
    }

    // Load from serialized state
    loadState(state) {
        this.grid = new Grid(this.size, state.grid.cells);
        this.score = state.score;
        this.over = state.over;
        this.won = state.won;
        this.keepPlaying = state.keepPlaying;
    }
}
