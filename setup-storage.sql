-- Setup Supabase Storage for product images
-- Run this in your Supabase SQL editor

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Set up RLS policies for the bucket
-- Allow public read access
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

-- Allow anyone to upload (for product creation)
CREATE POLICY "Anyone can upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images');

-- Allow anyone to update (for product editing)
CREATE POLICY "Anyone can update" ON storage.objects
FOR UPDATE USING (bucket_id = 'product-images');

-- Allow anyone to delete (for product deletion)
CREATE POLICY "Anyone can delete" ON storage.objects
FOR DELETE USING (bucket_id = 'product-images');
