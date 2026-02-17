import { NextRequest, NextResponse } from "next/server";
// import { useGlobalContext } from "./context/maincontext";

export function proxy(req: NextRequest) {
  // const { msg } = useGlobalContext();
  const accessToken = String(req.cookies.get("accessToken")?.value);
  const { pathname } = req.nextUrl;
  console.log({ accessToken, pathname });
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isPrivatePage = pathname.startsWith("/dashboard");

  if (!accessToken && isPrivatePage) {
    // msg.warning("login to access");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (accessToken && isAuthPage) {
    // msg.warning("logout to access");
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login", "/register"],
};
