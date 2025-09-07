-- Add quantity field to products table
ALTER TABLE products ADD COLUMN quantity INTEGER DEFAULT 0;

-- Update existing products to have a default quantity of 10
UPDATE products SET quantity = 10 WHERE quantity IS NULL OR quantity = 0;

-- Add constraint to ensure quantity is non-negative
ALTER TABLE products ADD CONSTRAINT products_quantity_check CHECK (quantity >= 0);

-- Add index for better performance on quantity queries
CREATE INDEX idx_products_quantity ON products(quantity);

-- Add comment to document the field
COMMENT ON COLUMN products.quantity IS 'Total available quantity for this product across all variants';
