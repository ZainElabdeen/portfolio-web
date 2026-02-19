# Portfolio & Resume Builder

A personal portfolio management system and AI-powered resume builder — similar in concept to tools like **FlowCV**, **Reactive Resume**, and **Enhancv**, but self-hosted and fully under your own control.

Manage your professional profile, curate your work history, and generate tailored resumes for specific job postings — with AI evaluation that tells you exactly how well you match a role and what to improve.

---

## What It Does

### Portfolio Management

Maintain a single source of truth for your professional identity:

- **Profile** — name, title, location, contact info, LinkedIn, GitHub, website, and a professional summary
- **Experience** — work history with rich text descriptions, employment type, and date ranges
- **Education** — degrees, institutions, and study periods
- **Skills** — categorised skills with optional proficiency levels
- **Projects** — portfolio projects with tags, live URLs, and GitHub links
- **Media** — profile image and CV upload via Supabase Storage

### Resume Builder

Create multiple tailored resumes from your single profile:

- Pick which experiences, educations, and skills to include per resume
- Override personal details and summary text per resume without changing your profile
- Add resume-only custom entries that don't affect your master profile
- Live A4 preview with smart page-break logic — sections never orphan across pages
- Download as PDF via browser print (A4, correct margins, light mode forced)
- Multiple resumes for different roles, all maintained from one profile

### AI Job Evaluator

Paste a job description, choose an AI provider, and get back:

- **Match percentage** — realistic score of how well your profile fits the role
- **Strengths** — what you already bring that's relevant
- **Gaps** — what's missing from your profile for this role
- **Recommendations** — specific actions to improve your candidacy
- **Suggested resume** — automatically selects the most relevant experiences, education, and skills from your profile and writes a tailored summary
- **Suggested new skills** — skills to learn that would improve your fit

The AI response is saved directly into the resume so you can revisit insights without re-running the evaluation.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Server Actions) |
| Language | TypeScript 5 |
| UI | [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://www.radix-ui.com) + [Tailwind CSS v4](https://tailwindcss.com) |
| Rich Text | [Tiptap](https://tiptap.dev) (bold, italic, underline, lists) |
| Database | [MongoDB](https://www.mongodb.com) via [Prisma ORM](https://www.prisma.io) |
| Auth | [Clerk](https://clerk.com) (restricted to a single admin email via `.env`) |
| File Storage | [Supabase Storage](https://supabase.com/storage) (profile images, CV uploads) |
| AI / LLM | [Vercel AI SDK](https://sdk.vercel.ai) with multi-provider support |
| AI Providers | OpenAI GPT-4o · Anthropic Claude · Google Gemini (or via [OpenRouter](https://openrouter.ai)) |
| Animation | [Framer Motion](https://www.framer.com/motion) |
| Forms | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |
| Dates | [date-fns](https://date-fns.org) |
| Notifications | [Sonner](https://sonner.emilkowal.ski) |

---

## Project Structure

```text
app/
  page.tsx                     # Public portfolio landing page
  dashboard/
    profile/                   # Edit personal info, headline, links
    experience/                # Manage work history
    education/                 # Manage education entries
    skills/                    # Manage skills
    projects/                  # Manage portfolio projects
    resumes/
      [id]/                    # Resume editor + live A4 preview
    job-evaluator/             # AI job fit analysis + resume generation

actions/                       # Next.js Server Actions (CRUD + AI)
lib/
  ai-providers.ts              # OpenAI / Anthropic / Google / OpenRouter routing
  ai-prompts.ts                # Structured prompts for job evaluation
  validation.ts                # Zod schemas shared across client and server
prisma/
  schema.prisma                # MongoDB schema (single-user, flat models)
components/
  ui/                          # shadcn/ui component library
  app-sidebar.tsx              # Dashboard navigation
providers/
  theme-provider.tsx           # Light / dark mode toggle
```

---

## Data Model

All models are flat — no relational joins. A `Resume` stores arrays of IDs pointing to `Experience`, `Education`, and `Skill` records, plus a `content` JSON blob for per-resume overrides and cached AI evaluation results.

```text
Profile        — one record, your professional identity
Experience[]   — work history entries (reused across resumes)
Education[]    — education entries (reused across resumes)
Skill[]        — skills (reused across resumes)
Project[]      — portfolio projects (shown on public page)
Resume[]       — each resume = selected IDs + content overrides + AI insights
```

---

## AI Setup

The evaluator supports three providers. You only need one key to get started.

Add your keys to `.env.local`:

```env
# OpenAI (direct) or OpenRouter (prefix: sk-or-)
OPENAI_API_KEY=sk-...

# Anthropic (direct)
ANTHROPIC_API_KEY=sk-ant-...

# Google Gemini (direct)
GOOGLE_GENERATIVE_AI_API_KEY=AIza...
```

**OpenRouter** — if your `OPENAI_API_KEY` starts with `sk-or-`, all providers are automatically routed through [openrouter.ai](https://openrouter.ai), which lets you access GPT-4o-mini, Claude 3 Haiku, and Gemini 2.0 Flash with a single API key and pay-per-use pricing.

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database (local or [Atlas](https://www.mongodb.com/atlas))
- A Clerk account (for authentication)
- At least one AI provider key

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
DATABASE_URL=mongodb+srv://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
OPENAI_API_KEY=sk-...
ALLOWED_ADMIN_EMAIL=you@example.com
```

> `ALLOWED_ADMIN_EMAIL` locks the dashboard to your email only. Anyone else hitting `/dashboard` is redirected to the public portfolio page.

### 3. Generate Prisma client

```bash
npx prisma generate
```

### 4. (Optional) Seed sample data

```bash
npm run db:seed
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the public portfolio page.

Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard) — the admin dashboard.

---

## Resume PDF Export

The resume editor includes a live A4 preview at 82% scale. To download as PDF:

1. Click **Download PDF** in the editor toolbar
2. In the browser print dialog, select **Save as PDF**
3. Set paper size to **A4**, margins to **None** (margins are handled by the app)

The print stylesheet forces light mode, correct A4 dimensions (794 × 1123 px at 96 dpi), and hides all dashboard UI (sidebar, header, theme toggle).

---

## Deployment

The easiest way to deploy is [Vercel](https://vercel.com):

```bash
vercel --prod
```

Set all environment variables from `.env.local` in your Vercel project settings. The `postinstall` script runs `prisma generate` automatically on every deploy.

---

## Similar Projects

| Project | Difference |
| --- | --- |
| [FlowCV](https://flowcv.com) | Cloud SaaS, not self-hosted, no AI evaluator |
| [Reactive Resume](https://rxresu.me) | Open source, no AI job matching |
| [Enhancv](https://enhancv.com) | Paid SaaS, AI-assisted but no profile CMS |
| [Resume.io](https://resume.io) | Paid SaaS, template-focused |

This project gives you the full pipeline: **profile CMS → resume builder → AI job evaluator → tailored PDF** — all in one self-hosted app with your own AI keys.
