# CAEOS — Constitutional AI Engineering Operating System

## ما هو المشروع؟

CAEOS هو نظام حوكمة هندسية مدعوم بالذكاء الاصطناعي. ليس مساعداً في كتابة الكود — بل هو **نواة دستورية** تمنع الانهيار المعماري وتحافظ على السيادة البشرية في كل قرار هندسي.

## الوضع الحالي للكود

| المكوّن | الحالة |
|---|---|
| واجهة المستخدم الويب (React + Vite) | ✅ تعمل — ثنائية اللغة (عربي/إنجليزي) |
| معالج AI حقيقي (Wizard) | ✅ يعمل — يحلل مشروعك باستخدام GPT + القوانين الدستورية |
| الـ Backend (Express 5) | ✅ يعمل — routes: `/api/wizard/sessions`, `/api/openai/conversations` |
| قاعدة البيانات (PostgreSQL + Drizzle) | ✅ تعمل — جداول: `conversations`, `messages` |
| OpenAI Integration | ✅ مُفعَّل — Replit AI proxy, بدون API key خاص |
| تطبيق الموبايل (Expo) | ✅ يعمل — 4 tabs يعكس الويب |

## كيف يعمل الـ Wizard الحقيقي

1. المستخدم يصف مشروعه بحرية (أي لغة)
2. الـ Backend يُنشئ session في قاعدة البيانات
3. GPT-5.4 يستخدم **21 قانوناً دستورياً** كـ system prompt
4. CAEOS يحلل المشروع ويطرح أسئلة عميقة واحدة بواحدة (P2 — Deep Interrogation)
5. التوصيات مبنية على مشروع المستخدم الفعلي — ليست إجابات ثابتة
6. كل المحادثات محفوظة في PostgreSQL

## مقارنة فروع GitHub

| | `frontend-init` (المصدر الأصلي) | `main` (هذا المشروع) |
|---|---|---|
| Backend | Python + FastAPI + LangChain + CrewAI | Node.js + Express 5 ✅ |
| AI | Multi-agent: 15 Python agents | OpenAI GPT-5.4 + CAEOS system prompt ✅ |
| DB | SQL schema + seed data | PostgreSQL + Drizzle ORM ✅ |
| Frontend | Next.js 15 | React + Vite ✅ |
| Mobile | لا يوجد | Expo companion app ✅ |
| اللغة | عربي/إنجليزي | عربي/إنجليزي ✅ |

`frontend-init` هو المصدر الأصلي بـ Python multi-agent system.
`main` (هذا المشروع) هو إعادة بناء كاملة بـ Node.js مع نفس الرؤية الدستورية.

## Run & Operate

- `pnpm --filter @workspace/caeos run dev` — تشغيل الـ Frontend (Vite dev server)
- `pnpm --filter @workspace/api-server run dev` — تشغيل الـ API server (port 5000/8080)
- `pnpm run typecheck` — typecheck كامل
- `pnpm run build` — typecheck + build
- `pnpm --filter @workspace/api-spec run codegen` — إعادة توليد API hooks من OpenAPI spec
- `pnpm --filter @workspace/db run push` — push تغييرات DB (dev only)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite، Routing: wouter
- i18n: custom context-based (Arabic RTL default + English LTR)
- API: Express 5 — routes فعّالة: `/api/wizard`, `/api/openai`, `/api/healthz`
- DB: PostgreSQL + Drizzle ORM — جداول: `conversations`, `messages`
- AI: OpenAI GPT-5.4 عبر Replit AI Integrations proxy
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle for API server)
- Mobile: Expo (React Native) — 4 tabs

## API Endpoints

| Method | Path | الوظيفة |
|---|---|---|
| GET | `/api/healthz` | health check |
| POST | `/api/wizard/sessions` | إنشاء session جديد بوصف المشروع |
| GET | `/api/wizard/sessions/:id` | جلب session مع كل الرسائل |
| POST | `/api/wizard/sessions/:id/messages` | إرسال رسالة والحصول على رد AI (SSE streaming) |
| GET | `/api/openai/conversations` | قائمة كل المحادثات |
| POST | `/api/openai/conversations` | إنشاء محادثة عامة |
| POST | `/api/openai/conversations/:id/messages` | إرسال رسالة عامة (SSE streaming) |

## Where things live

- `artifacts/caeos/` — React + Vite frontend (preview path: `/`)
- `artifacts/caeos-mobile/` — Expo mobile companion (preview path: `/caeos-mobile`)
- `artifacts/api-server/` — Express API server (preview path: `/api`)
- `artifacts/api-server/src/routes/wizard/` — **CAEOS Wizard AI routes** ⭐
- `artifacts/api-server/src/routes/openai/` — OpenAI generic routes
- `artifacts/caeos/src/pages/wizard.tsx` — **Wizard Frontend مع AI chat** ⭐
- `artifacts/caeos/src/pages/` — home, dashboard, constitution
- `lib/db/src/schema/` — conversations.ts, messages.ts
- `lib/api-spec/openapi.yaml` — API contract
- `lib/integrations-openai-ai-server/` — OpenAI SDK wrapper

## القوانين الدستورية الـ 21 (system prompt المُفعَّل)

المُضمَّنة في `artifacts/api-server/src/routes/wizard/index.ts` كـ `CAEOS_SYSTEM_PROMPT`:
1. ممنوع كتابة كود قبل تحليل النوايا
2. ممنوع الافتراض غير المؤكد ... (21 قانوناً)

## User preferences

- المشروع ثنائي اللغة: عربي (RTL) افتراضي + إنجليزي
- الـ Wizard يجب أن يعمل بـ AI حقيقي وليس بيانات ثابتة
- يجب الرجوع إلى `frontend-init` branch لفهم الرؤية الأصلية

## Gotchas

- الـ App تبدأ بالعربية (RTL). اللغة تُغيَّر عبر الزر في أعلى اليسار.
- الـ Wizard الآن يستخدم AI حقيقي — يحتاج API server يعمل
- استخدم `import` (مش `require`) للـ JSON messages — Vite هو ESM فقط.
- BASE_URL في الـ Frontend يُضاف قبل كل fetch للـ API — لا تستخدم `/api/...` مباشرة

## Pointers

- See the `pnpm-workspace` skill for workspace structure
- `frontend-init` branch: https://github.com/oculusegypt/CAEOS-Sovereign-Architect/tree/frontend-init
