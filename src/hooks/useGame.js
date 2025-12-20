import { useState, useEffect, useCallback } from 'react';
import { GameManager } from '../game/GameManager';

const STORAGE_KEY = 'base2048_gameState';
const BEST_SCORE_KEY = 'base2048_bestScore';

// Custom hook for game logic
export const useGame = () => {
    const [gameManager, setGameManager] = useState(null);
    const [grid, setGrid] = useState(null);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [newTile, setNewTile] = useState(null);

    // Initialize game
    useEffect(() => {
        const savedBestScore = localStorage.getItem(BEST_SCORE_KEY);
        if (savedBestScore) {
            setBestScore(parseInt(savedBestScore, 10));
        }

        const savedState = localStorage.getItem(STORAGE_KEY);
        const gm = new GameManager(4);

        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                gm.loadState(state);
            } catch (e) {
                console.error('Failed to load saved game:', e);
            }
        }

        setGameManager(gm);
        updateState(gm);
    }, []);

    // Update state from game manager
    const updateState = useCallback((gm) => {
        setGrid(gm.grid.serialize());
        setScore(gm.score);
        setGameOver(gm.over);
        setGameWon(gm.won && !gm.keepPlaying);

        // Update best score
        if (gm.score > bestScore) {
            setBestScore(gm.score);
            localStorage.setItem(BEST_SCORE_KEY, gm.score.toString());
        }

        // Save game state
        if (!gm.over) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(gm.serialize()));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [bestScore]);

    // Move tiles
    const move = useCallback((direction) => {
        if (!gameManager) return;

        const moved = gameManager.move(direction);
        if (moved) {
            updateState(gameManager);
        }
    }, [gameManager, updateState]);

    // Restart game
    const restart = useCallback(() => {
        if (!gameManager) return;

        gameManager.restart();
        updateState(gameManager);
    }, [gameManager, updateState]);

    // Continue after winning
    const keepPlaying = useCallback(() => {
        if (!gameManager) return;

        gameManager.continueGame();
        updateState(gameManager);
    }, [gameManager, updateState]);

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!gameManager || gameManager.isGameTerminated()) return;

            const keyMap = {
                'ArrowUp': 0,
                'ArrowRight': 1,
                'ArrowDown': 2,
                'ArrowLeft': 3,
                'w': 0,
                'd': 1,
                's': 2,
                'a': 3,
            };

            const direction = keyMap[event.key];
            if (direction !== undefined) {
                event.preventDefault();
                move(direction);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameManager, move]);

    return {
        grid,
        score,
        bestScore,
        gameOver,
        gameWon,
        move,
        restart,
        keepPlaying,
        newTile
    };
};
