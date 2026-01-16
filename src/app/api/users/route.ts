import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User"; // Ensure you have a User model
import { requireAdmin } from "@/lib/auth-guard";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();
    // For safety, we usually don't return all users in a real app 
    // without admin protection, so we'll just return a placeholder for now.
    return NextResponse.json({ message: "User Archive Access Authorized" }, { status: 200 });
  } catch (error: any) {
    const status =
      error?.message === "Unauthorized"
        ? 401
        : error?.message === "Forbidden"
        ? 403
        : 500;
    return NextResponse.json({ error: "Archive Access Failed" }, { status });
  }
}
