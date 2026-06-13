import crypto from "crypto";
import { readJson, writeJson, deleteJson, listJson } from "./blob";

/*
 * Admin accounts, designed around Vercel Blob's read-after-write lag.
 *
 * We NEVER overwrite or rely on a shared mutable file. Every admin record is an
 * immutable blob with a random name:  admu_<rand>.json = { username, passHash, createdAt }
 *   add            -> create a new record
 *   changePassword -> create a NEW record, then delete the user's older record(s)
 *   delete         -> delete all the user's records
 *   login/list     -> read all records, keep only the LATEST per username
 *
 * Because login honors only the newest record per username, a password change is
 * effective immediately (new record) and the old password stops working even if
 * the old record's deletion hasn't propagated yet. Passwords are sha256-hashed.
 */
export type AdminRecord = { username: string; passHash: string; createdAt: string };

export const hashPw = (s: string) => crypto.createHash("sha256").update(s).digest("hex");
const rand = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

async function allRecords(): Promise<{ file: string; rec: AdminRecord }[]> {
  const files = await listJson("admu_");
  const out: { file: string; rec: AdminRecord }[] = [];
  for (const f of files) {
    const rec = await readJson<AdminRecord | null>(f, null);
    if (rec?.username) out.push({ file: f, rec });
  }
  return out;
}

/* latest record per username */
function latest(records: { file: string; rec: AdminRecord }[]): Map<string, AdminRecord> {
  const map = new Map<string, AdminRecord>();
  for (const { rec } of records) {
    const cur = map.get(rec.username);
    if (!cur || rec.createdAt > cur.createdAt) map.set(rec.username, rec);
  }
  return map;
}

export async function isValidAdminKey(key: string | null | undefined): Promise<boolean> {
  if (!key) return false;
  const master = process.env.ADMIN_PASSWORD ?? "as01admin";
  if (key === master) return true;
  const h = hashPw(key);
  const map = latest(await allRecords());
  for (const rec of map.values()) if (rec.passHash === h) return true;
  return false;
}

export async function getAdmins(): Promise<{ username: string; createdAt: string }[]> {
  const map = latest(await allRecords());
  return [...map.values()]
    .map((r) => ({ username: r.username, createdAt: r.createdAt }))
    .sort((a, b) => a.username.localeCompare(b.username));
}

export async function adminExists(username: string): Promise<boolean> {
  const u = username.trim().toLowerCase();
  return latest(await allRecords()).has(u);
}

export async function addAdmin(username: string, password: string) {
  const u = username.trim().toLowerCase();
  await writeJson(`admu_${rand()}.json`, {
    username: u,
    passHash: hashPw(password),
    createdAt: new Date().toISOString(),
  });
}

export async function changeAdminPassword(username: string, password: string) {
  const u = username.trim().toLowerCase();
  const records = await allRecords();
  // create the new record first
  await writeJson(`admu_${rand()}.json`, {
    username: u,
    passHash: hashPw(password),
    createdAt: new Date().toISOString(),
  });
  // then clean up the user's previous records
  for (const { file, rec } of records) {
    if (rec.username === u) await deleteJson(file);
  }
}

export async function deleteAdmin(username: string) {
  const u = username.trim().toLowerCase();
  for (const { file, rec } of await allRecords()) {
    if (rec.username === u) await deleteJson(file);
  }
}
