-- Add font, background_gradient, and effects columns to campaigns table
ALTER TABLE campaigns 
ADD COLUMN IF NOT EXISTS font JSONB,
ADD COLUMN IF NOT EXISTS background_gradient TEXT,
ADD COLUMN IF NOT EXISTS effects JSONB;

