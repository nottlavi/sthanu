import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("sthanu_token")?.value;

  const { pathname, search } = request.nextUrl;

  const isOnboarding = pathname.startsWith("/onboarding");

  if (!token && !isOnboarding) {
    const onboardingUrl = new URL("/onboarding", request.url);

    onboardingUrl.searchParams.set("returnUrl", pathname + search);

    return NextResponse.redirect(onboardingUrl);
  }

  if (token && isOnboarding) {
    const returnUrl = request.nextUrl.searchParams.get("returnUrl") || "/";

    const targetUrl = new URL(returnUrl, request.url);

    return NextResponse.redirect(targetUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icons|manifest.json).*)",
  ],
};
