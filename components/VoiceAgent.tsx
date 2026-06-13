"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/*
 * Browser voice assistant - visitors TALK to our AI in the chat (not a phone call):
 *   mic -> Web Speech API (STT) -> /api/chat (OpenRouter) -> speechSynthesis (TTS).
 * Opens via window.dispatchEvent(new CustomEvent("as01:voice")).
 * Works best in Chrome/Edge/Android; falls back gracefully where unsupported.
 */

type VState = "idle" | "listening" | "thinking" | "speaking";
type Line = { who: "agent" | "you"; text: string };

const GREETING =
  "Hi! I'm the AS01 voice assistant. Ask me anything about our websites, apps, pricing or AI services. What are you building?";

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
  const [state, setState] = useState<VState>("idle");
  const [lines, setLines] = useState<Line[]>([]);
  const [supported, setSupported] = useState(true);
  const recRef = useRef<SpeechRecognition | null>(null);
  const liveRef = useRef(false);
  const linesRef = useRef<Line[]>([]);

  const speak = useCallback((text: string, onDone?: () => void) => {
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const v = pickVoice();
      if (v) u.voice = v;
      u.rate = 1.04;
      u.onend = () => onDone?.();
      u.onerror = () => onDone?.();
      window.speechSynthesis.speak(u);
    } catch {
      onDone?.();
    }
  }, []);

  const listen = useCallback(() => {
    if (!liveRef.current || !recRef.current) return;
    setState("listening");
    try {
      recRef.current.start();
    } catch {
      /* already running */
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

      const phone = text.replace(/\s/g, "").match(/(\+?91)?([6-9]\d{9})/);
      if (phone) {
        fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Voice assistant visitor",
            phone: phone[2],
            message: text,
            intent: "Voice assistant - callback requested",
            source: "voice-agent",
          }),
        }).catch(() => {});
        agentSay("Got it! I've saved your number and our team will reach out to you soon. Anything else I can help with?");
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
                  "(This is a VOICE conversation - answer under 50 words, plain conversational speech, no lists, no emojis.) " +
                  text,
              },
            ],
          }),
        });
        const d = await r.json();
        agentSay(
          d?.text ||
            "Our websites start at twenty thousand rupees and ship in seven days. Tell me about your business and I'll suggest the best option."
        );
      } catch {
        agentSay("Sorry, I didn't catch that. Could you say it again?");
      }
    },
    [agentSay]
  );

  const endSession = useCallback(() => {
    liveRef.current = false;
    setState("idle");
    try {
      recRef.current?.abort();
    } catch {}
    try {
      window.speechSynthesis.cancel();
    } catch {}
    setTimeout(() => setOpen(false), 300);
  }, []);

  useEffect(() => {
    const onOpen = () => {
      setLines([]);
      linesRef.current = [];
      setState("idle");
      setOpen(true);
    };
    window.addEventListener("as01:voice", onOpen);
    return () => window.removeEventListener("as01:voice", onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const rec = getRecognizer();
    if (!rec || typeof window === "undefined" || !("speechSynthesis" in window)) {
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
      if (liveRef.current) setTimeout(() => listen(), 500);
    };
    rec.onend = () => {
      if (liveRef.current)
        setState((s) => {
          if (s === "listening") setTimeout(() => listen(), 300);
          return s;
        });
    };

    const t = setTimeout(() => {
      if (liveRef.current) agentSay(GREETING);
    }, 700);

    return () => {
      clearTimeout(t);
      liveRef.current = false;
      try {
        rec.abort();
      } catch {}
      try {
        window.speechSynthesis.cancel();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const label: Record<VState, string> = {
    idle: "Connecting...",
    listening: "Listening - speak now",
    thinking: "Thinking...",
    speaking: "AS01 is speaking",
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 backdrop-blur-lg"
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
                  Voice needs Chrome
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Your browser doesn&apos;t support voice input. Open this site in Chrome or
                  Edge - or just type to the chat assistant instead!
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
                <div className="relative mt-2">
                  {(state === "idle" || state === "listening") && (
                    <>
                      <span className="absolute inset-0 animate-ping rounded-full bg-purple-500/30" />
                      <span className="absolute -inset-3 animate-pulse rounded-full border border-purple-500/40" />
                    </>
                  )}
                  <div
                    className={`logo-ring relative flex h-24 w-24 items-center justify-center rounded-full ${
                      state === "speaking" ? "animate-pulse" : ""
                    }`}
                  >
                    <span className="flex h-[84px] w-[84px] items-center justify-center rounded-full bg-[#0a0420] text-4xl">
                      🤖
                    </span>
                  </div>
                </div>
                <h3 className="font-display mt-5 text-lg font-bold text-white">AS01 Voice Assistant</h3>
                <p className={`mt-1 text-sm ${state === "listening" ? "text-green-400" : "text-purple-300"}`}>
                  {label[state]}
                </p>

                <div className="mt-5 max-h-32 w-full space-y-2 overflow-y-auto text-left">
                  {lines.slice(-4).map((l, i) => (
                    <p key={i} className="text-xs leading-relaxed text-slate-400">
                      <span className={l.who === "agent" ? "text-purple-400" : "text-blue-400"}>
                        {l.who === "agent" ? "AS01: " : "You: "}
                      </span>
                      {l.text}
                    </p>
                  ))}
                </div>

                <div className="mt-7 flex items-center gap-4">
                  <button
                    onClick={listen}
                    aria-label="Speak"
                    className="btn-neon flex h-12 w-12 items-center justify-center rounded-full text-xl text-white"
                    title="Tap and speak"
                  >
                    🎤
                  </button>
                  <button
                    onClick={endSession}
                    aria-label="End"
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-xl text-white shadow-[0_0_24px_rgba(239,68,68,0.5)] transition hover:scale-110"
                  >
                    ✕
                  </button>
                </div>
                <p className="mt-4 text-[10px] text-slate-600">
                  Talk to our AI assistant · mic permission required
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
