import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  getLocaleFromPathname,
  isLocale,
  localizePath,
} from "@/lib/i18n";
import {
  checkRateLimit,
  READ_RATE_LIMIT,
  WRITE_RATE_LIMIT,
  rateLimitResetSeconds,
} from "@/lib/rate-limit";

const PUBLIC_FILE = /\.[^/]+$/;

function shouldSkipLocale(pathname: string) {
  return (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/uploadthing") ||
    PUBLIC_FILE.test(pathname)
  );
}

function getRateLimitKey(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? null;
  if (!ip) return null;
  if (ip === "127.0.0.1" || ip === "::1" || ip === "localhost") return null;
  return ip;
}

function handleApiRateLimit(request: NextRequest): NextResponse | null {
  const method = request.method;
  const key = getRateLimitKey(request);

  if (!key) return null;

  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    const { allowed, retryAfterMs, remaining, resetMs } = checkRateLimit(`read:${key}`, READ_RATE_LIMIT);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(retryAfterMs / 1000)),
            "X-RateLimit-Limit": String(READ_RATE_LIMIT.max),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(rateLimitResetSeconds(resetMs)),
          },
        },
      );
    }
    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", String(READ_RATE_LIMIT.max));
    response.headers.set("X-RateLimit-Remaining", String(remaining));
    response.headers.set("X-RateLimit-Reset", String(Math.ceil(resetMs / 1000)));
    return response;
  }

  const { allowed, retryAfterMs, remaining, resetMs } = checkRateLimit(`write:${key}`, WRITE_RATE_LIMIT);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(retryAfterMs / 1000)),
          "X-RateLimit-Limit": String(WRITE_RATE_LIMIT.max),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(resetMs / 1000)),
        },
      },
    );
  }

  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Limit", String(WRITE_RATE_LIMIT.max));
  response.headers.set("X-RateLimit-Remaining", String(remaining));
  response.headers.set("X-RateLimit-Reset", String(Math.ceil(resetMs / 1000)));
  return response;
}

function handleLocale(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    return handleApiRateLimit(request) ?? NextResponse.next();
  }

  if (shouldSkipLocale(pathname)) {
    return NextResponse.next();
  }

  const pathnameLocale = getLocaleFromPathname(pathname);
  const requestHeaders = new Headers(request.headers);

  if (pathnameLocale) {
    requestHeaders.set("x-softai-locale", pathnameLocale);
    requestHeaders.set("x-pathname", pathname);
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.cookies.set(LOCALE_COOKIE, pathnameLocale, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  }

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;

  const url = request.nextUrl.clone();
  url.pathname = localizePath(pathname, locale);
  return NextResponse.redirect(url);
}

export const proxy = clerkMiddleware((_auth, request) => handleLocale(request));

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
