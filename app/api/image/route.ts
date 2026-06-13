import { NextResponse } from "next/server";

/*
 * AI image generation, admin-only. Provider chosen by whichever key exists:
 *   1. Together AI  (TOGETHER_API_KEY)  — FLUX.1-schnell-Free, genuinely free, reliable
 *   2. Hugging Face (HF_TOKEN)          — FLUX.1-schnell via router
 *   3. Pollinations (no key)            — works on some IPs, last resort
 * Returns { url } (image URL or data URI) or { error }.
 */

export async function POST(req: Request) {
  const adminKey = process.env.ADMIN_PASSWORD ?? "as01admin";
  if (req.headers.get("x-admin-key") !== adminKey) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { prompt } = await req.json().catch(() => ({}));
  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "prompt required" }, { status: 400 });
  }
  const fullPrompt = `${prompt.slice(0, 400)}, professional photography, instagram post, high quality, vibrant, sharp focus`;

  const together = process.env.TOGETHER_API_KEY;
  const hf = process.env.HF_TOKEN;

  // 1. Together AI — FLUX.1-schnell-Free
  if (together) {
    try {
      const r = await fetch("https://api.together.xyz/v1/images/generations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${together}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "black-forest-labs/FLUX.1-schnell-Free",
          prompt: fullPrompt,
          width: 1024,
          height: 1024,
          steps: 4,
          n: 1,
        }),
        signal: AbortSignal.timeout(45_000),
      });
      if (r.ok) {
        const data = await r.json();
        const url = data?.data?.[0]?.url;
        const b64 = data?.data?.[0]?.b64_json;
        if (url) return NextResponse.json({ url, provider: "together" });
        if (b64) return NextResponse.json({ url: `data:image/png;base64,${b64}`, provider: "together" });
      }
    } catch {
      /* fall through */
    }
  }

  // 2. Hugging Face — FLUX.1-schnell
  if (hf) {
    try {
      const r = await fetch(
        "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${hf}`, "Content-Type": "application/json" },
          body: JSON.stringify({ inputs: fullPrompt }),
          signal: AbortSignal.timeout(50_000),
        }
      );
      if (r.ok) {
        const buf = Buffer.from(await r.arrayBuffer());
        return NextResponse.json({
          url: `data:image/jpeg;base64,${buf.toString("base64")}`,
          provider: "huggingface",
        });
      }
    } catch {
      /* fall through */
    }
  }

  // 3. Pollinations — no key (works on some networks)
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    fullPrompt
  )}?width=1024&height=1024&seed=${Date.now() % 100000}`;
  return NextResponse.json({ url, provider: "pollinations", note: "free fallback — may be rate-limited" });
}
