-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image TEXT,
  content TEXT NOT NULL,
  action_items TEXT[] DEFAULT '{}',
  action_items_title TEXT DEFAULT '행동강령',
  show_action_items BOOLEAN DEFAULT true,
  colors JSONB NOT NULL DEFAULT '{"primary": "#3b82f6", "secondary": "#8b5cf6", "background": "#ffffff", "text": "#1f2937"}'::jsonb,
  require_auth BOOLEAN DEFAULT false,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create signatures table
CREATE TABLE IF NOT EXISTS signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  content TEXT,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON campaigns(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_signatures_campaign_id ON signatures(campaign_id);
CREATE INDEX IF NOT EXISTS idx_signatures_created_at ON signatures(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE signatures ENABLE ROW LEVEL SECURITY;

-- RLS Policies for campaigns
-- Anyone can read published campaigns
CREATE POLICY "Anyone can read campaigns"
  ON campaigns FOR SELECT
  USING (true);

-- Users can create their own campaigns
CREATE POLICY "Users can create campaigns"
  ON campaigns FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Users can update their own campaigns
CREATE POLICY "Users can update own campaigns"
  ON campaigns FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Users can delete their own campaigns
CREATE POLICY "Users can delete own campaigns"
  ON campaigns FOR DELETE
  USING (auth.uid() = user_id OR user_id IS NULL);

-- RLS Policies for signatures
-- Anyone can read signatures
CREATE POLICY "Anyone can read signatures"
  ON signatures FOR SELECT
  USING (true);

-- Anyone can create signatures (if campaign allows)
CREATE POLICY "Anyone can create signatures"
  ON signatures FOR INSERT
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

