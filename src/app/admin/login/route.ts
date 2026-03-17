import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const formData = await request.formData();
  const password = formData.get("password");

  if (typeof password !== "string" || password.length === 0) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const adminPassword = process.env["ADMIN_PASSWORD"] ?? "";
  if (password !== adminPassword) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const token = createHash("sha256").update(adminPassword).digest("hex");
  const response = NextResponse.redirect(new URL("/admin", request.url));
  response.cookies.set("admin_token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/admin",
    maxAge: 60 * 60 * 8,
  });
  return response;
}
