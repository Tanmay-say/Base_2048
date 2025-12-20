import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../context/GameContext';
import { useGame } from '../hooks/useGame';

// Generate consistent avatar color based on address
const getAvatarColor = (address) => {
    if (!address) return 'from-slate-600 to-slate-800';
    const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
        'from-blue-600 to-blue-800',
        'from-purple-600 to-purple-800',
        'from-pink-600 to-pink-800',
        'from-green-600 to-green-800',
        'from-yellow-600 to-yellow-800',
        'from-red-600 to-red-800',
        'from-indigo-600 to-indigo-800',
        'from-teal-600 to-teal-800',
    ];
    return colors[hash % colors.length];
};

const mockLeaderboard = [
    { rank: 1, name: 'king_nft', address: '0x8a...2f', score: 24080, avatar: 1 },
    { rank: 2, name: 'base_god', address: '0xbd...cc', score: 18420, avatar: 2 },
    { rank: 3, name: 'vitalik_b', address: '0x12...99', score: 16200, avatar: 3 },
    { rank: 4, name: 'satoshi_nakamoto', address: '0x52...9A', score: 15940, avatar: 4 },
    { rank: 5, name: 'wagmi_friend', address: '0x81...BB', score: 14200, avatar: 5 },
    { rank: 6, name: 'solana_summer', address: '0x12...FF', score: 12850, avatar: 6 },
    { rank: 7, name: 'diamond_hands', address: '0x44...1C', score: 11100, avatar: 7 },
];

export const Leaderboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('global');
    const { walletConnected, walletAddressShort, walletAddress } = useGameContext();
    const { bestScore } = useGame();

    return (
        <div className="bg-background-dark text-white font-display overflow-x-hidden selection:bg-primary selection:text-white">
            {/* Ambient Background Glow */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none z-0"></div>

            <div className="relative flex flex-col min-h-screen w-full max-w-md mx-auto z-10 pb-24">
                {/* Top App Bar */}
                <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-background-dark/80 backdrop-blur-md border-b border-white/5">
                    <button
                        onClick={() => navigate('/game')}
                        className="flex items-center justify-center size-10 rounded-full hover:bg-white/10 transition-colors text-white"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-lg font-bold tracking-tight text-white">Leaderboard</h1>
                    <button className="flex items-center justify-center size-10 rounded-full hover:bg-white/10 transition-colors text-white">
                        <span className="material-symbols-outlined">share</span>
                    </button>
                </header>

                {/* Segmented Control */}
                <div className="px-4 py-4">
                    <div className="flex p-1 bg-surface-dark rounded-xl border border-white/5">
                        <label className="flex-1 relative cursor-pointer group">
                            <input
                                type="radio"
                                name="scope"
                                value="global"
                                checked={activeTab === 'global'}
                                onChange={() => setActiveTab('global')}
                                className="peer sr-only"
                            />
                            <div className="py-2 text-center text-sm font-semibold text-slate-400 peer-checked:text-white peer-checked:bg-primary rounded-lg transition-all shadow-sm">
                                Global
                            </div>
                        </label>
                        <label className="flex-1 relative cursor-pointer group">
                            <input
                                type="radio"
                                name="scope"
                                value="friends"
                                checked={activeTab === 'friends'}
                                onChange={() => setActiveTab('friends')}
                                className="peer sr-only"
                            />
                            <div className="py-2 text-center text-sm font-semibold text-slate-400 peer-checked:text-white peer-checked:bg-primary rounded-lg transition-all shadow-sm">
                                Friends
                            </div>
                        </label>
                    </div>
                </div>

                {/* Podium Section (Top 3) */}
                <div className="px-4 pb-6 pt-2">
                    <div className="flex items-end justify-center gap-3">
                        {/* Rank 2 */}
                        <div className="flex flex-col items-center flex-1">
                            <div className="relative flex flex-col items-center w-full p-3 pt-8 pb-4 bg-surface-dark border border-white/5 rounded-t-lg rounded-b-[2rem] mt-6">
                                <div className="absolute -top-6 size-12 rounded-full border-2 border-surface-dark p-0.5 bg-gradient-to-br from-slate-600 to-slate-800">
                                    <div className="w-full h-full rounded-full bg-slate-700"></div>
                                </div>
                                <div className="text-xs font-bold text-slate-400 mb-1">#2</div>
                                <div className="text-sm font-bold text-white truncate max-w-[80px]">base_god</div>
                                <div className="text-xs text-primary font-medium">18,420</div>
                            </div>
                        </div>

                        {/* Rank 1 */}
                        <div className="flex flex-col items-center flex-1 z-10">
                            <div className="relative flex flex-col items-center w-full p-3 pt-10 pb-6 bg-gradient-to-b from-primary/20 to-surface-dark border border-primary/30 rounded-t-lg rounded-b-[2rem] shadow-[0_0_30px_-10px_rgba(13,85,242,0.5)]">
                                <div className="absolute -top-3 text-yellow-400">
                                    <span className="material-symbols-outlined text-[20px] drop-shadow-lg">crown</span>
                                </div>
                                <div className="absolute -top-8 size-16 rounded-full border-2 border-primary p-0.5 bg-gradient-to-br from-primary to-blue-900 shadow-lg shadow-primary/20">
                                    <div className="w-full h-full rounded-full bg-primary"></div>
                                </div>
                                <div className="text-sm font-bold text-yellow-400 mb-1 drop-shadow-sm">#1</div>
                                <div className="text-base font-bold text-white truncate max-w-[90px]">king_nft</div>
                                <div className="text-sm text-primary font-bold">24,080</div>
                            </div>
                        </div>

                        {/* Rank 3 */}
                        <div className="flex flex-col items-center flex-1">
                            <div className="relative flex flex-col items-center w-full p-3 pt-8 pb-4 bg-surface-dark border border-white/5 rounded-t-lg rounded-b-[2rem] mt-8">
                                <div className="absolute -top-6 size-12 rounded-full border-2 border-surface-dark p-0.5 bg-gradient-to-br from-slate-700 to-slate-800">
                                    <div className="w-full h-full rounded-full bg-slate-800"></div>
                                </div>
                                <div className="text-xs font-bold text-slate-500 mb-1">#3</div>
                                <div className="text-sm font-bold text-white truncate max-w-[80px]">vitalik_b</div>
                                <div className="text-xs text-primary font-medium">16,200</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* List Section (Ranks 4+) */}
                <div className="flex flex-col px-4 gap-2">
                    {mockLeaderboard.slice(3).map((player) => (
                        <div
                            key={player.rank}
                            className="group flex items-center justify-between p-3 rounded-xl bg-surface-dark/50 border border-white/5 hover:bg-surface-dark transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-6 text-sm font-bold text-slate-500">{player.rank}</div>
                                <div className={`size-10 rounded-full bg-gradient-to-br ${getAvatarColor(player.address)} overflow-hidden`}></div>
                                <div className="flex flex-col">
                                    <div className="text-sm font-bold text-white">{player.name}</div>
                                    <div className="text-[10px] text-slate-500 font-mono">{player.address}</div>
                                </div>
                            </div>
                            <div className="text-sm font-bold text-slate-300 font-mono tracking-wide">{player.score.toLocaleString()}</div>
                        </div>
                    ))}
                    <div className="h-4"></div>
                </div>

                {/* Sticky User Footer */}
                <div className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto z-40">
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background-dark via-background-dark to-transparent pointer-events-none"></div>
                    <div className="relative p-4 pb-6">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-primary shadow-[0_4px_20px_-5px_rgba(13,85,242,0.4)] border border-white/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 blur-xl rounded-full pointer-events-none"></div>
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="flex items-center justify-center w-6 text-sm font-bold text-white/80">242</div>
                                <div className={`size-10 rounded-full bg-gradient-to-br ${getAvatarColor(walletAddress)} ring-2 ring-white/20 overflow-hidden`}></div>
                                <div className="flex flex-col">
                                    <div className="text-sm font-bold text-white flex items-center gap-1">
                                        {walletConnected ? 'You' : 'Guest'}
                                        {walletConnected && (
                                            <span className="bg-black/20 text-white/90 text-[10px] px-1.5 py-0.5 rounded ml-1 font-medium">PRO</span>
                                        )}
                                    </div>
                                    <div className="text-[10px] text-white/60 font-mono">{walletConnected ? walletAddressShort : 'Not connected'}</div>
                                </div>
                            </div>
                            <div className="relative z-10 text-right">
                                <div className="text-sm font-bold text-white font-mono tracking-wide">{bestScore.toLocaleString()}</div>
                                <div className="text-[10px] text-white/70 font-medium flex items-center justify-end gap-0.5">
                                    <span className="material-symbols-outlined text-[10px]">arrow_drop_up</span> Top 15%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
