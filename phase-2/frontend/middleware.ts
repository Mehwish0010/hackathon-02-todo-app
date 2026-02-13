import { NextRequest, NextResponse } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/tasks"];

// Routes that should redirect to dashboard if authenticated
const authRoutes = ["/signin", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for session cookie (Better Auth session)
  const sessionCookie = request.cookies.get("better-auth.session_token");
  const isAuthenticated = !!sessionCookie?.value;

  // Check if current path is a protected route
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if current path is an auth route
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Redirect unauthenticated users from protected routes to signin
  if (isProtectedRoute && !isAuthenticated) {
    const signinUrl = new URL("/signin", request.url);
    signinUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signinUrl);
  }

  // Redirect authenticated users from auth routes to dashboard
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all protected routes
    "/dashboard/:path*",
    "/tasks/:path*",
    // Match auth routes
    "/signin",
    "/signup",
  ],
};
