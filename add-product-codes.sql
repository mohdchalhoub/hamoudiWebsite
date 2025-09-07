-- Add product codes and age support to existing tables
-- This migration adds the new fields required for the updated product logic

-- Add product_code to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS product_code VARCHAR(6) UNIQUE;

-- Add age_range and variant_code to product_variants table
ALTER TABLE product_variants 
ADD COLUMN IF NOT EXISTS age_range VARCHAR(20),
ADD COLUMN IF NOT EXISTS variant_code VARCHAR(3);

-- Update the unique constraint to include age_range
-- First, drop the existing constraint
ALTER TABLE product_variants 
DROP CONSTRAINT IF EXISTS product_variants_product_id_size_color_key;

-- Create a partial unique index for size-based variants
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_variants_size_unique 
ON product_variants (product_id, size, color) 
WHERE size IS NOT NULL AND age_range IS NULL;

-- Create a partial unique index for age-based variants  
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_variants_age_unique 
ON product_variants (product_id, age_range, color) 
WHERE age_range IS NOT NULL AND size IS NULL;

-- Create index for faster lookups on product_code
CREATE INDEX IF NOT EXISTS idx_products_product_code ON products(product_code);

-- Create index for faster lookups on variant_code
CREATE INDEX IF NOT EXISTS idx_product_variants_variant_code ON product_variants(variant_code);

-- Add check constraint to ensure either size or age_range is provided (but not both)
ALTER TABLE product_variants 
ADD CONSTRAINT check_size_or_age 
CHECK (
  (size IS NOT NULL AND age_range IS NULL) OR 
  (size IS NULL AND age_range IS NOT NULL)
);
