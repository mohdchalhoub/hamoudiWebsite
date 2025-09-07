-- Add multiple media support to products table
-- This migration adds back the images array and adds videos array for multiple media support

-- Add images array column back to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Add videos array column for video support
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS videos TEXT[] DEFAULT '{}';

-- Copy existing image_url to images array if it exists
UPDATE products 
SET images = ARRAY[image_url] 
WHERE image_url IS NOT NULL AND image_url != '';

-- Create index for faster lookups on images array
CREATE INDEX IF NOT EXISTS idx_products_images ON products USING GIN(images);

-- Create index for faster lookups on videos array
CREATE INDEX IF NOT EXISTS idx_products_videos ON products USING GIN(videos);

-- Add comment to document the new structure
COMMENT ON COLUMN products.images IS 'Array of image URLs for the product';
COMMENT ON COLUMN products.videos IS 'Array of video URLs for the product';
