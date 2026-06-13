import { NextResponse } from "next/server";
import { isValidAdminKey } from "@/lib/adminAuth";

/*
 * AI Marketing Studio (admin-only) — generates Instagram content via
 * OpenRouter. Protected by x-admin-key so public visitors can't burn quota.
 */

const MODELS = [
  "openai/gpt-oss-120b:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "meta-llama/llama-3.3-70b-instruct:free",
];

const BRAND = `You are the social media manager for Project AS01 — a premium AI-powered website & app development company in Guwahati, Assam (tagline "Coffee > Code > Repeat", cyberpunk purple/blue brand, futuristic vibe). Services: websites from ₹20,000 (7-day delivery), e-commerce, mobile apps, AI chatbots & AI calling agents, ERP/CRM, gaming platforms. Portfolio: ShopKart, LuxeNest Realty, DriveNow, GlamBride, Evermore Events, ResellHub, BigWin Arena, Stratos ERP, PulseCRM, Spice Route, ZoomRide. Audience: business owners in Assam & Northeast India (restaurants, salons, real estate, shops, startups). Goal: get them to DM or visit the website for a free consultation.
Write in plain text (no markdown). Mix English with light Hinglish/Assamese flavour where natural. Always include a call-to-action. Hashtags must mix niche + local (e.g. #GuwahatiBusiness #AssamStartups #WebDesignIndia).`;

const TASKS: Record<string, string> = {
  ideas:
    "Give 8 scroll-stopping Instagram post ideas (reels + carousels) for this business goal/topic. For each: format (Reel/Carousel/Story), hook line, and 1-sentence concept. Number them.",
  caption:
    "Write 3 ready-to-post Instagram captions for this topic. Each: strong hook first line, 3-5 short lines of value, a clear CTA (DM us / link in bio / free consultation), then 12-15 hashtags. Separate the 3 options with a line of dashes.",
  calendar:
    "Create a 7-day Instagram content calendar for this goal. For each day: day name, post format (Reel/Carousel/Story/Static), topic, hook line, and best posting time (IST). Keep it practical for a 2-person team.",
};

export async function POST(req: Request) {
  if (!(await isValidAdminKey(req.headers.get("x-admin-key")))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "AI not configured" }, { status: 500 });

  const { type, topic } = await req.json().catch(() => ({}));
  const task = TASKS[type as string];
  if (!task || !topic) {
    return NextResponse.json({ error: "type and topic required" }, { status: 400 });
  }

  for (const model of MODELS) {
    try {
      const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://project-as01.vercel.app",
          "X-Title": "Project AS01 Marketing Studio",
        },
        body: JSON.stringify({
          model,
          max_tokens: 1200,
          temperature: 0.85,
          messages: [
            { role: "system", content: BRAND },
            { role: "user", content: `${task}\n\nTopic/goal: ${String(topic).slice(0, 400)}` },
          ],
        }),
        signal: AbortSignal.timeout(30_000),
      });
      if (!r.ok) continue;
      const data = await r.json();
      const text = data?.choices?.[0]?.message?.content
        ?.trim()
        ?.replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/^#+\s+/gm, "");
      if (text) return NextResponse.json({ text, model });
    } catch {
      // try next model
    }
  }

  return NextResponse.json(
    { error: "All free AI models are busy right now — try again in a minute." },
    { status: 503 }
  );
}
