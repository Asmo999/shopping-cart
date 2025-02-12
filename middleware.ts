import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const GRAPHQL_ENDPOINT =
  process.env.GRAPHQL_ENDPOINT || "https://take-home-be.onrender.com/api";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const visitorToken = request.cookies.get("visitor-token");

  if (visitorToken) {
    return response;
  }

  try {
    const registerResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation RegisterVisitor {
            register {
              _id
              token
            }
          }
        `,
      }),
    });

    const { data, errors } = await registerResponse.json();

    if (errors || !data?.register) {
      throw new Error("Failed to register visitor");
    }

    const { token } = data.register;

    response.cookies.set("visitor-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Visitor registration failed:", error);
    return NextResponse.json(
      { error: "Failed to initialize visitor session" },
      { status: 500 },
    );
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
