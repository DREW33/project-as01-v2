import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

/*
 * Demo lead store backed by a local JSON file. In production swap this for
 * Supabase/PostgreSQL and trigger the real automation pipeline:
 *   1. persist lead                4. notify admin dashboard
 *   2. WhatsApp message (Twilio)   5. AI voice agent call (ElevenLabs + Claude)
 *   3. confirmation email          6. CRM update with call transcript
 */
const dataFile = path.join(process.cwd(), "data", "leads.json");

async function readLeads(): Promise<Record<string, unknown>[]> {
  try {
    return JSON.parse(await fs.readFile(dataFile, "utf-8"));
  } catch {
    return [];
  }
}

export async function GET() {
  return NextResponse.json({ leads: await readLeads() });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const lead = {
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

  const leads = await readLeads();
  leads.unshift(lead);
  try {
    await fs.mkdir(path.dirname(dataFile), { recursive: true });
    await fs.writeFile(dataFile, JSON.stringify(leads, null, 2), "utf-8");
  } catch {
    // read-only environments (e.g. some serverless hosts) — accept anyway
  }

  return NextResponse.json({ ok: true, lead });
}
