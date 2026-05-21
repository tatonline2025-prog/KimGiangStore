import { NextResponse } from "next/server";

import {
  createAdminSessionToken,
  getAdminSessionCookieName,
  getAdminSessionTtlSeconds,
  verifyAdminCredentials,
} from "@/lib/admin-auth";

export async function POST(req: Request) {
  const body = (await req.json()) as { username?: string; password?: string };

  if (!body.username || !body.password) {
    return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
  }

  if (!verifyAdminCredentials(body.username, body.password)) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const token = createAdminSessionToken(body.username);
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: getAdminSessionCookieName(),
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: getAdminSessionTtlSeconds(),
  });

  return response;
}
