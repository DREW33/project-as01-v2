"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useLeadModal } from "./LeadModalContext";
import { LogoMark } from "./Logo";

/* Counts numeric stats up from 0 when scrolled into view */
function CountUp({ value }: { value: string }) {
  const m = value.match(/^([^0-9]*)([\d.]+)(.*)$/);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView || !m) return;
    const target = parseFloat(m[2]);
    const decimals = m[2].includes(".") ? 1 : 0;
    const start = performance.now();
    const dur = 1500;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay((target * eased).toFixed(decimals));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  if (!m) return <span>{value}</span>;
  return (
    <span ref={ref}>
      {m[1]}
      {display}
      {m[3]}
    </span>
  );
}

const codeLines = [
  "const client = await as01.consult({ free: true });",
  "const design = await as01.design(client.vision);",
  "const product = await as01.build(design, { ai: true });",
  "await as01.launch(product); // 🚀",
  "client.revenue *= 3.2;",
];

function TypingCode() {
  const [line, setLine] = useState(0);
  const [chars, setChars] = useState(0);

  useEffect(() => {
    const current = codeLines[line];
    if (chars < current.length) {
      const t = setTimeout(() => setChars((c) => c + 1), 34);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      if (line < codeLines.length - 1) {
        setLine((l) => l + 1);
        setChars(0);
      } else {
        setLine(0);
        setChars(0);
      }
    }, 1400);
    return () => clearTimeout(t);
  }, [chars, line]);

  return (
    <div className="scanlines glass relative overflow-hidden rounded-2xl font-mono text-xs sm:text-sm">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-500/80" />
        <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
        <span className="h-3 w-3 rounded-full bg-green-500/80" />
        <span className="ml-2 text-[11px] text-slate-500">as01-engine.ts</span>
      </div>
      <div className="space-y-2 px-4 py-4 text-left">
        {codeLines.slice(0, line).map((l, i) => (
          <p key={i} className="text-slate-500">
            <span className="mr-3 select-none text-slate-700">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-purple-300/70">{l}</span>
          </p>
        ))}
        <p>
          <span className="mr-3 select-none text-slate-700">{String(line + 1).padStart(2, "0")}</span>
          <span className="text-cyan-300">{codeLines[line].slice(0, chars)}</span>
          <span className="animate-blink text-purple-400">▍</span>
        </p>
      </div>
    </div>
  );
}

export default function Hero() {
  const { openModal } = useLeadModal();

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-16">
      {/* ambient gradient blobs */}
      <div className="pointer-events-none absolute -left-40 top-20 h-[480px] w-[480px] rounded-full bg-purple-700/25 blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[480px] w-[480px] rounded-full bg-blue-600/25 blur-[140px]" />

      {/* floating neon elements */}
      <div className="animate-float pointer-events-none absolute left-[8%] top-[22%] hidden select-none font-mono text-3xl text-purple-500/50 drop-shadow-[0_0_14px_rgba(168,85,247,0.8)] md:block">
        {"</>"}
      </div>
      <div className="animate-float-slow pointer-events-none absolute right-[10%] top-[30%] hidden select-none font-mono text-2xl text-blue-400/50 drop-shadow-[0_0_14px_rgba(59,130,246,0.8)] md:block">
        {"{ }"}
      </div>
      <div className="animate-float pointer-events-none absolute bottom-[18%] left-[14%] hidden select-none font-mono text-xl text-cyan-400/40 drop-shadow-[0_0_12px_rgba(56,189,248,0.8)] lg:block">
        {"=>"}
      </div>
      <motion.div
        animate={{ y: [0, -14, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute right-[14%] bottom-[22%] hidden lg:block"
      >
        <LogoMark px={96} />
      </motion.div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-2">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium tracking-wide text-slate-300"
          >
            <span className="animate-pulse-glow h-2 w-2 rounded-full bg-green-400 shadow-[0_0_10px_#4ade80]" />
            coffee &gt; code &gt; repeat — accepting new projects
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-display mt-6 text-4xl font-extrabold leading-[1.12] text-white sm:text-5xl lg:text-[3.4rem]"
          >
            We Build <span className="gradient-text">Websites, Apps &amp; AI Solutions</span> That Grow Businesses
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg"
          >
            Custom Websites, Mobile Apps, AI Automation, Prediction Platforms, Gaming
            Systems &amp; Enterprise Software — engineered to convert visitors into
            paying clients automatically. Proudly built in{" "}
            <span className="font-semibold text-slate-200">Assam</span>, serving the world.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <a
              href="#projects"
              className="btn-neon font-display w-full rounded-full px-8 py-4 text-center text-sm font-bold uppercase tracking-wider text-white sm:w-auto"
            >
              View Projects
            </a>
            <button
              onClick={() => openModal("Get Free Consultation")}
              className="btn-ghost font-display w-full rounded-full px-8 py-4 text-center text-sm font-bold uppercase tracking-wider text-white sm:w-auto"
            >
              Get Free Consultation
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-12 flex flex-wrap gap-8"
          >
            {[
              ["50+", "Projects shipped"],
              ["3.2x", "Avg. conversion lift"],
              ["<60s", "AI lead response"],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="font-display gradient-text text-2xl font-bold">
                  <CountUp value={v} />
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">{l}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="relative"
        >
          <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-purple-600/25 to-blue-600/25 blur-2xl" />
          <div className="relative">
            <TypingCode />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="glass absolute -right-4 -top-6 rounded-xl px-4 py-2.5 text-xs font-semibold text-purple-200 shadow-[0_0_24px_rgba(168,85,247,0.35)]"
            >
              ⚡ AI agent online
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="glass absolute -bottom-6 -left-4 rounded-xl px-4 py-2.5 text-xs font-semibold text-blue-200 shadow-[0_0_24px_rgba(59,130,246,0.35)]"
            >
              🚀 Lighthouse 100/100
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* scroll hint */}
      <motion.a
        href="#projects"
        aria-label="Scroll to projects"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 text-slate-500 md:block"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/20 p-1.5">
          <div className="h-2 w-1 rounded-full bg-purple-400" />
        </div>
      </motion.a>
    </section>
  );
}
