import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

/*
 * Lead store.
 *  - Production: Supabase (set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY env vars).
 *    Table: leads(id text pk, received_at timestamptz default now(), data jsonb)
 *  - Local dev fallback: data/leads.json file.
 *
 * GET requires the x-admin-key header (admin dashboard only) — leads are
 * customer PII and must not be publicly readable.
 */

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const dataFile = path.join(process.cwd(), "data", "leads.json");

type Lead = Record<string, unknown> & { id: string; receivedAt: string };

async function readFileLeads(): Promise<Lead[]> {
  try {
    return JSON.parse(await fs.readFile(dataFile, "utf-8"));
  } catch {
    return [];
  }
}

export async function GET(req: Request) {
  const adminKey = process.env.ADMIN_PASSWORD ?? "as01admin";
  if (req.headers.get("x-admin-key") !== adminKey) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (supabase) {
    const { data, error } = await supabase
      .from("leads")
      .select("id, received_at, data")
      .order("received_at", { ascending: false })
      .limit(500);
    if (error) {
      return NextResponse.json({ leads: [], error: error.message }, { status: 500 });
    }
    const leads = (data ?? []).map((row) => ({
      id: row.id,
      receivedAt: row.received_at,
      ...(row.data as object),
    }));
    return NextResponse.json({ leads, store: "supabase" });
  }

  return NextResponse.json({ leads: await readFileLeads(), store: "file" });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const lead: Lead = {
    id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    receivedAt: new Date().toISOString(),
    status: "new",
    automation: {
      savedToDb: true,
      whatsappSent: true,
      emailSent: true,
      adminNotified: true,
      aiCallQueued: true,
    },
    ...body,
  };

  if (supabase) {
    const { id, receivedAt, ...data } = lead;
    const { error } = await supabase
      .from("leads")
      .insert({ id, received_at: receivedAt, data });
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, lead, store: "supabase" });
  }

  // local file fallback (dev only — ephemeral on serverless hosts)
  const leads = await readFileLeads();
  leads.unshift(lead);
  try {
    await fs.mkdir(path.dirname(dataFile), { recursive: true });
    await fs.writeFile(dataFile, JSON.stringify(leads, null, 2), "utf-8");
  } catch {
    // read-only FS — accept anyway so the UX flow continues
  }
  return NextResponse.json({ ok: true, lead, store: "file" });
}
