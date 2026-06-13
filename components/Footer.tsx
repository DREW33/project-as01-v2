import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-12">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <Logo />
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-slate-500">
              Premium AI-powered website &amp; app development company in Guwahati, Assam.
              Coffee &gt; Code &gt; Repeat.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
            <a href="#projects" className="transition hover:text-white">Projects</a>
            <a href="#services" className="transition hover:text-white">Services</a>
            <a href="#pricing" className="transition hover:text-white">Pricing</a>
            <a href="#contact" className="transition hover:text-white">Contact</a>
            <a href="https://instagram.com/project_as01" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">Instagram</a>
            <Link href="/admin" className="transition hover:text-purple-400">Admin</Link>
          </nav>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs text-slate-600 md:flex-row">
          <p>© {new Date().getFullYear()} Project AS01. All rights reserved.</p>
          <p className="font-mono">
            <span className="text-purple-500">&lt;/&gt;</span> vibe coder{" "}
            <span className="text-blue-500">&lt;/&gt;</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
