import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware() {
  const response = NextResponse.next();
  const cookieStore = await cookies();

  cookieStore.set(
    "visitor-token",
    "ee1b3f5316fd294450db5e927f7168f6ef28fa4648ecda81ff259135c2e9b2412668b34a5be67f284403f142524e42b8136c33e204e72e4a271f6e79dd3cdef8",
  );

  response.cookies.set(
    "visitor-token",
    "ee1b3f5316fd294450db5e927f7168f6ef28fa4648ecda81ff259135c2e9b2412668b34a5be67f284403f142524e42b8136c33e204e72e4a271f6e79dd3cdef8",
  );
  return response;
}

export const config = {
  matcher: ["/api/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};
