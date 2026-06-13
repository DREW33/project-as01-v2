import crypto from "crypto";
import { readJson, writeJson } from "./blob";

/*
 * Admin accounts. The env ADMIN_PASSWORD is the permanent master/recovery key
 * (always works, cannot be deleted). Additional admins are stored in Blob and
 * can be added / removed / have passwords changed from the dashboard.
 * Passwords are stored as sha256 hashes, never plaintext.
 */
export type AdminUser = { username: string; passHash: string; createdAt: string };
const ADMINS_FILE = "admins.json";

export const hashPw = (s: string) => crypto.createHash("sha256").update(s).digest("hex");

export async function getAdmins(): Promise<AdminUser[]> {
  return readJson<AdminUser[]>(ADMINS_FILE, []);
}

export async function saveAdmins(list: AdminUser[]): Promise<void> {
  await writeJson(ADMINS_FILE, list);
}

export async function isValidAdminKey(key: string | null | undefined): Promise<boolean> {
  if (!key) return false;
  const master = process.env.ADMIN_PASSWORD ?? "as01admin";
  if (key === master) return true;
  const admins = await getAdmins();
  const h = hashPw(key);
  return admins.some((a) => a.passHash === h);
}
