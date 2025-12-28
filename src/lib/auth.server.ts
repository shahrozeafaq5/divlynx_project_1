import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { NextRequest } from "next/server";
import { verifyToken } from "./auth.token";

/* ---------- PASSWORD ---------- */

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

/* ---------- USER FROM TOKEN (NODE ONLY) ---------- */

export async function getUserFromToken(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  await connectDB();

  const user = await User.findById(payload.id).select(
    "_id name email role"
  );

  return user;
}
