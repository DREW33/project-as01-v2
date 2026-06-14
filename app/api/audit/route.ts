import { NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/blob";
import { limited } from "@/lib/rateLimit";

/*
 * PUBLIC free website audit. A visitor submits their business + contact details:
 *  1. We save them as a lead (so admin sees it).
 *  2. We scan their site and return a CLIENT-SAFE analysis (score, problems,
 *     revenue loss, opportunities) — but NOT the internal sales proposal/pitch.
 */

const MODELS = [
  "openai/gpt-oss-120b:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "meta-llama/llama-3.3-70b-instruct:free",
];

type Lead = Record<string, unknown> & { id: string; receivedAt: string };

function normalizeUrl(raw: string): string | null {
  if (!raw) return null;
  let u = raw.trim();
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  try {
    const parsed = new URL(u);
    if (!/^https?:$/.test(parsed.protocol)) return null;
    // SSRF guard: block internal / private / metadata hosts
    const h = parsed.hostname.toLowerCase();
    if (
      h === "localhost" ||
      h === "0.0.0.0" ||
      h.endsWith(".local") ||
      h.endsWith(".internal") ||
      /^127\./.test(h) ||
      /^10\./.test(h) ||
      /^192\.168\./.test(h) ||
      /^169\.254\./.test(h) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(h)
    ) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

async function inspectSite(url: string) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (AS01-Audit)" },
      signal: AbortSignal.timeout(12_000),
      redirect: "follow",
    });
    const html = await res.text();
    const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim();
    const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return {
      reachable: true,
      status: res.status,
      https: url.startsWith("https://"),
      title: title || "(no title tag)",
      hasMetaDescription: /<meta[^>]+name=["']description["']/i.test(html),
      hasViewport: /name=["']viewport["']/i.test(html),
      wordCount: text.split(" ").filter(Boolean).length,
      kb: Math.round(html.length / 1024),
    };
  } catch {
    return { reachable: false };
  }
}

export async function POST(req: Request) {
  // anti-abuse: 4 audits per 5 minutes per IP (protects AI quota)
  if (limited(req, "audit", 4, 300_000)) {
    return NextResponse.json({ error: "Too many requests. Please wait a few minutes." }, { status: 429 });
  }
  const body = await req.json().catch(() => ({}));
  const { business, website, industry, email, phone, name } = body;

  if (!business || !email || !phone) {
    return NextResponse.json(
      { error: "Please fill business name, email and phone." },
      { status: 400 }
    );
  }

  // 1. Save the lead (fire-and-forget safe)
  const lead: Lead = {
    id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    receivedAt: new Date().toISOString(),
    status: "new",
    name: name || "Website Audit visitor",
    business,
    website: website || "",
    email,
    phone,
    projectType: industry || "Website Audit",
    intent: "Free Website Audit",
    source: "public-audit",
  };
  try {
    const leads = await readJson<Lead[]>("leads.json", []);
    leads.unshift(lead);
    await writeJson("leads.json", leads);
  } catch {
    /* don't block the audit if storage hiccups */
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      saved: true,
      healthScore: null,
      note: "Thanks! Our team will review your business and reach out shortly.",
    });
  }

  const url = normalizeUrl(website || "");
  const signals = url ? await inspectSite(url) : { reachable: false };
  const signalSummary = url
    ? signals.reachable
      ? `Site scan (${url}): HTTPS=${"https" in signals && signals.https}, title="${"title" in signals ? signals.title : ""}", metaDesc=${"hasMetaDescription" in signals && signals.hasMetaDescription}, mobileViewport=${"hasViewport" in signals && signals.hasViewport}, words=${"wordCount" in signals ? signals.wordCount : 0}, pageKB=${"kb" in signals ? signals.kb : 0}.`
      : `Could not load ${url} (down/blocked).`
    : "No website provided — likely has none.";

  const prompt = `You are a friendly digital growth advisor for Project AS01 (web/app/AI company, Guwahati Assam). A business owner requested a FREE audit of their own business. Be honest, encouraging and specific. Base ₹ estimates on reasonable Indian small-business assumptions and clearly call them estimates.

BUSINESS: ${business}
INDUSTRY: ${industry || "unknown"}
WEBSITE: ${website || "none"}
SCAN: ${signalSummary}

Return ONLY valid JSON (no markdown) with EXACTLY:
{
 "healthScore": <0-100 integer>,
 "summary": "<2 sentence friendly verdict on their current online presence>",
 "problems": [<4-6 plain-language issues hurting their growth>],
 "revenueLoss": "<1-2 sentences estimating ₹ they likely lose monthly/yearly, with brief reasoning>",
 "opportunities": [<4-6 specific improvements that would grow their business>]
}`;

  for (const model of MODELS) {
    try {
      const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://project-as01.vercel.app",
          "X-Title": "Project AS01 Free Audit",
        },
        body: JSON.stringify({
          model,
          max_tokens: 1100,
          temperature: 0.6,
          response_format: { type: "json_object" },
          messages: [{ role: "user", content: prompt }],
        }),
        signal: AbortSignal.timeout(40_000),
      });
      if (!r.ok) continue;
      const data = await r.json();
      let text: string = data?.choices?.[0]?.message?.content?.trim() || "";
      text = text.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
      const parsed = JSON.parse(text);
      return NextResponse.json({ saved: true, ...parsed });
    } catch {
      /* next model */
    }
  }

  // AI busy — lead still saved
  return NextResponse.json({
    saved: true,
    healthScore: null,
    note: "Thanks! Our AI is busy right now, but we've saved your details and our team will send your full audit shortly.",
  });
}
