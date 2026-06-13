"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import PostMaker from "@/components/PostMaker";

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
  const [tab, setTab] = useState<
    "leads" | "calls" | "analytics" | "studio" | "analyzer" | "admins"
  >("leads");
  const [studioTopic, setStudioTopic] = useState("");
  const [studioResult, setStudioResult] = useState("");
  const [studioLoading, setStudioLoading] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [daily, setDaily] = useState<{ date: string; text: string } | null>(null);
  const [dailyLoading, setDailyLoading] = useState(false);
  const [dailyCopied, setDailyCopied] = useState(false);

  // Client business analyzer
  type Analysis = {
    healthScore?: number;
    problems?: string[];
    revenueLoss?: string;
    opportunities?: string[];
    proposal?: string;
    recommendedPackage?: string;
    whatsappPitch?: string;
    error?: string;
  };
  const [azForm, setAzForm] = useState({ business: "", website: "", industry: "", notes: "" });
  const [azResult, setAzResult] = useState<Analysis | null>(null);
  const [azLoading, setAzLoading] = useState(false);
  const [azCopied, setAzCopied] = useState("");

  const runAnalysis = async () => {
    if (!azForm.business.trim() || azLoading) return;
    setAzLoading(true);
    setAzResult(null);
    try {
      const r = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": sessionStorage.getItem("as01_admin_key") ?? "",
        },
        body: JSON.stringify(azForm),
      });
      setAzResult(await r.json());
    } catch {
      setAzResult({ error: "Network error — try again." });
    }
    setAzLoading(false);
  };

  const copyText = (text: string, tag: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setAzCopied(tag);
      setTimeout(() => setAzCopied(""), 1500);
    });
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Delete this lead permanently?")) return;
    setLeads((ls) => ls.filter((l) => l.id !== id));
    try {
      await fetch("/api/leads", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": sessionStorage.getItem("as01_admin_key") ?? "",
        },
        body: JSON.stringify({ id }),
      });
    } catch {
      /* optimistic — already removed from UI */
    }
  };

  // Admin account management
  const [admins, setAdmins] = useState<{ username: string; createdAt: string }[]>([]);
  const [newAdmin, setNewAdmin] = useState({ username: "", password: "" });
  const [pwChange, setPwChange] = useState({ username: "", password: "" });
  const [adminMsg, setAdminMsg] = useState("");

  const loadAdmins = async () => {
    try {
      const r = await fetch("/api/admin-users", {
        headers: { "x-admin-key": sessionStorage.getItem("as01_admin_key") ?? "" },
      });
      const d = await r.json();
      setAdmins(d.admins ?? []);
    } catch {
      /* ignore */
    }
  };

  const adminAction = async (body: Record<string, string>, okMsg: string) => {
    setAdminMsg("");
    try {
      const r = await fetch("/api/admin-users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": sessionStorage.getItem("as01_admin_key") ?? "",
        },
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (d.ok) {
        setAdminMsg(okMsg);
        loadAdmins();
      } else {
        setAdminMsg(d.error || "Something went wrong.");
      }
    } catch {
      setAdminMsg("Network error.");
    }
  };

  useEffect(() => {
    if (authed && tab === "admins") loadAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, tab]);

  const downloadPdf = () => {
    if (!azResult || azResult.error) return;
    const esc = (s = "") =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const score = azResult.healthScore ?? 0;
    const scoreColor = score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";
    const li = (arr: string[] = [], color: string, mark: string) =>
      arr
        .map(
          (x) =>
            `<li><span style="color:${color};font-weight:700;margin-right:8px">${mark}</span>${esc(x)}</li>`
        )
        .join("");

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Growth Report — ${esc(
      azForm.business
    )}</title>
<style>
@page{size:A4;margin:0}
*{margin:0;padding:0;box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:'Segoe UI',Arial,sans-serif;background:#030014;color:#e8edf5}
.page{width:210mm;min-height:297mm;margin:0 auto;background:#06021a;position:relative;overflow:hidden}
.blob{position:absolute;border-radius:50%;filter:blur(80px);opacity:.45}
.hero{position:relative;padding:48px 50px 36px;background:linear-gradient(135deg,#1a0b3a,#0a1633);border-bottom:2px solid #7c3aed}
.brand{display:flex;align-items:center;gap:14px}
.ring{width:60px;height:60px;border-radius:50%;background:conic-gradient(#a855f7,#3b82f6,#38bdf8,#a855f7);display:flex;align-items:center;justify-content:center}
.ring span{width:50px;height:50px;border-radius:50%;background:#06021a;display:flex;align-items:center;justify-content:center;font-family:monospace;font-weight:bold;font-size:18px;background-clip:text;color:#a855f7}
.logo-txt{font-size:26px;font-weight:800;letter-spacing:1px}
.logo-txt b{color:#fff}.logo-txt em{font-style:normal;background:linear-gradient(92deg,#c084fc,#60a5fa);-webkit-background-clip:text;background-clip:text;color:transparent}
.tag{font-family:monospace;font-size:11px;color:#8b93b5;letter-spacing:3px;margin-top:2px}
.report-title{margin-top:28px;font-size:30px;font-weight:800;line-height:1.2}
.report-title em{font-style:normal;background:linear-gradient(92deg,#c084fc,#60a5fa);-webkit-background-clip:text;background-clip:text;color:transparent}
.sub{color:#9aa3c7;margin-top:8px;font-size:13px}
.body{padding:34px 50px}
.scorewrap{display:flex;gap:24px;align-items:center;background:rgba(255,255,255,.04);border:1px solid rgba(168,85,247,.25);border-radius:16px;padding:24px;margin-bottom:22px}
.gauge{width:120px;height:120px;border-radius:50%;flex-shrink:0;background:conic-gradient(${scoreColor} ${score}%,#1e1b34 ${score}% 100%);display:flex;align-items:center;justify-content:center}
.gauge div{width:92px;height:92px;border-radius:50%;background:#06021a;display:flex;flex-direction:column;align-items:center;justify-content:center}
.gauge b{font-size:34px;font-weight:800;color:${scoreColor}}
.gauge small{font-size:10px;color:#8b93b5;letter-spacing:1px}
.scoremsg h3{font-size:16px;margin-bottom:6px}
.scoremsg p{color:#9aa3c7;font-size:13px;line-height:1.6}
.lossbox{background:linear-gradient(135deg,rgba(239,68,68,.14),rgba(124,58,237,.08));border:1px solid rgba(239,68,68,.35);border-radius:16px;padding:22px;margin-bottom:22px}
.lossbox .lbl{color:#fca5a5;font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase}
.lossbox p{margin-top:8px;font-size:15px;line-height:1.6;color:#fff}
.sec{margin-bottom:22px}
.sec h2{font-size:13px;letter-spacing:1.5px;text-transform:uppercase;color:#a855f7;margin-bottom:12px;border-left:3px solid #a855f7;padding-left:10px}
.sec ul{list-style:none}
.sec li{font-size:13px;line-height:1.6;color:#dbe2f0;margin-bottom:9px;display:flex}
.proposal{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:22px;font-size:13px;line-height:1.7;color:#dbe2f0;white-space:pre-line}
.pkg{display:inline-block;margin-top:10px;background:linear-gradient(92deg,#9333ea,#3b82f6);color:#fff;font-size:12px;font-weight:700;padding:6px 16px;border-radius:99px}
.footer{margin-top:8px;padding:26px 50px;background:linear-gradient(135deg,#1a0b3a,#0a1633);border-top:2px solid #7c3aed}
.footer h3{font-size:16px;font-weight:800;margin-bottom:14px}
.footer h3 em{font-style:normal;background:linear-gradient(92deg,#c084fc,#60a5fa);-webkit-background-clip:text;background-clip:text;color:transparent}
.contacts{display:flex;flex-wrap:wrap;gap:10px 26px}
.contacts div{font-size:12.5px;color:#cdd3ec}
.contacts b{color:#a855f7}
.disc{margin-top:16px;font-size:9.5px;color:#5c6480;line-height:1.5}
</style></head>
<body><div class="page">
<div class="blob" style="width:300px;height:300px;background:#7c3aed;top:-60px;left:-60px"></div>
<div class="blob" style="width:280px;height:280px;background:#2563eb;bottom:200px;right:-80px"></div>
<div class="hero">
  <div class="brand"><div class="ring"><span>&lt;/&gt;</span></div><div><div class="logo-txt"><b>project</b> <em>as01</em></div><div class="tag">&lt;/&gt; VIBE CODER &lt;/&gt;</div></div></div>
  <div class="report-title">Digital Growth Report for<br><em>${esc(azForm.business)}</em></div>
  <div class="sub">${esc(azForm.industry || "Business")} ${azForm.website ? "· " + esc(azForm.website) : ""} · Prepared ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</div>
</div>
<div class="body">
  <div class="scorewrap">
    <div class="gauge"><div><b>${score}</b><small>/ 100</small></div></div>
    <div class="scoremsg"><h3>Online Health Score</h3><p>This measures how well your current online presence attracts and converts customers. ${
      score >= 70 ? "Good foundation — but real growth is left on the table." : score >= 40 ? "Major gaps are costing you customers every day." : "Critical — you are nearly invisible to online buyers."
    }</p></div>
  </div>
  ${azResult.revenueLoss ? `<div class="lossbox"><div class="lbl">💸 Estimated Revenue Being Lost</div><p>${esc(azResult.revenueLoss)}</p></div>` : ""}
  ${azResult.problems?.length ? `<div class="sec"><h2>⚠️ Problems We Found</h2><ul>${li(azResult.problems, "#ef4444", "✗")}</ul></div>` : ""}
  ${azResult.opportunities?.length ? `<div class="sec"><h2>🚀 Growth Opportunities with Project AS01</h2><ul>${li(azResult.opportunities, "#22c55e", "✓")}</ul></div>` : ""}
  ${azResult.proposal ? `<div class="sec"><h2>📄 Our Proposal</h2><div class="proposal">${esc(azResult.proposal)}${azResult.recommendedPackage ? `<br><span class="pkg">Recommended: ${esc(azResult.recommendedPackage)}</span>` : ""}</div></div>` : ""}
</div>
<div class="footer">
  <h3>Let's grow <em>${esc(azForm.business)}</em> together 🚀</h3>
  <div class="contacts">
    <div>💬 WhatsApp: <b>+91 96706 21213</b></div>
    <div>📞 Call: <b>+91 96783 49001</b></div>
    <div>🌐 Web: <b>project-as01.vercel.app</b></div>
    <div>📸 Instagram: <b>@project_as01</b></div>
  </div>
  <div class="disc">Revenue figures are good-faith estimates based on typical industry benchmarks, not guarantees. © ${new Date().getFullYear()} Project AS01 · Guwahati, Assam · Premium Websites, Apps & AI Solutions.</div>
</div>
</div>
<script>window.onload=function(){setTimeout(function(){window.print()},400)}</script>
</body></html>`;

    const w = window.open("", "_blank");
    if (!w) {
      alert("Please allow pop-ups to download the PDF report.");
      return;
    }
    w.document.write(html);
    w.document.close();
  };

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
            <button
              onClick={() => {
                setTab("leads");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              aria-label="Admin dashboard home"
              className="transition hover:opacity-80"
            >
              <Logo />
            </button>
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
        <div className="mt-8 flex flex-wrap gap-2">
          {(
            [
              ["leads", "🎯 Leads & CRM"],
              ["calls", "🤖 AI Call Logs"],
              ["analytics", "📊 Analytics"],
              ["studio", "✨ AI Studio"],
              ["analyzer", "🔍 Client Analyzer"],
              ["admins", "👤 Admins"],
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
                    <th className="px-5 py-4 text-right">Action</th>
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
                          {l.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => deleteLead(l.id)}
                          aria-label="Delete lead"
                          title="Delete lead"
                          className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-[11px] font-semibold text-red-300 transition hover:bg-red-500/25"
                        >
                          🗑 Delete
                        </button>
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
          <PostMaker />
          </>
        )}

        {tab === "analyzer" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="glass h-fit rounded-2xl p-6">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                🔍 Client Business Analyzer
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Enter a prospect&apos;s details. AI scans their current website, finds the
                problems, estimates the money they&apos;re losing, and writes a ready-to-send
                proposal — your perfect sales weapon.
              </p>
              <input
                className={`${inputCls} mt-4`}
                placeholder="Business name *"
                value={azForm.business}
                onChange={(e) => setAzForm((f) => ({ ...f, business: e.target.value }))}
              />
              <input
                className={`${inputCls} mt-3`}
                placeholder="Their website (or leave blank if none)"
                value={azForm.website}
                onChange={(e) => setAzForm((f) => ({ ...f, website: e.target.value }))}
              />
              <input
                className={`${inputCls} mt-3`}
                placeholder="Industry (e.g. restaurant, salon, real estate)"
                value={azForm.industry}
                onChange={(e) => setAzForm((f) => ({ ...f, industry: e.target.value }))}
              />
              <textarea
                rows={2}
                className={`${inputCls} mt-3`}
                placeholder="Anything you know about them (optional)"
                value={azForm.notes}
                onChange={(e) => setAzForm((f) => ({ ...f, notes: e.target.value }))}
              />
              <button
                onClick={runAnalysis}
                disabled={azLoading || !azForm.business.trim()}
                className="btn-neon font-display mt-4 w-full rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50"
              >
                {azLoading ? "Analyzing their business…" : "🚀 Analyze & Build Proposal"}
              </button>
            </div>

            <div className="space-y-4">
              {!azResult && !azLoading && (
                <div className="glass flex h-full min-h-[300px] items-center justify-center rounded-2xl p-6 text-center text-sm text-slate-600">
                  The full analysis, revenue-loss estimate and ready-to-send proposal will
                  appear here.
                </div>
              )}
              {azLoading && (
                <div className="glass flex h-full min-h-[300px] items-center justify-center rounded-2xl p-6">
                  <span className="animate-pulse text-purple-300">
                    Scanning their website &amp; building your pitch…
                  </span>
                </div>
              )}
              {azResult?.error && (
                <div className="glass rounded-2xl p-6 text-sm text-red-400">{azResult.error}</div>
              )}
              {azResult && !azResult.error && (
                <>
                  <button
                    onClick={downloadPdf}
                    className="btn-neon font-display w-full rounded-xl px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white"
                  >
                    📄 Download Branded PDF Report
                  </button>
                  <div className="glass rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <p className="text-xs uppercase tracking-wider text-slate-500">
                        Online Health Score
                      </p>
                      <p className="font-display gradient-text text-3xl font-extrabold">
                        {azResult.healthScore ?? "—"}/100
                      </p>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-400"
                        style={{ width: `${azResult.healthScore ?? 0}%` }}
                      />
                    </div>
                  </div>

                  {azResult.revenueLoss && (
                    <div className="glass rounded-2xl border border-red-500/20 p-6">
                      <p className="text-xs font-bold uppercase tracking-wider text-red-400">
                        💸 Estimated Revenue Lost
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-200">
                        {azResult.revenueLoss}
                      </p>
                    </div>
                  )}

                  {azResult.problems && (
                    <div className="glass rounded-2xl p-6">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        ⚠️ Problems Found
                      </p>
                      <ul className="mt-3 space-y-2">
                        {azResult.problems.map((p, i) => (
                          <li key={i} className="flex gap-2 text-sm text-slate-300">
                            <span className="text-red-400">✗</span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {azResult.opportunities && (
                    <div className="glass rounded-2xl p-6">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        🚀 Growth Opportunities with Project AS01
                      </p>
                      <ul className="mt-3 space-y-2">
                        {azResult.opportunities.map((o, i) => (
                          <li key={i} className="flex gap-2 text-sm text-slate-300">
                            <span className="text-green-400">✓</span>
                            {o}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {azResult.proposal && (
                    <div className="glass rounded-2xl p-6">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-wider text-purple-400">
                          📄 Ready-to-Send Proposal
                          {azResult.recommendedPackage && (
                            <span className="ml-2 rounded-full bg-purple-500/15 px-2 py-0.5 text-[10px] text-purple-300">
                              {azResult.recommendedPackage}
                            </span>
                          )}
                        </p>
                        <button
                          onClick={() => copyText(azResult.proposal!, "proposal")}
                          className="btn-ghost rounded-lg px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white"
                        >
                          {azCopied === "proposal" ? "✓ Copied" : "📋 Copy"}
                        </button>
                      </div>
                      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-200">
                        {azResult.proposal}
                      </p>
                    </div>
                  )}

                  {azResult.whatsappPitch && (
                    <div className="glass rounded-2xl border border-green-500/20 p-6">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-wider text-green-400">
                          💬 WhatsApp Opener
                        </p>
                        <button
                          onClick={() => copyText(azResult.whatsappPitch!, "wa")}
                          className="btn-ghost rounded-lg px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white"
                        >
                          {azCopied === "wa" ? "✓ Copied" : "📋 Copy"}
                        </button>
                      </div>
                      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-200">
                        {azResult.whatsappPitch}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {tab === "admins" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                  ➕ Add New Admin
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Give a teammate their own login. They&apos;ll use the username &amp; password
                  below on the admin login page.
                </p>
                <input
                  className={`${inputCls} mt-4`}
                  placeholder="Username (e.g. rahul)"
                  value={newAdmin.username}
                  onChange={(e) => setNewAdmin((f) => ({ ...f, username: e.target.value }))}
                />
                <input
                  className={`${inputCls} mt-3`}
                  type="password"
                  placeholder="Password (min 6 characters)"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin((f) => ({ ...f, password: e.target.value }))}
                />
                <button
                  onClick={() =>
                    adminAction(
                      { action: "add", ...newAdmin },
                      `Admin "${newAdmin.username}" added.`
                    ).then(() => setNewAdmin({ username: "", password: "" }))
                  }
                  className="btn-neon font-display mt-4 w-full rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-wider text-white"
                >
                  Create Admin
                </button>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                  🔑 Change Admin Password
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Pick an admin and set a new password for them.
                </p>
                <select
                  className={`${inputCls} mt-4`}
                  value={pwChange.username}
                  onChange={(e) => setPwChange((f) => ({ ...f, username: e.target.value }))}
                >
                  <option value="" className="bg-[#0a0420]">Select admin…</option>
                  {admins.map((a) => (
                    <option key={a.username} value={a.username} className="bg-[#0a0420]">
                      {a.username}
                    </option>
                  ))}
                </select>
                <input
                  className={`${inputCls} mt-3`}
                  type="password"
                  placeholder="New password (min 6 characters)"
                  value={pwChange.password}
                  onChange={(e) => setPwChange((f) => ({ ...f, password: e.target.value }))}
                />
                <button
                  onClick={() =>
                    adminAction(
                      { action: "changePassword", ...pwChange },
                      `Password updated for "${pwChange.username}".`
                    ).then(() => setPwChange({ username: "", password: "" }))
                  }
                  disabled={!pwChange.username}
                  className="btn-ghost font-display mt-4 w-full rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50"
                >
                  Update Password
                </button>
              </div>

              {adminMsg && (
                <p className="rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-3 text-sm text-purple-200">
                  {adminMsg}
                </p>
              )}
            </div>

            <div className="glass h-fit rounded-2xl p-6">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                Team Admins
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Your master password (set at setup) always works and isn&apos;t shown here.
              </p>
              <div className="mt-4 space-y-2">
                {admins.length === 0 ? (
                  <p className="rounded-xl bg-white/[0.03] p-4 text-center text-sm text-slate-600">
                    No extra admins yet. Add one on the left.
                  </p>
                ) : (
                  admins.map((a) => (
                    <div
                      key={a.username}
                      className="flex items-center justify-between rounded-xl bg-white/[0.04] px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">{a.username}</p>
                        <p className="text-[11px] text-slate-500">
                          Added {new Date(a.createdAt).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          confirm(`Remove admin "${a.username}"?`) &&
                          adminAction({ action: "delete", username: a.username }, `Removed "${a.username}".`)
                        }
                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-[11px] font-semibold text-red-300 transition hover:bg-red-500/25"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
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
