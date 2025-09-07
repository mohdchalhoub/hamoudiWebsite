-- Add season field to products table
-- This migration adds the season field to track when products are suitable for

-- Add 'season' column (enum: summer, winter)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS season VARCHAR(20) DEFAULT 'summer';

-- Add constraint to ensure only valid seasons
-- First drop the constraint if it exists, then add it
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_season') THEN
        ALTER TABLE products DROP CONSTRAINT check_season;
    END IF;
END $$;

ALTER TABLE products
ADD CONSTRAINT check_season 
CHECK (season IN ('summer', 'winter', 'all_season'));

-- Add comment for clarity
COMMENT ON COLUMN products.season IS 'Season when the product is most suitable: summer, winter, or all_season';

-- Create index for faster queries on season
CREATE INDEX IF NOT EXISTS idx_products_season ON products (season);
