import { NextRequest } from "next/server";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function isSameOriginRequest(req: NextRequest) {
  if (SAFE_METHODS.has(req.method)) return true;

  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const expected =
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    req.nextUrl.origin;

  const matches = (value: string) => {
    try {
      return new URL(value).origin === expected;
    } catch {
      return false;
    }
  };

  if (origin && !matches(origin)) return false;
  if (!origin && referer && !matches(referer)) return false;
  return true;
}
