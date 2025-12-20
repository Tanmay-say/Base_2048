import { createClient } from '@supabase/supabase-js';

// Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
    }
});

// Helper function to set current user wallet for RLS
export const setCurrentUserWallet = async (walletAddress) => {
    if (!walletAddress) return;

    try {
        await supabase.rpc('set_current_user_wallet', {
            wallet_address: walletAddress
        });
    } catch (error) {
        console.error('Error setting current user wallet:', error);
    }
};

// Helper function to generate avatar from wallet address
export const generateAvatarUrl = (walletAddress) => {
    if (!walletAddress) return null;
    // Using DiceBear API for consistent avatars based on wallet address
    return `https://api.dicebear.com/7.x/identicon/svg?seed=${walletAddress}`;
};

// Helper function to upload avatar image
export const uploadAvatar = async (file, walletAddress) => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${walletAddress}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { data, error } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (error) {
        console.error('Error uploading avatar:', error);
        throw error;
    }
};
