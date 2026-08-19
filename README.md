# NyayaSetu (Legal-Assistant)

Citizen-first legal assistance prototype for India. AI helps people understand documents and situations. It does not replace qualified legal professionals.

**Phase 1** is a polished front-end with mock data. There is no Firebase, Gemini, OCR, or live lawyer marketplace.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Demo sign-in: any email works. A sample citizen (`Meera Iyer`) and three fictional cases load in the browser.

## Journey

Landing → Sign in → Dashboard → New case → Upload/describe → Processing → Analysis → Find an advocate → Profile

## Architecture

- `app/` routes and layouts
- `components/` UI and feature views
- `domain/` typed models
- `services/` interfaces; `services/mock/` is the Phase 1 implementation
- `data/mocks/` demo cases, analyses, and advocate profiles

Swap `services/index.ts` later for Firebase Auth, Firestore, Storage, and Gemini.

## Scripts

- `npm run dev` — development
- `npm run build` — production build
- `npm run lint` — ESLint
