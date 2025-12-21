import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../context/GameContext';
import { useProfile } from '../hooks/useProfile';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useGame } from '../hooks/useGame';

export const GameOver = () => {
    const navigate = useNavigate();
    const { walletAddress, walletConnected, walletAddressShort } = useGameContext();
    const { profile, updateStats } = useProfile(walletAddress);
    const { leaderboard, submitScore } = useLeaderboard('global', 3);
    const { score, bestScore, highestTile } = useGame();
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Get final score from localStorage or game context
    const finalScore = score || parseInt(localStorage.getItem('base2048_lastScore')) || 0;
    const finalHighestTile = highestTile || parseInt(localStorage.getItem('base2048_highestTile')) || 0;
    // Get best score from localStorage - this is the user's all-time high score
    const finalBestScore = bestScore || parseInt(localStorage.getItem('base2048_bestScore')) || 0;

    console.log('GameOver initialized:', { finalScore, finalBestScore, finalHighestTile });

    useEffect(() => {
        // Submit score when component mounts (only once)
        console.log('=== GAMEOV ER MOUNTED ===');
        console.log('GameOver useEffect:', { walletConnected, walletAddress, submitted, finalScore });

        if (!walletConnected) {
            console.warn('CANNOT SUBMIT - Wallet not connected');
            return;
        }

        if (!walletAddress) {
            console.warn('CANNOT SUBMIT - No wallet address');
            return;
        }

        if (submitted) {
            console.log('SKIPPING - Already submitted');
            return;
        }

        if (finalScore <= 0) {
            console.warn('CANNOT SUBMIT - Invalid score:', finalScore);
            return;
        }

        console.log('✅ ALL CHECKS PASSED - Calling handleScoreSubmission...');
        handleScoreSubmission();
    }, [walletConnected, walletAddress, submitted]);

    const handleScoreSubmission = async () => {
        console.log('=== HANDLE SCORE SUBMISSION ===');
        console.log('Wallet Connected:', walletConnected);
        console.log('Wallet Address:', walletAddress);
        console.log('Final Score:', finalScore);
        console.log('Final Highest Tile:', finalHighestTile);

        // Only submit if wallet is connected
        if (!walletConnected || !walletAddress) {
            console.log('Skipping score submission - wallet not connected');
            return;
        }

        if (submitting || submitted) {
            console.log('Skipping - already submitting or submitted');
            return;
        }

        try {
            setSubmitting(true);
            console.log('Starting score submission...');
            console.log('Current game score:', finalScore);
            console.log('All-time best score:', finalBestScore);

            // Submit current game score to leaderboard
            console.log('Submitting to leaderboard...');
            await submitScore(walletAddress, finalScore, finalHighestTile, 0);
            console.log('Leaderboard submission complete');

            // Update profile stats - pass the CURRENT game score
            // updateStats will handle calculating the new high_score using Math.max internally
            console.log('Updating profile stats with current game score:', finalScore);
            await updateStats(finalScore, finalHighestTile);
            console.log('Profile stats update complete');

            setSubmitted(true);
            console.log('Score submitted successfully!');
        } catch (error) {
            console.error('Error submitting score:', error);
            console.error('Error details:', error.message, error.stack);
            // Don't block the user if submission fails
        } finally {
            setSubmitting(false);
        }
    };

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
                        <div className={`w-2 h-2 rounded-full ${submitted ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`}></div>
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                            {submitting ? 'Submitting...' : submitted ? 'Submitted' : 'Live'}
                        </span>
                    </div>
                    {walletConnected && (
                        <div className="flex items-center gap-2 bg-surface-dark/80 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-sm">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-400 to-primary flex items-center justify-center text-[10px] font-bold text-white">
                                0x
                            </div>
                            <span className="text-sm font-medium text-slate-200">{walletAddressShort}</span>
                        </div>
                    )}
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
                            {/* Token Reward Badge or Connect Wallet Prompt */}
                            {walletConnected ? (
                                <div className="mt-4 flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full">
                                    <span className="material-symbols-outlined text-primary text-sm">token</span>
                                    <span className="text-sm font-bold text-primary">+32 $BASE</span>
                                </div>
                            ) : (
                                <div className="mt-4 flex flex-col items-center gap-2">
                                    <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-4 py-1.5 rounded-full">
                                        <span className="material-symbols-outlined text-yellow-500 text-sm">warning</span>
                                        <span className="text-sm font-bold text-yellow-500">Score not saved</span>
                                    </div>
                                    <p className="text-xs text-slate-400 text-center max-w-[250px]">
                                        Connect your wallet to save scores and earn rewards
                                    </p>
                                </div>
                            )}
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
                            {leaderboard.length > 0 ? (
                                leaderboard.map((player, index) => {
                                    const isCurrentUser = player.wallet_address === walletAddress;
                                    return (
                                        <div
                                            key={player.id || index}
                                            className={`flex items-center justify-between p-3 rounded-xl relative overflow-hidden group transition-colors border ${isCurrentUser
                                                ? 'bg-primary/10 border-primary/30'
                                                : 'hover:bg-white/5 border-transparent hover:border-white/5'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-8 h-8 flex items-center justify-center font-bold rounded-lg text-sm ${index === 0
                                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                                        : 'bg-surface-dark text-slate-400 border border-white/5'
                                                        }`}
                                                >
                                                    {player.rank || index + 1}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={`font-bold text-sm ${isCurrentUser ? 'text-white' : 'text-slate-300'}`}>
                                                        {isCurrentUser ? 'You' : player.name}
                                                    </span>
                                                    <span className={`text-xs ${isCurrentUser ? 'text-primary/80' : 'text-slate-500'}`}>
                                                        {player.address}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className={`text-xl font-bold ${isCurrentUser ? 'text-white' : index === 0 ? 'text-slate-400' : 'text-slate-500'}`}>
                                                {player.score.toLocaleString()}
                                            </span>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-8 text-slate-500">
                                    <p className="text-sm">No scores yet. Be the first!</p>
                                </div>
                            )}
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
