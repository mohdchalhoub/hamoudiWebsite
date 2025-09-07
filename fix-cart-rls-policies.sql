-- Fix RLS policies for cart_items table to support guest sessions
-- This migration updates the cart_items policies to allow both authenticated users and guest sessions

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can view their own cart items" ON cart_items;

-- Create new policies that support both authenticated users and guest sessions

-- Policy for authenticated users (using customer_id)
CREATE POLICY "Authenticated users can manage their cart items" ON cart_items 
FOR ALL USING (customer_id = auth.uid() AND customer_id IS NOT NULL);

-- Policy for guest users (using session_id)
CREATE POLICY "Guest users can manage their session cart items" ON cart_items 
FOR ALL USING (session_id IS NOT NULL AND customer_id IS NULL);

-- Policy for reading cart items (both authenticated and guest)
CREATE POLICY "Users can read their cart items" ON cart_items 
FOR SELECT USING (
  (customer_id = auth.uid() AND customer_id IS NOT NULL) OR 
  (session_id IS NOT NULL AND customer_id IS NULL)
);

-- Policy for inserting cart items (both authenticated and guest)
CREATE POLICY "Users can insert cart items" ON cart_items 
FOR INSERT WITH CHECK (
  (customer_id = auth.uid() AND customer_id IS NOT NULL) OR 
  (session_id IS NOT NULL AND customer_id IS NULL)
);

-- Policy for updating cart items (both authenticated and guest)
CREATE POLICY "Users can update their cart items" ON cart_items 
FOR UPDATE USING (
  (customer_id = auth.uid() AND customer_id IS NOT NULL) OR 
  (session_id IS NOT NULL AND customer_id IS NULL)
);

-- Policy for deleting cart items (both authenticated and guest)
CREATE POLICY "Users can delete their cart items" ON cart_items 
FOR DELETE USING (
  (customer_id = auth.uid() AND customer_id IS NOT NULL) OR 
  (session_id IS NOT NULL AND customer_id IS NULL)
);
