import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  detectLocaleFromAcceptLanguage,
  getLocaleFromPathname,
  isLocale,
  localizePath,
} from "@/lib/i18n";

const PUBLIC_FILE = /\.[^/]+$/;

function shouldSkipLocale(pathname: string) {
  return (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/uploadthing") ||
    PUBLIC_FILE.test(pathname)
  );
}

function handleLocale(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (shouldSkipLocale(pathname) || pathname.startsWith("/api/")) {
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
  const locale = isLocale(cookieLocale)
    ? cookieLocale
    : detectLocaleFromAcceptLanguage(request.headers.get("accept-language")) || DEFAULT_LOCALE;

  const url = request.nextUrl.clone();
  url.pathname = localizePath(pathname, locale);
  return NextResponse.redirect(url);
}

export default clerkMiddleware((_auth, request) => handleLocale(request));

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
