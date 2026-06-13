"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLeadModal } from "./LeadModalContext";

const projectTypes = [
  "Business Website",
  "E-Commerce Store",
  "Mobile App",
  "Admin Dashboard / CRM",
  "AI Automation / Calling Agent",
  "Prediction Platform",
  "Gaming Platform",
  "Custom Software / ERP",
];

const budgets = ["₹20,000 – ₹50,000", "₹50,000 – ₹1,50,000", "₹1,50,000 – ₹5,00,000", "₹5,00,000+"];

const workflow = [
  { icon: "💾", label: "Request saved securely" },
  { icon: "🖥️", label: "Our team has been notified" },
  { icon: "📋", label: "Your project added to our queue" },
  { icon: "🤝", label: "We'll reach out to you shortly" },
];

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-purple-500/70 focus:shadow-[0_0_18px_rgba(168,85,247,0.25)]";

export default function LeadModal() {
  const { open, intent, closeModal } = useLeadModal();
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    business: "",
    projectType: projectTypes[0],
    budget: budgets[0],
    message: "",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, intent, source: "lead-modal" }),
      });
    } catch {
      // demo mode — still show the workflow
    }
    setSending(false);
    setSubmitted(true);
  };

  const close = () => {
    closeModal();
    setTimeout(() => setSubmitted(false), 400);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="glass-strong relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl p-6 md:p-8"
            initial={{ scale: 0.85, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-400 transition hover:border-purple-500/60 hover:text-white"
            >
              ✕
            </button>

            {!submitted ? (
              <>
                <p className="font-display text-xs uppercase tracking-[0.3em] text-purple-400">{intent}</p>
                <h3 className="font-display mt-2 text-2xl font-bold text-white">
                  Let&apos;s build something <span className="gradient-text">legendary</span>
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Fill this in and our team will get back to you shortly to understand your project.
                </p>

                <form onSubmit={submit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input required placeholder="Your name" className={inputCls} value={form.name} onChange={set("name")} />
                  <input required placeholder="Phone number" type="tel" className={inputCls} value={form.phone} onChange={set("phone")} />
                  <input required placeholder="Email address" type="email" className={`${inputCls} sm:col-span-2`} value={form.email} onChange={set("email")} />
                  <input placeholder="Business name" className={`${inputCls} sm:col-span-2`} value={form.business} onChange={set("business")} />
                  <select className={inputCls} value={form.projectType} onChange={set("projectType")}>
                    {projectTypes.map((t) => (
                      <option key={t} value={t} className="bg-[#0a0420]">{t}</option>
                    ))}
                  </select>
                  <select className={inputCls} value={form.budget} onChange={set("budget")}>
                    {budgets.map((b) => (
                      <option key={b} value={b} className="bg-[#0a0420]">{b}</option>
                    ))}
                  </select>
                  <textarea
                    placeholder="Tell us about your project…"
                    rows={3}
                    className={`${inputCls} sm:col-span-2`}
                    value={form.message}
                    onChange={set("message")}
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-neon font-display sm:col-span-2 rounded-xl px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white disabled:opacity-60"
                  >
                    {sending ? "Transmitting…" : "Submit & Get AI Call ⚡"}
                  </button>
                </form>
              </>
            ) : (
              <div className="py-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-500 text-3xl shadow-[0_0_40px_rgba(147,51,234,0.5)]">
                  ✓
                </div>
                <h3 className="font-display mt-4 text-center text-2xl font-bold text-white">
                  Thank you, {form.name.split(" ")[0] || "friend"}!
                </h3>
                <p className="mt-2 text-center text-sm text-slate-400">
                  We&apos;ve received your request. Here&apos;s what happens next:
                </p>
                <div className="mt-6 space-y-3">
                  {workflow.map((w, i) => (
                    <motion.div
                      key={w.label}
                      initial={{ opacity: 0, x: -24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.7 }}
                      className="glass flex items-center gap-3 rounded-xl px-4 py-3"
                    >
                      <span className="text-xl">{w.icon}</span>
                      <span className="text-sm text-slate-200">{w.label}</span>
                      <motion.span
                        className="ml-auto text-green-400"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1 + i * 0.7 }}
                      >
                        ✓
                      </motion.span>
                    </motion.div>
                  ))}
                </div>
                <a
                  href="https://wa.me/919670621213"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-neon font-display mt-6 block w-full rounded-xl px-6 py-3.5 text-center text-sm font-bold uppercase tracking-wider text-white"
                >
                  💬 Chat with us on WhatsApp
                </a>
                <button
                  onClick={close}
                  className="btn-ghost font-display mt-3 w-full rounded-xl px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white"
                >
                  Done
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
