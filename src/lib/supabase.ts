import { createBrowserClient } from "@supabase/auth-helpers-nextjs"; // اگر این پکیج نصب شده باشد
// یا همان کد قبلی با تایپ دستی:
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);