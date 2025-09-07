-- Fix the size constraint to allow null values when age_range is provided
-- This migration fixes the database constraint issue

-- First, drop the existing constraint that requires size to be not null
ALTER TABLE product_variants 
DROP CONSTRAINT IF EXISTS product_variants_size_check;

-- Update the size column to allow null values
ALTER TABLE product_variants 
ALTER COLUMN size DROP NOT NULL;

-- Ensure the check constraint is properly set up
ALTER TABLE product_variants 
DROP CONSTRAINT IF EXISTS check_size_or_age;

-- Add the proper check constraint
ALTER TABLE product_variants 
ADD CONSTRAINT check_size_or_age 
CHECK (
  (size IS NOT NULL AND age_range IS NULL) OR 
  (size IS NULL AND age_range IS NOT NULL)
);
