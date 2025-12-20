import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AmbientBackground } from '../components/AmbientBackground';

export const HowToPlay = () => {
    const navigate = useNavigate();

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden bg-background-dark">
            <AmbientBackground />

            <div className="relative z-10 flex flex-col flex-1 max-w-md mx-auto w-full h-full">
                {/* Header */}
                <div className="flex items-center p-6 pt-8 pb-4 justify-center">
                    <h2 className="text-white text-2xl font-bold leading-tight tracking-tight text-center">How to Play</h2>
                </div>

                {/* Scrollable Instructional Content */}
                <div className="flex-1 px-4 space-y-4 py-2">
                    {/* Card 1: Swipe */}
                    <div className="flex flex-col gap-4 bg-surface-dark/50 backdrop-blur-sm border border-white/5 rounded-xl p-5 shadow-lg">
                        <div className="flex items-start gap-4">
                            <div className="relative shrink-0 flex items-center justify-center bg-primary/10 rounded-xl size-[72px] border border-primary/20 overflow-hidden">
                                <span className="material-symbols-outlined text-primary text-3xl relative z-10">swipe</span>
                            </div>
                            <div className="flex flex-1 flex-col justify-center pt-1">
                                <p className="text-white text-lg font-bold leading-tight mb-1">Swipe to Move</p>
                                <p className="text-slate-400 text-sm font-medium leading-relaxed">Swipe up, down, left, or right to move all tiles on the board at once.</p>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Merge */}
                    <div className="flex flex-col gap-4 bg-surface-dark/50 backdrop-blur-sm border border-white/5 rounded-xl p-5 shadow-lg">
                        <div className="flex items-start gap-4">
                            <div className="relative shrink-0 flex items-center justify-center bg-primary/10 rounded-xl size-[72px] border border-primary/20 overflow-hidden">
                                <span className="material-symbols-outlined text-primary text-3xl relative z-10">call_merge</span>
                            </div>
                            <div className="flex flex-1 flex-col justify-center pt-1">
                                <p className="text-white text-lg font-bold leading-tight mb-1">Merge Tiles</p>
                                <p className="text-slate-400 text-sm font-medium leading-relaxed">When two tiles with the same number touch, they merge into one!</p>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Win Condition */}
                    <div className="flex flex-col gap-4 bg-surface-dark/50 backdrop-blur-sm border border-white/5 rounded-xl p-5 shadow-lg">
                        <div className="flex items-start gap-4">
                            <div className="relative shrink-0 flex items-center justify-center bg-primary/10 rounded-xl size-[72px] border border-primary/20 overflow-hidden">
                                <span className="material-symbols-outlined text-primary text-3xl relative z-10">emoji_events</span>
                            </div>
                            <div className="flex flex-1 flex-col justify-center pt-1">
                                <p className="text-white text-lg font-bold leading-tight mb-1">Reach $2048</p>
                                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                    Join the numbers and get to the <span className="text-primary font-bold">$2048</span> tile to win the game.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Spacer */}
                <div className="h-8"></div>

                {/* Sticky Bottom Action */}
                <div className="sticky bottom-0 w-full p-4 bg-gradient-to-t from-background-dark via-background-dark to-transparent pb-8">
                    <button
                        onClick={() => navigate('/game')}
                        className="w-full cursor-pointer flex items-center justify-center overflow-hidden rounded-xl h-14 bg-primary hover:bg-blue-600 transition-colors text-white text-lg font-bold tracking-wide shadow-[0_0_20px_rgba(19,88,236,0.4)] active:scale-[0.98] transform duration-100"
                    >
                        Got It
                    </button>
                </div>
            </div>
        </div>
    );
};
