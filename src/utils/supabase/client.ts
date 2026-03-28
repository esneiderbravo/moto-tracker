import { createBrowserClient } from '@supabase/ssr';

/**
 * Initializes and returns a Supabase browser client with public environment keys.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
