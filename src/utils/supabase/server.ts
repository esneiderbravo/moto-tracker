import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Initializes and returns a Supabase server client that manages cookies for SSR context.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(keysToSet) {
          try {
            keysToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Next.js handles server component cookie errors natively.
          }
        },
      },
    }
  );
}
