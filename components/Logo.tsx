"use client";

import { motion } from "framer-motion";

/* Circular coding mark: spinning neon gradient ring + </> glyph */
export function LogoMark({ px = 48 }: { px?: number }) {
  return (
    <span
      className="logo-ring inline-flex shrink-0 rounded-full p-[3px]"
      style={{ width: px, height: px }}
    >
      <span className="flex h-full w-full items-center justify-center rounded-full bg-[#06021a] font-mono font-bold">
        <span className="gradient-text" style={{ fontSize: px * 0.36 }}>
          {"</>"}
        </span>
      </span>
    </span>
  );
}

export default function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const lg = size === "lg";
  return (
    <motion.span
      className="inline-flex items-center gap-3"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
    >
      <LogoMark px={lg ? 88 : 48} />
      <span className="flex flex-col">
        <span className={`font-logo leading-none ${lg ? "text-4xl md:text-6xl" : "text-lg"}`}>
          <span className="font-semibold tracking-wide text-white">project</span>{" "}
          <span className="gradient-text font-extrabold tracking-wider">as01</span>
          <span className="animate-blink ml-0.5 font-mono font-normal text-purple-400">▍</span>
        </span>
        <span
          className={`mt-1 font-mono uppercase text-slate-400 ${
            lg ? "text-sm tracking-[0.5em]" : "text-[8px] tracking-[0.32em]"
          }`}
        >
          <span className="text-purple-400">&lt;/&gt;</span> vibe coder{" "}
          <span className="text-blue-400">&lt;/&gt;</span>
        </span>
      </span>
    </motion.span>
  );
}
