-- Supabase Setup SQL Script
-- Copy and paste this entire script into Supabase SQL Editor and run it

-- Step 1: Create the site_data table
CREATE TABLE IF NOT EXISTS site_data (
  id TEXT PRIMARY KEY,
  data JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Enable Row Level Security
ALTER TABLE site_data ENABLE ROW LEVEL SECURITY;

-- Step 3: Drop existing policies if they exist (safe to run multiple times)
DROP POLICY IF EXISTS "Allow public read" ON site_data;
DROP POLICY IF EXISTS "Allow public write" ON site_data;

-- Step 4: Create policy for public read access
CREATE POLICY "Allow public read" ON site_data
  FOR SELECT
  USING (true);

-- Step 5: Create policy for public write access (INSERT and UPDATE)
CREATE POLICY "Allow public write" ON site_data
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Step 6: Insert initial row
INSERT INTO site_data (id, data, updated_at)
VALUES ('main', '{}', NOW())
ON CONFLICT (id) DO NOTHING;

-- Step 7: Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 8: Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Step 9: Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read users" ON users;
DROP POLICY IF EXISTS "Allow public insert users" ON users;
DROP POLICY IF EXISTS "Allow public update users" ON users;

-- Step 10: Create policies for users table
-- Allow anyone to read users (for login checks)
CREATE POLICY "Allow public read users" ON users
  FOR SELECT
  USING (true);

-- Allow anyone to insert (for signup)
CREATE POLICY "Allow public insert users" ON users
  FOR INSERT
  WITH CHECK (true);

-- Allow users to update their own data (optional, for future use)
CREATE POLICY "Allow public update users" ON users
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Step 11: Insert default admin user (password: password346139)
-- Note: In production, you should hash passwords properly
-- For now, we'll store it as plain text (NOT SECURE - but matches current setup)
INSERT INTO users (email, password_hash, role)
VALUES ('krimirayen296@gmail.com', 'password346139', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Step 12: Create orders table (for storing order submissions from website)
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  description TEXT NOT NULL,
  product_image TEXT,
  product_image_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 13: Enable RLS on orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Step 14: Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read orders" ON orders;
DROP POLICY IF EXISTS "Allow public insert orders" ON orders;
DROP POLICY IF EXISTS "Allow public update orders" ON orders;
DROP POLICY IF EXISTS "Allow public delete orders" ON orders;

-- Step 15: Create policies for orders table
CREATE POLICY "Allow public read orders" ON orders
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert orders" ON orders
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update orders" ON orders
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete orders" ON orders
  FOR DELETE
  USING (true);

-- Done! ✅
-- Your tables are now set up:
-- 1. site_data - stores site content (contact info, socials, portfolio, footer links, calendly)
-- 2. users - stores user accounts for authentication (logins)
-- 3. orders - stores order submissions from the website

