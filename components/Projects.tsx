"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { categories, projects, type Project } from "@/lib/data";
import { useLeadModal } from "./LeadModalContext";

/* Live thumbnail: the REAL demo website in a scaled-down iframe.
   The iframe is only mounted once the card scrolls near the viewport, so the
   page doesn't try to load 17 external sites at once (keeps it fast). Until
   then a branded gradient placeholder stands in. */
function LiveThumb({ p, anchor = "", eager = false }: { p: Project; anchor?: string; eager?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(eager);

  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "250px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show]);

  return (
    <div
      ref={ref}
      className={`relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-gradient-to-br ${p.accent}`}
    >
      {show ? (
        <iframe
          src={p.demoUrl + anchor}
          title={`${p.title} preview`}
          loading="lazy"
          tabIndex={-1}
          aria-hidden
          scrolling="no"
          className="pointer-events-none absolute left-0 top-0 origin-top-left border-0 bg-white"
          style={{ width: "400%", height: "400%", transform: "scale(0.25)" }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display px-4 text-center text-sm font-bold uppercase tracking-wider text-white/85">
            {p.title}
          </span>
        </div>
      )}
      <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-green-300 backdrop-blur">
        ● Live
      </span>
    </div>
  );
}

/* Fully interactive demo, rendered at desktop width inside the modal */
function LiveFrame({ p }: { p: Project }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white">
      {/* browser chrome */}
      <div className="flex items-center gap-1.5 bg-[#0c0c0f] px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/90" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400/90" />
        <span className="ml-2 truncate rounded bg-white/10 px-2.5 py-0.5 text-[10px] text-slate-300">
          {p.id}.projectas01.com
        </span>
        <a
          href={p.demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-[10px] font-semibold text-purple-300 hover:text-white"
        >
          Open full ↗
        </a>
      </div>
      <div className="relative aspect-[16/11] w-full overflow-hidden">
        <iframe
          src={p.demoUrl}
          title={`${p.title} live demo`}
          className="absolute left-0 top-0 origin-top-left border-0"
          style={{ width: "200%", height: "200%", transform: "scale(0.5)" }}
        />
      </div>
    </div>
  );
}

function ProjectModal({ p, onClose }: { p: Project; onClose: () => void }) {
  const [tab, setTab] = useState<"preview" | "screens" | "case" | "tech">("preview");
  const { openModal } = useLeadModal();
  const tabs = [
    ["preview", "Live Preview"],
    ["screens", "Screenshots"],
    ["case", "Case Study"],
    ["tech", "Tech Stack"],
  ] as const;

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-3 backdrop-blur-lg sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="glass-strong relative flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl"
        initial={{ scale: 0.88, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 30, opacity: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 260 }}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-white/10 p-5 sm:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-400">{p.category}</p>
            <h3 className="font-display mt-1 text-2xl font-bold text-white">{p.title}</h3>
            <p className="mt-1 text-sm text-slate-400">{p.tagline}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close project"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-slate-400 transition hover:rotate-90 hover:border-purple-500/60 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="flex shrink-0 gap-2 overflow-x-auto border-b border-white/10 px-5 pt-3 sm:px-6">
          {tabs.map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`whitespace-nowrap rounded-t-lg px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition ${
                tab === id
                  ? "border-b-2 border-purple-500 bg-white/5 text-white"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto p-5 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {tab === "preview" && (
                <div>
                  <LiveFrame p={p} />
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {p.stats.map((s) => (
                      <div key={s.label} className="glass rounded-xl p-3 text-center sm:p-4">
                        <p className="font-display gradient-text text-lg font-bold sm:text-2xl">{s.value}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500 sm:text-xs">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {tab === "screens" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <LiveThumb p={p} eager />
                  <LiveThumb p={p} anchor="#s2" eager />
                </div>
              )}
              {tab === "case" && (
                <div>
                  <p className="leading-relaxed text-slate-300">{p.caseStudy}</p>
                  <p className="mt-4 text-sm leading-relaxed text-slate-500">{p.description}</p>
                </div>
              )}
              {tab === "tech" && (
                <div className="flex flex-wrap gap-3">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="neon-border rounded-full px-5 py-2.5 text-sm font-medium text-slate-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex shrink-0 flex-wrap gap-3 border-t border-white/10 p-5 sm:p-6">
          <a
            href={p.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-neon font-display rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider text-white"
          >
            Visit Demo ↗
          </a>
          <button
            onClick={() => openModal(`Build me something like ${p.title}`)}
            className="btn-ghost font-display rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider text-white"
          >
            Build Me This
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState<string>("All");
  const [active, setActive] = useState<Project | null>(null);

  const shown = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="relative scroll-mt-24 py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <h2 className="headline text-[14vw] leading-[0.85] text-outline sm:text-[11vw] lg:text-[8rem]">
            Projects
          </h2>
          <p className="max-w-sm text-sm font-medium uppercase tracking-wide text-slate-400 md:pb-4">
            Tap any card to open its live preview, screenshots, case study and full
            tech stack.
          </p>
        </motion.div>

        <div className="mt-10 flex flex-wrap justify-center gap-2.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                filter === c
                  ? "btn-neon text-white"
                  : "glass text-slate-400 hover:border-purple-500/40 hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <motion.div layout className="mt-12 grid gap-7 sm:grid-cols-2 md:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {shown.map((p, i) => (
              <motion.article
                layout
                key={p.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: (i % 3) * 0.1 }}
                className="group cursor-pointer [perspective:900px]"
                onClick={() => setActive(p)}
              >
                <div
                  className="glass glow-card overflow-hidden rounded-2xl transition-transform duration-150 ease-out will-change-transform"
                  onMouseMove={(e) => {
                    const el = e.currentTarget;
                    const r = el.getBoundingClientRect();
                    const x = (e.clientX - r.left) / r.width - 0.5;
                    const y = (e.clientY - r.top) / r.height - 0.5;
                    el.style.transform = `rotateY(${(x * 6).toFixed(2)}deg) rotateX(${(-y * 6).toFixed(2)}deg) translateY(-6px) scale(1.01)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "";
                  }}
                >
                <div className="relative overflow-hidden p-3 pb-0">
                  <div className="transition-transform duration-500 group-hover:scale-[1.04]">
                    <LiveThumb p={p} />
                  </div>
                  <div className="pointer-events-none absolute inset-3 bottom-0 flex items-center justify-center rounded-xl bg-black/55 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                    <span className="btn-neon font-display rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white">
                      ▶ Open Live Preview
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-lg font-bold text-white">{p.title}</h3>
                    <span className="shrink-0 rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-purple-300">
                      {p.category}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-400">{p.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.tech.slice(0, 4).map((t) => (
                      <span key={t} className="rounded bg-white/5 px-2 py-1 text-[10px] font-medium text-slate-400">
                        {t}
                      </span>
                    ))}
                    {p.tech.length > 4 && (
                      <span className="rounded bg-white/5 px-2 py-1 text-[10px] text-slate-500">
                        +{p.tech.length - 4}
                      </span>
                    )}
                  </div>
                </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {active && <ProjectModal p={active} onClose={() => setActive(null)} />}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
}
