import { NextResponse } from "next/server";

/*
 * Client Business Analyzer (admin-only).
 *  - Optionally fetches the prospect's current site to ground the audit in
 *    real signals (title, meta, https, viewport, word count, load size).
 *  - Asks the AI for: problems found, estimated monthly revenue lost, and a
 *    ready-to-send Project AS01 proposal. Returned as structured JSON.
 */

const MODELS = [
  "openai/gpt-oss-120b:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "meta-llama/llama-3.3-70b-instruct:free",
];

type SiteSignals = {
  reachable: boolean;
  https?: boolean;
  title?: string;
  hasMetaDescription?: boolean;
  hasViewport?: boolean;
  wordCount?: number;
  bytes?: number;
  status?: number;
  note?: string;
};

function normalizeUrl(raw: string): string | null {
  if (!raw) return null;
  let u = raw.trim();
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  try {
    return new URL(u).toString();
  } catch {
    return null;
  }
}

async function inspectSite(url: string): Promise<SiteSignals> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (AS01-Analyzer)" },
      signal: AbortSignal.timeout(12_000),
      redirect: "follow",
    });
    const html = await res.text();
    const lower = html.toLowerCase();
    const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim();
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return {
      reachable: true,
      status: res.status,
      https: url.startsWith("https://"),
      title: title || "(no title tag)",
      hasMetaDescription: /<meta[^>]+name=["']description["']/i.test(html),
      hasViewport: lower.includes('name="viewport"'),
      wordCount: text.split(" ").filter(Boolean).length,
      bytes: html.length,
    };
  } catch {
    return { reachable: false, note: "Site did not respond (down, blocked, or no website at all)." };
  }
}

export async function POST(req: Request) {
  const adminKey = process.env.ADMIN_PASSWORD ?? "as01admin";
  if (req.headers.get("x-admin-key") !== adminKey) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "AI not configured" }, { status: 500 });

  const { business, website, industry, notes } = await req.json().catch(() => ({}));
  if (!business) return NextResponse.json({ error: "business name required" }, { status: 400 });

  const url = normalizeUrl(website || "");
  const signals: SiteSignals = url
    ? await inspectSite(url)
    : { reachable: false, note: "No website provided — prospect likely has none." };

  const signalSummary = url
    ? signals.reachable
      ? `Live site checked (${url}): HTTPS=${signals.https}, title="${signals.title}", metaDescription=${signals.hasMetaDescription}, mobileViewport=${signals.hasViewport}, visibleWords=${signals.wordCount}, pageWeightKB=${Math.round((signals.bytes || 0) / 1024)}, httpStatus=${signals.status}.`
      : `Tried to load ${url} but: ${signals.note}`
    : signals.note;

  const prompt = `You are a senior digital growth consultant at Project AS01 (premium web/app/AI development company, Guwahati Assam; websites from ₹20,000, e-commerce ₹50,000+, apps & AI custom). A salesperson needs an outreach analysis for a prospect.

PROSPECT
Business: ${business}
Industry: ${industry || "unknown"}
Website: ${website || "none provided"}
Extra notes: ${notes || "none"}
TECHNICAL SCAN: ${signalSummary}

Produce a sharp, specific, honest analysis. Base revenue-loss numbers on reasonable Indian small-business assumptions and STATE them as estimates (never fake precision). Be persuasive but credible — this becomes a real sales pitch.

Return ONLY valid JSON (no markdown fences) with EXACTLY these keys:
{
 "healthScore": <0-100 integer for their current online presence>,
 "problems": [<5-7 concrete issues with their current website/online presence; if no site, frame around being invisible online>],
 "revenueLoss": "<1-2 sentences estimating monthly/yearly ₹ they likely lose by not having a strong website, with brief reasoning>",
 "opportunities": [<4-6 specific growth wins Project AS01 would deliver>],
 "proposal": "<a ready-to-send proposal message, 120-180 words, warm and confident, addressed to the owner of ${business}: name the top problems, the cost of inaction, exactly what AS01 will build, a suggested package + price, and a clear next step (free consultation / WhatsApp). Plain text, no markdown.>",
 "recommendedPackage": "<Starter ₹20,000+ | Business ₹50,000+ | Premium custom>",
 "whatsappPitch": "<a punchy 2-3 line WhatsApp opener to send this prospect>"
}`;

  for (const model of MODELS) {
    try {
      const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://project-as01.vercel.app",
          "X-Title": "Project AS01 Analyzer",
        },
        body: JSON.stringify({
          model,
          max_tokens: 1500,
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
      return NextResponse.json({ ...parsed, signals, model });
    } catch {
      // try next model
    }
  }

  return NextResponse.json(
    { error: "All free AI models are busy — try again in a minute." },
    { status: 503 }
  );
}
