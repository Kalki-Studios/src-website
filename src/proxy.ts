import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /x9 routes except /x9/login
  if (pathname.startsWith("/x9") && pathname !== "/x9/login") {
    const token = request.cookies.get("src_admin_session")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/x9/login", request.url));
    }

    try {
      await jwtVerify(token, SECRET);
      return NextResponse.next();
    } catch (e) {
      const response = NextResponse.redirect(new URL("/x9/login", request.url));
      response.cookies.delete("src_admin_session");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/x9/:path*"],
};
