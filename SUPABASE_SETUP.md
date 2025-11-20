# Supabase Setup Guide - Quick & Easy! 🚀

Supabase is much simpler than Firebase. Follow these steps:

## Step 1: Create Supabase Account & Project

1. **Go to Supabase**: https://supabase.com/
2. Click **"Start your project"** or **"Sign in"**
3. Sign in with GitHub (recommended) or email
4. Click **"New project"**
5. Fill in the form:
   - **Name**: `flowai-website` (or any name)
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to your users (e.g., `North America (East)`)
6. Click **"Create new project"**
7. Wait ~2 minutes for setup to complete

## Step 2: Get Your Supabase Credentials

1. Once your project is ready, you'll see the project dashboard
2. Click on the **gear icon ⚙️** (Settings) in the left sidebar
3. Click **"API"** in the settings menu
4. You'll see two important values:

   **a) Project URL**:
   - Look for **"Project URL"** or **"URL"**
   - Example: `https://abcdefghijklmnop.supabase.co`
   - **COPY THIS** - This is your `VITE_SUPABASE_URL`

   **b) Anon/Public Key**:
   - Look for **"anon public"** or **"Project API keys"** → **"anon"**
   - It's a long string starting with `eyJ...`
   - **COPY THIS** - This is your `VITE_SUPABASE_ANON_KEY`

## Step 3 & 4: Create Table and Set Permissions (SQL Editor - EASIEST WAY! 🚀)

**Go to SQL Editor** in the left sidebar, then click **"New query"** and paste this entire script:

```sql
-- Create the site_data table
CREATE TABLE IF NOT EXISTS site_data (
  id TEXT PRIMARY KEY,
  data JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE site_data ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read" ON site_data
  FOR SELECT
  USING (true);

-- Create policy for public write access (INSERT and UPDATE)
CREATE POLICY "Allow public write" ON site_data
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert initial row
INSERT INTO site_data (id, data, updated_at)
VALUES ('main', '{}', NOW())
ON CONFLICT (id) DO NOTHING;
```

**Click "Run"** (or press Ctrl+Enter) and you're done! ✅

This creates the table, enables RLS, sets up both read and write policies, and inserts the initial data row all at once.

## Step 5: Add Environment Variables

### For Local Development:

1. Create a `.env` file in your project root (`media-flow-maker/.env`)
2. Add these lines (replace with YOUR values from Step 2):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important**: Replace `your-project-id` and the long key with your actual values!

### For Render Deployment:

1. Go to **Render Dashboard**: https://dashboard.render.com
2. Select your **Static Site**
3. Click **"Environment"** tab
4. Click **"Add Environment Variable"** for each:

   - **Key**: `VITE_SUPABASE_URL`
     **Value**: `https://your-project-id.supabase.co` (your actual URL)

   - **Key**: `VITE_SUPABASE_ANON_KEY`
     **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your actual key)

5. Click **"Save Changes"**
6. **Redeploy** your site on Render

## Step 6: Install Supabase Package

```bash
cd media-flow-maker
npm install
```

This will install `@supabase/supabase-js` that's already in your `package.json`.

## Step 7: Test It! ✅

1. **Start local dev server**: `npm run dev`
2. **Login as admin**: `krimirayen296@gmail.com` / `password346139`
3. **Go to Admin Dashboard**
4. **Edit something** (e.g., change contact info or add portfolio item)
5. **Check Supabase**: Go to Table Editor → `site_data` table → You should see data!
6. **Open site in incognito/another browser** → Changes should be visible!

## Troubleshooting

- **"Supabase not initialized"**: Check environment variables are set correctly
- **"Permission denied"**: Make sure RLS policies are set up (Step 4)
- **"Table not found"**: Make sure you created the `site_data` table (Step 3)
- **Data not syncing**: Check browser console (F12) for errors

## That's It! 🎉

Supabase is much simpler than Firebase - no complex rules, just a simple table setup!

