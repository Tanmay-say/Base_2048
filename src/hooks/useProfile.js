import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useProfile = (walletAddress) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!walletAddress) {
            setProfile(null);
            setLoading(false);
            return;
        }

        fetchProfile();
    }, [walletAddress]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('wallet_address', walletAddress)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
                throw error;
            }

            if (!data) {
                // Create profile if it doesn't exist
                await createProfile(walletAddress);
            } else {
                setProfile(data);
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError(err.message);
        } finally {
            setLoading(false);
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
            return data;
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.message);
            throw err;
        }
    };

    const updateStats = async (gameScore, highestTile) => {
        try {
            const updates = {
                games_played: (profile?.games_played || 0) + 1,
                total_score: (profile?.total_score || 0) + gameScore,
                high_score: Math.max(profile?.high_score || 0, gameScore),
                highest_tile: Math.max(profile?.highest_tile || 0, highestTile)
            };

            return await updateProfile(updates);
        } catch (err) {
            console.error('Error updating stats:', err);
            throw err;
        }
    };

    return {
        profile,
        loading,
        error,
        updateProfile,
        updateStats,
        refreshProfile: fetchProfile
    };
};
