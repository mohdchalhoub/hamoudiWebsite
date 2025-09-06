-- Kids E-commerce Database Schema
-- This file contains the complete database schema for the kids e-commerce application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  description TEXT,
  short_description VARCHAR(500),
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  compare_at_price DECIMAL(10,2) CHECK (compare_at_price >= 0),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  gender VARCHAR(20) NOT NULL CHECK (gender IN ('boys', 'girls', 'unisex')),
  age_range VARCHAR(20) DEFAULT '3-12', -- e.g., '3-5', '6-8', '9-12', '3-12'
  brand VARCHAR(100),
  material VARCHAR(200),
  care_instructions TEXT,
  image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  is_digital BOOLEAN DEFAULT false,
  weight_grams INTEGER,
  dimensions_cm JSONB, -- {length, width, height}
  seo_title VARCHAR(200),
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product variants table (sizes, colors, etc.)
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku VARCHAR(100) UNIQUE,
  size VARCHAR(20) NOT NULL,
  color VARCHAR(50) NOT NULL,
  color_hex VARCHAR(7), -- Hex color code
  stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  price_adjustment DECIMAL(10,2) DEFAULT 0, -- Additional cost for this variant
  weight_adjustment INTEGER DEFAULT 0, -- Additional weight in grams
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, size, color)
);

-- Customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  date_of_birth DATE,
  gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other')),
  newsletter_subscribed BOOLEAN DEFAULT false,
  marketing_consent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Addresses table
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('shipping', 'billing')),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  company VARCHAR(100),
  address_line_1 VARCHAR(200) NOT NULL,
  address_line_2 VARCHAR(200),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'US',
  phone VARCHAR(20),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart items table
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  session_id VARCHAR(255), -- For guest users
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(customer_id, variant_id),
  UNIQUE(session_id, variant_id)
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) NOT NULL UNIQUE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  email VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partially_refunded')),
  payment_method VARCHAR(50),
  payment_reference VARCHAR(100),
  subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
  tax_amount DECIMAL(10,2) DEFAULT 0 CHECK (tax_amount >= 0),
  shipping_amount DECIMAL(10,2) DEFAULT 0 CHECK (shipping_amount >= 0),
  discount_amount DECIMAL(10,2) DEFAULT 0 CHECK (discount_amount >= 0),
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
  currency VARCHAR(3) DEFAULT 'USD',
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  notes TEXT,
  tracking_number VARCHAR(100),
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  product_name VARCHAR(200) NOT NULL,
  product_sku VARCHAR(100),
  variant_description TEXT, -- e.g., "Size: M, Color: Blue"
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wishlist table
CREATE TABLE wishlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(customer_id, product_id)
);

-- Coupons table
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  type VARCHAR(20) NOT NULL CHECK (type IN ('percentage', 'fixed_amount', 'free_shipping')),
  value DECIMAL(10,2) NOT NULL CHECK (value >= 0),
  minimum_amount DECIMAL(10,2) DEFAULT 0,
  maximum_discount DECIMAL(10,2),
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_gender ON products(gender);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_sku ON product_variants(sku);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_user_id ON customers(user_id);

CREATE INDEX idx_addresses_customer ON addresses(customer_id);
CREATE INDEX idx_addresses_type ON addresses(type);

CREATE INDEX idx_cart_customer ON cart_items(customer_id);
CREATE INDEX idx_cart_session ON cart_items(session_id);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

CREATE INDEX idx_order_items_order ON order_items(order_id);

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_customer ON reviews(customer_id);

CREATE INDEX idx_wishlist_customer ON wishlist_items(customer_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number = 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_sequence')::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_sequence START 1;

-- Add trigger for order number generation
CREATE TRIGGER generate_order_number_trigger
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION generate_order_number();

-- Insert sample categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Tops', 'tops', 'T-shirts, shirts, blouses, and more', 1),
('Bottoms', 'bottoms', 'Pants, shorts, skirts, and leggings', 2),
('Dresses', 'dresses', 'One-piece outfits for special occasions', 3),
('Outerwear', 'outerwear', 'Jackets, hoodies, and sweaters', 4),
('Accessories', 'accessories', 'Hats, bags, and other accessories', 5),
('Shoes', 'shoes', 'Sneakers, sandals, and dress shoes', 6),
('Sleepwear', 'sleepwear', 'Pajamas and nightgowns', 7),
('Underwear', 'underwear', 'Undergarments and basics', 8);

-- Insert sample products
INSERT INTO products (name, slug, description, short_description, price, compare_at_price, category_id, gender, age_range, brand, material, care_instructions, images, is_featured, is_active) VALUES
('Space Explorer T-Shirt', 'space-explorer-t-shirt', 'A fun and comfortable t-shirt featuring space exploration themes that kids love. Made from soft, breathable cotton.', 'Soft cotton t-shirt with space theme', 19.99, 24.99, (SELECT id FROM categories WHERE slug = 'tops'), 'boys', '4-8', 'KidsCo', '100% Cotton', 'Machine wash cold, tumble dry low', ARRAY['/boys-space-explorer-t-shirt.png'], true, true),
('Princess Castle Top', 'princess-castle-top', 'A sparkly and magical top perfect for little princesses. Features a beautiful castle design with glitter details.', 'Sparkly princess-themed top', 29.99, 34.99, (SELECT id FROM categories WHERE slug = 'tops'), 'girls', '3-7', 'PrincessWear', 'Polyester with glitter', 'Hand wash recommended', ARRAY['/girls-princess-castle-top-sparkly-pink.png'], true, true),
('Superhero Hoodie', 'superhero-hoodie', 'A cozy hoodie with superhero cape design. Perfect for imaginative play and everyday wear.', 'Hoodie with superhero cape design', 39.99, 49.99, (SELECT id FROM categories WHERE slug = 'outerwear'), 'boys', '5-10', 'HeroKids', '80% Cotton, 20% Polyester', 'Machine wash cold', ARRAY['/boys-superhero-hoodie-blue.png'], true, true),
('Unicorn Dress', 'unicorn-dress', 'A magical unicorn dress with rainbow colors and sparkly details. Perfect for special occasions.', 'Magical unicorn dress with rainbow colors', 49.99, 59.99, (SELECT id FROM categories WHERE slug = 'dresses'), 'girls', '4-8', 'MagicWear', 'Polyester with sequins', 'Dry clean only', ARRAY['/girls-unicorn-dress-rainbow-colors.png'], true, true);

-- Insert product variants
INSERT INTO product_variants (product_id, sku, size, color, color_hex, stock_quantity, price_adjustment) VALUES
-- Space Explorer T-Shirt variants
((SELECT id FROM products WHERE slug = 'space-explorer-t-shirt'), 'SE-TS-S-BL', 'S', 'Blue', '#3B82F6', 10, 0),
((SELECT id FROM products WHERE slug = 'space-explorer-t-shirt'), 'SE-TS-M-BL', 'M', 'Blue', '#3B82F6', 15, 0),
((SELECT id FROM products WHERE slug = 'space-explorer-t-shirt'), 'SE-TS-L-BL', 'L', 'Blue', '#3B82F6', 12, 0),
((SELECT id FROM products WHERE slug = 'space-explorer-t-shirt'), 'SE-TS-S-RD', 'S', 'Red', '#EF4444', 8, 0),
((SELECT id FROM products WHERE slug = 'space-explorer-t-shirt'), 'SE-TS-M-RD', 'M', 'Red', '#EF4444', 10, 0),
-- Princess Castle Top variants
((SELECT id FROM products WHERE slug = 'princess-castle-top'), 'PC-TP-S-PK', 'S', 'Pink', '#EC4899', 5, 0),
((SELECT id FROM products WHERE slug = 'princess-castle-top'), 'PC-TP-M-PK', 'M', 'Pink', '#EC4899', 8, 0),
((SELECT id FROM products WHERE slug = 'princess-castle-top'), 'PC-TP-L-PK', 'L', 'Pink', '#EC4899', 6, 0),
-- Superhero Hoodie variants
((SELECT id FROM products WHERE slug = 'superhero-hoodie'), 'SH-HD-S-BL', 'S', 'Blue', '#1E40AF', 7, 0),
((SELECT id FROM products WHERE slug = 'superhero-hoodie'), 'SH-HD-M-BL', 'M', 'Blue', '#1E40AF', 10, 0),
((SELECT id FROM products WHERE slug = 'superhero-hoodie'), 'SH-HD-L-BL', 'L', 'Blue', '#1E40AF', 8, 0),
((SELECT id FROM products WHERE slug = 'superhero-hoodie'), 'SH-HD-M-RD', 'M', 'Red', '#DC2626', 5, 0),
-- Unicorn Dress variants
((SELECT id FROM products WHERE slug = 'unicorn-dress'), 'UD-DR-S-ML', 'S', 'Multi', '#8B5CF6', 3, 0),
((SELECT id FROM products WHERE slug = 'unicorn-dress'), 'UD-DR-M-ML', 'M', 'Multi', '#8B5CF6', 5, 0),
((SELECT id FROM products WHERE slug = 'unicorn-dress'), 'UD-DR-L-ML', 'L', 'Multi', '#8B5CF6', 4, 0);

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to products and categories
CREATE POLICY "Public can view categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view product variants" ON product_variants FOR SELECT USING (is_active = true);

-- Create policies for authenticated users
CREATE POLICY "Users can view their own cart items" ON cart_items FOR ALL USING (customer_id = auth.uid());
CREATE POLICY "Users can view their own orders" ON orders FOR ALL USING (customer_id = auth.uid());
CREATE POLICY "Users can view their own order items" ON order_items FOR ALL USING (order_id IN (SELECT id FROM orders WHERE customer_id = auth.uid()));
CREATE POLICY "Users can view their own reviews" ON reviews FOR ALL USING (customer_id = auth.uid());
CREATE POLICY "Users can view their own wishlist" ON wishlist_items FOR ALL USING (customer_id = auth.uid());
CREATE POLICY "Users can manage their own customer profile" ON customers FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage their own addresses" ON addresses FOR ALL USING (customer_id = auth.uid());
