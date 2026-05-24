# CAEOS — Constitutional AI Engineering Operating System

## ما هو المشروع فعلاً؟

CAEOS هو **واجهة مستخدم أمامية فقط (Frontend Prototype)** — لا يوجد فيه أي ذكاء اصطناعي حقيقي ولا اتصال بخادم. كل البيانات المعروضة ثابتة ومُضمَّنة في الكود.

### ما تراه الآن في التطبيق:
- **الصفحة الرئيسية**: صفحة ترحيبية تعريفية بالنظام — بيانات ثابتة
- **الـ Wizard**: 4 أسئلة ثابتة ومُحدَّدة مسبقاً (نوع التسليم، حجم الفريق، التقنية، اللغة) — التوصيات مُضمَّنة في الكود، لا يوجد ذكاء اصطناعي
- **الـ Constitution**: قائمة ثابتة من 21 قانوناً دستورياً — نص فقط
- **الـ Dashboard**: بيانات وهمية ثابتة (قرارات وهمية، حالات وهمية) — لا يتغير بناءً على أي إدخال حقيقي

### ما لا يوجد حالياً:
- ❌ لا يوجد حقل لإدخال مشروعك أو برومبتك
- ❌ لا يوجد اتصال بـ AI (OpenAI / Anthropic / etc.)
- ❌ القرارات في الـ Dashboard لا تتغير ولا تُحفظ
- ❌ الـ Wizard لا يحلل مشروعك — الأسئلة والتوصيات ثابتة للجميع
- ❌ لا يوجد Backend فعّال (scaffold فارغ فقط)

## الرؤية مقابل الواقع

| الرؤية (ما يُفترض أن يكون) | الواقع الحالي |
|---|---|
| إدخال وصف مشروعك فيتحلله AI | لا يوجد إدخال ولا AI |
| الـ Wizard يسألك أسئلة ذكية بناءً على مشروعك | 4 أسئلة ثابتة لكل المستخدمين |
| الـ Dashboard يعكس قراراتك الفعلية | بيانات وهمية ثابتة في الكود |
| النظام يطبّق القوانين الدستورية على كودك | قائمة نصية فقط، لا تطبيق حقيقي |

## ما يحتاج إلى بناء لجعل النظام حقيقياً

1. **إضافة حقل إدخال** — المستخدم يكتب وصف مشروعه أو يلصق برومبته
2. **ربط بـ AI API** — الـ Wizard يستخدم AI (مثل OpenAI/Anthropic) لتحليل المشروع وطرح أسئلة ذكية
3. **قاعدة بيانات حقيقية** — حفظ القرارات وتتبعها عبر الجلسات
4. **Backend فعّال** — Express scaffold موجود لكن فارغ تماماً

## Run & Operate

- `pnpm --filter @workspace/caeos run dev` — تشغيل الـ Frontend (Vite dev server)
- `pnpm --filter @workspace/api-server run dev` — تشغيل الـ API server (port 5000) — scaffold فارغ
- `pnpm run typecheck` — typecheck كامل
- `pnpm run build` — typecheck + build
- `pnpm --filter @workspace/api-spec run codegen` — إعادة توليد API hooks
- `pnpm --filter @workspace/db run push` — push تغييرات DB (dev only)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite
- Routing: wouter
- i18n: custom context-based (Arabic RTL + English LTR)
- API: Express 5 (scaffold فارغ — لا routes بعد)
- DB: PostgreSQL + Drizzle ORM (scaffold فارغ — لا schema بعد)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle for API server)

## Where things live

- `artifacts/caeos/` — React + Vite frontend (preview path: `/`)
- `artifacts/caeos-mobile/` — Expo mobile companion (preview path: `/caeos-mobile`)
- `artifacts/api-server/` — Express API server (preview path: `/api`)
- `artifacts/caeos/src/pages/` — Page components (home, wizard, dashboard, constitution)
- `artifacts/caeos/src/components/` — Shared UI (Navbar, shadcn/ui)
- `artifacts/caeos/src/context/LocaleContext.tsx` — RTL/LTR locale state
- `artifacts/caeos/src/lib/useTranslations.ts` — i18n hook
- `artifacts/caeos/src/lib/messages/` — Translation files (en.json, ar.json)
- `lib/api-spec/openapi.yaml` — API contract source of truth

## Architecture decisions

- **No next-intl**: Replaced with custom React context + static JSON import (Vite ESM compatible)
- **Default locale Arabic**: App loads in Arabic RTL by default
- **Language toggle**: Persisted to localStorage, switches HTML dir attribute
- **No real backend**: Frontend prototype only. Express scaffold available when needed.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- الـ App تبدأ بالعربية (RTL). اللغة تُغيَّر عبر الزر في أعلى اليسار.
- استخدم `import` (مش `require`) للـ JSON messages — Vite هو ESM فقط.
- الـ Backend الأصلي (Python/FastAPI) لم يُنقل. Express scaffold متاح عند الحاجة.
- **كل البيانات في الـ Dashboard والـ Wizard ثابتة في الكود** — مش حقيقية.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
