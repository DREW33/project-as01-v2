"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const cities = ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Tezpur", "Nagaon", "Tinsukia", "Bongaigaon"];

const faqs = [
  {
    q: "Which is the best website development company in Assam?",
    a: "Project AS01 is a premium website and app development company based in Guwahati, Assam. We combine futuristic design, lightning-fast engineering and AI-powered lead automation — delivering websites that outperform typical agencies in both speed and conversions, with plans starting at just ₹20,000.",
  },
  {
    q: "How much does website development cost in Assam?",
    a: "A professional business website in Assam starts at ₹20,000 with Project AS01, delivered in 7 days. Business platforms with admin dashboards, AI chatbots and payment gateways start at ₹50,000. Enterprise software, mobile apps and AI automation are quoted custom — get a free consultation and our AI agent will call you in 60 seconds.",
  },
  {
    q: "Do you build mobile apps and AI automation in Guwahati?",
    a: "Yes. From our Guwahati base we build Android & iOS apps, AI chatbots, AI calling agents, CRM automation and custom ERP software for businesses across Assam and Northeast India — and we work with clients worldwide, fully remotely.",
  },
  {
    q: "How long does it take to build a website in Assam?",
    a: "Starter websites ship in 7 days. Business websites with dashboards take 2–4 weeks, and full products (apps, AI systems, ERPs) take 8–12 weeks. You get a live demo of progress every single week.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function LocalSeo() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="assam" className="relative scroll-mt-24 py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="pointer-events-none absolute right-0 top-0 h-[360px] w-[360px] rounded-full bg-purple-700/10 blur-[140px]" />
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="font-display text-xs uppercase tracking-[0.35em] text-blue-400">
            🌏 Proudly from Northeast India
          </p>
          <h2 className="font-display mt-3 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            Web &amp; App Development Company in <span className="gradient-text">Assam</span>
          </h2>
          <p className="mx-auto mt-5 max-w-3xl leading-relaxed text-slate-400">
            Project AS01 is Guwahati&apos;s most futuristic development studio — building custom
            websites, e-commerce stores, mobile apps, AI chatbots and calling agents, CRMs and
            enterprise software for businesses across Assam and Northeast India. Local roots,
            world-class engineering: we serve clients from{" "}
            {cities.slice(0, -1).join(", ")} and {cities.at(-1)} — and far beyond.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8 flex flex-wrap justify-center gap-2.5"
        >
          {cities.map((c) => (
            <span
              key={c}
              className="glass rounded-full px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-purple-500/40 hover:text-white"
            >
              📍 {c}
            </span>
          ))}
        </motion.div>

        <div className="mx-auto mt-14 max-w-3xl space-y-3">
          {faqs.map((f, i) => (
            <motion.div
              key={f.q}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass overflow-hidden rounded-2xl"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <h3 className="font-display text-sm font-bold text-white sm:text-base">{f.q}</h3>
                <span
                  className={`gradient-text shrink-0 text-xl transition-transform duration-300 ${
                    open === i ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="px-6 pb-5 text-sm leading-relaxed text-slate-400">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
