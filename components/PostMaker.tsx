"use client";

import { useRef, useState } from "react";

/*
 * Free Instagram visuals, no paid APIs:
 *  - Branded card: drawn on <canvas> in the AS01 neon style → PNG download.
 *  - AI photo: Pollinations.ai free text-to-image (no key) → download.
 */

const STYLES = [
  { name: "Neon Night", bg: "#030014", glow1: "#7c3aed", glow2: "#2563eb", accent: "#a855f7" },
  { name: "Cyber Blue", bg: "#020817", glow1: "#0ea5e9", glow2: "#6366f1", accent: "#38bdf8" },
  { name: "Sunset Punch", bg: "#170312", glow1: "#db2777", glow2: "#7c3aed", accent: "#f472b6" },
];

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export default function PostMaker() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hook, setHook] = useState("Your business needs a website that SELLS, not just exists.");
  const [sub, setSub] = useState("Premium websites from ₹20,000 · delivered in 7 days");
  const [styleIdx, setStyleIdx] = useState(0);
  const [cardReady, setCardReady] = useState(false);

  const [photoPrompt, setPhotoPrompt] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState("");

  const drawCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const S = 1080;
    canvas.width = S;
    canvas.height = S;
    const ctx = canvas.getContext("2d")!;
    const st = STYLES[styleIdx];

    // background
    ctx.fillStyle = st.bg;
    ctx.fillRect(0, 0, S, S);

    // glow blobs
    const g1 = ctx.createRadialGradient(S * 0.15, S * 0.2, 0, S * 0.15, S * 0.2, S * 0.55);
    g1.addColorStop(0, st.glow1 + "55");
    g1.addColorStop(1, "transparent");
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, S, S);
    const g2 = ctx.createRadialGradient(S * 0.9, S * 0.85, 0, S * 0.9, S * 0.85, S * 0.6);
    g2.addColorStop(0, st.glow2 + "4d");
    g2.addColorStop(1, "transparent");
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, S, S);

    // subtle grid
    ctx.strokeStyle = "rgba(148,163,184,0.07)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= S; i += 72) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, S); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(S, i); ctx.stroke();
    }

    // code accents
    ctx.font = "600 44px monospace";
    ctx.fillStyle = st.accent + "66";
    ctx.fillText("</>", 80, 150);
    ctx.fillText("{ }", S - 170, S - 220);

    // hook text
    ctx.font = "800 76px Arial, sans-serif";
    const lines = wrapText(ctx, hook, S - 200);
    const grad = ctx.createLinearGradient(100, 0, S - 100, 0);
    grad.addColorStop(0, "#e9d5ff");
    grad.addColorStop(0.5, "#ffffff");
    grad.addColorStop(1, "#bae6fd");
    ctx.fillStyle = grad;
    ctx.shadowColor = st.glow1;
    ctx.shadowBlur = 28;
    const startY = S / 2 - ((lines.length - 1) * 96) / 2 - 30;
    lines.forEach((l, i) => ctx.fillText(l, 100, startY + i * 96));
    ctx.shadowBlur = 0;

    // subtext
    if (sub.trim()) {
      ctx.font = "600 38px Arial, sans-serif";
      ctx.fillStyle = "#94a3b8";
      const subLines = wrapText(ctx, sub, S - 200);
      subLines.forEach((l, i) =>
        ctx.fillText(l, 100, startY + lines.length * 96 + 40 + i * 52)
      );
    }

    // bottom brand bar
    const grad2 = ctx.createLinearGradient(0, 0, S, 0);
    grad2.addColorStop(0, st.glow1);
    grad2.addColorStop(1, st.glow2);
    ctx.fillStyle = grad2;
    ctx.fillRect(0, S - 8, S, 8);
    ctx.font = "800 40px Arial, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("project", 100, S - 70);
    ctx.fillStyle = st.accent;
    ctx.fillText("as01", 252, S - 70);
    ctx.font = "500 28px monospace";
    ctx.fillStyle = "#64748b";
    ctx.fillText("</> vibe coder · DM for free consultation", 380, S - 72);

    setCardReady(true);
  };

  const downloadCard = () => {
    canvasRef.current?.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `as01-post-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(a.href);
    }, "image/png");
  };

  const generatePhoto = async () => {
    if (!photoPrompt.trim() || photoLoading) return;
    setPhotoError("");
    setPhotoUrl("");
    setPhotoLoading(true);
    try {
      const r = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": sessionStorage.getItem("as01_admin_key") ?? "",
        },
        body: JSON.stringify({ prompt: photoPrompt }),
      });
      const d = await r.json();
      if (d.url) {
        setPhotoUrl(d.url); // <img> onLoad/onError takes over from here
      } else {
        setPhotoLoading(false);
        setPhotoError(d.error || "Could not generate image — try again.");
      }
    } catch {
      setPhotoLoading(false);
      setPhotoError("Network error — try again.");
    }
  };

  const onPhotoError = () => {
    setPhotoLoading(false);
    setPhotoUrl("");
    setPhotoError(
      "The free image service is busy right now. Wait a minute and try again — or use the Branded Card Maker on the left, which always works instantly."
    );
  };

  const downloadPhoto = async () => {
    try {
      const blob = await fetch(photoUrl).then((r) => r.blob());
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `as01-ai-photo-${Date.now()}.jpg`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      window.open(photoUrl, "_blank"); // CORS fallback: open & save manually
    }
  };

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-purple-500/70";

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      {/* branded card maker */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
          🖼️ Branded Card Maker
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Type your hook → download a 1080×1080 neon post. Pair with captions from the
          generator above.
        </p>
        <input
          className={`${inputCls} mt-4`}
          value={hook}
          onChange={(e) => setHook(e.target.value)}
          placeholder="Big hook text (the scroll-stopper)"
          maxLength={90}
        />
        <input
          className={`${inputCls} mt-3`}
          value={sub}
          onChange={(e) => setSub(e.target.value)}
          placeholder="Small subtext (offer / CTA)"
          maxLength={80}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {STYLES.map((s, i) => (
            <button
              key={s.name}
              onClick={() => setStyleIdx(i)}
              className={`rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition ${
                styleIdx === i
                  ? "btn-neon text-white"
                  : "glass text-slate-400 hover:text-white"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
        <div className="mt-4 flex gap-2.5">
          <button
            onClick={drawCard}
            className="btn-neon font-display rounded-xl px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white"
          >
            🎨 Generate Card
          </button>
          {cardReady && (
            <button
              onClick={downloadCard}
              className="btn-ghost rounded-xl px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-white"
            >
              ⬇ Download PNG
            </button>
          )}
        </div>
        <canvas
          ref={canvasRef}
          className={`mt-4 w-full max-w-xs rounded-xl border border-white/10 ${
            cardReady ? "" : "hidden"
          }`}
        />
      </div>

      {/* AI photo */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
          📸 AI Photo Generator
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Describe any image — generated free by AI. The free service is rate-limited, so
          it may take a few tries. For guaranteed instant results, use the Branded Card
          Maker on the left.
        </p>
        <textarea
          rows={3}
          className={`${inputCls} mt-4`}
          value={photoPrompt}
          onChange={(e) => setPhotoPrompt(e.target.value)}
          placeholder="e.g. modern restaurant owner using a tablet, warm light, Indian setting"
        />
        <div className="mt-4 flex gap-2.5">
          <button
            onClick={generatePhoto}
            disabled={!photoPrompt.trim() || photoLoading}
            className="btn-neon font-display rounded-xl px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white disabled:opacity-50"
          >
            {photoLoading ? "Generating…" : "✨ Generate Photo"}
          </button>
          {photoUrl && !photoLoading && (
            <button
              onClick={downloadPhoto}
              className="btn-ghost rounded-xl px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-white"
            >
              ⬇ Download
            </button>
          )}
        </div>
        {photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt="AI generated"
            onLoad={() => setPhotoLoading(false)}
            onError={onPhotoError}
            className={`mt-4 w-full max-w-xs rounded-xl border border-white/10 ${
              photoLoading ? "hidden" : ""
            }`}
          />
        )}
        {photoLoading && (
          <p className="mt-3 animate-pulse text-xs text-purple-300">
            AI is painting your image… (~10-20 seconds)
          </p>
        )}
        {photoError && (
          <p className="mt-3 text-xs leading-relaxed text-amber-400">{photoError}</p>
        )}
      </div>
    </div>
  );
}
