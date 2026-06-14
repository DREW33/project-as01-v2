"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { projects, type Project } from "@/lib/data";
import { useLeadModal } from "./LeadModalContext";

/* Scaled-down live preview of a real demo site */
function Thumb({ p }: { p: Project }) {
  return (
    <div className={`relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-gradient-to-br ${p.accent}`}>
      <iframe
        src={p.demoUrl}
        title={`${p.title} preview`}
        loading="lazy"
        tabIndex={-1}
        aria-hidden
        scrolling="no"
        className="pointer-events-none absolute left-0 top-0 origin-top-left border-0 bg-white"
        style={{ width: "400%", height: "400%", transform: "scale(0.25)" }}
      />
      <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-green-300 backdrop-blur">
        ● Live
      </span>
    </div>
  );
}

/* Full-screen "Our Work" popup — opened from the laptop screen via the
   `as01:work` window event. Shows every project; click one to open its
   live demo inside a large frame. */
export default function WorkShowcase() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Project | null>(null);
  const { openModal } = useLeadModal();

  useEffect(() => {
    const onOpen = () => {
      setActive(null);
      setOpen(true);
    };
    window.addEventListener("as01:work", onOpen);
    return () => window.removeEventListener("as01:work", onOpen);
  }, []);

  const close = () => setOpen(false);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] flex flex-col bg-black/85 backdrop-blur-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="glass-strong relative mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-none sm:my-6 sm:h-[calc(100%-3rem)] sm:rounded-3xl"
            initial={{ scale: 0.94, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 240 }}
          >
            {/* header */}
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 p-5 sm:p-6">
              <div>
                <p className="font-display text-xs uppercase tracking-[0.3em] text-[#a259ff]">
                  {active ? active.category : "Portfolio"}
                </p>
                <h2 className="headline mt-1 text-2xl text-white sm:text-3xl">
                  {active ? active.title : "Our Work"}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {active && (
                  <button
                    onClick={() => setActive(null)}
                    className="btn-ghost rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider text-white"
                  >
                    ← All
                  </button>
                )}
                <button
                  onClick={close}
                  aria-label="Close"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-400 transition hover:rotate-90 hover:border-[#a259ff]/60 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* body */}
            <div data-lenis-prevent className="grow overflow-y-auto p-5 sm:p-6">
              <AnimatePresence mode="wait">
                {!active ? (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {projects.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setActive(p)}
                        className="glass glow-card group overflow-hidden rounded-2xl text-left"
                      >
                        <div className="p-3 pb-0">
                          <Thumb p={p} />
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-display text-base font-bold text-white">{p.title}</h3>
                            <span className="shrink-0 rounded-full border border-[#a259ff]/30 bg-[#a259ff]/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#c084fc]">
                              {p.category}
                            </span>
                          </div>
                          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-400">
                            {p.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="detail"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                  >
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white">
                      <div className="flex items-center gap-1.5 bg-[#0c0c0f] px-3 py-2.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
                        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/90" />
                        <span className="h-2.5 w-2.5 rounded-full bg-green-400/90" />
                        <span className="ml-2 truncate rounded bg-white/10 px-2.5 py-0.5 text-[10px] text-slate-300">
                          {active.id}.projectas01.com
                        </span>
                      </div>
                      <div className="relative aspect-[16/10] w-full overflow-hidden">
                        <iframe
                          src={active.demoUrl}
                          title={`${active.title} live demo`}
                          className="absolute left-0 top-0 origin-top-left border-0"
                          style={{ width: "200%", height: "200%", transform: "scale(0.5)" }}
                        />
                      </div>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      {active.stats.map((s) => (
                        <div key={s.label} className="glass rounded-xl p-3 text-center">
                          <p className="num-index gradient-text text-xl">{s.value}</p>
                          <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">{s.label}</p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 leading-relaxed text-slate-300">{active.caseStudy}</p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <a
                        href={active.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-neon font-display px-6 py-3 text-xs font-bold uppercase tracking-wider text-white"
                      >
                        Visit Demo ↗
                      </a>
                      <button
                        onClick={() => openModal(`Build me something like ${active.title}`)}
                        className="btn-ghost font-display px-6 py-3 text-xs font-bold uppercase tracking-wider text-white"
                      >
                        Build Me This
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
