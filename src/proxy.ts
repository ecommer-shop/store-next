import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
  "/:locale/account(.*)",
  "/:locale/checkout(.*)",
  "/:locale/account/profile(.*)",
]);

export default clerkMiddleware(async (auth, req) => {

  const { pathname, search } = req.nextUrl;
  const cleanPathname = pathname.startsWith("/")
  ? pathname.slice(1)
  : pathname;

  const locale = req.nextUrl.locale ?? "es";
  if (cleanPathname === "/legal/terms") {
    const domain = new URL(process.env.NEXT_PUBLIC_SITE_URL!);
    const returnTo = new URL(`${locale}${pathname}${search}`, domain).toString();
    domain.searchParams.set("redirect_url", returnTo)
    return NextResponse.redirect(domain);
  }

  if (cleanPathname === "/legal/privacy") {
    const domain = new URL(process.env.NEXT_PUBLIC_SITE_URL!);
    const returnTo = new URL(`${locale}${pathname}${search}`, domain).toString();
    domain.searchParams.set("redirect_url", returnTo)
    return NextResponse.redirect(domain);
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith(`/${locale}/_next`) ||
    pathname.match(/\.(.*)$/)
  ) {
    return NextResponse.next();
  }

  if (isProtectedRoute(req)) {
    const { userId } = await auth();

    if (!userId) {
      const signInUrl = new URL(process.env.CLERK_SIGN_IN_URL!);
      const domain = new URL(process.env.NEXT_PUBLIC_SITE_URL!);

      const returnTo = new URL(`${locale}${pathname}${search}`, domain).toString();

      signInUrl.searchParams.set("redirect_url", returnTo);
      return NextResponse.redirect(signInUrl);
    }
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
