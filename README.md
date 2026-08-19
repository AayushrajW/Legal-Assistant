# NyayaSetu (Legal-Assistant)

Citizen-first legal assistance prototype for India. AI helps people understand documents and situations. It does not replace qualified legal professionals.

See **[docs/PHASE1_IMPLEMENTATION_PLAN.md](docs/PHASE1_IMPLEMENTATION_PLAN.md)** for product scope and Phase 1 architecture.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Default mode is **mock**: any email signs in, cases stay in the browser, explanations are sample data.

## Phase 2 (opt-in)

Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_DATA_SOURCE=firebase` plus the `NEXT_PUBLIC_FIREBASE_*` keys — real accounts, Firestore cases, Storage uploads. Deploy `firebase/firestore.rules` and `firebase/storage.rules`.
- `NEXT_PUBLIC_AI_PROVIDER=gemini` plus server `GEMINI_API_KEY` — `/api/ai/analyze` and `/api/ai/chat` call Gemini. The key never ships to the browser.

You can turn on Gemini without Firebase, or Firebase without Gemini. The UI still says NyayaSetu is not a lawyer.

Not in this slice: lawyer portal, matching, consultations, payments, OCR pipeline beyond sending the file to Gemini, Hindi UI.

## Journey

Landing → Sign in → Dashboard → New case → Upload/describe → Processing → Analysis → Find an advocate → Profile

## Architecture

- `app/` routes, including `app/api/ai/*`
- `components/` UI
- `domain/` models + Zod schema for model JSON
- `services/` interfaces
- `services/mock/` local prototype
- `services/firebase/` Auth, Firestore, Storage
- `services/gemini/` client wrappers around the API routes
- `services/index.ts` composition root

## Scripts

- `npm run dev` — development
- `npm run build` — production build
- `npm run lint` — ESLint
