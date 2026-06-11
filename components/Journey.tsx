"use client";

import { motion } from "framer-motion";
import { journey } from "@/lib/data";

export default function Journey() {
  return (
    <section id="journey" className="relative scroll-mt-24 py-24">
      <div className="pointer-events-none absolute right-0 top-1/3 h-[380px] w-[380px] rounded-full bg-purple-700/15 blur-[140px]" />
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="font-display text-xs uppercase tracking-[0.35em] text-blue-400">The Process</p>
          <h2 className="font-display mt-3 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            From <span className="gradient-text">Idea</span> to{" "}
            <span className="gradient-text">Growth</span>
          </h2>
        </motion.div>

        <div className="relative mt-16">
          {/* glowing spine */}
          <div className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-purple-500 via-blue-500 to-cyan-400 shadow-[0_0_12px_rgba(147,51,234,0.8)] md:left-1/2" />

          <div className="space-y-12">
            {journey.map((j, i) => {
              const left = i % 2 === 0;
              return (
                <motion.div
                  key={j.step}
                  initial={{ opacity: 0, x: left ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className={`relative flex items-start gap-6 pl-16 md:w-1/2 md:pl-0 ${
                    left
                      ? "md:mr-auto md:flex-row-reverse md:pr-14 md:text-right"
                      : "md:ml-auto md:pl-14"
                  }`}
                >
                  <div
                    className={`absolute left-0 flex h-12 w-12 items-center justify-center rounded-full border border-purple-500/50 bg-[#0a0420] text-xl shadow-[0_0_20px_rgba(147,51,234,0.5)] ${
                      left ? "md:left-auto md:-right-6" : "md:-left-6"
                    }`}
                  >
                    {j.icon}
                  </div>
                  <div className="glass glow-card flex-1 rounded-2xl p-5">
                    <p className="font-display text-[10px] uppercase tracking-[0.3em] text-purple-400">
                      Step {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="font-display mt-1 text-lg font-bold text-white">{j.step}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{j.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
