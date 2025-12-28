import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyPassword } from "@/lib/auth.server";
import { generateToken } from "@/lib/auth.token";


export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // ✅ FIX 1: Add 'await' here because generateToken is now async
    const token = await generateToken({
      id: user._id.toString(),
      role: user.role,
    });

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
    });

    // ✅ FIX 2: Ensure cookie setting is robust
    response.cookies.set("token", token, {
      httpOnly: true, // Prevents XSS attacks
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    // Log the error for debugging
    console.error("Login Error:", error);
    
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}