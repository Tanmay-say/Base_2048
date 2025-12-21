import { useState, useEffect, useCallback, useMemo } from 'react';
import { GameManager } from '../game/GameManager';
import { storage } from '../utils/localStorage';
import soundManager from '../utils/soundManager';
import { useGameContext } from '../context/GameContext';

export const useGame = () => {
    const { gridSize } = useGameContext();

    // Initialize from saved game state if it matches current grid size
    const [gameManager, setGameManager] = useState(() => {
        const saved = storage.getGameState();
        if (saved && saved.grid?.size === gridSize) {
            const gm = new GameManager(gridSize);
            gm.loadState(saved);
            return gm;
        }
        return new GameManager(gridSize);
    });
    const [, forceUpdate] = useState(0);

    // Single-step undo snapshot (persisted so it survives navigation / reload)
    const [previousState, setPreviousState] = useState(() => storage.getPreviousGameState());

    // Initialize best score from localStorage
    const [bestScore, setBestScore] = useState(storage.getBestScore());

    // Recreate game manager when grid size changes (preserve state if saved and same size)
    useEffect(() => {
        const saved = storage.getGameState();
        const prev = storage.getPreviousGameState();
        const gm = new GameManager(gridSize);

        if (saved && saved.grid?.size === gridSize) {
            gm.loadState(saved);
        }
        setGameManager(gm);

        // Only keep undo history if it's for the same grid size; otherwise reset it
        if (prev && prev.grid?.size === gridSize) {
            setPreviousState(prev);
        } else {
            setPreviousState(null);
            storage.clearPreviousGameState();
        }

        forceUpdate(prevCount => prevCount + 1);
    }, [gridSize]);

    // Memoized game state
    const gameState = useMemo(() => ({
        grid: gameManager.grid,
        score: gameManager.score,
        gameOver: gameManager.over,
        gameWon: gameManager.won && !gameManager.keepPlaying,
        highestTile: gameManager.highestTile || 0
    }), [gameManager.grid, gameManager.score, gameManager.over, gameManager.won, gameManager.keepPlaying, gameManager.highestTile]);

    // Update best score (local cache)
    useEffect(() => {
        if (gameState.score > bestScore) {
            setBestScore(gameState.score);
            storage.setBestScore(gameState.score);
        }
    }, [gameState.score, bestScore]);

    // Persist last game result when game is over
    useEffect(() => {
        if (gameState.gameOver) {
            try {
                localStorage.setItem('base2048_last_score', String(gameState.score || 0));
                localStorage.setItem('base2048_last_highest_tile', String(gameState.highestTile || 0));
            } catch (e) {
                console.warn('Failed to persist last game result:', e);
            }
        }
    }, [gameState.gameOver, gameState.score, gameState.highestTile]);

    // Persist ongoing game state so leaving/returning resumes the same board
    useEffect(() => {
        try {
            storage.setGameState(gameManager.serialize());
        } catch (e) {
            console.warn('Failed to persist game state:', e);
        }
    }, [gameManager, gameState.score, gameState.gameOver, gameState.highestTile]);

    // Play sounds for game events
    useEffect(() => {
        if (gameState.gameWon) {
            soundManager.play('win');
        } else if (gameState.gameOver) {
            soundManager.play('gameover');
        }
    }, [gameState.gameWon, gameState.gameOver]);

    const move = useCallback((direction) => {
        // Freeze board when game is terminated
        if (gameManager.isGameTerminated && gameManager.isGameTerminated()) {
            return false;
        }

        // Snapshot current state for undo
        const snapshot = gameManager.serialize();
        const moved = gameManager.move(direction);
        if (moved) {
            setPreviousState(snapshot);
            storage.setPreviousGameState(snapshot);
            storage.setGameState(gameManager.serialize());
            forceUpdate(prev => prev + 1);
        }
        return moved;
    }, [gameManager]);

    const restart = useCallback(() => {
        gameManager.restart();
        setPreviousState(null);
        storage.clearPreviousGameState();
        storage.setGameState(gameManager.serialize());
        forceUpdate(prev => prev + 1);
    }, [gameManager]);

    const keepPlaying = useCallback(() => {
        gameManager.continueGame();
        storage.setGameState(gameManager.serialize());
        forceUpdate(prev => prev + 1);
    }, [gameManager]);

    const undo = useCallback(() => {
        if (!previousState) return;
        const gm = new GameManager(gridSize);
        gm.loadState(previousState);
        setGameManager(gm);
        setPreviousState(null);
        storage.clearPreviousGameState();
        storage.setGameState(previousState);
        forceUpdate(prev => prev + 1);
    }, [previousState, gridSize]);

    return {
        grid: gameState.grid,
        score: gameState.score,
        bestScore,
        highestTile: gameState.highestTile,
        gameOver: gameState.gameOver,
        gameWon: gameState.gameWon,
        move,
        restart,
        keepPlaying,
        undo,
        canUndo: !!previousState
    };
};
