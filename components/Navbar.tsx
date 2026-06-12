"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Logo from "./Logo";
import { useLeadModal } from "./LeadModalContext";

const links = [
  { href: "#projects", label: "Projects" },
  { href: "#services", label: "Services" },
  { href: "#pricing", label: "Pricing" },
  { href: "#journey", label: "Process" },
  { href: "#contact", label: "Contact" },
];

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
        <Link href="#" aria-label="Project AS01 home">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm font-medium text-slate-300 transition hover:text-white hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.9)]"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openModal("Get Free Consultation")}
            className="btn-neon font-display hidden rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white sm:block"
          >
            Free Consultation
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
                  onClick={() => setMenuOpen(false)}
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
