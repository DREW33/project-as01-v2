"use client";

import { motion } from "framer-motion";
import { services } from "@/lib/data";
import { useLeadModal } from "./LeadModalContext";

export default function Services() {
  const { openModal } = useLeadModal();

  return (
    <section id="services" className="relative scroll-mt-24 py-24">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-blue-700/10 blur-[160px]" />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="font-display text-xs uppercase tracking-[0.35em] text-blue-400">Services</p>
          <h2 className="font-display mt-3 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            Everything Your Business Needs to <span className="gradient-text">Dominate Online</span>
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-7 sm:grid-cols-2 md:grid-cols-3">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: (i % 3) * 0.12 }}
              className="glass glow-card group relative overflow-hidden rounded-2xl p-7"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-purple-600/15 blur-2xl transition-all duration-500 group-hover:bg-blue-500/25" />
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600/30 to-blue-600/30 text-3xl shadow-[0_0_24px_rgba(147,51,234,0.25)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                {s.icon}
              </div>
              <h3 className="font-display mt-5 text-xl font-bold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.desc}</p>
              <ul className="mt-4 space-y-2">
                {s.items.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => openModal(`Quote: ${s.title}`)}
                className="mt-6 text-xs font-bold uppercase tracking-wider text-purple-400 transition group-hover:text-blue-300"
              >
                Get a quote →
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
