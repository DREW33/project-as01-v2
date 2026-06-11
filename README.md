# Project AS01 — Premium AI-Powered Agency Website

Dark cyberpunk agency website built with Next.js 15, TypeScript, Tailwind CSS 4 and Framer Motion.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

## What's inside

| Area | Where |
|---|---|
| Homepage (hero, projects, services, journey, pricing, testimonials, contact) | `app/page.tsx` + `components/` |
| Project showcase with fullscreen live-preview modal | `components/Projects.tsx` |
| Lead capture popup + automation workflow animation | `components/LeadModal.tsx` |
| Floating AI chat assistant | `components/ChatWidget.tsx` |
| Admin dashboard (leads, AI call logs, analytics) | `app/admin/page.tsx` — demo password `as01admin` |
| Lead API (JSON file store) | `app/api/leads/route.ts` |
| Content (projects, services, pricing, testimonials) | `lib/data.ts` |
| SEO (metadata, JSON-LD, sitemap, robots) | `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts` |

## Going to production

The demo ships with safe placeholders. To wire up the real stack:

1. **Database** — replace the JSON store in `app/api/leads/route.ts` with Supabase/PostgreSQL.
2. **AI chat** — point `components/ChatWidget.tsx` at a `/api/chat` route backed by the Claude API (`claude-fable-5`).
3. **AI calling** — on lead POST, trigger Twilio + ElevenLabs voice agent; store transcripts back on the lead.
4. **WhatsApp/Email** — Twilio WhatsApp API + Resend/SendGrid in the lead POST handler.
5. **Auth** — replace the demo admin gate with JWT + role-based access (NextAuth or Supabase Auth).
6. **Contact details** — update phone/email in `components/Contact.tsx` and `app/layout.tsx`.
