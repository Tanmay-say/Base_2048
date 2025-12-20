import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameGrid } from '../components/GameGrid';
import { useGame } from '../hooks/useGame';
import { useSwipe } from '../hooks/useSwipe';
import { useGameContext } from '../context/GameContext';

export const MainGame = () => {
    const navigate = useNavigate();
    const { walletConnected, walletAddressShort, connectWallet } = useGameContext();
    const { grid, score, bestScore, gameOver, gameWon, move, restart, keepPlaying, undo, canUndo } = useGame();
    const swipeHandlers = useSwipe(move);

    // Navigate to game over screen when game ends
    useEffect(() => {
        if (gameOver) {
            setTimeout(() => navigate('/game-over'), 500);
        }
    }, [gameOver, navigate]);

    return (
        <div className="relative flex h-screen w-full flex-col max-w-md mx-auto bg-background-dark">
            {/* Ambient Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[80px]"></div>
                <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
            </div>

            {/* Header */}
            <header className="relative z-10 flex items-start justify-between px-6 pt-12 pb-4 w-full">
                <div className="flex flex-col gap-1">
                    <div className="flex gap-4">
                        <div className="flex flex-col">
                            <span className="text-[#9aa5bc] text-xs font-bold tracking-widest uppercase mb-1">Score</span>
                            <span className="text-white text-3xl font-bold leading-none tracking-tight">{score.toLocaleString()}</span>
                        </div>
                        <div className="flex flex-col pl-4 border-l border-[#394256]">
                            <span className="text-[#9aa5bc] text-xs font-bold tracking-widest uppercase mb-1">Best</span>
                            <span className="text-[#9aa5bc] text-xl font-bold leading-none tracking-tight">{bestScore.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Wallet Status */}
                {walletConnected ? (
                    <div className="flex h-9 items-center justify-center gap-x-2 rounded-full bg-[#1e2636] border border-[#394256] pl-2 pr-3 shadow-lg">
                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[#9aa5bc] text-[16px]">wallet</span>
                            <p className="text-white text-xs font-bold tracking-wide">{walletAddressShort}</p>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={connectWallet}
                        className="flex h-9 items-center justify-center gap-x-2 rounded-full bg-primary/10 border border-primary/30 px-3 shadow-lg hover:bg-primary/20 transition-colors"
                    >
                        <span className="material-symbols-outlined text-primary text-[16px]">wallet</span>
                        <p className="text-primary text-xs font-bold tracking-wide">Connect</p>
                    </button>
                )}
            </header>

            {/* Main Game Area */}
            <main
                className="relative z-10 flex-1 flex flex-col justify-center items-center px-4 w-full mb-10"
                {...swipeHandlers}
            >
                <div className="w-full max-w-[360px] flex justify-end gap-3 mb-4 pr-1">
                    <button
                        onClick={() => navigate('/how-to-play')}
                        className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#1e2636] border border-[#394256] text-[#9aa5bc] hover:text-white hover:bg-[#2a3449] active:scale-95 transition-all duration-150 shadow-lg group"
                    >
                        <span className="material-symbols-outlined text-[24px]">info</span>
                    </button>
                    <button
                        onClick={undo}
                        disabled={!canUndo}
                        className={`flex items-center justify-center w-12 h-12 rounded-xl bg-[#1e2636] border border-[#394256] active:scale-95 transition-all duration-150 shadow-lg group ${canUndo ? 'text-[#9aa5bc] hover:text-white hover:bg-[#2a3449] cursor-pointer' : 'text-[#394256] cursor-not-allowed opacity-50'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[24px] group-hover:-rotate-90 transition-transform duration-300">undo</span>
                    </button>
                </div>

                <GameGrid grid={grid} />

                <p className="mt-6 text-[#5b6882] text-sm font-medium tracking-wide">
                    Join the numbers to get to <span className="text-primary font-bold">2048</span>
                </p>

                {/* Win Message */}
                {gameWon && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-surface-dark p-8 rounded-2xl border border-primary/30 text-center">
                            <h2 className="text-3xl font-bold text-white mb-4">You Win!</h2>
                            <button
                                onClick={keepPlaying}
                                className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold"
                            >
                                Keep Playing
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="relative z-10 px-6 pb-8 w-full">
                <div className="glass-panel rounded-2xl p-2 flex items-center justify-between gap-3 shadow-2xl">
                    <div className="flex gap-1 pl-1">
                        <button
                            onClick={() => navigate('/profile')}
                            className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors text-[#9aa5bc] hover:text-white"
                        >
                            <span className="material-symbols-outlined text-[24px]">person</span>
                        </button>
                        <button
                            onClick={() => navigate('/leaderboard')}
                            className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors text-[#9aa5bc] hover:text-white"
                        >
                            <span className="material-symbols-outlined text-[24px]">leaderboard</span>
                        </button>
                        <button
                            onClick={() => navigate('/settings')}
                            className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors text-[#9aa5bc] hover:text-white"
                        >
                            <span className="material-symbols-outlined text-[24px]">settings</span>
                        </button>
                    </div>
                    <button
                        onClick={restart}
                        className="flex-1 h-14 bg-primary hover:bg-blue-600 active:scale-95 transition-all duration-150 rounded-xl flex items-center justify-center gap-2 shadow-glow-blue relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <span className="material-symbols-outlined text-white font-bold">add_circle</span>
                        <span className="text-white font-bold tracking-wider text-base">NEW GAME</span>
                    </button>
                </div>
                <div className="mt-6 flex justify-center items-center gap-2 opacity-60">
                    <span className="text-xs text-[#5b6882] font-medium tracking-widest uppercase">Powered by BASE</span>
                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,81,255,0.8)]"></div>
                </div>
            </footer>
        </div>
    );
};
