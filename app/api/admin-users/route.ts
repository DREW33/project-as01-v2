import { NextResponse } from "next/server";
import { getAdmins, saveAdmins, isValidAdminKey, hashPw, type AdminUser } from "@/lib/adminAuth";

/*
 * Admin account management (admin-only). The env master password is the
 * permanent recovery key and is NOT listed/editable here.
 */

export async function GET(req: Request) {
  if (!(await isValidAdminKey(req.headers.get("x-admin-key")))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const admins = await getAdmins();
  return NextResponse.json({
    admins: admins.map((a) => ({ username: a.username, createdAt: a.createdAt })),
  });
}

export async function POST(req: Request) {
  if (!(await isValidAdminKey(req.headers.get("x-admin-key")))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { action, username, password } = await req.json().catch(() => ({}));
  const admins = await getAdmins();

  if (action === "add") {
    const u = String(username || "").trim().toLowerCase();
    if (!u || !password || String(password).length < 6) {
      return NextResponse.json(
        { error: "Username and a password of 6+ characters are required." },
        { status: 400 }
      );
    }
    if (admins.some((a) => a.username === u)) {
      return NextResponse.json({ error: "That username already exists." }, { status: 400 });
    }
    const next: AdminUser = { username: u, passHash: hashPw(password), createdAt: new Date().toISOString() };
    await saveAdmins([...admins, next]);
    return NextResponse.json({ ok: true });
  }

  if (action === "changePassword") {
    const u = String(username || "").trim().toLowerCase();
    if (!password || String(password).length < 6) {
      return NextResponse.json({ error: "New password must be 6+ characters." }, { status: 400 });
    }
    const idx = admins.findIndex((a) => a.username === u);
    if (idx === -1) return NextResponse.json({ error: "Admin not found." }, { status: 404 });
    admins[idx].passHash = hashPw(password);
    await saveAdmins(admins);
    return NextResponse.json({ ok: true });
  }

  if (action === "delete") {
    const u = String(username || "").trim().toLowerCase();
    await saveAdmins(admins.filter((a) => a.username !== u));
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
