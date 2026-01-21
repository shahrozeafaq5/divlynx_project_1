import { SignJWT, jwtVerify } from "jose";

const RAW_SECRET = process.env.JWT_SECRET;
const JWT_SECRET = RAW_SECRET ? new TextEncoder().encode(RAW_SECRET) : null;

export async function generateToken(payload: {
  id: string;
  role: "user" | "admin";
}) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET not defined");
  }
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    if (!JWT_SECRET) return null;
    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (
      typeof payload !== "object" ||
      !payload ||
      !("id" in payload) ||
      !("role" in payload)
    ) {
      return null;
    }

    return payload as {
      id: string;
      role: "user" | "admin";
    };
  } catch {
    return null;
  }
}
