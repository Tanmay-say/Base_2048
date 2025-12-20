import React from 'react';
import { Tile } from './Tile';

export const GameGrid = ({ grid }) => {
    if (!grid || !grid.cells) return null;

    // Flatten tiles for rendering
    const tiles = [];
    grid.cells.forEach((row, x) => {
        row.forEach((cell, y) => {
            if (cell) {
                tiles.push({
                    ...cell,
                    position: cell.position,
                    key: `${cell.position.x}-${cell.position.y}-${cell.value}`,
                });
            }
        });
    });

    return (
        <div className="relative w-full aspect-square max-w-[360px] bg-surface-dark rounded-2xl p-3 shadow-2xl border border-[#394256]/50 backdrop-blur-sm">
            {/* Empty grid cells */}
            <div className="grid grid-cols-4 grid-rows-4 gap-3 w-full h-full">
                {Array.from({ length: 16 }).map((_, i) => (
                    <div
                        key={i}
                        className="rounded-lg bg-tile-empty flex items-center justify-center shadow-inner-light"
                    ></div>
                ))}
            </div>

            {/* Tiles */}
            <div className="absolute inset-3">
                {tiles.map((tile) => (
                    <Tile
                        key={tile.key}
                        value={tile.value}
                        position={tile.position}
                    />
                ))}
            </div>
        </div>
    );
};
