"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Result = {
  healthScore?: number | null;
  summary?: string;
  problems?: string[];
  revenueLoss?: string;
  opportunities?: string[];
  note?: string;
  error?: string;
};

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-purple-500/70 focus:shadow-[0_0_18px_rgba(168,85,247,0.25)]";

export default function BusinessAudit() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [form, setForm] = useState({
    business: "",
    website: "",
    industry: "",
    name: "",
    email: "",
    phone: "",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    const onOpen = () => {
      setResult(null);
      setOpen(true);
    };
    window.addEventListener("as01:audit", onOpen);
    return () => window.removeEventListener("as01:audit", onOpen);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setResult(await r.json());
    } catch {
      setResult({ error: "Network error — please try again." });
    }
    setLoading(false);
  };

  const close = () => {
    setOpen(false);
    setTimeout(() => setResult(null), 400);
  };

  const score = result?.healthScore ?? 0;
  const scoreColor = score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <>
      {/* section */}
      <section id="audit" className="relative scroll-mt-24 py-24">
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-purple-700/15 blur-[150px]" />
        <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-display text-xs uppercase tracking-[0.35em] text-purple-400">
              Free AI Tool
            </p>
            <h2 className="font-display mt-3 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              Is Your Business <span className="gradient-text">Losing Money Online?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              Get a free AI-powered audit of your business in 30 seconds. See your online
              health score, what&apos;s holding you back, and how much revenue you could be
              missing — no cost, no commitment.
            </p>
            <button
              onClick={() => {
                setResult(null);
                setOpen(true);
              }}
              className="btn-neon font-display mt-8 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-wider text-white"
            >
              🔍 Analyze My Business Free
            </button>
          </motion.div>
        </div>
      </section>

      {/* modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 p-3 backdrop-blur-md sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="glass-strong relative max-h-[94vh] w-full max-w-lg overflow-y-auto rounded-3xl p-6 md:p-8"
              initial={{ scale: 0.88, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 24, stiffness: 280 }}
            >
              <button
                onClick={close}
                aria-label="Close"
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-400 transition hover:border-purple-500/60 hover:text-white"
              >
                ✕
              </button>

              {/* FORM */}
              {!result && (
                <>
                  <p className="font-display text-xs uppercase tracking-[0.3em] text-purple-400">
                    Free Business Audit
                  </p>
                  <h3 className="font-display mt-2 text-2xl font-bold text-white">
                    Let&apos;s analyze <span className="gradient-text">your business</span>
                  </h3>
                  <p className="mt-2 text-sm text-slate-400">
                    Fill this in and our AI will instantly score your online presence and
                    show your growth potential.
                  </p>
                  <form onSubmit={submit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <input required placeholder="Business name *" className={inputCls} value={form.business} onChange={set("business")} />
                    <input placeholder="Industry (e.g. restaurant)" className={inputCls} value={form.industry} onChange={set("industry")} />
                    <input placeholder="Your website (or leave blank)" className={`${inputCls} sm:col-span-2`} value={form.website} onChange={set("website")} />
                    <input placeholder="Your name" className={inputCls} value={form.name} onChange={set("name")} />
                    <input required type="tel" placeholder="Phone number *" className={inputCls} value={form.phone} onChange={set("phone")} />
                    <input required type="email" placeholder="Email address *" className={`${inputCls} sm:col-span-2`} value={form.email} onChange={set("email")} />
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-neon font-display sm:col-span-2 rounded-xl px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white disabled:opacity-60"
                    >
                      {loading ? "Analyzing your business…" : "Get My Free Audit ⚡"}
                    </button>
                    <p className="text-center text-[11px] text-slate-500 sm:col-span-2">
                      🔒 We&apos;ll email you the full report. No spam, ever.
                    </p>
                  </form>
                </>
              )}

              {/* RESULT */}
              {result && (
                <div>
                  {result.error ? (
                    <p className="py-10 text-center text-sm text-red-400">{result.error}</p>
                  ) : result.healthScore == null ? (
                    <div className="py-8 text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-500 text-3xl shadow-[0_0_40px_rgba(147,51,234,0.5)]">
                        ✓
                      </div>
                      <h3 className="font-display mt-4 text-2xl font-bold text-white">
                        Thanks, {form.name.split(" ")[0] || "friend"}!
                      </h3>
                      <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
                        {result.note}
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="font-display text-xs uppercase tracking-[0.3em] text-purple-400">
                        Your Audit · {form.business}
                      </p>
                      <div className="mt-4 flex items-center gap-5 rounded-2xl border border-purple-500/25 bg-white/[0.04] p-5">
                        <div
                          className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full"
                          style={{ background: `conic-gradient(${scoreColor} ${score}%, rgba(255,255,255,0.08) ${score}% 100%)` }}
                        >
                          <div className="flex h-[74px] w-[74px] flex-col items-center justify-center rounded-full bg-[#0a0420]">
                            <span className="font-display text-2xl font-extrabold" style={{ color: scoreColor }}>
                              {score}
                            </span>
                            <span className="text-[9px] text-slate-500">/ 100</span>
                          </div>
                        </div>
                        <div>
                          <p className="font-display text-sm font-bold text-white">Online Health Score</p>
                          <p className="mt-1 text-xs leading-relaxed text-slate-400">{result.summary}</p>
                        </div>
                      </div>

                      {result.revenueLoss && (
                        <div className="mt-4 rounded-2xl border border-red-500/25 bg-red-500/[0.07] p-5">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-red-400">
                            💸 Estimated Revenue You&apos;re Losing
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-slate-200">{result.revenueLoss}</p>
                        </div>
                      )}

                      {result.problems && (
                        <div className="mt-4">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">⚠️ What&apos;s Holding You Back</p>
                          <ul className="mt-3 space-y-2">
                            {result.problems.map((p, i) => (
                              <li key={i} className="flex gap-2 text-sm text-slate-300">
                                <span className="text-red-400">✗</span>{p}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {result.opportunities && (
                        <div className="mt-4">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">🚀 How You Could Grow</p>
                          <ul className="mt-3 space-y-2">
                            {result.opportunities.map((o, i) => (
                              <li key={i} className="flex gap-2 text-sm text-slate-300">
                                <span className="text-green-400">✓</span>{o}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mt-6 rounded-2xl bg-gradient-to-r from-purple-900/40 to-blue-900/40 p-5 text-center">
                        <p className="font-display text-sm font-bold text-white">
                          Want us to fix all this for you?
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Project AS01 can turn this around — websites from ₹20,000, live in 7 days.
                        </p>
                        <a
                          href="https://wa.me/919670621213"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-neon font-display mt-4 inline-block rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider text-white"
                        >
                          💬 Get a Free Consultation
                        </a>
                      </div>
                    </>
                  )}
                  <button
                    onClick={close}
                    className="btn-ghost font-display mt-4 w-full rounded-xl px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
