"use client";

import { motion } from "framer-motion";
import { pricing } from "@/lib/data";
import { useLeadModal } from "./LeadModalContext";

export default function Pricing() {
  const { openModal } = useLeadModal();

  return (
    <section id="pricing" className="relative scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="font-display text-xs uppercase tracking-[0.35em] text-[#a259ff]">Pricing</p>
          <h2 className="headline mt-3 text-[12vw] leading-[0.85] text-white sm:text-6xl lg:text-7xl">
            Premium <span className="gradient-text">Results</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Every plan includes futuristic design, blazing performance and AI-powered lead capture.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-7 md:grid-cols-3">
          {pricing.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.14 }}
              className={`relative rounded-3xl p-8 ${
                plan.featured
                  ? "neon-border z-10 shadow-[0_0_60px_rgba(147,51,234,0.3)] md:-my-4 md:py-12"
                  : "glass glow-card"
              }`}
            >
              {plan.featured && (
                <span className="btn-neon font-display absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white">
                  ⚡ Most Popular
                </span>
              )}
              <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white">{plan.name}</h3>
              <p className="mt-1 text-xs text-slate-500">{plan.tag}</p>
              <p className="font-display gradient-text mt-5 text-4xl font-extrabold">{plan.price}</p>
              <ul className="mt-7 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="mt-0.5 text-purple-400">✦</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => openModal(`${plan.name} Plan — ${plan.cta}`)}
                className={`font-display mt-8 w-full rounded-xl px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white ${
                  plan.featured ? "btn-neon" : "btn-ghost"
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
