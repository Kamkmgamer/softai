import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/projects(.*)",
  "/library(.*)",
  "/billing(.*)",
  "/settings(.*)",
  "/admin(.*)",
  "/api/projects(.*)",
  "/api/me(.*)",
  "/api/report-abuse(.*)",
  "/api/admin(.*)",
]);

const hasClerk =
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
  Boolean(process.env.CLERK_SECRET_KEY);

const clerkProxy = clerkMiddleware(async (auth, request) => {
  if (hasClerk && isProtectedRoute(request)) {
    await auth.protect();
  }
});

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  if (!hasClerk) {
    return NextResponse.next();
  }

  return clerkProxy(request, event);
}

export const config = {
  matcher: [
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpg|jpeg|gif|png|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
