"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLeadModal } from "./LeadModalContext";

type Msg = { role: "bot" | "user"; text: string };
type ChatCtx = { awaiting: "phone" | null; askedPhoneOnce: boolean; fallbacks: number };

const quickReplies = ["💰 Pricing", "🗂️ Portfolio", "📅 Book a call", "🤖 AI automation"];

const phoneRe = /(\+?\s?91[\s-]?)?([6-9]\d{4}[\s-]?\d{5})/;

/*
 * Rule-based assistant brain with conversation context.
 * To make it fully agentic, point this at an /api/chat route backed by the
 * Claude API — the ctx object maps cleanly onto a system prompt + history.
 */
function brain(input: string, ctx: ChatCtx): { text: string; saveLead?: { phone: string } } {
  const q = input.toLowerCase().trim();
  const phoneMatch = input.replace(/\s/g, "").match(phoneRe) || input.match(phoneRe);

  // 1. If a phone number appears anywhere, capture the lead immediately
  if (phoneMatch) {
    ctx.awaiting = null;
    return {
      text: `Perfect! 📞 I've passed ${phoneMatch[0].trim()} to our team — they'll reach out to you shortly to understand your project. Talk soon!`,
      saveLead: { phone: phoneMatch[0].trim() },
    };
  }

  // 2. If we asked for a phone number and didn't get one
  if (ctx.awaiting === "phone") {
    ctx.awaiting = null;
    return {
      text: "No problem — whenever you're ready, just type your 10-digit number here and our team will reach out. Meanwhile, ask me anything about pricing, projects or timelines! 😊",
    };
  }

  const ask = (text: string) => {
    ctx.awaiting = "phone";
    return { text };
  };

  // 3. Intent matching, most specific first
  if (/(book|schedule|call me|callback|call back|talk|consult|meeting|demo call|connect)/.test(q))
    return ask(
      "Let's do it! 🚀 Type your 10-digit mobile number and our team will reach out to discuss your project and book a free consultation."
    );

  if (/(price|pricing|cost|charge|budget|rate|kitna|how much|₹|quote|package)/.test(q))
    return {
      text: "Here's our transparent pricing 💰\n\n• Starter — ₹20,000+: 5-page premium website, 7-day delivery\n• Business — ₹50,000+: custom web app, admin dashboard, AI chatbot (most popular)\n• Premium — custom quote: mobile apps, AI automation, enterprise systems\n\nEvery plan includes futuristic design + smart lead capture. Want an exact quote? Tell me what you're building, or drop your number for a callback!",
    };

  if (/(portfolio|project|work|example|demo|made|built|show me)/.test(q))
    return {
      text: "We've shipped 50+ products — scroll up to our Projects section and click any card for a LIVE interactive demo 🔥 Highlights:\n\n• ShopKart — e-commerce, 46% add-to-cart rate\n• ZoomRide — Rapido-style bike taxi app\n• Stratos ERP & PulseCRM — enterprise dashboards\n• BigWin Arena — gaming platform for 2.8L concurrent players\n\nWhich type of project are you planning?",
    };

  if (/(restaurant|cafe|hotel|food|dining)/.test(q))
    return {
      text: "We build delicious restaurant websites 🍽️ — menus, table reservations, WhatsApp confirmations. Check the Spice Route demo in our portfolio (online reservations now fill 65% of their seats). Want one for your restaurant? Starting ₹20,000, live in 7 days.",
    };

  if (/(real estate|property|realty|flat|apartment|villa)/.test(q))
    return {
      text: "Real estate is our sweet spot 🏠 — see the LuxeNest demo in our portfolio: property search, verified listings and site-visit booking (4x more qualified visits). Tell me about your agency and I'll suggest the right package!",
    };

  if (/(wedding|makeup|bridal|salon|event|planner)/.test(q))
    return {
      text: "Beautiful! 💍 We've built GlamBride (bridal makeup booking — 2x bookings) and Evermore Events (luxury wedding planner — 3x bigger inquiries). Both live demos are in our Projects section. Your business could look this premium too — want details?",
    };

  if (/(gaming|game|bet|prediction|casino|tournament|ludo|rummy)/.test(q))
    return {
      text: "We engineer gaming platforms that survive finals night 🎮 — BigWin Arena (in our portfolio) handles 2.8 lakh concurrent players with <100ms round latency: wallets, instant payouts, provably-fair RNG, anti-fraud. What kind of gaming product are you planning?",
    };

  if (/(taxi|bike|rapido|ola|uber|ride|delivery app|logistics)/.test(q))
    return {
      text: "Like ZoomRide in our portfolio? 🏍️ Rider app + captain app + ops dashboard with live geo-matching (<3s captain match) and upfront fares. On-demand apps are 8–12 week builds. Tell me your city and idea — I'll get the team to map it out!",
    };

  if (/(erp|crm|inventory|billing|accounting|gst|payroll|software|dashboard|saas)/.test(q))
    return {
      text: "Enterprise is where we flex 🏭 Check Stratos ERP and PulseCRM in our portfolio — real dashboards you can click through. We've cut a client's month-end closing from 6 days to 9 hours. What process is slowing your business down?",
    };

  if (/(ai|automation|chatbot|agent|voice|calling|whatsapp bot)/.test(q))
    return {
      text: "AI is our home turf 🤖 We build:\n\n• AI chatbots (like me!)\n• CRM + WhatsApp automation\n• Smart lead-capture systems\n• Full business automation with Claude & OpenAI\n\nWe help businesses automate the repetitive work. What would you like to automate?",
    };

  if (/(app|android|ios|mobile|play store|application)/.test(q))
    return {
      text: "We ship native-quality Android + iOS apps from one codebase 📱 MediBook moved 60% of a hospital chain's bookings to mobile in 3 months; ZoomRide did 10 lakh rides in year one. App builds run 8–12 weeks with weekly demos. What's your app idea?",
    };

  if (/(website|web|site|ecommerce|e-commerce|store|shop|landing)/.test(q))
    return {
      text: "Websites are where we flex hardest 💪 — blazing-fast, SEO-perfect, cyberpunk-beautiful and engineered to convert. Starter sites from ₹20,000, live in 7 days, e-commerce from ₹50,000. What's your business about?",
    };

  if (/(time|long|deliver|deadline|fast|duration|kab|when)/.test(q))
    return {
      text: "Speed is a feature here ⏱️\n\n• Starter websites — 7 days\n• Business platforms — 2–4 weeks\n• Apps & AI systems — 8–12 weeks\n\nYou get a live demo of progress every single week, so you're never in the dark.",
    };

  if (/(where|location|address|assam|guwahati|office|based)/.test(q))
    return {
      text: "We're based in Guwahati, Assam 🌏 — and we work with clients worldwide, fully remote-friendly. Local clients can meet us in person; everyone else gets weekly video demos. Where are you located?",
    };

  if (/(pay|payment|advance|upi|emi|refund|installment)/.test(q))
    return {
      text: "Simple & safe 💳 — typically 40% advance to start, 30% at design approval, 30% at launch. UPI, bank transfer or card. Milestone-based, so you only pay as you see progress. Need a custom split? We're flexible.",
    };

  if (/(support|maintain|maintenance|update|seo|rank|google)/.test(q))
    return {
      text: "Every project includes free support (1–3 months by plan) 🛠️ After that, maintenance plans start ₹2,000/month — updates, backups, security and SEO monitoring. Speaking of SEO: 100/100 Lighthouse scores are standard on our builds.",
    };

  if (/(hire|job|career|intern|vacancy|join)/.test(q))
    return {
      text: "Love the energy! We're a lean team but always happy to meet talented devs and designers from Assam. Send your portfolio through the contact form and we'll keep you on the radar 🤝",
    };

  if (/(thank|thanks|great|awesome|nice|cool|ok|okay)/.test(q))
    return {
      text: "Anytime! 😊 If you want to take the next step, just type your number and our team will reach out. Or keep exploring the live demos in our Projects section!",
    };

  if (/(bye|goodbye|see you|later)/.test(q))
    return {
      text: "See you soon! 👋 Project AS01 is always one click away. Coffee > Code > Repeat ☕",
    };

  if (/(who are you|what are you|human|robot|real person|your name)/.test(q))
    return {
      text: "I'm AS01 🤖 — the AI assistant for Project AS01, built by the same team that can build one for YOUR business. I answer instantly, never sleep, and capture leads while the humans drink coffee. Want one like me on your website?",
    };

  if (/(hi|hello|hey|namaste|namaskar|yo)/.test(q))
    return {
      text: "Hey there! 👋 I'm AS01, your AI assistant. I can show you our portfolio, explain pricing, or connect you with our team for a free consultation. What are you building?",
    };

  // 4. Rotating fallbacks that qualify the lead
  const fallbacks = [
    "Interesting! Tell me a bit more — is this about a website, mobile app, AI automation, or custom software? I'll point you to the right examples and pricing 🎯",
    "I want to get this right for you 🤔 Could you share what kind of business you run and what you're trying to build? Or type your number and our team will call to discuss it properly.",
    "Good question — that's one for our human experts! Type your 10-digit number and our team will reach out, or use the Get Free Consultation button. Meanwhile: pricing, portfolio and timelines — I know those cold 😎",
  ];
  const text = fallbacks[ctx.fallbacks % fallbacks.length];
  ctx.fallbacks += 1;
  return { text };
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "bot",
      text: "👋 Welcome to Project AS01! I'm your AI assistant. Ask me about pricing, projects, or AI automation — or type your phone number anytime and our team will reach out to you.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<ChatCtx>({ awaiting: null, askedPhoneOnce: false, fallbacks: 0 });
  const { openModal } = useLeadModal();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing, open]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    const history = [...msgs, { role: "user" as const, text }];
    setMsgs(history);
    setInput("");
    setTyping(true);

    // Phone numbers are captured instantly and deterministically — no AI needed
    const phoneMatch = text.replace(/\s/g, "").match(phoneRe) || text.match(phoneRe);
    if (phoneMatch) {
      fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Chat visitor",
          phone: phoneMatch[0].trim(),
          message: text,
          intent: "Chat — requested callback",
          source: "chat-widget",
        }),
      }).catch(() => {});
      setTimeout(() => {
        setTyping(false);
        setMsgs((m) => [
          ...m,
          {
            role: "bot",
            text: `Perfect! 📞 I've passed ${phoneMatch[0].trim()} to our team — they'll reach out to you shortly to understand your project. Talk soon!`,
          },
        ]);
      }, 700);
      return;
    }

    // Real AI via /api/chat (OpenRouter); rule-based brain as silent fallback
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.text })),
        }),
      });
      const d = await r.json();
      if (d?.text) {
        setTyping(false);
        setMsgs((m) => [...m, { role: "bot", text: d.text }]);
        return;
      }
    } catch {
      /* fall through to rule brain */
    }

    const { text: reply } = brain(text, ctxRef.current);
    setTyping(false);
    setMsgs((m) => [...m, { role: "bot", text: reply }]);
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
        className="btn-neon fixed overflow-visible bottom-5 right-5 z-[70] flex h-14 w-14 items-center justify-center rounded-full text-2xl text-white md:bottom-7 md:right-7"
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
            className="glass-strong fixed bottom-24 right-4 z-[70] flex h-[min(480px,calc(100dvh-8rem))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.7)] md:right-7"
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
              <button
                onClick={() => {
                  setOpen(false);
                  window.dispatchEvent(new CustomEvent("as01:voice"));
                }}
                aria-label="Talk to the AI by voice"
                title="Talk to the AI by voice"
                className="ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-purple-500/40 bg-purple-500/10 text-lg transition hover:scale-110 hover:bg-purple-500/25"
              >
                🎤
              </button>
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
                    className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
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
                    openModal("AI Chat — Request Callback");
                  }}
                  className="rounded-full border border-green-500/40 bg-green-500/10 px-3 py-1.5 text-[11px] text-green-300 transition hover:bg-green-500/25"
                >
                  📞 Request a callback
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
