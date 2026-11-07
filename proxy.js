import { NextResponse } from "next/server";

export function proxy(request) {
  const accessToken = request.cookies.get("auth_access_token")?.value;
  const refreshToken = request.cookies.get("auth_refresh_token")?.value;

  if (!accessToken && !refreshToken) {
    const loginUrl = new URL("/login", request.url);
    // const redirectTo = `${request.nextUrl.pathname}${request.nextUrl.search}`;
    // loginUrl.searchParams.set("redirect", redirectTo);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/users", "/users/:path*"],
};
