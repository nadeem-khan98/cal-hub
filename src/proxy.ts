import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth";

const protectedRoutes = ["/admin", "/api/admin"];
const publicRoutes = ["/admin/login"];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Check if it's an admin path
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));

  // If we are not hitting an admin route, continue
  if (!isProtectedRoute && !isPublicRoute) {
    return NextResponse.next();
  }

  // Get cookie and decrypt session
  const cookie = request.cookies.get("session")?.value;
  const session = cookie ? await decrypt(cookie) : null;

  // Protect backend API routes for admin
  if (path.startsWith("/api/admin") && !session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Redirect from public login route to dashboard if already logged in
  if (isPublicRoute && session?.user) {
    return NextResponse.redirect(new URL("/admin", request.nextUrl));
  }

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !isPublicRoute && !session?.user) {
    return NextResponse.redirect(new URL("/admin/login", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files etc.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
