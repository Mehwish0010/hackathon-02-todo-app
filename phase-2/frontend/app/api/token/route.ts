import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// Simple JWT encoding (matching what backend expects)
function base64url(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function createJWT(payload: object, secret: string): string {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));

  // For HS256, we need crypto
  const crypto = require("crypto");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64url");

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export async function GET() {
  try {
    const headersList = await headers();

    // Get session from Better Auth
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Create JWT token for backend API
    const jwtSecret = process.env.JWT_SECRET || process.env.BETTER_AUTH_SECRET;
    if (!jwtSecret) {
      return NextResponse.json({ error: "JWT secret not configured" }, { status: 500 });
    }

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      sub: session.user.id,
      email: session.user.email,
      name: session.user.name,
      iat: now,
      exp: now + 60 * 60 * 24, // 24 hours
    };

    const token = createJWT(payload, jwtSecret);

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Token generation error:", error);
    return NextResponse.json({ error: "Failed to generate token" }, { status: 500 });
  }
}
