import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const accessToken = String(req.cookies.get("accessToken")?.value);
  const { pathname } = req.nextUrl;
  console.log({ accessToken, pathname });
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isPrivatePage = pathname.startsWith("/dashboard");

  if (!accessToken && isPrivatePage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (accessToken && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login", "/register"],
};
