import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useProfile = (walletAddress) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rank, setRank] = useState(null);

    useEffect(() => {
        if (!walletAddress) {
            setProfile(null);
            setRank(null);
            setLoading(false);
            return;
        }

        fetchProfile();
    }, [walletAddress]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            console.log('=== FETCHING PROFILE ===');
            console.log('Wallet Address:', walletAddress);

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('wallet_address', walletAddress)
                .single();

            console.log('Database Response:', { data, error });

            if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
                throw error;
            }

            if (!data) {
                console.log('No profile found, creating new one');
                // Create profile if it doesn't exist
                await createProfile(walletAddress);
            } else {
                console.log('Profile Data from DB:', {
                    high_score: data.high_score,
                    games_played: data.games_played,
                    total_score: data.total_score,
                    highest_tile: data.highest_tile
                });
                setProfile(data);
                // Fetch rank after setting profile
                await fetchUserRank(data.high_score);
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserRank = async (userHighScore) => {
        try {
            // Count how many users have a higher score
            const { count, error } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .gt('high_score', userHighScore);

            if (error) throw error;

            // Rank is count + 1 (e.g., if 2 people have higher scores, user is rank 3)
            setRank(count + 1);
        } catch (err) {
            console.error('Error fetching rank:', err);
            setRank(null);
        }
    };

    const createProfile = async (wallet) => {
        try {
            const newProfile = {
                wallet_address: wallet,
                username: `Player ${wallet.slice(0, 6)}`,
                avatar_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${wallet}`,
                games_played: 0,
                high_score: 0,
                highest_tile: 0,
                total_score: 0
            };

            const { data, error } = await supabase
                .from('profiles')
                .insert([newProfile])
                .select()
                .single();

            if (error) throw error;
            setProfile(data);
            setRank(null); // New users don't have a rank yet
            return data;
        } catch (err) {
            console.error('Error creating profile:', err);
            setError(err.message);
        }
    };

    const updateProfile = async (updates) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('wallet_address', walletAddress)
                .select()
                .single();

            if (error) throw error;
            setProfile(data);

            // Refresh rank if high_score was updated
            if (updates.high_score !== undefined) {
                await fetchUserRank(data.high_score);
            }

            return data;
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.message);
            throw err;
        }
    };

    const updateStats = async (gameScore, highestTile) => {
        try {
            console.log('=== UPDATE STATS CALLED ===');
            console.log('Game Score:', gameScore);
            console.log('Highest Tile:', highestTile);
            console.log('Wallet Address:', walletAddress);

            if (!walletAddress) {
                console.error('ERROR: No wallet address for updateStats');
                throw new Error('No wallet address');
            }

            // Fetch fresh profile data first to avoid stale state
            console.log('Fetching fresh profile from database for wallet:', walletAddress);
            const { data: freshProfile, error: fetchError } = await supabase
                .from('profiles')
                .select('*')
                .eq('wallet_address', walletAddress)
                .single();

            if (fetchError) {
                console.error('ERROR fetching fresh profile:', fetchError);
                throw fetchError;
            }

            if (!freshProfile) {
                console.error('ERROR: No profile found for wallet:', walletAddress);
                throw new Error('Profile not found');
            }

            console.log('Fresh Profile Data:', {
                games_played: freshProfile?.games_played,
                total_score: freshProfile?.total_score,
                high_score: freshProfile?.high_score,
                highest_tile: freshProfile?.highest_tile
            });

            // Calculate updates based on fresh data
            const updates = {
                games_played: (freshProfile?.games_played || 0) + 1,
                total_score: (freshProfile?.total_score || 0) + gameScore,
                high_score: Math.max(freshProfile?.high_score || 0, gameScore),
                highest_tile: Math.max(freshProfile?.highest_tile || 0, highestTile)
            };

            console.log('Calculated Updates:', updates);
            console.log('High Score Calculation:', {
                currentHighScore: freshProfile?.high_score || 0,
                gameScore: gameScore,
                newHighScore: updates.high_score,
                willUpdate: updates.high_score > (freshProfile?.high_score || 0)
            });

            console.log('Calling updateProfile with:', updates);
            const result = await updateProfile(updates);
            console.log('updateProfile result:', result);
            console.log('=== UPDATE COMPLETE ===');
            return result;
        } catch (err) {
            console.error('❌ ERROR in updateStats:', err);
            console.error('Error stack:', err.stack);
            throw err;
        }
    };

    // Calculate average score
    const averageScore = profile?.games_played > 0
        ? Math.round(profile.total_score / profile.games_played)
        : 0;

    // Sync best score from localStorage to database
    const syncBestScoreFromLocalStorage = async () => {
        try {
            const localBestScore = parseInt(localStorage.getItem('base2048_bestScore') || '0', 10);
            console.log('Syncing localStorage bestScore to database:', localBestScore);

            if (!profile || !walletAddress || localBestScore === 0) {
                console.log('Skipping sync - no profile or local best score');
                return;
            }

            // Only update if localStorage has a higher score than database
            if (localBestScore > (profile.high_score || 0)) {
                console.log('localStorage score is higher, updating database from', profile.high_score, 'to', localBestScore);
                await updateProfile({ high_score: localBestScore });
                console.log('Sync complete!');
            } else {
                console.log('Database already has the best score:', profile.high_score);
            }
        } catch (err) {
            console.error('Error syncing best score:', err);
        }
    };

    return {
        profile,
        loading,
        error,
        rank,
        averageScore,
        updateProfile,
        updateStats,
        refreshProfile: fetchProfile,
        syncBestScoreFromLocalStorage
    };
};
