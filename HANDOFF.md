# Project AS01 — Handoff Guide (for the second website / UI redesign)

This repo is a complete copy of the Project AS01 website. The goal for the new
session: **keep all the data + backend logic, redesign only the UI.**

The second site is meant to **share the same live data** as the original
(same leads, prospects, admin logins) — see "Shared data setup" below.

---

## 🗂️ What to CHANGE (the UI) vs KEEP (data + backend)

### ✅ CHANGE these — this is the UI / look & feel
- `app/globals.css` — theme, colors, fonts, animations (the whole visual style)
- `app/layout.tsx` — fonts + `<head>` metadata (keep the JSON-LD schema logic)
- `app/page.tsx` — which sections show and in what order
- `components/*` — every visual component:
  - `Hero.tsx`, `Navbar.tsx`, `Footer.tsx`
  - `Projects.tsx`, `Services.tsx`, `Pricing.tsx`, `Journey.tsx`, `Testimonials.tsx`
  - `Contact.tsx`, `BusinessAudit.tsx`, `LeadModal.tsx`
  - `ChatWidget.tsx`, `VoiceAgent.tsx` (chat/voice UI — keep the fetch calls)
  - `Particles.tsx`, `Rockets.tsx`, `CursorGlow.tsx`, `ScrollProgress.tsx`,
    `LoadingScreen.tsx`, `TechMarquee.tsx`, `Logo.tsx`, `PostMaker.tsx`
- `app/admin/page.tsx` — admin dashboard UI (optional to restyle; logic must stay)

### 🚫 KEEP these AS-IS — data, content & backend (do NOT redesign)
- `lib/data.ts` — all content: projects, services, pricing, testimonials, journey.
  (You can edit the text/values, but the shape stays.)
- `lib/blob.ts` — JSON storage (Vercel Blob) helpers
- `lib/adminAuth.ts` — admin accounts (lag-proof per-record design)
- `lib/rateLimit.ts` — security rate limiting
- `lib/site.ts` — canonical site URL (driven by `NEXT_PUBLIC_SITE_URL`)
- `app/api/*` — ALL backend routes:
  - `leads/` — capture + list + delete leads
  - `audit/` — public free business audit (saves a lead)
  - `analyze/` — admin client analyzer (proposal generator)
  - `prospects/` — outbound prospect CRM
  - `chat/` — AI chat (OpenRouter)
  - `image/` — AI image generation (Together/HF/Pollinations)
  - `social/` — AI Instagram content
  - `daily-posts/` — daily auto-generated viral posts (cron)
  - `admin-login/`, `admin-users/` — auth + admin management
- `public/demos/*.html` — the 17 live portfolio demo sites (keep)
- `app/sitemap.ts`, `app/robots.ts` — SEO (keep)
- `vercel.json` — cron schedule (keep)

> Rule of thumb: if a component just renders content from `lib/data.ts` or calls
> a `/api/*` route, **only change how it looks — keep the data shape and the
> fetch calls identical**, and everything keeps working.

---

## 🔗 Shared data setup (IMPORTANT — this is how both sites share data)

Both websites share data by pointing at the **same Vercel Blob store**. In the
new Vercel project's Environment Variables, set the **exact same values** as the
original project (copy them from the original project's Vercel settings — they
are NOT stored in this repo for security):

| Env var | Purpose | For shared data… |
|---|---|---|
| `BLOB_READ_WRITE_TOKEN` | Storage (leads, prospects, admins) | **MUST be identical** to the original → this is what shares the data |
| `ADMIN_PASSWORD` | Master admin password | Use the same value → same admin login works on both |
| `OPENROUTER_API_KEY` | AI chat / analyzer / content | Same value (or a new key) |
| `CRON_SECRET` | Protects the daily-posts cron | Any value |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for SEO | **Use the NEW site's URL** (not the original's) |
| `TOGETHER_API_KEY` | (optional) reliable AI images | Same if set |

To copy the values from the original project:
`vercel env pull .env.local` (run in the original project), then set the same
ones in the new project — keeping `BLOB_READ_WRITE_TOKEN` identical.

---

## ▶️ Run & deploy

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
vercel deploy --prod --yes   # deploy (after `vercel link`)
```

Admin panel: `/admin` (password = `ADMIN_PASSWORD`).

---

## 🧠 Architecture in one line
Next.js 15 (App Router) + Tailwind 4 + Framer Motion. Content lives in
`lib/data.ts`; data persists in Vercel Blob via `lib/*`; all server logic is in
`app/api/*`; everything visual is in `components/*` + `app/globals.css`.
Redesign the visuals, leave the data layer alone, and you have the same product
with a brand-new look.
