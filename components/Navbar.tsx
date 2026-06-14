"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Logo from "./Logo";
import { useLeadModal } from "./LeadModalContext";

const links = [
  { href: "#projects", label: "Projects" },
  { href: "#services", label: "Services" },
  { href: "#pricing", label: "Pricing" },
  { href: "#journey", label: "Process" },
  { href: "#audit", label: "Free Audit" },
  { href: "#contact", label: "Contact" },
];

type LenisLike = { scrollTo: (t: number | string, o?: { offset?: number }) => void };

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { openModal } = useLeadModal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // navigate via Lenis so anchor jumps are smooth + snappy (no fighting the
  // smooth-scroll). Falls back to native behaviour if Lenis isn't ready.
  const goTo = (href: string) => {
    setMenuOpen(false);
    const lenis = (window as unknown as { lenis?: LenisLike }).lenis;
    if (href === "#") {
      if (lenis) lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (lenis) lenis.scrollTo(href, { offset: -72 });
    else document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-strong shadow-[0_8px_40px_rgba(0,0,0,0.5)]" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <button onClick={() => goTo("#")} aria-label="Project AS01 home" className="cursor-pointer">
          <Logo />
        </button>

        <ul className="hidden items-center gap-5 md:flex lg:gap-7">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={(e) => {
                  e.preventDefault();
                  goTo(l.href);
                }}
                className="mono-label transition hover:text-white"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openModal("Get Free Consultation")}
            className="btn-neon font-display hidden px-5 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-white sm:block"
          >
            Contact Us
          </button>
          <button
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-white/15 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className={`h-0.5 w-5 bg-white transition ${menuOpen ? "translate-y-1 rotate-45" : ""}`} />
            <span className={`h-0.5 w-5 bg-white transition ${menuOpen ? "-translate-y-1 -rotate-45" : ""}`} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="glass-strong md:hidden"
        >
          <ul className="space-y-1 px-5 py-4">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault();
                    goTo(l.href);
                  }}
                  className="block rounded-lg px-4 py-3 text-sm text-slate-200 transition hover:bg-white/5"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  openModal("Get Free Consultation");
                }}
                className="btn-neon font-display mt-2 w-full rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider text-white"
              >
                Free Consultation
              </button>
            </li>
          </ul>
        </motion.div>
      )}
    </motion.header>
  );
}
