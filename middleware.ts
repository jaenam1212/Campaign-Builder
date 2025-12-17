import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // WordPress 스캔 시도 차단 (빠른 404 반환)
  const wordpressPaths = [
    '/wp-admin',
    '/wp-content',
    '/wp-includes',
    '/wp-login.php',
    '/wp-admin/setup-config.php',
    '/wordpress',
    '/blog',
    '/phpmyadmin',
    '/admin',
    '/administrator',
  ];

  if (wordpressPaths.some(path => pathname.startsWith(path))) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - icon.svg (icon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|icon.svg).*)',
  ],
};

