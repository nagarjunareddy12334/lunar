-- ==============================================================================
-- 🌙 LUNAR STORE — ADMIN AUTHENTICATION TABLE & CREDENTIALS SETUP
-- ==============================================================================
-- INSTRUCTIONS:
-- 1. Open your Supabase Project Dashboard: https://supabase.com/dashboard
-- 2. Go to "SQL Editor" on the left navigation bar.
-- 3. Click "New Query", paste this entire script, and click "Run".
-- ==============================================================================

-- Step 1: Create the admin_users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Step 2: Enable Row Level Security (RLS)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS Policies
-- Allow checking credentials during admin login
DROP POLICY IF EXISTS "Allow select for login authentication" ON public.admin_users;
CREATE POLICY "Allow select for login authentication" ON public.admin_users
  FOR SELECT USING (true);

-- Allow inserting/updating credentials
DROP POLICY IF EXISTS "Allow admin management" ON public.admin_users;
CREATE POLICY "Allow admin management" ON public.admin_users
  FOR ALL USING (true);

-- Step 4: Insert your initial Admin Credentials
-- 👉 CHANGE 'admin' and 'lunar@2024' or 'admin@lunar.com' TO WHATEVER YOU PREFER:
INSERT INTO public.admin_users (username, password, email, role, is_active)
VALUES (
  'admin',
  'lunar@2024',
  'admin@lunar.com',
  'admin',
  true
)
ON CONFLICT (username) 
DO UPDATE SET 
  password = EXCLUDED.password,
  email = EXCLUDED.email,
  updated_at = now();

-- ==============================================================================
-- 💡 HOW TO CHANGE YOUR ADMIN CREDENTIALS DIRECTLY IN SUPABASE:
-- ==============================================================================
-- OPTION A (Via Supabase Table Editor):
-- 1. In Supabase Dashboard, click "Table Editor" -> "admin_users".
-- 2. Double-click the 'username' or 'password' column on any row to edit directly.
--
-- OPTION B (Via SQL Query):
-- Run this in SQL Editor whenever you want to change your username or password:
--
-- UPDATE public.admin_users 
-- SET 
--   username = 'my_new_username', 
--   password = 'my_new_secret_password',
--   email = 'my_email@gmail.com'
-- WHERE username = 'admin';
-- ==============================================================================
