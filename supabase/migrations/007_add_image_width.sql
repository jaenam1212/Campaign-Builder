-- Add image_width column to campaigns table
ALTER TABLE campaigns 
ADD COLUMN IF NOT EXISTS image_width INTEGER DEFAULT 80;

-- Update existing campaigns to have default image width
UPDATE campaigns 
SET image_width = 80 
WHERE image_width IS NULL;

