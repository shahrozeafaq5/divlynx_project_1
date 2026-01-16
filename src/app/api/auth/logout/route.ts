import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isSameOriginRequest } from "@/lib/security";

export async function POST(req: NextRequest) {
  if (!isSameOriginRequest(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const cookieStore = await cookies();

  cookieStore.set("token", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return NextResponse.json({ message: "Logged out" });
}
