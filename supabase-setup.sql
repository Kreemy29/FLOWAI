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

-- Done! ✅
-- Your table is now set up with public read/write access

