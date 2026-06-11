"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLeadModal } from "./LeadModalContext";

type Msg = { role: "bot" | "user"; text: string };

const quickReplies = ["💰 Pricing", "🗂️ Portfolio", "📅 Book a call", "🤖 AI automation"];

/*
 * Demo brain: keyword-routed answers. To go fully agentic, point this at
 * /api/chat backed by the Claude API (see app/api/chat/route.ts).
 */
function brain(input: string): string {
  const q = input.toLowerCase();
  if (/(price|pricing|cost|budget|charge|₹|quote)/.test(q))
    return "Our plans start at ₹20,000+ (Starter), ₹50,000+ (Business — most popular) and Custom for Premium AI/enterprise builds. Every plan includes futuristic design and AI lead capture. Want me to open the quote form?";
  if (/(portfolio|project|work|example|demo)/.test(q))
    return "We've shipped 50+ products — e-commerce (NovaCommerce, +64% conversions), CRMs, prediction platforms, gaming systems for 140k concurrent players, and AI calling agents. Scroll to the Projects section or tap a card to open its live preview! 🚀";
  if (/(call|book|schedule|meet|consult|talk)/.test(q))
    return "Easy! Tap the button below and drop your number — our AI voice agent will call you within 60 seconds to understand your project and schedule a consultation with the team. ⚡";
  if (/(ai|automation|chatbot|agent|voice)/.test(q))
    return "AI is our home turf 🤖 We build chatbots, AI calling agents (like the one that will call you!), CRM automation and full business automation using Claude, OpenAI and ElevenLabs. What process do you want to automate?";
  if (/(app|android|ios|mobile)/.test(q))
    return "We build native-quality Android + iOS apps from one codebase — like MediBook, which moved 60% of a hospital chain's bookings to mobile in 3 months. Tell me about your app idea!";
  if (/(website|web|ecommerce|store|shop)/.test(q))
    return "Websites are where we flex hardest 💪 — blazing-fast, SEO-perfect, cyberpunk-beautiful and engineered to convert. Starter sites from ₹20,000, delivered in 7 days. What's your business?";
  if (/(time|long|deliver|deadline|fast)/.test(q))
    return "Starter websites ship in 7 days, business platforms in 2–4 weeks, full products in 8–12 weeks. We demo progress every single week so you're never in the dark. ⏱️";
  if (/(hi|hello|hey|namaste)/.test(q))
    return "Hey there! 👋 I'm AS01, the AI assistant for Project AS01. I can show you our portfolio, explain pricing, or get our AI agent to call you. What are you building?";
  return "Great question! I can help with pricing, portfolio, AI automation, apps and websites — or connect you straight to the team. Want a free consultation call? Our AI agent responds in under 60 seconds. ⚡";
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "bot",
      text: "👋 Welcome to Project AS01! I'm your AI assistant. Ask me about pricing, projects, or AI automation — or I can have our AI agent call you in 60 seconds.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { openModal } = useLeadModal();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing, open]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { role: "bot", text: brain(text) }]);
    }, 900 + Math.random() * 600);
  };

  return (
    <>
      {/* launcher */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open AI assistant"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        className="btn-neon fixed bottom-5 right-5 z-[70] flex h-14 w-14 items-center justify-center rounded-full text-2xl text-white md:bottom-7 md:right-7"
      >
        {open ? "✕" : "🤖"}
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-green-400" />
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.92 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="glass-strong fixed bottom-24 right-5 z-[70] flex h-[480px] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.7)] md:right-7"
          >
            <div className="flex items-center gap-3 border-b border-white/10 bg-gradient-to-r from-purple-900/40 to-blue-900/40 px-5 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-500 text-lg shadow-[0_0_18px_rgba(147,51,234,0.6)]">
                🤖
              </div>
              <div>
                <p className="font-display text-sm font-bold text-white">AS01 Assistant</p>
                <p className="flex items-center gap-1.5 text-[11px] text-green-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80]" />
                  Online · replies instantly
                </p>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {msgs.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                        : "glass text-slate-200"
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="glass flex gap-1.5 rounded-2xl px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                        className="h-1.5 w-1.5 rounded-full bg-purple-400"
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-white/10 p-3">
              <div className="mb-2.5 flex flex-wrap gap-1.5">
                {quickReplies.map((r) => (
                  <button
                    key={r}
                    onClick={() => send(r.replace(/^\S+\s/, ""))}
                    className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-[11px] text-purple-200 transition hover:bg-purple-500/25"
                  >
                    {r}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setOpen(false);
                    openModal("AI Chat — Request Call");
                  }}
                  className="rounded-full border border-green-500/40 bg-green-500/10 px-3 py-1.5 text-[11px] text-green-300 transition hover:bg-green-500/25"
                >
                  📞 Get AI call now
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything…"
                  className="flex-1 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-purple-500/60"
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  className="btn-neon flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white"
                >
                  ➤
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
