import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/constants";

// UX-only gate: bounce un-authenticated visitors from /admin pages to the login
// screen. Real authorization is enforced server-side in every admin page and API
// route via getCurrentAdmin()/requireAdmin() — a forged cookie never passes those.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // /admin/signup guards itself: open only while no account exists, then
  // signed-in admins only. It must bypass this cookie check so a fresh install
  // can reach it at all.
  const isPublicAdminRoute = pathname === "/admin/login" || pathname === "/admin/signup";
  if (pathname.startsWith("/admin") && !isPublicAdminRoute) {
    if (!req.cookies.has(SESSION_COOKIE)) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
