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
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

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
