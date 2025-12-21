import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../context/GameContext';

export const Settings = () => {
    const navigate = useNavigate();
    const { settings, updateSettings, gridSize, setGridSize } = useGameContext();
    const [showGridSizeWarning, setShowGridSizeWarning] = useState(false);

    const toggleSetting = (key) => {
        updateSettings({ [key]: !settings[key] });
    };

    const handleGridSizeChange = (newSize) => {
        if (newSize !== gridSize) {
            setShowGridSizeWarning(true);
            setTimeout(() => setShowGridSizeWarning(false), 3000);
        }
        setGridSize(newSize);
    };

    const gridSizes = [
        { value: 4, label: '4×4', description: 'Classic' },
        { value: 5, label: '5×5', description: 'Challenging' },
        { value: 6, label: '6×6', description: 'Expert' }
    ];

    return (
        <div className="bg-background-dark font-display text-white antialiased selection:bg-primary selection:text-white overflow-hidden fixed inset-0">
            <div className="relative flex h-full w-full flex-col overflow-hidden max-w-md mx-auto shadow-2xl bg-background-dark border-x border-white/5" style={{ height: '100svh' }}>
                {/* Ambient Background Gradients */}
                <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[150%] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
                <div className="absolute bottom-[-10%] right-[-20%] w-[300px] h-[300px] bg-primary/10 blur-[80px] rounded-full pointer-events-none z-0"></div>

                {/* Top App Bar */}
                <header className="relative z-10 flex items-center justify-between px-5 pt-6 pb-2 backdrop-blur-sm" style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))' }}>
                    <button
                        onClick={() => navigate('/game')}
                        data-testid="settings-close-button"
                        className="group flex size-10 items-center justify-center rounded-full bg-white/5 transition-all hover:bg-white/10 active:scale-95 text-white/80 hover:text-white"
                    >
                        <span className="material-symbols-outlined text-[24px]">close</span>
                    </button>
                    <h2 className="text-xl font-bold tracking-tight text-white flex-1 text-center">Settings</h2>
                    <button
                        onClick={() => navigate('/game')}
                        data-testid="settings-done-button"
                        className="flex h-10 px-4 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-[0_0_15px_rgba(13,85,242,0.4)] transition-all hover:bg-blue-600 active:scale-95"
                    >
                        Done
                    </button>
                </header>

                {/* Grid Size Warning */}
                {showGridSizeWarning && (
                    <div className="relative z-20 mx-5 mt-2 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-xl text-yellow-200 text-sm text-center animate-pulse">
                        Restart your game to apply grid size changes
                    </div>
                )}

                {/* Scrollable Content */}
                <main className="relative z-10 flex-1 overflow-y-auto no-scrollbar p-5 pb-10 space-y-6" style={{ paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom))' }}>
                    {/* Section 1: Grid Size */}
                    <section className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 pl-2">Grid Size</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {gridSizes.map((size) => (
                                <button
                                    key={size.value}
                                    data-testid={`grid-size-${size.value}`}
                                    onClick={() => handleGridSizeChange(size.value)}
                                    className={`p-4 rounded-2xl border transition-all ${
                                        gridSize === size.value
                                            ? 'bg-primary border-primary shadow-glow-blue'
                                            : 'bg-surface-dark/60 border-white/10 hover:bg-white/5'
                                    }`}
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <span className={`text-2xl font-bold ${
                                            gridSize === size.value ? 'text-white' : 'text-white/60'
                                        }`}>{size.label}</span>
                                        <span className={`text-xs ${
                                            gridSize === size.value ? 'text-white/80' : 'text-white/40'
                                        }`}>{size.description}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Section 2: Game Preferences */}
                    <section className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 pl-2">Game Preferences</h3>
                        <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface-dark/60 backdrop-blur-md">
                            {/* Sound Item */}
                            <div className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <span className="material-symbols-outlined">volume_up</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-base font-medium text-white">Sound Effects</span>
                                        <span className="text-xs text-white/40">In-game noises</span>
                                    </div>
                                </div>
                                <div className="shrink-0">
                                    <label className="relative flex h-[28px] w-[48px] cursor-pointer items-center rounded-full bg-white/10 p-1 has-[:checked]:bg-primary transition-colors duration-300">
                                        <input
                                            type="checkbox"
                                            checked={settings.sound}
                                            onChange={() => toggleSetting('sound')}
                                            data-testid="sound-toggle"
                                            className="peer sr-only"
                                        />
                                        <div className="absolute left-1 size-5 rounded-full bg-white shadow-sm transition-all duration-300 peer-checked:translate-x-5"></div>
                                    </label>
                                </div>
                            </div>

                            {/* Music Item */}
                            <div className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <span className="material-symbols-outlined">music_note</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-base font-medium text-white">Music</span>
                                        <span className="text-xs text-white/40">Background ambience</span>
                                    </div>
                                </div>
                                <div className="shrink-0">
                                    <label className="relative flex h-[28px] w-[48px] cursor-pointer items-center rounded-full bg-white/10 p-1 has-[:checked]:bg-primary transition-colors duration-300">
                                        <input
                                            type="checkbox"
                                            checked={settings.music}
                                            onChange={() => toggleSetting('music')}
                                            data-testid="music-toggle"
                                            className="peer sr-only"
                                        />
                                        <div className="absolute left-1 size-5 rounded-full bg-white shadow-sm transition-all duration-300 peer-checked:translate-x-5"></div>
                                    </label>
                                </div>
                            </div>

                            {/* Vibration Item */}
                            <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <span className="material-symbols-outlined">vibration</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-base font-medium text-white">Haptics</span>
                                        <span className="text-xs text-white/40">Vibrate on merge</span>
                                    </div>
                                </div>
                                <div className="shrink-0">
                                    <label className="relative flex h-[28px] w-[48px] cursor-pointer items-center rounded-full bg-white/10 p-1 has-[:checked]:bg-primary transition-colors duration-300">
                                        <input
                                            type="checkbox"
                                            checked={settings.haptics}
                                            onChange={() => toggleSetting('haptics')}
                                            data-testid="haptics-toggle"
                                            className="peer sr-only"
                                        />
                                        <div className="absolute left-1 size-5 rounded-full bg-white shadow-sm transition-all duration-300 peer-checked:translate-x-5"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Legal & Privacy */}
                    <section className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 pl-2">Legal & Privacy</h3>
                        <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface-dark/60 backdrop-blur-md">
                            {/* Privacy Policy */}
                            <button className="w-full flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white/70 group-hover:text-white group-hover:bg-white/10 transition-all">
                                        <span className="material-symbols-outlined">policy</span>
                                    </div>
                                    <span className="text-base font-medium text-white text-left flex-1">Privacy Policy</span>
                                </div>
                                <span className="material-symbols-outlined text-white/30 group-hover:text-white/60">chevron_right</span>
                            </button>

                            {/* Terms of Service */}
                            <button className="w-full flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white/70 group-hover:text-white group-hover:bg-white/10 transition-all">
                                        <span className="material-symbols-outlined">description</span>
                                    </div>
                                    <span className="text-base font-medium text-white text-left flex-1">Terms of Service</span>
                                </div>
                                <span className="material-symbols-outlined text-white/30 group-hover:text-white/60">chevron_right</span>
                            </button>

                            {/* Restore Purchases */}
                            <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white/70 group-hover:text-white group-hover:bg-white/10 transition-all">
                                        <span className="material-symbols-outlined">restore</span>
                                    </div>
                                    <span className="text-base font-medium text-white text-left flex-1">Restore Purchases</span>
                                </div>
                                <span className="material-symbols-outlined text-white/30 group-hover:text-white/60">chevron_right</span>
                            </button>
                        </div>
                    </section>

                    {/* Support Button */}
                    <button className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white/80 font-medium hover:bg-white/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">mail</span>
                        Contact Support
                    </button>

                    {/* Footer Info */}
                    <div className="pt-4 flex flex-col items-center justify-center gap-4 opacity-50">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <div className="h-5 w-5 rounded-full bg-primary animate-pulse"></div>
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-white tracking-wide">Version 3.0.0</p>
                            <p className="text-xs text-white/60 mt-1 font-mono">Built on Base • PWA Ready</p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};
