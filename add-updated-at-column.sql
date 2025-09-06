-- Add updated_at column to product_variants table
-- Run this in your Supabase SQL editor

-- Add the updated_at column to product_variants table
ALTER TABLE product_variants 
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing records to have updated_at set to created_at
UPDATE product_variants 
SET updated_at = created_at 
WHERE updated_at IS NULL;
