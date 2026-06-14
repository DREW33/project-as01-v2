import Link from "next/link";
import Logo from "./Logo";
import AccentSwatches from "./AccentSwatches";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 pt-20 pb-10">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[320px] w-[640px] -translate-x-1/2 rounded-full bg-[#a259ff]/12 blur-[150px]" />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* big CTA headline like the video's closing screen */}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Let&apos;s build something
          </p>
          <h2 className="headline mt-4 text-[16vw] leading-[0.85] text-white sm:text-[13vw] lg:text-[9rem]">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <a
            href="#contact"
            className="btn-neon font-display mt-8 inline-block px-9 py-4 text-sm font-bold uppercase tracking-[0.15em]"
          >
            Start a Project
          </a>
        </div>

        {/* interactive accent picker (was a static rainbow row) */}
        <div className="mt-16">
          <AccentSwatches />
        </div>

        {/* bottom bar */}
        <div className="mt-16 flex flex-col items-center gap-6 border-t border-white/5 pt-10 md:flex-row md:justify-between">
          <div className="text-center md:text-left">
            <Logo />
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-slate-500">
              Premium AI-powered website &amp; app development studio in Guwahati,
              Assam. Coffee &gt; Code &gt; Repeat.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
            <a href="#projects" className="transition hover:text-white">Projects</a>
            <a href="#services" className="transition hover:text-white">Services</a>
            <a href="#pricing" className="transition hover:text-white">Pricing</a>
            <a href="#contact" className="transition hover:text-white">Contact</a>
            <a href="https://instagram.com/project_as01" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">Instagram</a>
            <Link href="/admin" className="transition hover:text-[#a259ff]">Admin</Link>
          </nav>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 text-xs text-slate-600 md:flex-row">
          <p>© {new Date().getFullYear()} Project AS01. All rights reserved.</p>
          <p className="font-display uppercase tracking-[0.2em]">Built bold in Assam</p>
        </div>
      </div>
    </footer>
  );
}
