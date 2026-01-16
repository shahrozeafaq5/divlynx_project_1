import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth.token";


export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/") {
    return NextResponse.next();
  }

  // 1. 🛡️ EXTRA SAFETY: If it's a static file or internal Next.js file, SKIP middleware
  // This prevents the "Unexpected token '<'" error
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/static') ||
    pathname.includes('.') // Catches favicon.ico, images, .js files
  ) {
    return NextResponse.next();
  }

  // 2. ✅ Allow Public Routes
  const isPublicRoute = 
    pathname === "/" ||
    pathname === "/login" || 
    pathname === "/register" || 
    pathname.startsWith("/books") ||
    pathname.startsWith("/api/public");

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  // 3. 🔐 No token -> Redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // 4. 🔒 Admin Protection
    if (pathname.startsWith("/admin") && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/books", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// 5. ⚙️ Updated Matcher
export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (maybe you want middleware on some APIs, if so, remove this)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
