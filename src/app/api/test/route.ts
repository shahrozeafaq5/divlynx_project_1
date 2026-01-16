import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";

export async function GET(req: NextRequest) {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await requireAdmin(req);
    await connectDB();
    return NextResponse.json({ message: "MongoDB connected successfully" });
  } catch (error: any) {
    const status =
      error?.message === "Unauthorized"
        ? 401
        : error?.message === "Forbidden"
        ? 403
        : 500;

    return NextResponse.json({ error: "Request failed" }, { status });
  }
}
