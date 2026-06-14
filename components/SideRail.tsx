"use client";

import { useEffect, useState } from "react";

/**
 * Fixed right-edge vertical rail — a ChainGPT signature. Shows a rotated brand
 * label and a live "SCROLL" indicator that flips to "TOP" once you've moved
 * down the page. Decorative + a scroll-to-top control. Hidden on mobile.
 */
export default function SideRail() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    const lenis = (window as unknown as { lenis?: { scrollTo: (t: number) => void } }).lenis;
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-5 top-0 z-40 hidden h-screen flex-col items-center justify-between py-8 md:flex lg:right-7"
    >
      <span className="mono-label [writing-mode:vertical-rl]">AS01 // STUDIO</span>

      <div className="flex flex-col items-center gap-3">
        <span className="h-16 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />
        <button
          onClick={toTop}
          className="pointer-events-auto flex flex-col items-center gap-2"
        >
          <span className="mono-label [writing-mode:vertical-rl]">
            {scrolled ? "BACK TOP" : "SCROLL"}
          </span>
          <span className="text-white/50 transition-transform">
            {scrolled ? "↑" : "↓"}
          </span>
        </button>
      </div>

      <span className="mono-label [writing-mode:vertical-rl]">EST · 2024</span>
    </div>
  );
}
