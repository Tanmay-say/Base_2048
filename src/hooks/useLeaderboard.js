import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useLeaderboard = (type = 'global', limit = 100) => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLeaderboard();

        // Subscribe to real-time updates
        const subscription = supabase
            .channel('leaderboard_changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'scores'
            }, () => {
                fetchLeaderboard();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [type, limit]);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);

            // Get top scores with profile information
            const { data, error } = await supabase
                .from('scores')
                .select(`
                    *,
                    profiles (
                        username,
                        avatar_url,
                        wallet_address
                    )
                `)
                .order('score', { ascending: false })
                .limit(limit);

            if (error) throw error;

            // Group by wallet address and keep only the highest score per user
            const uniqueScores = [];
            const seenWallets = new Set();

            data.forEach(score => {
                const wallet = score.wallet_address;
                if (!seenWallets.has(wallet)) {
                    seenWallets.add(wallet);
                    uniqueScores.push({
                        ...score,
                        rank: uniqueScores.length + 1,
                        name: score.profiles?.username || `Player ${wallet.slice(0, 6)}`,
                        avatar: score.profiles?.avatar_url,
                        address: wallet.slice(0, 6) + '...' + wallet.slice(-4)
                    });
                }
            });

            setLeaderboard(uniqueScores);
        } catch (err) {
            console.error('Error fetching leaderboard:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const submitScore = async (walletAddress, score, highestTile, movesCount = 0) => {
        try {
            const { data, error } = await supabase
                .from('scores')
                .insert([{
                    wallet_address: walletAddress,
                    score: score,
                    highest_tile: highestTile,
                    moves_count: movesCount
                }])
                .select()
                .single();

            if (error) throw error;

            // Refresh leaderboard after submission
            await fetchLeaderboard();
            return data;
        } catch (err) {
            console.error('Error submitting score:', err);
            throw err;
        }
    };

    const getUserRank = async (walletAddress) => {
        try {
            // Get user's best score
            const { data: userScore, error: userError } = await supabase
                .from('scores')
                .select('score')
                .eq('wallet_address', walletAddress)
                .order('score', { ascending: false })
                .limit(1)
                .single();

            if (userError || !userScore) return null;

            // Count how many unique users have a higher score
            const { count, error: countError } = await supabase
                .from('scores')
                .select('wallet_address', { count: 'exact', head: true })
                .gt('score', userScore.score);

            if (countError) throw countError;

            return (count || 0) + 1;
        } catch (err) {
            console.error('Error getting user rank:', err);
            return null;
        }
    };

    return {
        leaderboard,
        loading,
        error,
        submitScore,
        getUserRank,
        refreshLeaderboard: fetchLeaderboard
    };
};
