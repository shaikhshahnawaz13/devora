-- Devora — Supabase Database Setup
-- Run this in your Supabase SQL editor at supabase.com/dashboard

-- 1. Create the analyses table
CREATE TABLE IF NOT EXISTS devora_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  github_username TEXT NOT NULL,
  portfolio_score INTEGER NOT NULL,
  scores JSONB,
  ai_insights JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create an index for fast lookups by user + github username
CREATE INDEX IF NOT EXISTS idx_devora_analyses_user_github
  ON devora_analyses(user_id, github_username);

-- 3. Enable Row Level Security (users can only see their own data)
ALTER TABLE devora_analyses ENABLE ROW LEVEL SECURITY;

-- 4. Policy: users can insert, read, and delete their own analyses
CREATE POLICY "Users can manage own analyses"
  ON devora_analyses
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Done. Copy your project URL and anon key into Devora settings.
