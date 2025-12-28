import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET not defined");
}

export async function generateToken(payload: {
  id: string;
  role: "user" | "admin";
}) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
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
