import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 알려진 봇 User-Agent 패턴
const BOT_PATTERNS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
  /curl/i,
  /wget/i,
  /python/i,
  /java/i,
  /go-http/i,
  /http/i,
  /scrapy/i,
  /postman/i,
  /insomnia/i,
  /ahrefs/i,
  /semrush/i,
  /majestic/i,
  /dotbot/i,
  /mj12bot/i,
  /petalbot/i,
  /bingbot/i,
  /yandex/i,
  /baiduspider/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /linkedinbot/i,
  /slackbot/i,
  /whatsapp/i,
  /telegrambot/i,
  /discordbot/i,
  /applebot/i,
  /googlebot/i,
  /msnbot/i,
  /ia_archiver/i,
  /archive\.org_bot/i,
  /wayback/i,
];

// 허용할 봇 (검색 엔진 등)
const ALLOWED_BOTS = [
  /googlebot/i,
  /bingbot/i,
  /slurp/i, // Yahoo
  /duckduckbot/i,
  /baiduspider/i,
  /yandex/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /linkedinbot/i,
  /applebot/i,
];

function isBot(userAgent: string | null): boolean {
  if (!userAgent) return false;
  
  // 허용된 봇은 통과
  if (ALLOWED_BOTS.some(pattern => pattern.test(userAgent))) {
    return false;
  }
  
  // 봇 패턴 매칭
  return BOT_PATTERNS.some(pattern => pattern.test(userAgent));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';

  // WordPress 스캔 시도 차단 (빠른 404 반환, 캐싱 추가)
  const wordpressPaths = [
    '/wp-admin',
    '/wp-content',
    '/wp-includes',
    '/wp-login.php',
    '/wp-admin/setup-config.php',
    '/wordpress',
    '/blog',
    '/phpmyadmin',
    '/administrator',
    '/.env',
    '/.git',
    '/config.php',
    '/phpinfo.php',
    '/shell.php',
    '/xmlrpc.php',
  ];

  if (wordpressPaths.some(path => pathname.startsWith(path))) {
    return new NextResponse(null, {
      status: 404,
      headers: {
        'Cache-Control': 'public, max-age=86400', // 404도 24시간 캐싱
      }
    });
  }

  // 알려지지 않은 봇 차단 (검색 엔진은 허용)
  if (isBot(userAgent)) {
    // 봇은 정적 파일과 API는 허용하되, 페이지 요청은 차단
    if (!pathname.startsWith('/api') && !pathname.startsWith('/_next')) {
      return new NextResponse(null, { status: 403 });
    }
  }

  // 응답 생성
  const response = NextResponse.next();

  // 정적 자산에 대한 강력한 캐싱 헤더 추가
  if (pathname.startsWith('/_next/static') ||
      pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg|ico|woff|woff2|ttf|eot)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  // API 경로는 짧은 캐싱
  if (pathname.startsWith('/api/campaigns/') && pathname.includes('/og-image')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');
  } else if (pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=120');
  }

  return response;
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

