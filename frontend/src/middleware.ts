import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("sthanu_token")?.value;

  const { pathname } = request.nextUrl;

  const isOnboarding = pathname.startsWith("/onboarding");

  if (!token && !isOnboarding) {
    const onboardingUrl = new URL("/onboarding", request.url);

    return NextResponse.redirect(onboardingUrl);
  }

  if (token && isOnboarding) {
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icons|manifest.json).*)",
  ],
};
