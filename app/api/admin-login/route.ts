import { NextResponse } from "next/server";

/*
 * Admin password lives in the ADMIN_PASSWORD env var (set in Vercel dashboard
 * or .env.local). Falls back to the dev default only when the var is unset.
 */
export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  const expected = process.env.ADMIN_PASSWORD ?? "as01admin";
  if (typeof password === "string" && password.length > 0 && password === expected) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}
