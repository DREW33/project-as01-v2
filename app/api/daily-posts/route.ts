import { NextResponse } from "next/server";
import { get, put } from "@vercel/blob";
import { isValidAdminKey } from "@/lib/adminAuth";

/*
 * Daily viral-content engine.
 *  - Runs automatically via Vercel Cron (see vercel.json) every morning.
 *  - Pulls TODAY'S real tech trends from Hacker News + Dev.to (free, no keys),
 *    then asks the AI for 3 Instagram-ready posts (news reaction, AI-for-business
 *    tip, dev insight) in a viral style.
 *  - Caches the result in Blob storage per-day; admin reads it from the panel.
 * Auth: x-admin-key (admin panel) OR Bearer CRON_SECRET (Vercel cron).
 */

const MODELS = [
  "openai/gpt-oss-120b:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "meta-llama/llama-3.3-70b-instruct:free",
];

const BLOB_PATH = "daily-posts.json";

function todayIST(): string {
  return new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
}

async function freshTrends(): Promise<string[]> {
  const titles: string[] = [];
  try {
    const ids: number[] = await fetch(
      "https://hacker-news.firebaseio.com/v0/topstories.json",
      { signal: AbortSignal.timeout(8000) }
    ).then((r) => r.json());
    const items = await Promise.all(
      ids.slice(0, 8).map((id) =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
          signal: AbortSignal.timeout(8000),
        })
          .then((r) => r.json())
          .catch(() => null)
      )
    );
    for (const it of items) if (it?.title) titles.push(it.title);
  } catch {
    /* HN down — continue */
  }
  try {
    const arts: { title: string }[] = await fetch(
      "https://dev.to/api/articles?top=1&per_page=8",
      { signal: AbortSignal.timeout(8000) }
    ).then((r) => r.json());
    for (const a of arts) if (a?.title) titles.push(a.title);
  } catch {
    /* dev.to down — continue */
  }
  return titles.slice(0, 14);
}

async function readCache(): Promise<{ date: string; text: string } | null> {
  try {
    const res = (await get(BLOB_PATH, { access: "private" })) as unknown as {
      statusCode: number;
      stream: ReadableStream;
    } | null;
    if (!res || res.statusCode !== 200) return null;
    return JSON.parse(await new Response(res.stream).text());
  } catch {
    return null;
  }
}

async function generate(): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  const trends = await freshTrends();
  const trendBlock = trends.length
    ? `TODAY'S REAL TECH HEADLINES (use 1-2 of these as the news hook — pick whichever is most relevant to small-business owners):\n${trends.map((t) => `- ${t}`).join("\n")}`
    : "No live headlines available — use a timeless AI trend instead.";

  const prompt = `You are the social media manager for Project AS01, a web/app/AI development company in Guwahati, Assam (brand: futuristic, purple/blue, "Coffee > Code > Repeat"). Audience: business owners and curious people in Assam & India — NOT developers.

${trendBlock}

Create today's 3 Instagram posts. Make them VIRAL-style: curiosity hooks, simple language, light Hinglish flavour okay, each ends with a soft CTA (follow for daily AI tips / DM for free consultation). Plain text only, no markdown.

POST 1 — "AI/Tech News Today": react to one of today's headlines in simple words — what it means for normal business owners in India.
POST 2 — "Use AI Today": one practical way a small business (shop, restaurant, salon, etc.) can use AI right now, step-by-step in 4-5 lines.
POST 3 — "Did You Know / Dev Insight": a surprising fact, myth-buster or mini-story about websites/apps/AI that makes people share it.

For each post give exactly:
POST N: [title]
Format: Reel / Carousel / Static
Hook: [first line that stops the scroll]
Caption: [4-7 short lines]
Hashtags: [12 mixed niche + local like #AssamBusiness #AIForBusiness #GuwahatiStartups]
Visual: [1-line idea for the image/video]
---`;

  for (const model of MODELS) {
    try {
      const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://project-as01.vercel.app",
          "X-Title": "Project AS01 Daily Posts",
        },
        body: JSON.stringify({
          model,
          max_tokens: 1800,
          temperature: 0.9,
          messages: [{ role: "user", content: prompt }],
        }),
        signal: AbortSignal.timeout(40_000),
      });
      if (!r.ok) continue;
      const data = await r.json();
      const text = data?.choices?.[0]?.message?.content
        ?.trim()
        ?.replace(/\*\*([^*]+)\*\*/g, "$1");
      if (text) return text;
    } catch {
      /* try next model */
    }
  }
  return null;
}

export async function GET(req: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const isAdmin = await isValidAdminKey(req.headers.get("x-admin-key"));
  const isCron =
    !!cronSecret && req.headers.get("authorization") === `Bearer ${cronSecret}`;
  if (!isAdmin && !isCron) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const today = todayIST();
  const force = new URL(req.url).searchParams.get("force") === "1";

  const cached = await readCache();
  if (cached?.date === today && !force) {
    return NextResponse.json({ date: today, text: cached.text, cached: true });
  }

  const text = await generate();
  if (!text) {
    if (cached) return NextResponse.json({ date: cached.date, text: cached.text, cached: true, stale: true });
    return NextResponse.json({ error: "AI models busy — try again shortly." }, { status: 503 });
  }

  try {
    await put(BLOB_PATH, JSON.stringify({ date: today, text }), {
      access: "private",
      allowOverwrite: true,
      addRandomSuffix: false,
      contentType: "application/json",
    });
  } catch {
    /* cache write failed — still return content */
  }

  return NextResponse.json({ date: today, text, cached: false });
}
