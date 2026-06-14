"use client";

import { useEffect, useRef, useState } from "react";
import type { Application as SplineApp } from "@splinetool/runtime";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Swap this for your own Spline scene any time (Spline → Export → "Public URL").
 * Default is the classic cursor-following robot head — the closest public match
 * to the ChainGPT mascot.
 */
const ROBOT_SCENE = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

/**
 * The central 3D robot. Fixed + centered (z20) so it floats "inside" the dark
 * stage card while the content (z30) scrolls over and around it — the pinned
 * cinematic effect, without fragile ScrollTrigger pin-spacing.
 *
 * Three nested layers:
 *   #robot-stage  — fixed centered frame
 *   scrollRef     — GSAP scroll-scrubbed scale / drift / fade across #stage-zone
 *   tiltRef       — smooth mouse-parallax tilt
 *   (Spline)      — idle float + its own cursor tracking
 */
export default function RobotStage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<SplineApp | null>(null);
  const activeRef = useRef(true); // is the robot on-screen (in the hero)?
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  // ---- load the Spline scene onto the canvas (client-only runtime) ----
  // Deferred to idle so the heavy WASM/WebGL init doesn't block first paint
  // or starve the loading screen / scroll (keeps the page feeling fast).
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let app: SplineApp | null = null;
    let cancelled = false;

    const start = async () => {
      if (cancelled || !canvas) return;
      // Lazy-import the heavy Spline runtime so it's NOT in the initial bundle.
      const { Application } = await import("@splinetool/runtime");
      if (cancelled) return;
      app = new Application(canvas);
      appRef.current = app;
      app
        .load(ROBOT_SCENE)
        .then(() => {
          if (cancelled) return;
          setLoaded(true);
          if (!activeRef.current) app?.stop(); // already scrolled past
        })
        .catch(() => !cancelled && setFailed(true));
    };

    const ric = (window as unknown as {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
    }).requestIdleCallback;
    const handle = ric ? ric(start, { timeout: 2000 }) : window.setTimeout(start, 1300);

    return () => {
      cancelled = true;
      const cic = (window as unknown as { cancelIdleCallback?: (h: number) => void })
        .cancelIdleCallback;
      if (ric && cic) cic(handle);
      else clearTimeout(handle);
      app?.dispose();
      app = null;
    };
  }, []);

  // ---- scroll choreography across the stage zone ----
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const zone = document.getElementById("stage-zone");
    const el = scrollRef.current;
    if (reduce || !zone || !el) return;

    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: zone,
        start: "top top",
        end: "bottom top", // choreograph across the full hero scroll
        scrub: 1,
        // fully halt the WebGL render loop once the robot is offscreen
        onLeave: () => {
          activeRef.current = false;
          appRef.current?.stop();
          gsap.set(el, { display: "none" });
        },
        onEnterBack: () => {
          activeRef.current = true;
          gsap.set(el, { display: "block" });
          appRef.current?.play();
        },
      },
    });

    // float big & low in the hero, then gently lift, shrink and fade away
    tl.fromTo(
      el,
      { scale: 1.08, yPercent: 6 },
      { scale: 0.96, yPercent: -4, ease: "none" }
    ).to(el, { autoAlpha: 0, scale: 0.86, yPercent: -10 });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [loaded]);

  // ---- mouse-parallax tilt ----
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = tiltRef.current;
    if (reduce || !el) return;

    const qRotY = gsap.quickTo(el, "rotationY", { duration: 0.7, ease: "power3" });
    const qRotX = gsap.quickTo(el, "rotationX", { duration: 0.7, ease: "power3" });
    const qTx = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3" });
    const qTy = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3" });

    const onMove = (e: MouseEvent) => {
      if (!activeRef.current) return; // robot offscreen — skip work
      const cx = e.clientX / window.innerWidth - 0.5;
      const cy = e.clientY / window.innerHeight - 0.5;
      qRotY(cx * 22);
      qRotX(-cy * 16);
      qTx(cx * 60);
      qTy(cy * 36);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      id="robot-stage"
      aria-hidden
      className="pointer-events-none fixed inset-0 z-20 hidden items-center justify-center md:flex"
    >
      <div ref={scrollRef} className="relative h-[68vh] w-[68vw] max-w-[620px]">
        {/* tiltRef: GSAP mouse-parallax (transform owned by GSAP) */}
        <div
          ref={tiltRef}
          className="h-full w-full"
          style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
        >
          {/* inner layer: CSS idle float (separate element so it can't fight GSAP) */}
          <div className="animate-float-slow relative h-full w-full">
            <canvas
              ref={canvasRef}
              className="pointer-events-auto h-full w-full"
              style={{ display: failed ? "none" : "block" }}
            />

            {/* graceful fallback: glowing RGB orb while loading or if the scene
                can't be reached (keeps the composition intact) */}
            {(!loaded || failed) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rgb-ring h-40 w-40 opacity-70 blur-[2px]">
                  <div className="h-full w-full rounded-full bg-[#0a0b0f]" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
