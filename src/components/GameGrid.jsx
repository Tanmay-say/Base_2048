import React from 'react';
import { Tile } from './Tile';

export const GameGrid = ({ grid }) => {
    if (!grid || !grid.cells) return null;

    const size = grid.size;

    // Flatten tiles for rendering
    const tiles = [];
    grid.cells.forEach((row, x) => {
        row.forEach((cell, y) => {
            if (cell) {
                tiles.push({
                    ...cell,
                    position: cell,
                    key: `${cell.x}-${cell.y}-${cell.value}`,
                });
            }
        });
    });

    return (
        <div className="relative w-full aspect-square max-w-[min(90vw,400px)] bg-surface-dark rounded-2xl p-2.5 shadow-2xl border border-[#394256]/50 backdrop-blur-sm">
            {/* Empty grid cells */}
            <div 
                className="grid gap-2 w-full h-full"
                style={{
                    gridTemplateColumns: `repeat(${size}, 1fr)`,
                    gridTemplateRows: `repeat(${size}, 1fr)`
                }}
            >
                {Array.from({ length: size * size }).map((_, i) => (
                    <div
                        key={i}
                        className="rounded-lg bg-tile-empty flex items-center justify-center shadow-inner-light"
                    ></div>
                ))}
            </div>

            {/* Tiles */}
            <div className="absolute inset-[0.625rem]">
                {tiles.map((tile) => (
                    <Tile
                        key={tile.key}
                        value={tile.value}
                        position={tile.position}
                        gridSize={size}
                    />
                ))}
            </div>
        </div>
    );
};
