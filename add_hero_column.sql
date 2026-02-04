-- Run this in your Supabase SQL Editor

ALTER TABLE site_settings 
ADD COLUMN hero_image_url TEXT;

-- Verify it was added
SELECT * FROM site_settings LIMIT 1;
