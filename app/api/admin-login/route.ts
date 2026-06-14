import { NextResponse } from "next/server";
import { isValidAdminKey } from "@/lib/adminAuth";
import { limited } from "@/lib/rateLimit";

/*
 * Login check. Accepts the env ADMIN_PASSWORD (master/recovery) OR any admin
 * account stored in Blob (added from the dashboard). The client stores the raw
 * password and sends it as x-admin-key on subsequent admin requests.
 */
export async function POST(req: Request) {
  // brute-force shield: 8 attempts per minute per IP
  if (limited(req, "admin-login", 8, 60_000)) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Wait a minute." }, { status: 429 });
  }
  const { password } = await req.json().catch(() => ({ password: "" }));
  if (typeof password === "string" && (await isValidAdminKey(password))) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}
