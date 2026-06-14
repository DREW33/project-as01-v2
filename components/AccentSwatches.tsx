"use client";

import { useEffect, useState } from "react";

/* Footer accent picker — click a colour to recolour the whole site's accent
   (buttons, glows, highlights, scrollbar…). The choice is saved so it sticks
   on the next visit. Pure UI: no data/backend involved. */
const ACCENTS = [
  { name: "Emerald", c: "#10b981" },
  { name: "Cyan", c: "#1abcfe" },
  { name: "Blue", c: "#3b82f6" },
  { name: "Indigo", c: "#5b7bff" },
  { name: "Violet", c: "#8b5cf6" },
  { name: "Purple", c: "#b05bff" },
  { name: "Orange", c: "#ff8a3b" },
  { name: "Coral", c: "#ff5c5c" },
  { name: "Pink", c: "#ec4899" },
];

const STORAGE_KEY = "as01-accent";

export default function AccentSwatches() {
  const [active, setActive] = useState("#5b7bff");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        document.documentElement.style.setProperty("--accent", saved);
        setActive(saved);
      }
    } catch {
      /* localStorage unavailable — ignore */
    }
  }, []);

  const pick = (c: string) => {
    document.documentElement.style.setProperty("--accent", c);
    setActive(c);
    try {
      localStorage.setItem(STORAGE_KEY, c);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="mono-label">Pick an accent</span>
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {ACCENTS.map((a) => {
          const isActive = active.toLowerCase() === a.c.toLowerCase();
          return (
            <button
              key={a.c}
              type="button"
              onClick={() => pick(a.c)}
              aria-label={`Set accent colour to ${a.name}`}
              aria-pressed={isActive}
              title={a.name}
              className="h-9 w-9 rounded-xl outline-none transition-transform duration-200 hover:scale-110 focus-visible:scale-110"
              style={{
                background: a.c,
                transform: isActive ? "scale(1.12)" : undefined,
                boxShadow: isActive
                  ? `0 0 0 2px #fff, 0 0 22px ${a.c}aa`
                  : `0 0 18px ${a.c}55`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
