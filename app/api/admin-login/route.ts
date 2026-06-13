import { NextResponse } from "next/server";
import { isValidAdminKey } from "@/lib/adminAuth";

/*
 * Login check. Accepts the env ADMIN_PASSWORD (master/recovery) OR any admin
 * account stored in Blob (added from the dashboard). The client stores the raw
 * password and sends it as x-admin-key on subsequent admin requests.
 */
export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  if (typeof password === "string" && (await isValidAdminKey(password))) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}
