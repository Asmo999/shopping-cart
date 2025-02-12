"use server";

import { cookies } from "next/headers";

export async function getVisitorToken() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("visitor-token");
  if (tokenCookie) {
    return tokenCookie.value;
  } else {
    throw new Error("Visitor token not found");
  }
}
