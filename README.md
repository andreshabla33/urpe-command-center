# URPE Command Center

Single pane of glass para operar el ecosistema URPE en tiempo real:
tareas, agentes IA (N18, Sofía, Rocky, Mónica), emails, métricas y
sugerencias de acción generadas por LLM — todo desde un panel unificado.

## Stack

- **Frontend** Next.js 16 (App Router + RSC), Tailwind v4, shadcn/ui, TanStack Query
- **Backend** Supabase (Postgres + RLS + Edge Functions + Realtime + pgvector)
- **AI** OpenRouter → `anthropic/claude-opus-4.7` y `openai/gpt-5.2`
- **Auth** Supabase Auth + Google SSO (Workspace URPE)
- **Deploy** Vercel (Hobby) + Supabase Cloud
- **Mobile** PWA instalable (Serwist + Web Push)

## Arquitectura

Vertical slices por feature (`src/features/*`) con CQRS ligero sobre un backend
event-sourced: cada cambio se persiste como un row append-only en `fact_event`
y los read models (vistas materializadas) se reconstruyen automáticamente.

```
src/
├── app/                  Next.js App Router (UI shell + routes)
├── features/             Vertical slices: tasks, events, followups, ai, ...
├── components/           shadcn primitives + cross-feature
└── lib/
    ├── supabase/         server / client / service-role / middleware
    ├── openrouter/       LLM client + prompts
    ├── time/             helpers de horas hábiles
    └── env.ts            validación de env con Zod

db/
├── migrations/           SQL versionado (Supabase CLI)
└── seed/

scripts/                  one-shots (importar dump SQLite, etc.)
docs/                     plan del proyecto + dumps de referencia
```

## Setup local

```bash
pnpm install
cp .env.example .env.local   # rellenar con keys reales
pnpm dev
```

Variables requeridas (ver `.env.example`):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENROUTER_API_KEY`

## Roadmap

Ver [`ROADMAP.md`](ROADMAP.md). Plan original en [`docs/plan-del-proyecto.md`](docs/plan-del-proyecto.md).
