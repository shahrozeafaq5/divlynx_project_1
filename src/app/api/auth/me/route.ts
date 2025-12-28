export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth.server";

export async function GET(req: NextRequest) {
  const user = await getUserFromToken(req);

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user });
}
