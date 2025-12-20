import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <footer className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto z-50 px-6 pb-8">
            <div className="glass-panel rounded-2xl p-2 flex items-center justify-between gap-3 shadow-2xl">
                <div className="flex gap-1 pl-1">
                    <button
                        onClick={() => navigate('/profile')}
                        className={`w-12 h-12 flex items-center justify-center rounded-xl transition-colors ${isActive('/profile')
                                ? 'bg-primary/10 text-primary'
                                : 'hover:bg-white/5 active:bg-white/10 text-[#9aa5bc] hover:text-white'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[24px]">person</span>
                    </button>
                    <button
                        onClick={() => navigate('/leaderboard')}
                        className={`w-12 h-12 flex items-center justify-center rounded-xl transition-colors ${isActive('/leaderboard')
                                ? 'bg-primary/10 text-primary'
                                : 'hover:bg-white/5 active:bg-white/10 text-[#9aa5bc] hover:text-white'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[24px]">leaderboard</span>
                    </button>
                    <button
                        onClick={() => navigate('/settings')}
                        className={`w-12 h-12 flex items-center justify-center rounded-xl transition-colors ${isActive('/settings')
                                ? 'bg-primary/10 text-primary'
                                : 'hover:bg-white/5 active:bg-white/10 text-[#9aa5bc] hover:text-white'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[24px]">settings</span>
                    </button>
                </div>
                <button
                    onClick={() => navigate('/game')}
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
    );
};
