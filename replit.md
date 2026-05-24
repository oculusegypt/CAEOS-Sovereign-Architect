# CAEOS — Constitutional AI Engineering Operating System

A bilingual (Arabic/English) governance kernel that transforms human intent into production-grade software architectures under sovereign protocols.

## Run & Operate

- `pnpm --filter @workspace/caeos run dev` — run the frontend (Vite dev server)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite (migrated from Next.js 15)
- Routing: wouter
- i18n: custom context-based (Arabic RTL + English LTR)
- API: Express 5 (scaffold, no routes yet)
- DB: PostgreSQL + Drizzle ORM (scaffold, no schema yet)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle for API server)

## Where things live

- `artifacts/caeos/` — React + Vite frontend artifact (preview path: `/`)
- `artifacts/api-server/` — Express API server (preview path: `/api`)
- `artifacts/caeos/src/pages/` — Page components (home, wizard, dashboard, constitution)
- `artifacts/caeos/src/components/` — Shared UI components (Navbar, shadcn/ui)
- `artifacts/caeos/src/context/LocaleContext.tsx` — RTL/LTR locale state
- `artifacts/caeos/src/lib/useTranslations.ts` — i18n hook
- `artifacts/caeos/src/lib/messages/` — Translation files (en.json, ar.json)
- `lib/api-spec/openapi.yaml` — API contract source of truth

## Architecture decisions

- **No next-intl**: Replaced with custom React context + static JSON import (Vite ESM compatible)
- **Default locale Arabic**: App loads in Arabic RTL by default (matches original intent)
- **Language toggle**: Persisted to localStorage, switches HTML dir attribute
- **No backend yet**: Frontend-only. Backend Python (FastAPI) from original not ported — Express scaffold available for Node.js API routes when needed

## Product

CAEOS is a Constitutional AI Engineering Operating System — a governance kernel that prevents architectural collapse, AI hallucinations, and security regressions. Features:
- Landing page with hero + 3 feature cards
- Interactive Wizard (4-phase decision-making flow)
- Constitution page (21 constitutional laws, bilingual)
- Dashboard (system status, layer health, recent decisions)
- Full bilingual Arabic (RTL) + English (LTR) with language toggle

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- The app defaults to Arabic (RTL). Language is toggled via the top-left button.
- Use `import` (not `require`) for JSON messages — Vite is ESM-only.
- The original Python/FastAPI backend was NOT ported. The Express scaffold is available if a Node.js backend is needed.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
