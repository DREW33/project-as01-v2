"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { testimonials } from "@/lib/data";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  useEffect(() => {
    const t = setInterval(() => {
      setDir(1);
      setIndex((i) => (i + 1) % testimonials.length);
    }, 5200);
    return () => clearInterval(t);
  }, []);

  const go = (i: number) => {
    setDir(i > index ? 1 : -1);
    setIndex((i + testimonials.length) % testimonials.length);
  };

  const t = testimonials[index];

  return (
    <section className="relative py-24">
      <div className="pointer-events-none absolute left-0 top-1/4 h-[380px] w-[380px] rounded-full bg-blue-700/15 blur-[140px]" />
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="font-display text-xs uppercase tracking-[0.35em] text-[#a259ff]">Testimonials</p>
          <h2 className="headline mt-3 text-[12vw] leading-[0.85] text-white sm:text-6xl lg:text-7xl">
            Clients Who <span className="gradient-text">Leveled Up</span>
          </h2>
        </motion.div>

        <div className="relative mt-14 [perspective:1200px]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.figure
              key={index}
              custom={dir}
              initial={{ opacity: 0, rotateY: dir * 35, x: dir * 80 }}
              animate={{ opacity: 1, rotateY: 0, x: 0 }}
              exit={{ opacity: 0, rotateY: -dir * 35, x: -dir * 80 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="glass-strong rounded-3xl p-8 text-center shadow-[0_0_60px_rgba(88,28,135,0.25)] md:p-12"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-500 font-display text-lg font-bold text-white shadow-[0_0_30px_rgba(147,51,234,0.5)]">
                {t.avatar}
              </div>
              <div className="mt-4 text-lg tracking-widest text-yellow-400">
                {"★".repeat(t.rating)}
              </div>
              <blockquote className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-200 md:text-lg">
                “{t.review}”
              </blockquote>
              <figcaption className="mt-6">
                <p className="font-display font-bold text-white">{t.name}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {t.role} · <span className="gradient-text font-semibold">{t.company}</span>
                </p>
              </figcaption>
            </motion.figure>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => go(index - 1)}
              aria-label="Previous testimonial"
              className="btn-ghost flex h-11 w-11 items-center justify-center rounded-full text-white"
            >
              ←
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === index
                      ? "w-8 bg-gradient-to-r from-purple-500 to-blue-500 shadow-[0_0_10px_rgba(147,51,234,0.8)]"
                      : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => go(index + 1)}
              aria-label="Next testimonial"
              className="btn-ghost flex h-11 w-11 items-center justify-center rounded-full text-white"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
