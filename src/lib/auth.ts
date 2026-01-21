import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || null;

/**
 * Verifies a JWT token and returns the decoded payload
 * @param token JWT string
 * @returns decoded payload or null if invalid
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    if (!JWT_SECRET) return null;
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
}
