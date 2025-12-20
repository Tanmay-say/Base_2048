import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AmbientBackground } from '../components/AmbientBackground';
import { useGameContext } from '../context/GameContext';

export const Landing = () => {
    const navigate = useNavigate();
    const { connectWallet, walletConnected } = useGameContext();

    // Navigate to how-to-play when wallet is connected
    useEffect(() => {
        if (walletConnected) {
            navigate('/how-to-play');
        }
    }, [walletConnected, navigate]);

    const handleConnect = async () => {
        try {
            await connectWallet(); // This opens the modal and waits
            // Navigation happens via useEffect when walletConnected changes
        } catch (error) {
            console.error('Wallet connection failed:', error);
        }
    };

    const handleSkip = () => {
        navigate('/how-to-play');
    };

    return (
        <div className="min-h-screen flex flex-col bg-background-dark text-white overflow-x-hidden">
            <AmbientBackground />

            <div className="relative z-10 flex flex-col flex-grow w-full max-w-md mx-auto p-6 justify-between h-screen max-h-screen">
                {/* Header Spacer */}
                <div className="w-full flex justify-between items-center py-2 opacity-0">
                    <span className="material-symbols-outlined">menu</span>
                </div>

                {/* Hero Section */}
                <div className="flex flex-col items-center justify-center w-full flex-grow pb-10">
                    {/* 3D Tile Concept */}
                    <div className="relative group cursor-default mb-10">
                        {/* Glow behind tile */}
                        <div className="absolute -inset-4 bg-primary/30 rounded-full blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* Main Tile */}
                        <div className="relative w-40 h-40 sm:w-48 sm:h-48 bg-gradient-to-br from-[#1E293B] to-[#0B1221] rounded-3xl border border-white/10 shadow-2xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-500">
                            {/* Inner Number */}
                            <span className="text-5xl sm:text-6xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] z-10">2048</span>

                            {/* Decoration Badge */}
                            <div className="absolute -top-3 -right-3 w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/40 border border-white/20 transform rotate-12">
                                <span className="material-symbols-outlined text-white text-[20px]">token</span>
                            </div>
                        </div>
                    </div>

                    {/* Headlines */}
                    <div className="text-center space-y-3 z-10">
                        <h1 className="text-white tracking-tight text-5xl font-bold leading-none">
                            2048 <span className="text-primary drop-shadow-[0_0_15px_rgba(0,81,255,0.6)]">BASE</span>
                        </h1>
                        <p className="text-[#94A3B8] text-lg font-normal tracking-wider uppercase font-body">
                            Swipe. Merge. Score.
                        </p>
                    </div>
                </div>

                {/* Bottom Action Section */}
                <div className="w-full pb-8 flex flex-col gap-5 z-20">
                    {/* Primary Action */}
                    <button
                        onClick={handleConnect}
                        className="relative w-full group overflow-hidden rounded-2xl bg-primary text-white p-[1px] shadow-[0_0_30px_-5px_rgba(0,81,255,0.5)] hover:shadow-[0_0_40px_-5px_rgba(0,81,255,0.7)] transition-all duration-300"
                    >
                        {/* Inner Button Gradient Background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary via-[#3b82f6] to-primary opacity-100"></div>

                        {/* Shine Effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                        {/* Button Content */}
                        <div className="relative h-14 flex items-center justify-center gap-3 bg-primary/10 backdrop-blur-sm rounded-2xl px-6">
                            <span className="material-symbols-outlined text-[24px]">wallet</span>
                            <span className="text-lg font-bold tracking-wide">Connect Wallet</span>
                        </div>
                    </button>

                    {/* Skip Button */}
                    <button
                        onClick={handleSkip}
                        className="w-full text-slate-400 hover:text-white transition-colors text-sm font-medium"
                    >
                        Skip for now
                    </button>

                    {/* Footer Meta Text */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <p className="text-[#9aa5bc] text-xs font-medium font-body tracking-wide">Play instantly on Base</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
