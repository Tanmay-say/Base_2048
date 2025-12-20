import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="fixed bottom-0 left-0 right-0 w-full z-50 glass-panel pb-safe">
            <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
                <button
                    onClick={() => navigate('/game')}
                    className="flex flex-col items-center justify-center w-16 gap-1 group"
                >
                    <div className={`p-1.5 rounded-xl transition-colors ${isActive('/game') ? 'bg-primary/10' : 'group-hover:bg-white/5'}`}>
                        <span className={`material-symbols-outlined transition-colors ${isActive('/game') ? 'text-primary' : 'text-slate-400 group-hover:text-white'}`}>
                            grid_view
                        </span>
                    </div>
                    <span className={`text-[10px] font-medium transition-colors ${isActive('/game') ? 'text-primary font-bold' : 'text-slate-400 group-hover:text-white'}`}>
                        Game
                    </span>
                </button>

                <button
                    onClick={() => navigate('/leaderboard')}
                    className="flex flex-col items-center justify-center w-16 gap-1 group"
                >
                    <div className={`p-1.5 rounded-xl transition-colors ${isActive('/leaderboard') ? 'bg-primary/10' : 'group-hover:bg-white/5'}`}>
                        <span className={`material-symbols-outlined transition-colors ${isActive('/leaderboard') ? 'text-primary' : 'text-slate-400 group-hover:text-white'}`}>
                            leaderboard
                        </span>
                    </div>
                    <span className={`text-[10px] font-medium transition-colors ${isActive('/leaderboard') ? 'text-primary font-bold' : 'text-slate-400 group-hover:text-white'}`}>
                        Rank
                    </span>
                </button>

                <button
                    onClick={() => navigate('/profile')}
                    className="flex flex-col items-center justify-center w-16 gap-1 group"
                >
                    <div className={`p-1.5 rounded-xl transition-colors ${isActive('/profile') ? 'bg-primary/10' : 'group-hover:bg-white/5'}`}>
                        <span className={`material-symbols-outlined transition-colors ${isActive('/profile') ? 'text-primary' : 'text-slate-400 group-hover:text-white'}`}>
                            person
                        </span>
                    </div>
                    <span className={`text-[10px] font-medium transition-colors ${isActive('/profile') ? 'text-primary font-bold' : 'text-slate-400 group-hover:text-white'}`}>
                        Profile
                    </span>
                </button>
            </div>
            {/* Safe Area Spacer for iOS */}
            <div className="h-5 w-full"></div>
        </div>
    );
};
