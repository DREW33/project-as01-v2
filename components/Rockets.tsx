"use client";

/*
 * Two little rockets that fly across the whole page's sky background,
 * looping forever, enjoying the ride. Purely decorative, non-interactive.
 */
export default function Rockets() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      {/* Rocket 1 — drifts left → right, gently rising */}
      <div className="rocket rocket-1">
        <span className="rocket-trail" />
        <span className="rocket-emoji">🚀</span>
      </div>
      {/* Rocket 2 — drifts right → left, different height & speed */}
      <div className="rocket rocket-2">
        <span className="rocket-trail" />
        <span className="rocket-emoji">🚀</span>
      </div>
    </div>
  );
}
