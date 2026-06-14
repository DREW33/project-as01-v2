"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useLeadModal } from "./LeadModalContext";

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

const CAPABILITIES = ["WEB DESIGN", "MOBILE APPS", "AI AUTOMATION", "E-COMMERCE", "& MUCH MORE"];
const STATS: [string, string][] = [
  ["50+", "Projects shipped"],
  ["3.2x", "Avg. conversion lift"],
  ["7 days", "Fastest delivery"],
];

export default function Hero() {
  const { openModal } = useLeadModal();
  const openWork = () => window.dispatchEvent(new Event("as01:work"));
  const openContact = () => openModal("Get Free Consultation");

  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-5 pt-28 pb-12 md:px-12"
    >
      {/* ============ DESKTOP: side text, center open for the 3D robot ============ */}
      <div className="relative z-30 mx-auto hidden w-full max-w-7xl flex-1 flex-col justify-center md:flex">
        {/* prompt "speech bubble" near the robot (like the video's chat box) */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="frame glass absolute left-0 top-[20%] max-w-[260px] px-4 py-3"
        >
          <span className="font-display text-2xl leading-none text-white/30">&ldquo;</span>
          <p className="mono-label mt-1 leading-relaxed">
            Build me a website that turns visitors into paying clients.
          </p>
        </motion.div>

        {/* right capability rail */}
        <motion.ul
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute right-0 top-[22%] flex flex-col items-end gap-3"
        >
          {CAPABILITIES.map((c, i) => (
            <li key={c} className="flex items-center gap-3">
              <span className="mono-label">{c}</span>
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  i === 0 ? "bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]" : "bg-white/25"
                }`}
              />
            </li>
          ))}
        </motion.ul>

        {/* headline — bottom-left, boxed words like "Blockchain / AI" */}
        <div className="mt-auto max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mono-label"
          >
            We engineer the power of
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="headline mt-4 text-[clamp(2.8rem,7vw,6rem)] text-white"
          >
            <span className="block">
              <span className="word-box gradient-text">Bold Digital</span>
            </span>
            <span className="mt-3 block">
              <span className="word-box">Products</span>
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-7 flex flex-wrap items-center gap-3"
          >
            <button
              onClick={openWork}
              className="btn-neon font-display px-7 py-3.5 text-sm font-bold uppercase tracking-[0.12em]"
            >
              View Work
            </button>
            <button
              onClick={openContact}
              className="btn-ghost font-display px-7 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-white"
            >
              Contact Us
            </button>
            <span className="mono-label ml-2 max-w-[220px]">
              Websites, apps &amp; AI built in Assam, serving the world.
            </span>
          </motion.div>
        </div>
      </div>

      {/* desktop bottom hairline: stats + corner labels */}
      <div className="relative z-30 mx-auto hidden w-full max-w-7xl items-end justify-between gap-8 border-t border-white/10 pt-6 md:flex">
        <span className="mono-label">AS01 &times; AWWWARDS</span>
        <div className="flex gap-10">
          {STATS.map(([v, l]) => (
            <div key={l} className="text-right">
              <p className="num-index gradient-text text-2xl sm:text-3xl">
                <CountUp value={v} />
              </p>
              <p className="mono-label mt-1">{l}</p>
            </div>
          ))}
        </div>
        <span className="mono-label">EST. 2024</span>
      </div>

      {/* ============ MOBILE: full hero (no robot, tap-friendly) ============ */}
      <div className="relative z-30 md:hidden">
        <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
          <span className="animate-pulse-glow h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]" />
          <span className="mono-label">Web · Apps · AI — accepting new projects</span>
        </div>

        <h1 className="headline mt-8 text-[15vw] leading-[0.86] text-white">
          <span className="block">We Build</span>
          <span className="gradient-text block">Bold Digital</span>
          <span className="text-outline block">Products</span>
        </h1>
        <p className="mt-5 text-sm font-medium uppercase leading-relaxed tracking-wide text-slate-400">
          Websites, mobile apps &amp; AI automation that convert visitors into paying
          clients — built in <span className="text-slate-200">Assam</span>, serving the world.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={openWork} className="btn-neon font-display px-7 py-3.5 text-sm font-bold uppercase tracking-[0.12em]">
            View Work
          </button>
          <button onClick={openContact} className="btn-ghost font-display px-7 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-white">
            Contact Us
          </button>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
          {STATS.map(([v, l]) => (
            <div key={l} className="text-center">
              <p className="num-index gradient-text text-3xl">
                <CountUp value={v} />
              </p>
              <p className="mono-label mt-2">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
