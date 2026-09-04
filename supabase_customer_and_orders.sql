-- ==============================================================================
-- 🌙 LUNAR STORE — CUSTOMERS & ORDERS SUPABASE DATABASE SETUP
-- ==============================================================================
-- INSTRUCTIONS:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Go to "SQL Editor" on the left navigation bar.
-- 3. Click "New Query", paste this entire script, and click "Run".
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. CUSTOMERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'United States',
  reset_otp TEXT,
  reset_otp_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure reset_otp columns exist if table was already created earlier
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS reset_otp TEXT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS reset_otp_expires_at TIMESTAMPTZ;

-- Enable RLS for customers table
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Customer table RLS Policies
DROP POLICY IF EXISTS "Allow select for customer login & profiles" ON public.customers;
CREATE POLICY "Allow select for customer login & profiles" ON public.customers
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow customer registration" ON public.customers;
CREATE POLICY "Allow customer registration" ON public.customers
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow customer profile updates" ON public.customers;
CREATE POLICY "Allow customer profile updates" ON public.customers
  FOR UPDATE USING (true);

-- ------------------------------------------------------------------------------
-- AUTOMATIC SYNC TRIGGER: Customers -> Supabase Auth (auth.users)
-- Ensures every newly registered customer immediately appears in Supabase Users
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_customer()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = NEW.email) THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      role,
      aud,
      confirmation_token
    ) VALUES (
      NEW.id,
      '00000000-0000-0000-0000-000000000000',
      NEW.email,
      crypt(NEW.password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object('full_name', NEW.full_name, 'phone', NEW.phone),
      now(),
      now(),
      'authenticated',
      'authenticated',
      ''
    );

    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      NEW.id,
      jsonb_build_object('sub', NEW.id, 'email', NEW.email),
      'email',
      NEW.id::text,
      now(),
      now(),
      now()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_customer_created ON public.customers;
CREATE TRIGGER on_customer_created
  AFTER INSERT ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_customer();

-- ------------------------------------------------------------------------------
-- 2. ORDERS TABLE (Includes COD & Card Payment Details)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'card')),
  payment_status TEXT NOT NULL DEFAULT 'pending',
  order_status TEXT NOT NULL DEFAULT 'processing',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for orders table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Order table RLS Policies
DROP POLICY IF EXISTS "Allow public to create orders" ON public.orders;
CREATE POLICY "Allow public to create orders" ON public.orders
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow reading orders" ON public.orders;
CREATE POLICY "Allow reading orders" ON public.orders
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow updating orders" ON public.orders;
CREATE POLICY "Allow updating orders" ON public.orders
  FOR UPDATE USING (true);

-- ------------------------------------------------------------------------------
-- 3. HELPFUL INDEXES (Optimized for Mobile Number & Email Lookups)
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_payment_method ON public.orders(payment_method);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- ==============================================================================
-- ✨ DEMO CUSTOMER ACCOUNT (Optional test account)
-- ==============================================================================
INSERT INTO public.customers (email, password, full_name, phone, address, city, state, postal_code, country)
VALUES (
  'alex.vanguard@lunar.com',
  'lunar@123',
  'Alex Vanguard',
  '+1 (555) 019-2834',
  '42 Lunar Boulevard, Suite 800',
  'San Francisco',
  'CA',
  '94107',
  'United States'
)
ON CONFLICT (email) DO NOTHING;
