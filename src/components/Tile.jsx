import React from 'react';

const getTileColor = (value) => {
    const colors = {
        2: 'bg-[#283245]',
        4: 'bg-[#32405c]',
        8: 'bg-primary/30 shadow-glow-blue border-primary/20',
        16: 'bg-primary/50 shadow-glow-blue border-primary/30',
        32: 'bg-primary/70 shadow-glow-blue border-primary/40',
        64: 'tile-glass shadow-glow-strong',
        128: 'tile-glass shadow-glow-strong',
        256: 'tile-glass shadow-glow-strong',
        512: 'tile-glass shadow-glow-strong',
        1024: 'tile-glass shadow-glow-strong',
        2048: 'tile-glass shadow-glow-strong',
    };
    return colors[value] || 'tile-glass shadow-glow-strong';
};

const getTileSize = (value) => {
    if (value >= 1000) return 'text-2xl';
    if (value >= 100) return 'text-3xl';
    return 'text-3xl';
};

export const Tile = ({ value, position }) => {
    const tileColor = getTileColor(value);
    const tileSize = getTileSize(value);

    // Calculate position based on grid layout
    // Grid has 4 columns/rows with gap-2 (0.5rem = 8px)
    // Each cell is 25% width minus gap
    const cellSize = 'calc((100% - 1.5rem) / 4)'; // (100% - 3 gaps * 0.5rem) / 4 cells
    const gapSize = '0.5rem';

    return (
        <div
            className={`
        absolute rounded-lg flex items-center justify-center
        border border-white/5 backdrop-blur-sm
        transition-all duration-100 ease-in-out
        ${tileColor} ${tileSize}
      `}
            style={{
                width: cellSize,
                height: cellSize,
                left: `calc(${position.y} * (${cellSize} + ${gapSize}))`,
                top: `calc(${position.x} * (${cellSize} + ${gapSize}))`,
            }}
        >
            {value >= 8 && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 rounded-lg"></div>
            )}
            <span className="text-white font-bold relative z-10">{value}</span>
        </div>
    );
};
