import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

/**
 * Middleware to intercept requests, handle i18n routing, and enforce Supabase SSR authentication.
 * Unauthenticated users attempting to access protected routes are redirected to the registration page.
 */
export async function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(keysToSet) {
          keysToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          keysToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuthPage = pathname.includes('/login') || pathname.includes('/register');
  const isPublicAsset = pathname.includes('.') || pathname.includes('_next');

  if (!isPublicAsset) {
    if (!user && !isAuthPage) {
      request.nextUrl.pathname = '/es/register'; 
      return NextResponse.redirect(request.nextUrl);
    }
    
    if (user && isAuthPage) {
      request.nextUrl.pathname = '/';
      return NextResponse.redirect(request.nextUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
};
