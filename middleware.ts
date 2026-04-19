import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const protectedRoutes = ["/overview", "/crm", "/proposals", "/projects", "/finance", "/qbr"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const currentPath = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) => currentPath.startsWith(route));

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // RBAC Boilerplate implementation Check
  if (user && isProtectedRoute) {
    // In a real scenario, you would fetch user's custom role from the `users` table
    // or from custom JWT claims from Supabase Auth
    // const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
    // const role = profile?.role;
    
    const mockRole = "SALES"; // Assume pulled from DB

    if (currentPath.startsWith("/finance") && !["FINANCE", "ADMIN"].includes(mockRole)) {
       return NextResponse.redirect(new URL("/overview", request.url));
    }
    if (currentPath.startsWith("/projects") && !["DELIVERY", "ADMIN"].includes(mockRole)) {
       return NextResponse.redirect(new URL("/overview", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
