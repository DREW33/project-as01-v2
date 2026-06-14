import { NextResponse } from "next/server";
import { readJson, writeJson, deleteJson, listJson } from "@/lib/blob";
import { isValidAdminKey } from "@/lib/adminAuth";

/*
 * Outbound prospect CRM (admin-only). Each prospect is its OWN blob
 * (prospect_<id>.json) so rapid adds never overwrite each other — same
 * lag-proof pattern as admin accounts.
 */
export type Prospect = {
  id: string;
  business: string;
  website?: string;
  industry?: string;
  phone?: string;
  status: "to_contact" | "contacted" | "proposal_sent" | "won" | "lost";
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

const key = (id: string) => `prospect_${id}.json`;
const rid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36);

async function allProspects(): Promise<Prospect[]> {
  const files = await listJson("prospect_");
  const out: Prospect[] = [];
  for (const f of files) {
    const p = await readJson<Prospect | null>(f, null);
    if (p?.id) out.push(p);
  }
  return out.sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
}

export async function GET(req: Request) {
  if (!(await isValidAdminKey(req.headers.get("x-admin-key")))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ prospects: await allProspects() });
}

export async function POST(req: Request) {
  if (!(await isValidAdminKey(req.headers.get("x-admin-key")))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));

  if (body.action === "delete") {
    if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await deleteJson(key(body.id));
    return NextResponse.json({ ok: true });
  }

  // save (create or update)
  const p = body.prospect || {};
  if (!p.business || !String(p.business).trim()) {
    return NextResponse.json({ error: "business name required" }, { status: 400 });
  }
  const now = new Date().toISOString();
  const id = p.id || rid();
  const existing = p.id ? await readJson<Prospect | null>(key(id), null) : null;
  const record: Prospect = {
    id,
    business: String(p.business).trim(),
    website: p.website || "",
    industry: p.industry || "",
    phone: p.phone || "",
    status: p.status || "to_contact",
    notes: p.notes ?? existing?.notes ?? "",
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };
  await writeJson(key(id), record);
  return NextResponse.json({ ok: true, prospect: record });
}
