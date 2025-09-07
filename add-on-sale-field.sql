-- Add on_sale field to products table
-- This migration adds the on_sale boolean field to track products that are currently on sale

-- Add 'on_sale' column (boolean)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS on_sale BOOLEAN DEFAULT FALSE;

-- Add comment for clarity
COMMENT ON COLUMN products.on_sale IS 'Indicates if the product is currently on sale.';

-- Create index for faster queries on sale products
CREATE INDEX IF NOT EXISTS idx_products_on_sale ON products (on_sale) WHERE on_sale = TRUE;
