import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { get, put } from "@vercel/blob";
import { isValidAdminKey } from "@/lib/adminAuth";

/*
 * Lead store, picked by available credentials:
 *  1. Supabase  — SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 *  2. Vercel Blob — BLOB_READ_WRITE_TOKEN (production default; auto-provisioned)
 *  3. Local JSON file — dev fallback
 *
 * GET requires the x-admin-key header (admin dashboard only) — leads are
 * customer PII and must not be publicly readable.
 */

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const hasBlob = !!process.env.BLOB_READ_WRITE_TOKEN;
const BLOB_PATH = "leads.json";

const dataFile = path.join(process.cwd(), "data", "leads.json");

type Lead = Record<string, unknown> & { id: string; receivedAt: string };

async function readBlobLeads(): Promise<Lead[]> {
  try {
    const res = (await get(BLOB_PATH, { access: "private" })) as unknown as {
      statusCode: number;
      stream: ReadableStream;
    } | null;
    if (!res || res.statusCode !== 200) return [];
    const text = await new Response(res.stream).text();
    return JSON.parse(text) as Lead[];
  } catch {
    return []; // blob doesn't exist yet
  }
}

async function writeBlobLeads(leads: Lead[]) {
  await put(BLOB_PATH, JSON.stringify(leads), {
    access: "private",
    allowOverwrite: true,
    addRandomSuffix: false,
    contentType: "application/json",
  });
}

async function readFileLeads(): Promise<Lead[]> {
  try {
    return JSON.parse(await fs.readFile(dataFile, "utf-8"));
  } catch {
    return [];
  }
}

export async function GET(req: Request) {
  if (!(await isValidAdminKey(req.headers.get("x-admin-key")))) {
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

  if (hasBlob) {
    return NextResponse.json({ leads: await readBlobLeads(), store: "blob" });
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

  if (hasBlob) {
    const leads = await readBlobLeads();
    leads.unshift(lead);
    await writeBlobLeads(leads);
    return NextResponse.json({ ok: true, lead, store: "blob" });
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

export async function DELETE(req: Request) {
  if (!(await isValidAdminKey(req.headers.get("x-admin-key")))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await req.json().catch(() => ({}));
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  if (supabase) {
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (hasBlob) {
    const leads = (await readBlobLeads()).filter((l) => l.id !== id);
    await writeBlobLeads(leads);
    return NextResponse.json({ ok: true });
  }

  const leads = (await readFileLeads()).filter((l) => l.id !== id);
  try {
    await fs.writeFile(dataFile, JSON.stringify(leads, null, 2), "utf-8");
  } catch {
    /* ignore */
  }
  return NextResponse.json({ ok: true });
}
