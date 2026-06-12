const tech = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "Tailwind CSS",
  "Framer Motion",
  "PostgreSQL",
  "Supabase",
  "Claude AI",
  "OpenAI",
  "ElevenLabs",
  "React Native",
  "Docker",
  "AWS",
  "Vercel",
];

export default function TechMarquee() {
  const row = [...tech, ...tech];
  return (
    <div className="relative overflow-hidden border-y border-white/5 bg-white/[0.02] py-5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#030014] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#030014] to-transparent" />
      <div className="animate-marquee flex w-max items-center gap-12">
        {row.map((t, i) => (
          <span
            key={`${t}-${i}`}
            className="flex items-center gap-3 whitespace-nowrap font-mono text-sm text-slate-500 transition hover:text-purple-300"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
