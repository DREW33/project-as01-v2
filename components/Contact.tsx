"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-purple-500/70 focus:shadow-[0_0_18px_rgba(168,85,247,0.25)]";

const channels = [
  { icon: "💬", label: "WhatsApp", value: "+91 98765 43210", href: "https://wa.me/919876543210" },
  { icon: "📞", label: "Call Us", value: "+91 98765 43210", href: "tel:+919876543210" },
  { icon: "📧", label: "Email", value: "hello@projectas01.com", href: "mailto:hello@projectas01.com" },
];

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, intent: "Contact Form", source: "contact-section" }),
      });
    } catch {
      /* demo mode */
    }
    setSending(false);
    setSent(true);
  };

  return (
    <section id="contact" className="relative scroll-mt-24 py-24">
      <div className="pointer-events-none absolute left-1/2 bottom-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-purple-800/15 blur-[160px]" />
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="font-display text-xs uppercase tracking-[0.35em] text-blue-400">Contact</p>
          <h2 className="font-display mt-3 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            Let&apos;s Build Your <span className="gradient-text">Next Big Thing</span>
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-8 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="space-y-4 lg:col-span-2"
          >
            {channels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="glass glow-card flex items-center gap-4 rounded-2xl p-5"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600/30 to-blue-600/30 text-2xl">
                  {c.icon}
                </span>
                <div>
                  <p className="font-display text-sm font-bold text-white">{c.label}</p>
                  <p className="text-sm text-slate-400">{c.value}</p>
                </div>
                <span className="ml-auto text-purple-400">→</span>
              </a>
            ))}

            {/* stylized map */}
            <div className="glass relative h-44 overflow-hidden rounded-2xl">
              <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(139,92,246,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.25)_1px,transparent_1px)] [background-size:28px_28px]" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="relative flex h-5 w-5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-500 opacity-60" />
                  <span className="relative inline-flex h-5 w-5 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 shadow-[0_0_20px_rgba(147,51,234,0.9)]" />
                </span>
              </div>
              <p className="absolute bottom-3 left-4 text-xs text-slate-400">📍 Guwahati, Assam · Working worldwide 🌍</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="glass-strong rounded-3xl p-7 md:p-9 lg:col-span-3"
          >
            {!sent ? (
              <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input required placeholder="Your name" className={inputCls} value={form.name} onChange={set("name")} />
                <input required placeholder="Phone number" type="tel" className={inputCls} value={form.phone} onChange={set("phone")} />
                <input required placeholder="Email address" type="email" className={`${inputCls} sm:col-span-2`} value={form.email} onChange={set("email")} />
                <textarea required placeholder="Describe your project…" rows={5} className={`${inputCls} sm:col-span-2`} value={form.message} onChange={set("message")} />
                <button
                  type="submit"
                  disabled={sending}
                  className="btn-neon font-display sm:col-span-2 rounded-xl px-6 py-4 text-sm font-bold uppercase tracking-wider text-white disabled:opacity-60"
                >
                  {sending ? "Sending…" : "Send Message 🚀"}
                </button>
                <p className="text-center text-xs text-slate-500 sm:col-span-2">
                  Average reply time: under 60 seconds (our AI agent never sleeps).
                </p>
              </form>
            ) : (
              <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-500 text-3xl shadow-[0_0_40px_rgba(147,51,234,0.5)]">
                  ✓
                </div>
                <h3 className="font-display mt-5 text-2xl font-bold text-white">Message received!</h3>
                <p className="mt-2 max-w-sm text-sm text-slate-400">
                  Our AI agent is processing your request and will reach out within 60 seconds. Keep your phone close. ⚡
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
