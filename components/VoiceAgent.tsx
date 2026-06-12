"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/*
 * Free browser-based AI voice agent ("AI call" without telephony):
 * mic → Web Speech API (STT) → /api/chat (OpenRouter) → speechSynthesis (TTS).
 * Open it from anywhere: window.dispatchEvent(new CustomEvent("as01:voice"))
 * Works best in Chrome/Edge/Android. Falls back gracefully where unsupported.
 */

type CallState = "ringing" | "speaking" | "listening" | "thinking" | "ended";
type Line = { who: "agent" | "you"; text: string };

const GREETING =
  "Hello! This is the AI agent from Project A S zero one. Thanks for reaching out! Tell me — what kind of project are you planning?";

function getRecognizer(): SpeechRecognition | null {
  if (typeof window === "undefined") return null;
  const SR =
    (window as unknown as { SpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition ||
    (window as unknown as { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;
  if (!SR) return null;
  const rec = new SR();
  rec.lang = "en-IN";
  rec.continuous = false;
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  return rec;
}

function pickVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang === "en-IN") ||
    voices.find((v) => v.lang === "hi-IN") ||
    voices.find((v) => v.lang.startsWith("en")) ||
    voices[0]
  );
}

export default function VoiceAgent() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<CallState>("ringing");
  const [lines, setLines] = useState<Line[]>([]);
  const [supported, setSupported] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const recRef = useRef<SpeechRecognition | null>(null);
  const liveRef = useRef(false);
  const linesRef = useRef<Line[]>([]);

  const speak = useCallback((text: string, onDone?: () => void) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice();
    if (v) u.voice = v;
    u.rate = 1.04;
    u.pitch = 1.0;
    u.onend = () => onDone?.();
    u.onerror = () => onDone?.();
    window.speechSynthesis.speak(u);
  }, []);

  const listen = useCallback(() => {
    if (!liveRef.current) return;
    const rec = recRef.current;
    if (!rec) return;
    setState("listening");
    try {
      rec.start();
    } catch {
      /* already started */
    }
  }, []);

  const agentSay = useCallback(
    (text: string) => {
      if (!liveRef.current) return;
      setLines((l) => [...l, { who: "agent", text }]);
      linesRef.current = [...linesRef.current, { who: "agent", text }];
      setState("speaking");
      speak(text, () => listen());
    },
    [speak, listen]
  );

  const handleUserSpeech = useCallback(
    async (text: string) => {
      if (!liveRef.current) return;
      setLines((l) => [...l, { who: "you", text }]);
      linesRef.current = [...linesRef.current, { who: "you", text }];
      setState("thinking");

      // phone number anywhere → capture lead instantly
      const phone = text.replace(/\s/g, "").match(/(\+?91)?([6-9]\d{9})/);
      if (phone) {
        fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Voice call visitor",
            phone: phone[2],
            message: text,
            intent: "AI voice call — callback requested",
            source: "voice-agent",
          }),
        }).catch(() => {});
        agentSay("Got it! I have saved your number and our team will reach out very soon. Anything else I can help you with?");
        return;
      }

      try {
        const r = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              ...linesRef.current.map((l) => ({
                role: l.who === "you" ? "user" : "assistant",
                content: l.text,
              })),
              {
                role: "user",
                content:
                  "(This is a VOICE call — keep your answer under 50 words, plain conversational speech, no lists, no emojis.) " +
                  text,
              },
            ],
          }),
        });
        const d = await r.json();
        agentSay(
          d?.text ||
            "Great question! Our plans start at twenty thousand rupees for websites. Could you tell me more about your business?"
        );
      } catch {
        agentSay("Sorry, the line glitched for a second. Could you say that again?");
      }
    },
    [agentSay]
  );

  const endCall = useCallback(() => {
    liveRef.current = false;
    setState("ended");
    try {
      recRef.current?.abort();
    } catch {}
    window.speechSynthesis.cancel();
    setTimeout(() => setOpen(false), 900);
  }, []);

  // open via global event
  useEffect(() => {
    const onOpen = () => {
      setLines([]);
      linesRef.current = [];
      setSeconds(0);
      setState("ringing");
      setOpen(true);
    };
    window.addEventListener("as01:voice", onOpen);
    return () => window.removeEventListener("as01:voice", onOpen);
  }, []);

  // call lifecycle
  useEffect(() => {
    if (!open) return;
    const rec = getRecognizer();
    if (!rec || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    setSupported(true);
    recRef.current = rec;
    liveRef.current = true;

    rec.onresult = (e: SpeechRecognitionEvent) => {
      const text = e.results[0]?.[0]?.transcript?.trim();
      if (text) handleUserSpeech(text);
    };
    rec.onerror = () => {
      if (liveRef.current) setTimeout(() => listen(), 400);
    };
    rec.onend = () => {
      // if nothing was captured and we're still "listening", re-arm
      if (liveRef.current) {
        setState((s) => {
          if (s === "listening") setTimeout(() => listen(), 250);
          return s;
        });
      }
    };

    // ring, then greet
    const t = setTimeout(() => {
      if (liveRef.current) agentSay(GREETING);
    }, 1800);

    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);

    return () => {
      clearTimeout(t);
      clearInterval(timer);
      liveRef.current = false;
      try {
        rec.abort();
      } catch {}
      window.speechSynthesis.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const mins = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  const statusLabel: Record<CallState, string> = {
    ringing: "Connecting…",
    speaking: "AS01 is speaking",
    listening: "Listening — speak now",
    thinking: "Thinking…",
    ended: "Call ended",
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-black/85 p-4 backdrop-blur-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 20, opacity: 0 }}
            className="glass-strong flex w-full max-w-sm flex-col items-center rounded-3xl p-8 text-center"
          >
            {!supported ? (
              <>
                <p className="text-4xl">🎙️</p>
                <h3 className="font-display mt-4 text-xl font-bold text-white">
                  Voice calls need Chrome
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Your browser doesn&apos;t support voice recognition. Open this site in
                  Chrome (or Edge) — or just use the 🤖 chat instead!
                </p>
                <button
                  onClick={() => setOpen(false)}
                  className="btn-neon font-display mt-6 rounded-full px-8 py-3 text-xs font-bold uppercase tracking-wider text-white"
                >
                  Okay
                </button>
              </>
            ) : (
              <>
                <p className="font-mono text-xs text-slate-500">{mins}</p>
                {/* avatar with state ring */}
                <div className="relative mt-4">
                  {(state === "ringing" || state === "listening") && (
                    <>
                      <span className="absolute inset-0 animate-ping rounded-full bg-purple-500/30" />
                      <span className="absolute -inset-3 animate-pulse rounded-full border border-purple-500/40" />
                    </>
                  )}
                  <div
                    className={`relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-500 text-4xl shadow-[0_0_50px_rgba(147,51,234,0.6)] ${
                      state === "speaking" ? "animate-pulse" : ""
                    }`}
                  >
                    🤖
                  </div>
                </div>
                <h3 className="font-display mt-5 text-lg font-bold text-white">AS01 Voice Agent</h3>
                <p
                  className={`mt-1 text-sm ${
                    state === "listening" ? "text-green-400" : "text-purple-300"
                  }`}
                >
                  {statusLabel[state]}
                </p>

                {/* last exchange */}
                <div className="mt-5 max-h-32 w-full space-y-2 overflow-y-auto text-left">
                  {lines.slice(-3).map((l, i) => (
                    <p key={i} className="text-xs leading-relaxed text-slate-400">
                      <span className={l.who === "agent" ? "text-purple-400" : "text-blue-400"}>
                        {l.who === "agent" ? "AS01: " : "You: "}
                      </span>
                      {l.text}
                    </p>
                  ))}
                </div>

                <div className="mt-7 flex items-center gap-5">
                  <button
                    onClick={endCall}
                    aria-label="End call"
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-2xl text-white shadow-[0_0_24px_rgba(239,68,68,0.6)] transition hover:scale-110"
                  >
                    ✕
                  </button>
                </div>
                <p className="mt-4 text-[10px] text-slate-600">
                  Free in-browser AI call · mic permission required
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
