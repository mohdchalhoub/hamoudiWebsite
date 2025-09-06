-- Migration to update products table schema
-- Run this in your Supabase SQL editor

-- First, add the new image_url column
ALTER TABLE products ADD COLUMN image_url TEXT;

-- Copy data from images array to image_url (take first image if exists)
UPDATE products 
SET image_url = images[1] 
WHERE images IS NOT NULL AND array_length(images, 1) > 0;

-- Add tags column
ALTER TABLE products ADD COLUMN tags TEXT[] DEFAULT '{}';

-- Drop the old images column
ALTER TABLE products DROP COLUMN images;
