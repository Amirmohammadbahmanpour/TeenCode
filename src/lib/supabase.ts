// lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// اضافه کردن یک چک ساده برای جلوگیری از کرش کردن موقع Build
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials are missing!")
}

export const supabase = createBrowserClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
)