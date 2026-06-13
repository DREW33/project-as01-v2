import { NextResponse } from "next/server";
import {
  getAdmins,
  isValidAdminKey,
  addAdmin,
  changeAdminPassword,
  deleteAdmin,
  adminExists,
} from "@/lib/adminAuth";

/*
 * Admin account management (admin-only). The env master password is the
 * permanent recovery key and is NOT listed/editable here.
 */

export async function GET(req: Request) {
  if (!(await isValidAdminKey(req.headers.get("x-admin-key")))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ admins: await getAdmins() });
}

export async function POST(req: Request) {
  if (!(await isValidAdminKey(req.headers.get("x-admin-key")))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { action, username, password } = await req.json().catch(() => ({}));
  const u = String(username || "").trim().toLowerCase();

  if (action === "add") {
    if (!u || !password || String(password).length < 6) {
      return NextResponse.json(
        { error: "Username and a password of 6+ characters are required." },
        { status: 400 }
      );
    }
    if (await adminExists(u)) {
      return NextResponse.json({ error: "That username already exists." }, { status: 400 });
    }
    await addAdmin(u, password);
    return NextResponse.json({ ok: true });
  }

  if (action === "changePassword") {
    if (!u || !password || String(password).length < 6) {
      return NextResponse.json({ error: "New password must be 6+ characters." }, { status: 400 });
    }
    await changeAdminPassword(u, password);
    return NextResponse.json({ ok: true });
  }

  if (action === "delete") {
    if (!u) return NextResponse.json({ error: "username required" }, { status: 400 });
    await deleteAdmin(u);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
