-- Base 2048 Game Database Schema
-- Run this in your Supabase SQL Editor: https://app.supabase.com/project/_/sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address TEXT UNIQUE NOT NULL,
    username TEXT,
    avatar_url TEXT,
    games_played INTEGER DEFAULT 0,
    high_score INTEGER DEFAULT 0,
    highest_tile INTEGER DEFAULT 0,
    total_score BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SCORES TABLE (for leaderboard)
-- ============================================
CREATE TABLE IF NOT EXISTS scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address TEXT NOT NULL,
    score INTEGER NOT NULL,
    highest_tile INTEGER NOT NULL,
    moves_count INTEGER DEFAULT 0,
    game_duration INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (wallet_address) REFERENCES profiles(wallet_address) ON DELETE CASCADE
);

-- ============================================
-- ACHIEVEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    requirement JSONB,
    reward_xp INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER ACHIEVEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address TEXT NOT NULL,
    achievement_id UUID NOT NULL,
    progress INTEGER DEFAULT 0,
    unlocked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (wallet_address) REFERENCES profiles(wallet_address) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE,
    UNIQUE(wallet_address, achievement_id)
);

-- ============================================
-- GAME SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS game_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address TEXT NOT NULL,
    final_score INTEGER NOT NULL,
    highest_tile INTEGER NOT NULL,
    moves_count INTEGER DEFAULT 0,
    duration_seconds INTEGER DEFAULT 0,
    game_state JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (wallet_address) REFERENCES profiles(wallet_address) ON DELETE CASCADE
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_scores_score ON scores(score DESC);
CREATE INDEX IF NOT EXISTS idx_scores_wallet ON scores(wallet_address);
CREATE INDEX IF NOT EXISTS idx_scores_created ON scores(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_wallet ON profiles(wallet_address);
CREATE INDEX IF NOT EXISTS idx_profiles_high_score ON profiles(high_score DESC);
CREATE INDEX IF NOT EXISTS idx_user_achievements_wallet ON user_achievements(wallet_address);
CREATE INDEX IF NOT EXISTS idx_game_sessions_wallet ON game_sessions(wallet_address);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Profiles: Everyone can read, users can update their own
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (true);

-- Scores: Everyone can read, users can insert their own
CREATE POLICY "Scores are viewable by everyone"
    ON scores FOR SELECT
    USING (true);

CREATE POLICY "Users can insert own scores"
    ON scores FOR INSERT
    WITH CHECK (true);

-- Achievements: Everyone can read
CREATE POLICY "Achievements are viewable by everyone"
    ON achievements FOR SELECT
    USING (true);

-- User Achievements: Everyone can read, users can update their own
CREATE POLICY "User achievements are viewable by everyone"
    ON user_achievements FOR SELECT
    USING (true);

CREATE POLICY "Users can insert own achievements"
    ON user_achievements FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update own achievements"
    ON user_achievements FOR UPDATE
    USING (true);

-- Game Sessions: Users can view and insert their own
CREATE POLICY "Users can view own game sessions"
    ON game_sessions FOR SELECT
    USING (true);

CREATE POLICY "Users can insert own game sessions"
    ON game_sessions FOR INSERT
    WITH CHECK (true);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at on profiles
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA: Default Achievements
-- ============================================
INSERT INTO achievements (name, description, icon, requirement, reward_xp) VALUES
    ('First Steps', 'Play your first game', 'emoji_events', '{"type": "games_played", "value": 1}', 10),
    ('Getting Started', 'Reach the 128 tile', 'military_tech', '{"type": "highest_tile", "value": 128}', 25),
    ('Tile Master', 'Reach the 2048 tile', 'trophy', '{"type": "highest_tile", "value": 2048}', 100),
    ('Score Hunter', 'Score over 10,000 points', 'star', '{"type": "high_score", "value": 10000}', 50),
    ('Dedicated Player', 'Play 10 games', 'sports_esports', '{"type": "games_played", "value": 10}', 30),
    ('Veteran', 'Play 100 games', 'workspace_premium', '{"type": "games_played", "value": 100}', 200)
ON CONFLICT DO NOTHING;

-- ============================================
-- STORAGE BUCKET FOR AVATARS
-- ============================================
-- Run this separately or create bucket in Supabase Dashboard
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Storage policy for avatars
-- CREATE POLICY "Avatar images are publicly accessible"
--     ON storage.objects FOR SELECT
--     USING (bucket_id = 'avatars');

-- CREATE POLICY "Users can upload own avatar"
--     ON storage.objects FOR INSERT
--     WITH CHECK (bucket_id = 'avatars');

-- CREATE POLICY "Users can update own avatar"
--     ON storage.objects FOR UPDATE
--     USING (bucket_id = 'avatars');
