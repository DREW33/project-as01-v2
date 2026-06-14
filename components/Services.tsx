"use client";

import { motion } from "framer-motion";
import { services } from "@/lib/data";
import { useLeadModal } from "./LeadModalContext";

export default function Services() {
  const { openModal } = useLeadModal();

  return (
    <section
      id="services"
      className="relative scroll-mt-24 overflow-hidden py-24 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-12">
        {/* section eyebrow */}
        <div className="flex items-center justify-between">
          <span className="mono-label">/ 01 — Capabilities</span>
          <span className="mono-label hidden md:block">What we build</span>
        </div>

        {/* big headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="headline mt-6 text-[14vw] leading-[0.85] text-white sm:text-[11vw] lg:text-[9rem]"
        >
          <span className="text-outline">Full-stack</span>{" "}
          <span className="gradient-text">studio</span>
        </motion.h2>
        <p className="mt-6 max-w-xl text-sm font-medium uppercase tracking-wide text-slate-400">
          Everything your business needs to dominate online — designed, built and
          automated end to end.
        </p>

        {/* editorial numbered rows */}
        <div className="mt-16 border-t border-white/10">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group grid grid-cols-1 items-start gap-4 border-b border-white/10 py-8 md:grid-cols-12 md:gap-8"
            >
              <div className="num-index col-span-2 flex items-start gap-3 text-3xl text-white md:text-5xl">
                <span className="gradient-text">{String(i + 1).padStart(2, "0")}</span>
              </div>

              <div className="col-span-4 flex items-center gap-3">
                <span className="text-3xl">{s.icon}</span>
                <h3 className="font-display text-2xl font-extrabold text-white md:text-3xl">
                  {s.title}
                </h3>
              </div>

              <div className="col-span-4">
                <p className="text-sm leading-relaxed text-slate-400">{s.desc}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {s.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-medium text-slate-300"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-2 flex md:justify-end">
                <button
                  onClick={() => openModal(`Quote: ${s.title}`)}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-white transition-transform group-hover:translate-x-1"
                >
                  Quote
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-base text-[#07080b] transition group-hover:bg-[var(--rgb-6)] group-hover:text-white">
                    →
                  </span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
