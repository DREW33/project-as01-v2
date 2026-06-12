"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";

type Lead = {
  id: string;
  receivedAt: string;
  status: string;
  name?: string;
  phone?: string;
  email?: string;
  business?: string;
  projectType?: string;
  budget?: string;
  intent?: string;
  source?: string;
  message?: string;
};

const callLogs = [
  { lead: "Rohit Verma", duration: "4m 12s", outcome: "Consultation booked", sentiment: "Positive", time: "Today 11:42" },
  { lead: "Anita Desai", duration: "2m 48s", outcome: "Requested pricing PDF", sentiment: "Interested", time: "Today 10:15" },
  { lead: "Karan Malhotra", duration: "6m 03s", outcome: "Follow-up scheduled", sentiment: "Positive", time: "Yesterday 17:30" },
  { lead: "Fatima Khan", duration: "1m 55s", outcome: "Wrong number", sentiment: "N/A", time: "Yesterday 14:05" },
];

const traffic = [42, 58, 51, 69, 75, 64, 88, 92, 81, 96, 89, 100];
const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-purple-500/70";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tab, setTab] = useState<"leads" | "calls" | "analytics" | "studio">("leads");
  const [studioTopic, setStudioTopic] = useState("");
  const [studioResult, setStudioResult] = useState("");
  const [studioLoading, setStudioLoading] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [daily, setDaily] = useState<{ date: string; text: string } | null>(null);
  const [dailyLoading, setDailyLoading] = useState(false);
  const [dailyCopied, setDailyCopied] = useState(false);

  const fetchDaily = async (force = false) => {
    if (dailyLoading) return;
    setDailyLoading(true);
    try {
      const r = await fetch(`/api/daily-posts${force ? "?force=1" : ""}`, {
        headers: { "x-admin-key": sessionStorage.getItem("as01_admin_key") ?? "" },
      });
      const d = await r.json();
      if (d.text) setDaily({ date: d.date, text: d.text });
      else setDaily({ date: "", text: d.error || "Generation failed — try again." });
    } catch {
      setDaily({ date: "", text: "Network error — try again." });
    }
    setDailyLoading(false);
  };

  const generate = async (type: "ideas" | "caption" | "calendar") => {
    if (!studioTopic.trim() || studioLoading) return;
    setStudioLoading(type);
    setStudioResult("");
    try {
      const r = await fetch("/api/social", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": sessionStorage.getItem("as01_admin_key") ?? "",
        },
        body: JSON.stringify({ type, topic: studioTopic }),
      });
      const d = await r.json();
      setStudioResult(d.text || d.error || "Something went wrong — try again.");
    } catch {
      setStudioResult("Network error — try again.");
    }
    setStudioLoading(null);
  };

  useEffect(() => {
    if (sessionStorage.getItem("as01_admin_key")) setAuthed(true);
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetch("/api/leads", {
      headers: { "x-admin-key": sessionStorage.getItem("as01_admin_key") ?? "" },
    })
      .then((r) => r.json())
      .then((d) => setLeads(d.leads ?? []))
      .catch(() => {});
  }, [authed]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    try {
      const r = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pass }),
      });
      if (r.ok) {
        sessionStorage.setItem("as01_admin_key", pass);
        setAuthed(true);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
    setChecking(false);
  };

  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030014] px-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-strong w-full max-w-sm rounded-3xl p-8 text-center"
        >
          <Logo />
          <h1 className="font-display mt-6 text-xl font-bold text-white">Admin Access</h1>
          <p className="mt-2 text-xs text-slate-500">Authorized personnel only.</p>
          <form onSubmit={login} className="mt-6 space-y-4">
            <input
              type="password"
              placeholder="Password"
              className={inputCls}
              value={pass}
              onChange={(e) => {
                setPass(e.target.value);
                setError(false);
              }}
            />
            {error && <p className="text-xs text-red-400">Access denied. Try again.</p>}
            <button
              disabled={checking}
              className="btn-neon font-display w-full rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-60"
            >
              {checking ? "Verifying…" : "Enter Dashboard"}
            </button>
          </form>
          <Link href="/" className="mt-5 block text-xs text-slate-500 transition hover:text-white">
            ← Back to website
          </Link>
        </motion.div>
      </main>
    );
  }

  const stats = [
    { label: "Total Leads", value: leads.length || 0, icon: "🎯" },
    { label: "New Today", value: leads.filter((l) => new Date(l.receivedAt).toDateString() === new Date().toDateString()).length, icon: "✨" },
    { label: "AI Calls Made", value: callLogs.length, icon: "🤖" },
    { label: "Est. Pipeline", value: "₹8.4L", icon: "💰" },
  ];

  return (
    <main className="min-h-screen bg-[#030014] pb-16">
      <header className="glass-strong sticky top-0 z-40 border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="rounded-full border border-purple-500/40 bg-purple-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-purple-300">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs text-slate-400 transition hover:text-white">
              View site ↗
            </Link>
            <button
              onClick={() => {
                sessionStorage.removeItem("as01_admin_key");
                setAuthed(false);
              }}
              className="btn-ghost rounded-full px-4 py-2 text-xs font-semibold text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 pt-8 md:px-8">
        {/* stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass glow-card rounded-2xl p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{s.icon}</span>
                <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80]" />
              </div>
              <p className="font-display gradient-text mt-3 text-3xl font-extrabold">{s.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* tabs */}
        <div className="mt-8 flex gap-2">
          {(
            [
              ["leads", "🎯 Leads & CRM"],
              ["calls", "🤖 AI Call Logs"],
              ["analytics", "📊 Analytics"],
              ["studio", "✨ AI Studio"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                tab === id ? "btn-neon text-white" : "glass text-slate-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "leads" && (
          <div className="glass mt-6 overflow-x-auto rounded-2xl">
            {leads.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-3xl">📭</p>
                <p className="mt-3 text-sm text-slate-400">
                  No leads yet. Submit the form on the website and it appears here instantly.
                </p>
              </div>
            ) : (
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-4">Lead</th>
                    <th className="px-5 py-4">Contact</th>
                    <th className="px-5 py-4">Project</th>
                    <th className="px-5 py-4">Budget</th>
                    <th className="px-5 py-4">Message</th>
                    <th className="px-5 py-4">Intent</th>
                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l) => (
                    <tr key={l.id} className="border-b border-white/5 transition hover:bg-white/[0.03]">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-white">{l.name || "—"}</p>
                        <p className="text-xs text-slate-500">{l.business || l.source}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-300">
                        <p>{l.phone || "—"}</p>
                        <p className="text-xs text-slate-500">{l.email}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-300">{l.projectType || "—"}</td>
                      <td className="px-5 py-4 text-slate-300">{l.budget || "—"}</td>
                      <td className="max-w-[240px] px-5 py-4 text-slate-300">
                        <span className="line-clamp-2 text-xs leading-relaxed" title={l.message}>
                          {l.message || "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-blue-500/15 px-2.5 py-1 text-[11px] text-blue-300">
                          {l.intent || "General"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-green-500/15 px-2.5 py-1 text-[11px] font-semibold uppercase text-green-300">
                          {l.status} · AI call queued
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === "calls" && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {callLogs.map((c, i) => (
              <motion.div
                key={c.lead}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass glow-card rounded-2xl p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="font-display font-bold text-white">{c.lead}</p>
                  <span className="text-xs text-slate-500">{c.time}</span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl bg-white/[0.04] p-3">
                    <p className="text-xs text-slate-500">Duration</p>
                    <p className="mt-1 text-sm font-semibold text-white">{c.duration}</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.04] p-3">
                    <p className="text-xs text-slate-500">Sentiment</p>
                    <p className="mt-1 text-sm font-semibold text-purple-300">{c.sentiment}</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.04] p-3">
                    <p className="text-xs text-slate-500">Outcome</p>
                    <p className="mt-1 text-sm font-semibold text-green-300">{c.outcome}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <button className="btn-ghost flex-1 rounded-lg py-2 text-[11px] font-semibold uppercase tracking-wider text-white">
                    ▶ Play Recording
                  </button>
                  <button className="btn-ghost flex-1 rounded-lg py-2 text-[11px] font-semibold uppercase tracking-wider text-white">
                    📄 Transcript
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === "studio" && (
          <>
          <div className="glass mt-6 rounded-2xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                  🔥 Today&apos;s Auto-Posts <span className="gradient-text">· 3 viral posts daily</span>
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Auto-generated every morning at 8:30 AM IST from today&apos;s real tech
                  trends (Hacker News + Dev.to) — AI news, business AI tips &amp; dev insights.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchDaily(false)}
                  disabled={dailyLoading}
                  className="btn-neon font-display rounded-xl px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white disabled:opacity-50"
                >
                  {dailyLoading ? "Loading…" : "📬 Get Today's Posts"}
                </button>
                {daily?.text && (
                  <>
                    <button
                      onClick={() => fetchDaily(true)}
                      disabled={dailyLoading}
                      className="btn-ghost rounded-xl px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-white disabled:opacity-50"
                    >
                      🔄 Regenerate
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(daily.text).then(() => {
                          setDailyCopied(true);
                          setTimeout(() => setDailyCopied(false), 1500);
                        });
                      }}
                      className="btn-ghost rounded-xl px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-white"
                    >
                      {dailyCopied ? "✓ Copied" : "📋 Copy All"}
                    </button>
                  </>
                )}
              </div>
            </div>
            {daily?.text && (
              <div className="mt-4 max-h-[420px] overflow-y-auto whitespace-pre-line rounded-xl bg-white/[0.03] p-4 text-sm leading-relaxed text-slate-300">
                {daily.date && (
                  <p className="mb-2 text-[11px] uppercase tracking-wider text-purple-400">
                    Generated for {daily.date}
                  </p>
                )}
                {daily.text}
              </div>
            )}
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                ✨ Instagram Content Generator
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Powered by your AI API. Describe a goal or topic, generate, then copy-paste
                straight into Instagram. Posting manually keeps your account 100% safe.
              </p>
              <textarea
                rows={4}
                value={studioTopic}
                onChange={(e) => setStudioTopic(e.target.value)}
                placeholder="e.g. promote our ₹20,000 website offer to restaurant owners in Guwahati"
                className={`${inputCls} mt-4`}
              />
              <div className="mt-4 flex flex-wrap gap-2.5">
                {(
                  [
                    ["ideas", "💡 8 Post Ideas"],
                    ["caption", "✍️ Captions + Hashtags"],
                    ["calendar", "🗓️ 7-Day Calendar"],
                  ] as const
                ).map(([t, label]) => (
                  <button
                    key={t}
                    onClick={() => generate(t)}
                    disabled={!!studioLoading || !studioTopic.trim()}
                    className="btn-neon font-display rounded-xl px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white disabled:opacity-50"
                  >
                    {studioLoading === t ? "Generating…" : label}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-[11px] leading-relaxed text-slate-600">
                Growth tip: post 4-5x a week, reply to every comment within an hour, and put
                your WhatsApp link in bio. Never use auto-DM bots — Instagram bans for it.
              </p>
            </div>
            <div className="glass relative rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                  Result
                </h3>
                {studioResult && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(studioResult).then(() => {
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1500);
                      });
                    }}
                    className="btn-ghost rounded-lg px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white"
                  >
                    {copied ? "✓ Copied" : "📋 Copy"}
                  </button>
                )}
              </div>
              <div className="mt-4 max-h-[420px] overflow-y-auto whitespace-pre-line text-sm leading-relaxed text-slate-300">
                {studioLoading ? (
                  <span className="animate-pulse text-purple-300">
                    AI is writing your content…
                  </span>
                ) : (
                  studioResult || (
                    <span className="text-slate-600">
                      Generated content appears here. Type a topic on the left and pick a
                      format.
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
          </>
        )}

        {tab === "analytics" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="glass rounded-2xl p-6 lg:col-span-2">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                Website Traffic (12 months)
              </h3>
              <div className="mt-6 flex h-48 items-end gap-2">
                {traffic.map((v, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-2">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${v}%` }}
                      transition={{ delay: i * 0.06, duration: 0.6, ease: "easeOut" }}
                      className="w-full rounded-t-md bg-gradient-to-t from-blue-600 to-purple-500 shadow-[0_0_12px_rgba(147,51,234,0.4)]"
                    />
                    <span className="text-[9px] text-slate-600">{months[i]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {[
                ["Conversion rate", "7.4%", "82%"],
                ["Avg. session", "4m 32s", "68%"],
                ["AI call answer rate", "91%", "91%"],
                ["Revenue this quarter", "₹12.6L", "76%"],
              ].map(([label, value, width]) => (
                <div key={label} className="glass rounded-2xl p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
                    <p className="font-display gradient-text font-bold">{value}</p>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
