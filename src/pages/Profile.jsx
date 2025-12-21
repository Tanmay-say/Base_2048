import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../components/BottomNav';
import { useGameContext } from '../context/GameContext';
import { useProfile } from '../hooks/useProfile';
import { uploadAvatar } from '../lib/supabase';

export const Profile = () => {
    const navigate = useNavigate();
    const { walletConnected, walletAddress, walletAddressShort } = useGameContext();
    const { profile, loading, rank, averageScore, updateProfile, refreshProfile, syncBestScoreFromLocalStorage } = useProfile(walletAddress);
    const [uploading, setUploading] = useState(false);

    // Refresh profile data when wallet address changes
    useEffect(() => {
        // The useProfile hook already fetches on walletAddress change
        // This is just to force a manual refresh when navigating to profile
        const timer = setTimeout(() => {
            if (walletAddress && refreshProfile) {
                console.log('Profile page: Force refreshing profile data');
                refreshProfile();
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [walletAddress]);

    // Sync localStorage bestScore to database when profile loads
    useEffect(() => {
        if (profile && walletAddress && syncBestScoreFromLocalStorage) {
            console.log('Syncing localStorage bestScore to database...');
            syncBestScoreFromLocalStorage();
        }
    }, [profile, walletAddress]);

    const handleAvatarUpload = async (event) => {
        try {
            setUploading(true);
            const file = event.target.files?.[0];
            if (!file || !walletAddress) return;

            // Upload avatar
            const avatarUrl = await uploadAvatar(file, walletAddress);

            // Update profile with new avatar URL
            await updateProfile({ avatar_url: avatarUrl });
        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert('Failed to upload avatar. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleCopyAddress = () => {
        if (walletAddress) {
            navigator.clipboard.writeText(walletAddress);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Recently';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="bg-background-dark text-white font-display antialiased selection:bg-primary selection:text-white flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-dark text-white font-display antialiased selection:bg-primary selection:text-white">
            {/* Ambient Background Glow */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[400px] bg-primary/15 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none z-0"></div>

            <div className="relative flex h-full min-h-screen w-full flex-col max-w-md mx-auto z-10 pb-28">
                {/* Top App Bar */}
                <header className="relative z-10 flex items-center justify-between px-5 pt-6 pb-2 backdrop-blur-sm sticky top-0">
                    <button
                        onClick={() => navigate('/game')}
                        className="group flex size-10 items-center justify-center rounded-full bg-white/5 transition-all hover:bg-white/10 active:scale-95 text-white/80 hover:text-white"
                    >
                        <span className="material-symbols-outlined text-[24px]">close</span>
                    </button>
                    <h2 className="text-xl font-bold tracking-tight text-white flex-1 text-center">Profile</h2>

                </header>

                {/* Profile Header */}
                <div className="flex flex-col items-center px-4 pt-2 pb-6 w-full">
                    <div className="relative group">
                        {/* Avatar with gradient ring */}
                        <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary via-blue-400 to-purple-600 opacity-70 blur-sm"></div>
                        <div className="relative h-28 w-28 rounded-full border-4 border-background-dark overflow-hidden bg-surface-dark">
                            {profile?.avatar_url ? (
                                <img
                                    src={profile.avatar_url}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary to-blue-900"></div>
                            )}
                        </div>
                        <label
                            htmlFor="avatar-upload"
                            className="absolute bottom-0 right-0 bg-primary border-4 border-background-dark rounded-full p-1.5 flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors"
                        >
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                className="hidden"
                                disabled={uploading || !walletConnected}
                            />
                            <span className="material-symbols-outlined text-[14px] font-bold text-white">
                                {uploading ? 'hourglass_empty' : 'edit'}
                            </span>
                        </label>
                    </div>
                    <div className="flex flex-col items-center mt-4 gap-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-white">
                                {profile?.username || (walletConnected ? `Player ${walletAddressShort}` : 'Guest')}
                            </h1>
                            {walletConnected && (
                                <span className="material-symbols-outlined text-blue-400 text-[20px]" title="Verified">verified</span>
                            )}
                        </div>
                        {walletConnected && (
                            <button
                                onClick={handleCopyAddress}
                                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-highlight hover:bg-surface-highlight/80 transition-colors cursor-pointer group/copy"
                            >
                                <p className="text-slate-400 text-sm font-mono group-hover/copy:text-white transition-colors">
                                    {walletAddressShort}
                                </p>
                                <span className="material-symbols-outlined text-slate-500 text-[14px] group-hover/copy:text-white transition-colors">content_copy</span>
                            </button>
                        )}
                        <p className="text-slate-500 text-xs font-medium mt-1">
                            Joined {formatDate(profile?.created_at)}
                        </p>
                    </div>
                </div>

                {/* Main Stats Grid */}
                <div className="px-4 w-full">
                    <div className="grid grid-cols-2 gap-3">
                        {/* Highest Tile */}
                        <div className="col-span-2 bg-gradient-to-r from-primary/20 to-surface-dark border border-primary/20 rounded-2xl p-5 flex items-center justify-between relative overflow-hidden group">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-primary/20 blur-[40px] rounded-full translate-x-10 -translate-y-10"></div>
                            <div className="flex flex-col gap-1 z-10">
                                <span className="text-blue-200 text-sm font-medium flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px]">emoji_events</span>
                                    Highest Tile
                                </span>
                                <span className="text-4xl font-bold text-white tracking-tight drop-shadow-[0_0_10px_rgba(13,85,242,0.5)]">{profile?.highest_tile || 0}</span>
                            </div>
                            <div className="h-16 w-16 bg-[#ecc400] rounded-lg shadow-[0_0_15px_rgba(236,196,0,0.4)] flex items-center justify-center rotate-6 group-hover:rotate-12 transition-transform z-10 border-2 border-[#fffad6]">
                                <span className="text-[#776e65] font-bold text-xl">{profile?.highest_tile || 0}</span>
                            </div>
                        </div>

                        {/* Total Games */}
                        <div className="bg-surface-dark border border-white/5 rounded-2xl p-4 flex flex-col gap-2 hover:bg-surface-highlight transition-colors">
                            <div className="flex items-start justify-between">
                                <div className="p-2 bg-white/5 rounded-lg text-slate-300">
                                    <span className="material-symbols-outlined text-[20px]">videogame_asset</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Games Played</p>
                                <p className="text-xl font-bold text-white">{(profile?.games_played || 0).toLocaleString()}</p>
                            </div>
                        </div>

                        {/* High Score */}
                        <div className="bg-surface-dark border border-white/5 rounded-2xl p-4 flex flex-col gap-2 hover:bg-surface-highlight transition-colors">
                            <div className="flex items-start justify-between">
                                <div className="p-2 bg-white/5 rounded-lg text-slate-300">
                                    <span className="material-symbols-outlined text-[20px]">trending_up</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">High Score</p>
                                <p className="text-xl font-bold text-white">{(profile?.high_score || 0).toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Global Rank */}
                        <div className="bg-surface-dark border border-white/5 rounded-2xl p-4 flex flex-col gap-2 hover:bg-surface-highlight transition-colors">
                            <div className="flex items-start justify-between">
                                <div className="p-2 bg-white/5 rounded-lg text-slate-300">
                                    <span className="material-symbols-outlined text-[20px]">public</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Global Rank</p>
                                <p className="text-xl font-bold text-white">
                                    {walletConnected && rank ? `#${rank}` : 'N/A'}
                                </p>
                            </div>
                        </div>

                        {/* Average Score */}
                        <div className="bg-surface-dark border border-white/5 rounded-2xl p-4 flex flex-col gap-2 hover:bg-surface-highlight transition-colors">
                            <div className="flex items-start justify-between">
                                <div className="p-2 bg-white/5 rounded-lg text-slate-300">
                                    <span className="material-symbols-outlined text-[20px]">analytics</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Avg Score</p>
                                <p className="text-xl font-bold text-white">
                                    {walletConnected && averageScore > 0 ? averageScore.toLocaleString() : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-8"></div>

                {/* Achievements */}
                <div className="flex flex-col w-full px-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white text-lg font-bold">Achievements</h3>
                        <a className="text-primary text-sm font-bold hover:text-blue-400 transition-colors" href="#">View all</a>
                    </div>
                    <div className="flex flex-col gap-3">
                        {/* Achievement 1 */}
                        <div className="flex items-center p-3 rounded-xl bg-surface-dark border border-white/5 gap-4 hover:border-primary/30 transition-colors group">
                            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center border border-yellow-500/20 group-hover:shadow-[0_0_10px_rgba(234,179,8,0.2)] transition-all">
                                <span className="material-symbols-outlined text-yellow-500">military_tech</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-white font-bold text-base truncate">Tile Master</h4>
                                <p className="text-slate-500 text-xs">Reach 2048 tile 10 times</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">100 XP</span>
                            </div>
                        </div>

                        {/* Achievement 2 */}
                        <div className="flex items-center p-3 rounded-xl bg-surface-dark border border-white/5 gap-4 hover:border-primary/30 transition-colors group">
                            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/20 group-hover:shadow-[0_0_10px_rgba(59,130,246,0.2)] transition-all">
                                <span className="material-symbols-outlined text-blue-500">rocket_launch</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-white font-bold text-base truncate">Early Adopter</h4>
                                <p className="text-slate-500 text-xs">Play during Season 1</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">NFT</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Branding */}
                <div className="flex items-center justify-center mt-8 mb-4 gap-2 opacity-40">
                    <span className="text-xs text-white">Powered by</span>
                    <div className="h-4 w-4 rounded-full bg-blue-600 border-2 border-white"></div>
                    <span className="text-xs font-bold text-white tracking-widest uppercase">Base</span>
                </div>
            </div>


        </div>
    );
};
