import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../context/GameContext';

export const GameOver = () => {
    const navigate = useNavigate();
    const { walletAddress } = useGameContext();

    // Mock data - in real app, this would come from game state
    const finalScore = localStorage.getItem('base2048_lastScore') || '4096';

    return (
        <div className="bg-background-dark text-white min-h-screen flex flex-col font-display overflow-hidden relative">
            {/* Background Ambience */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-40"></div>
                <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] opacity-30"></div>
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 flex flex-col h-full max-w-md mx-auto w-full px-6 pt-6 pb-8 justify-between flex-grow">
                {/* Top Bar */}
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Live</span>
                    </div>
                    <div className="flex items-center gap-2 bg-surface-dark/80 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-sm">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-400 to-primary flex items-center justify-center text-[10px] font-bold text-white">
                            0x
                        </div>
                        <span className="text-sm font-medium text-slate-200">{walletAddress}</span>
                    </div>
                </div>

                {/* Central Score Display */}
                <div className="flex flex-col items-center justify-center mt-8 mb-4">
                    <h1 className="text-5xl font-bold text-white tracking-tight uppercase mb-2 drop-shadow-lg">Game Over</h1>
                    <div className="relative mt-8 mb-8 group">
                        {/* Glowing backdrop */}
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
                        <div className="relative flex flex-col items-center">
                            <span className="text-sm text-primary font-bold tracking-[0.2em] uppercase mb-2">Final Score</span>
                            <span className="text-7xl font-bold text-white tracking-tighter">{finalScore}</span>
                            {/* Token Reward Badge */}
                            <div className="mt-4 flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full">
                                <span className="material-symbols-outlined text-primary text-sm">token</span>
                                <span className="text-sm font-bold text-primary">+32 $BASE</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Leaderboard Card */}
                <div className="flex-grow flex flex-col justify-center">
                    <div className="glass-panel rounded-2xl p-5 w-full shadow-2xl shadow-black/20">
                        <div className="flex justify-between items-center mb-4 px-2">
                            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider">Top Players</h3>
                            <span
                                onClick={() => navigate('/leaderboard')}
                                className="text-xs text-primary font-medium cursor-pointer hover:text-white transition-colors"
                            >
                                View All
                            </span>
                        </div>
                        <div className="space-y-3">
                            {/* Rank 1 (Current User) */}
                            <div className="flex items-center justify-between p-3 bg-primary/10 border border-primary/30 rounded-xl relative overflow-hidden group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 flex items-center justify-center bg-primary text-white font-bold rounded-lg shadow-lg shadow-primary/20 text-sm">1</div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-bold text-sm">You</span>
                                        <span className="text-xs text-primary/80">{walletAddress}</span>
                                    </div>
                                </div>
                                <span className="text-xl font-bold text-white">{finalScore}</span>
                            </div>

                            {/* Rank 2 */}
                            <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors border border-transparent hover:border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 flex items-center justify-center bg-surface-dark text-slate-400 font-bold rounded-lg border border-white/5 text-sm">2</div>
                                    <div className="flex flex-col">
                                        <span className="text-slate-300 font-medium text-sm">based_god</span>
                                        <span className="text-xs text-slate-500">0xbd...cc</span>
                                    </div>
                                </div>
                                <span className="text-lg font-bold text-slate-400">2,048</span>
                            </div>

                            {/* Rank 3 */}
                            <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors border border-transparent hover:border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 flex items-center justify-center bg-surface-dark text-slate-500 font-bold rounded-lg border border-white/5 text-sm">3</div>
                                    <div className="flex flex-col">
                                        <span className="text-slate-300 font-medium text-sm">cryptopunk</span>
                                        <span className="text-xs text-slate-500">0x12...99</span>
                                    </div>
                                </div>
                                <span className="text-lg font-bold text-slate-500">1,024</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 space-y-3">
                    <button
                        onClick={() => navigate('/game')}
                        className="w-full bg-primary hover:bg-blue-600 active:scale-[0.98] transition-all duration-200 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-primary/25 flex items-center justify-center gap-2 group relative overflow-hidden"
                    >
                        <span className="material-symbols-outlined group-hover:rotate-180 transition-transform duration-500">replay</span>
                        Play Again
                    </button>
                    <button className="w-full bg-surface-dark hover:bg-surface-dark/80 border border-white/10 active:scale-[0.98] transition-all text-white font-medium py-4 rounded-xl flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-sm text-slate-400">ios_share</span>
                        Share Score
                    </button>
                </div>

                {/* Footer Note */}
                <div className="mt-6 text-center">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Powered by Base Network</p>
                </div>
            </div>
        </div>
    );
};
