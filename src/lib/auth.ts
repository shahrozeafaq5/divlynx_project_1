// import { SignJWT, jwtVerify } from "jose";
// import bcrypt from "bcryptjs";
// import User from "@/models/User";
// import { connectDB } from "@/lib/db";
// import { NextRequest } from "next/server";

// const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// if (!process.env.JWT_SECRET) {
//   throw new Error("JWT_SECRET not defined in env");
// }

// /* ---------- PASSWORD HELPERS ---------- */

// export function hashPassword(password: string) {
//   return bcrypt.hash(password, 10);
// }

// export function verifyPassword(password: string, hash: string) {
//   return bcrypt.compare(password, hash);
// }

// /* ---------- JWT HELPERS (EDGE SAFE) ---------- */

// export async function generateToken(payload: {
//   id: string;
//   role: "user" | "admin";
// }) {
//   return await new SignJWT(payload)
//     .setProtectedHeader({ alg: "HS256" })
//     .setIssuedAt()
//     .setExpirationTime("7d")
//     .sign(JWT_SECRET);
// }

// export async function verifyToken(token: string) {
//   try {
//     const { payload } = await jwtVerify(token, JWT_SECRET);

//     if (
//       typeof payload !== "object" ||
//       !payload ||
//       !("id" in payload) ||
//       !("role" in payload)
//     ) {
//       return null;
//     }

//     return payload as {
//       id: string;
//       role: "user" | "admin";
//     };
//   } catch {
//     return null;
//   }
// }

// /* ---------- USER FROM COOKIE ---------- */

// export async function getUserFromToken(req: NextRequest) {
//   try {
//     const token = req.cookies.get("token")?.value;
//     if (!token) return null;

//     const payload = await verifyToken(token);
//     if (!payload) return null;

//     await connectDB();

//     const user = await User.findById(payload.id).select(
//       "_id name email role"
//     );

//     return user;
//   } catch {
//     return null;
//   }
// }
