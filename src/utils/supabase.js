import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nsewtmnfznbahoyngdaz.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_dZlaUwV8xKGJjmk1S6gbHw_em8Ju-gw'

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Supabase env variables missing in build, using fallback configuration.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

