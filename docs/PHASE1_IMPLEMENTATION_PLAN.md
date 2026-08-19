# NyayaSetu — Phase 1 Implementation Plan

**Product name (proposed):** NyayaSetu  
**Working title in repo:** Legal-Assistant  
**Phase:** 1 — Citizen journey front-end prototype (~40% MVP)  
**Status:** Plan only. No application code in this revision.

---

## 0. Repository inspection

### Current state

| Item | Finding |
|------|---------|
| Git | Single commit on `main`: `Initial commit` |
| Contents | `README.md` with heading `# Legal-Assistant` only |
| Package manager / lockfile | None |
| Framework / TypeScript / Tailwind | Not present |
| Tests, CI, env files | None |

This is a **greenfield** repository. Stack, folder layout, and design system are unconstrained by existing code.

### Implications

- Scaffold Next.js (App Router) + TypeScript + Tailwind from scratch.
- Do not retrofit an older Pages Router or CSS-in-JS stack.
- Product copy should use **NyayaSetu** in the UI; keep the GitHub repo name unless renamed later.

---

## 1. Product framing (Phase 1)

NyayaSetu helps Indian citizens make sense of confusing legal documents and situations. AI assists with understanding, extraction, explanation, and conversation. The product **must not** present itself as a lawyer, law firm, or substitute for qualified professionals.

**Always visible (product principle):** short, persistent disclaimer — e.g. “NyayaSetu explains and organises information. It is not a lawyer and does not give legal advice.”

### In scope (Phase 1)

A polished, mobile-first **citizen** prototype:

1. Professional landing page  
2. Authentication UI (sign in / sign up / forgot password)  
3. Citizen dashboard  
4. Case creation flow  
5. Document upload interface  
6. Problem description interface  
7. Document processing / loading experience  
8. Case analysis dashboard (full section set below)  
9. AI assistant UI  
10. Case history  
11. Lawyer discovery **preview** (browse/filter mock lawyers; no matching marketplace)  
12. Lawyer profile page (read-only citizen view)  
13. Responsive mobile + desktop layouts  
14. Reusable design system / components  
15. Mock data layer replaceable later by Firebase / Gemini  
16. Clear architecture for future Firebase + AI + lawyer matching  

### Out of scope (Phase 1)

- Real Firebase Auth, Firestore, Storage, Cloud Functions  
- Real Gemini (or any LLM) calls  
- Real OCR / PDF parsing pipelines  
- Lawyer portal (profile editor, case inbox, accept/decline, messaging)  
- Payments, consultations, scheduling, ratings persistence  
- Matching algorithm / ranking service  
- Multi-language UI (structure for i18n; English-first copy with Indian legal context)  
- Real legal research, statute databases, or citation verification  
- Admin / CMS  

### Core case analysis UI (must exist on the analysis page)

| Section | Purpose |
|---------|---------|
| Case overview | Title, type, status, created date, parties if known |
| What is this document/problem? | Plain-language summary |
| Key information | Facts extracted into a scannable list |
| Important clauses | Only when a document is present |
| Obligations | What the citizen may need to do / what others must do |
| Risks / attention points | Amber/red semantic treatment |
| Deadlines | Dates with relative urgency |
| Missing information | Gaps that block a fuller picture |
| Evidence / documents | Checklist of what they have vs. should gather |
| Relevant legal information | High-level, **demo-labeled**, not presented as verified law |
| Sources | Authoritative *types* of sources (e.g. “NALSA”, “eCourts”) as **placeholders**, not fake citations of real statutes as if researched |
| Next steps | Practical, ordered, citizen-scale actions |
| Questions to ask a lawyer | Prepared questions |
| Ask AI | Conversational panel bound to this case |

**Legal integrity rule:** Demo cases are clearly fictional. Labels such as “Demo case”, “Sample analysis”, “Not verified legal research”. Do not invent real case law holdings, fake section numbers as if they apply to the user’s facts, or “you will win” language.

---

## 2. Proposed tech stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 15** (App Router) | Routing, layouts, future server actions / API routes for Gemini & Firebase |
| Language | **TypeScript** (strict) | Typed domain models across UI and services |
| UI | **React 19** | Matches current Next.js |
| Styling | **Tailwind CSS v4** | Design tokens via theme; no extra CSS runtime |
| Fonts | **Source Serif 4** (headings, limited) + **Source Sans 3** or **IBM Plex Sans** (UI) | Readable, civic/professional; avoid Inter-as-AI-startup default if a distinctive pair works |
| Icons | **lucide-react** | Consistent, accessible SVGs |
| Forms | **React 19** controlled forms + native validation first; add **react-hook-form** + **zod** only if multi-step case creation needs it | Avoid extra deps unless the wizard complexity justifies them |
| Dates | **Intl** / native `Date` | Indian locale (`en-IN`); no date library unless timezone edge cases appear |
| Testing (Phase 1 light) | **Vitest** + **Testing Library** (optional first slice: domain types + mock repos) | Keep CI honest without blocking UX work |
| Lint / format | ESLint (Next config) + Prettier | Standard |

**Explicitly not in Phase 1:** Firebase SDK in production paths, Genkit/Vertex, Redux, TanStack Query (can add when live APIs exist), shadcn unless we adopt its primitives as the design-system base (see §7).

**Recommended design-system approach:** Custom primitives on Tailwind (not a heavy component library). Optionally **copy** a small set of shadcn-style primitives (Button, Dialog, Sheet, Tabs) and restyle them to NyayaSetu tokens — do **not** keep default shadcn look.

---

## 3. Folder structure

```
/
├── app/
│   ├── (marketing)/
│   │   ├── layout.tsx                 # public chrome: header + footer
│   │   ├── page.tsx                   # landing
│   │   └── lawyers/[id]/page.tsx      # public-ish lawyer profile (or under app)
│   ├── (auth)/
│   │   ├── layout.tsx                 # centered auth shell
│   │   ├── sign-in/page.tsx
│   │   ├── sign-up/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── (citizen)/
│   │   ├── layout.tsx                 # app shell: nav, disclaimer, user
│   │   ├── dashboard/page.tsx
│   │   ├── cases/
│   │   │   ├── page.tsx               # case history
│   │   │   ├── new/page.tsx           # create case wizard
│   │   │   └── [caseId]/
│   │   │       ├── page.tsx           # analysis dashboard
│   │   │       ├── processing/page.tsx
│   │   │       └── assistant/page.tsx # optional dedicated Ask AI route; or overlay
│   │   └── lawyers/
│   │       ├── page.tsx               # discovery preview
│   │       └── [lawyerId]/page.tsx
│   ├── layout.tsx                     # root: fonts, providers
│   └── globals.css
├── components/
│   ├── ui/                            # design-system primitives
│   ├── marketing/
│   ├── auth/
│   ├── layout/                        # AppHeader, Sidebar, MobileNav, DisclaimerBar
│   ├── cases/                         # wizard, upload, analysis sections
│   ├── assistant/
│   └── lawyers/
├── domain/
│   ├── case.ts                        # types + pure helpers (status, urgency)
│   ├── document.ts
│   ├── analysis.ts
│   ├── lawyer.ts
│   ├── user.ts
│   └── chat.ts
├── services/
│   ├── types.ts                       # repository / service interfaces
│   ├── mock/                          # Phase 1 implementations
│   └── index.ts                       # composition root (which impl to use)
├── data/
│   └── mocks/                         # JSON-like TS fixtures (demo cases, lawyers)
├── lib/
│   ├── cn.ts
│   ├── format.ts                      # dates, INR-free; en-IN
│   └── constants.ts                   # disclaimers, nav items
├── hooks/                             # thin UI hooks wrapping services
├── public/
│   └── demo/                          # sample PDF placeholders, avatars
├── docs/
│   └── PHASE1_IMPLEMENTATION_PLAN.md
└── README.md
```

**Rules**

- `app/` = routes and layout composition only. No business rules in page files beyond wiring.
- `components/` = presentation. Props in, events out.
- `domain/` = types and pure functions (e.g. `deadlineUrgency(date)`).
- `services/` = async I/O contracts. Pages/hooks never import `data/mocks` directly.
- `data/mocks` = fixtures only.

---

## 4. Component architecture

### 4.1 Design-system primitives (`components/ui`)

Build these first; all product UI composes them.

| Component | Notes |
|-----------|--------|
| `Button` | Variants: primary, secondary, ghost, danger, ai (purple accent, used sparingly) |
| `IconButton` | 44px min touch target on mobile |
| `Input`, `Textarea`, `Select`, `Checkbox`, `Radio` | Label always visible; error text; `aria-*` |
| `FileDropzone` | Keyboard-activable; file type hints; progress |
| `Badge` | Semantic: info, success, warning, urgent, demo, ai |
| `Card` | Restrained radius (~8–12px), subtle border, no glass |
| `Section` | Title, optional helper, optional “Learn more” disclosure |
| `EmptyState` | Illustration-free or simple line icon + one CTA |
| `Alert` | Inline, not toast-only; role="alert" for errors |
| `Skeleton` | Analysis loading |
| `Tabs` / `Accordion` | Progressive disclosure |
| `Stepper` | Case creation |
| `Modal` / `Sheet` | Sheet on mobile for Ask AI |
| `Toast` | Non-blocking success only; errors stay on page |
| `Disclaimer` | Compact, always available |

### 4.2 Feature components (not giant pages)

**Landing:** `Hero`, `HowItWorks`, `TrustAndLimits`, `WhoItsFor`, `SampleJourney`, `Footer`.

**Auth:** `AuthCard`, `AuthForm` (mode prop: sign-in | sign-up | forgot).

**Citizen shell:** `SidebarNav` (desktop), `BottomNav` or `TopBar + MenuSheet` (mobile), `UserMenu`.

**Dashboard:** `WelcomeHeader`, `PrimaryCtaCreateCase`, `RecentCasesList`, `ContinueAnalysisCard`, `HelpStrip` (legal aid / official help pointers — not a marketplace).

**Case creation wizard (3–4 steps):**

1. `CaseIntakeChoice` — “I have a document” / “I can describe the problem” / both  
2. `DocumentUploadPanel`  
3. `ProblemDescriptionPanel` (guided prompts: what happened, where, when, who, what you want)  
4. `CaseReviewSubmit` — confirm + disclaimer acknowledgement  

**Processing:** `ProcessingTimeline` (queued → reading document → extracting → drafting explanation) with **honest copy**: “Simulated processing for this demo” when using mocks.

**Analysis dashboard:**

- `AnalysisHeader` (title, demo badge, status)  
- `DocumentPreview` (desktop split; mobile: tab “Document” vs “Analysis”)  
- One component **per section** listed in §1 (e.g. `ObligationsList`, `DeadlineList`, `SourcesList`, `NextStepsList`)  
- `AnalysisSectionNav` — jump links on desktop; compact select/accordion on mobile  
- `AskLawyerQuestions`  
- `AskAiPanel` — persistent on desktop right or bottom sheet on mobile  

**Assistant:** `ChatThread`, `ChatComposer`, `SuggestedPrompts`, `MessageDisclaimer`.

**Lawyers preview:** `LawyerFilters` (practice area, city, language — client-side on mock data), `LawyerCard`, `LawyerProfile` (bio, areas, languages, jurisdictions, “Request consultation” **disabled or demo-modal**: “Matching and consultations come in a later release”).

### 4.3 State and data flow

```
Page (RSC or client wrapper)
  → hook (useCase, useCaseAnalysis, useChat)
    → CaseService / AnalysisService / ChatService (interface)
      → MockCaseRepository (Phase 1)
```

- Prefer **React Server Components** for static marketing and for reading mock data on first paint where it does not hurt interactivity.
- Client components for upload, wizard, chat, filters.
- No global store in Phase 1. URL + React state + service layer is enough.
- Case analysis is **read from mock repo by `caseId`**. Chat history is in-memory per session (mock), keyed by case id, documented as non-persistent.

### 4.4 Accessibility

- Skip link to main content  
- Focus rings on all interactive elements  
- Headings in order on analysis page  
- Lists announced as lists  
- Urgency: text (“Due in 3 days”) + icon + colour  
- `prefers-reduced-motion` on processing animation  
- Contrast: navy on warm white meeting WCAG AA  

---

## 5. Data models

All types live in `domain/`. Optional fields stay optional; UI must handle missing data (empty section with “Not found in this document / description”).

```ts
// Identity (Phase 1 mock user)
type UserId = string;
type CaseId = string;
type DocumentId = string;
type LawyerId = string;

type UserRole = "citizen"; // "lawyer" reserved; unused in Phase 1 routes

interface User {
  id: UserId;
  role: UserRole;
  displayName: string;
  email: string;
  preferredLanguage: "en"; // i18n hook later
}

type CaseStatus =
  | "draft"
  | "processing"
  | "ready"
  | "needs_more_info"
  | "error";

type CaseSource = "document" | "description" | "document_and_description";

type MatterCategory =
  | "consumer"
  | "tenancy"
  | "employment"
  | "family"
  | "criminal_complaint" // citizen-side: FIR/notice confusion — handle with extra care copy
  | "property"
  | "documents_id"
  | "other";

interface CaseRecord {
  id: CaseId;
  citizenId: UserId;
  title: string;
  category: MatterCategory;
  source: CaseSource;
  status: CaseStatus;
  createdAt: string; // ISO
  updatedAt: string;
  location?: { city?: string; state?: string };
  isDemo: true; // Phase 1: always true
}

interface UploadedDocument {
  id: DocumentId;
  caseId: CaseId;
  fileName: string;
  mimeType: string;
  byteSize: number;
  kind: "pdf" | "image" | "other";
  /** Phase 1: object URL or /public/demo path — not Firebase Storage */
  previewUrl?: string;
  uploadStatus: "local_only" | "simulated";
}

interface ProblemDescription {
  caseId: CaseId;
  narrative: string;
  whatHappened?: string;
  whenHappened?: string;
  whoInvolved?: string;
  whatOutcomeWanted?: string;
}

type Urgency = "none" | "upcoming" | "soon" | "urgent";

interface DeadlineItem {
  id: string;
  label: string;
  date?: string; // ISO date; omit if unknown
  urgency: Urgency;
  note?: string;
}

interface ClauseItem {
  id: string;
  heading: string;
  plainLanguage: string;
  excerpt?: string; // quoted from demo doc
  whyItMatters?: string;
}

interface ObligationItem {
  id: string;
  actor: "you" | "other_party" | "unclear";
  text: string;
}

interface RiskItem {
  id: string;
  severity: "attention" | "serious";
  text: string;
}

interface MissingInfoItem {
  id: string;
  question: string;
  whyNeeded: string;
}

interface EvidenceItem {
  id: string;
  label: string;
  status: "have" | "missing" | "optional";
}

interface LegalInfoItem {
  id: string;
  title: string;
  summary: string;
  /** Never implied as a live legal opinion */
  verification: "demo_unverified";
}

interface SourceItem {
  id: string;
  label: string; // e.g. "National Legal Services Authority (NALSA)"
  kind: "official_body" | "procedure_guide" | "legislation_portal" | "court_services";
  url?: string; // real public URLs only (nalsa.gov.in, ecourts.gov.in) — not fake papers
  note: string; // "Starting point for official information; not a citation for this case"
}

interface NextStepItem {
  id: string;
  order: number;
  text: string;
  kind: "self" | "official" | "legal_aid" | "lawyer";
}

interface CaseAnalysis {
  caseId: CaseId;
  overview: {
    oneLine: string;
    documentOrProblemType: string;
  };
  plainLanguageSummary: string;
  keyFacts: string[];
  clauses: ClauseItem[];
  obligations: ObligationItem[];
  risks: RiskItem[];
  deadlines: DeadlineItem[];
  missingInformation: MissingInfoItem[];
  evidenceChecklist: EvidenceItem[];
  legalInformation: LegalInfoItem[];
  sources: SourceItem[];
  nextSteps: NextStepItem[];
  questionsForLawyer: string[];
}

type ChatRole = "user" | "assistant" | "system";

interface ChatMessage {
  id: string;
  caseId: CaseId;
  role: ChatRole;
  content: string;
  createdAt: string;
}

interface LawyerProfile {
  id: LawyerId;
  fullName: string;
  enrollmentDisplay?: string; // fictional, labeled demo
  city: string;
  state: string;
  practiceAreas: MatterCategory[];
  languages: string[];
  yearsExperience?: number;
  bio: string;
  consultationNote: string; // "Demo profile — not a real advocate"
  isDemo: true;
}

interface ServiceResult<T> {
  ok: true;
  data: T;
} | {
  ok: false;
  code: "not_found" | "invalid" | "unavailable";
  message: string;
}
```

**Future mapping (do not leak into UI):**

| Domain | Future Firebase / AI |
|--------|----------------------|
| `User` | Firebase Auth + `users/{uid}` |
| `CaseRecord` | `cases/{caseId}` |
| `UploadedDocument` | Storage path + Firestore metadata |
| `CaseAnalysis` | Cloud Function / Gemini structured output written to Firestore |
| `ChatMessage` | `cases/{id}/messages` or Gemini chat session |
| `LawyerProfile` | `lawyers/{id}` + matching service |

---

## 6. Routing structure

| Path | Audience | Purpose |
|------|----------|---------|
| `/` | Public | Landing |
| `/sign-in` | Public | Auth UI |
| `/sign-up` | Public | Auth UI |
| `/forgot-password` | Public | Auth UI |
| `/dashboard` | Citizen | Home |
| `/cases` | Citizen | History |
| `/cases/new` | Citizen | Create flow |
| `/cases/[caseId]/processing` | Citizen | Loading experience |
| `/cases/[caseId]` | Citizen | Analysis |
| `/lawyers` | Citizen | Discovery preview |
| `/lawyers/[lawyerId]` | Citizen | Profile |

**Auth behaviour (Phase 1):** Mock session. “Sign in” sets a cookie/local flag and a demo user. Do **not** mimic Firebase error codes or security rules. UI copy: “Demo sign-in — accounts are not stored on a server yet.”

**Middleware:** Optional gate: unauthenticated users hitting `/dashboard` redirect to `/sign-in`. Marketing stays public. Lawyer routes in Phase 1 are citizen-readable previews (no `/lawyer/*` portal).

**Deep links:** Analysis sections via hash (`#deadlines`) for desktop jump nav.

---

## 7. Design system

### 7.1 Personality

Premium civic fintech × legal-tech: calm, high contrast, generous whitespace, few surfaces. Trust over novelty.

**Avoid:** neon, cyberpunk, heavy glass, dark-first UI, rainbow AI gradients, oversized squircles, dashboard clutter, lorem ipsum.

### 7.2 Colour tokens (semantic)

| Token | Role | Example direction |
|-------|------|-------------------|
| `--color-bg` | Page | Warm off-white (`#F7F5F2` range) |
| `--color-surface` | Cards | `#FFFFFF` with 1px `navy/10` border |
| `--color-ink` | Body text | Near-navy charcoal |
| `--color-primary` | Primary actions, links in nav | Deep navy |
| `--color-info` | Informational callouts | Mid blue |
| `--color-success` | Completed / verified **process** states (not “legally verified”) | Green |
| `--color-warning` | Attention, upcoming deadlines | Amber |
| `--color-danger` | Urgent deadlines, serious risks | Red (rare) |
| `--color-ai` | Ask AI affordances only | Muted purple |
| `--color-demo` | Demo / sample badges | Neutral slate |

Never encode meaning with colour alone (icon + label).

### 7.3 Typography

- **UI / body:** 16px minimum on mobile; 1.5–1.6 line height.  
- **Section titles:** slightly tighter tracking, navy.  
- **Legal excerpts:** serif or monospace-adjacent for quoted clauses, visually distinct from explanation.  
- **Hierarchy:** Overview → summary → details behind accordion “Show clause text”.

### 7.4 Layout

**Mobile:** single column; sticky primary CTA (“Ask a question” / “Create a case”); bottom or hamburger nav; analysis sections stacked; document behind a tab.

**Desktop:** 240–280px sidebar; analysis page 2-column: document preview | analysis; Ask AI as third column (≥1440px) or slide-over.

**Spacing:** 8px grid; cards radius 8–12px; shadows barely there (or none — border only).

### 7.5 Motion

Short (150–250ms) fades for section expand. Processing uses a stepped checklist, not a looping “AI brain” animation.

### 7.6 Content design

- Short sentences; avoid legalese in UI chrome.  
- Indian English where natural (e.g. “advocate”, “legal aid”, “police station”, “notice”).  
- Progressive disclosure: 2–4 lines summary, then “See details”.

---

## 8. Dependencies

### 8.1 Phase 1 install (expected)

```
next
react
react-dom
typescript
tailwindcss @tailwindcss/postcss
lucide-react
clsx (or tailwind-merge)     # class composition
```

**Add if wizard validation gets painful:** `zod`, `react-hook-form`.

**Add if PDF preview is required in-browser:** `react-pdf` / `pdfjs-dist` — only for demo PDFs; images use `<img>`. Fallback: filename + “Preview available in a later version” to avoid a heavy dep.

### 8.2 Dev

```
eslint
eslint-config-next
prettier
# optional: vitest, @testing-library/react, jsdom
```

### 8.3 Explicitly deferred

| Package | When |
|---------|------|
| `firebase` | Phase 2 auth/data |
| `@google/generative-ai` / Vertex | Phase 2 analysis/chat |
| Stripe / Razorpay | Consultations |
| i18n library (`next-intl`) | When Hindi/other languages ship |

### 8.4 Environment

`.env.example` with placeholders only:

```
# PHASE=mock
# FUTURE: NEXT_PUBLIC_FIREBASE_*
# FUTURE: GEMINI_API_KEY (server only)
```

No fake API keys. README explains mock mode.

---

## 9. What to mock (and how honestly)

| Capability | Phase 1 behaviour | What we must not do |
|------------|-------------------|---------------------|
| Auth | Demo user after form submit; client session | Pretend passwords are validated by a real IdP |
| Persistence | In-memory + `localStorage` optional for “my cases” in-session | Silent “saved to cloud” |
| File upload | Accept file, show name/size/preview; store blob URL locally | Fake Storage upload progress to 100% as if on GCS |
| OCR / parse | After “Submit”, navigate to processing, then ready via **timer + mock analysis** | Show extracted text as if OCR ran |
| Legal research | Static `legalInformation` + real **institutional** links | Fake AIR citations, fake section applicability |
| Ask AI | Scripted / retrieval-from-mock-analysis answers + “This is a demo reply” | Streaming tokens that look like a live model without labeling |
| Lawyer discovery | Filter mock `LawyerProfile[]` | “12 lawyers nearby matched your case” as if geo/matching ran |
| Consultations | Modal: coming later | Fake booking calendar |

**Mock service interfaces** (`services/types.ts`):

- `AuthService` — `signIn`, `signUp`, `signOut`, `getSession`  
- `CaseRepository` — `listByCitizen`, `getById`, `createDraft`, `update`  
- `DocumentService` — `attachLocalFile`  
- `AnalysisService` — `getAnalysis(caseId)`; `startProcessing(caseId)` returns a mock job that resolves to `ready`  
- `ChatService` — `list`, `send` (returns canned assistant message)  
- `LawyerRepository` — `list`, `getById`, `listFiltered`  

`services/index.ts`:

```ts
export const authService = mockAuthService;
export const caseRepository = mockCaseRepository;
// later: if (process.env.DATA_SOURCE === "firebase") { ... }
```

**Demo dataset (minimum):**

1. **Tenancy** — fictional rent / eviction notice (Bengaluru or similar)  
2. **Consumer** — fictional defective product / warranty dispute  
3. **Employment** — fictional unpaid wages / appointment letter confusion  
4. **3–6 demo lawyers** — different cities (Delhi, Mumbai, Chennai, Kolkata, Jaipur), areas, Hindi/English/Tamil/etc. languages, all `isDemo: true`

One case should be `needs_more_info` and one `processing` for empty/loading/error stories.

---

## 10. Architecture for Firebase & Gemini (without baking them into UI)

```
components  ──►  hooks  ──►  services/*Service
                                   │
                     ┌─────────────┴─────────────┐
                     ▼                           ▼
              mock/* (Phase 1)         firebase/* | gemini/* (later)
                     │                           │
                     ▼                           ▼
              data/mocks/*.ts          Auth / Firestore / Storage / generateContent
```

**Rules**

- Components never import `firebase` or Gemini SDKs.  
- Analysis UI renders `CaseAnalysis`; it does not know if a model produced it.  
- Chat UI sends `{ caseId, message }` to `ChatService.send`; streaming can be added to the interface later (`AsyncIterable`) without changing section layout.  
- File input produces `File`; `DocumentService` abstracts upload.  
- Feature flags: `DATA_SOURCE=mock | firebase` read only in `services/index.ts`.

**Suggested later API shape (document now, implement later):**

- `POST /api/cases/:id/analyze` → Gemini structured JSON validated with zod → Firestore  
- `POST /api/cases/:id/chat` → server-side Gemini with system prompt: not a lawyer, India, cite uncertainty  
- Firebase Storage security rules: citizen can only write `users/{uid}/cases/{caseId}/**`

---

## 11. Phased implementation plan (within Phase 1)

Work in vertical slices so the app always looks like a product, not a component gallery.

### Slice A — Foundation

1. Scaffold Next.js + TS + Tailwind + folder layout  
2. Tokens, fonts, `globals.css`, `Button`/`Input`/`Card`/`Badge`/`Alert`/`Disclaimer`  
3. Root layout, marketing layout, citizen layout (nav placeholders)  
4. Domain types + mock fixtures (2 cases + analysis + lawyers)  
5. Service interfaces + mock implementations  
6. README: how to run, mock-mode disclaimer  

**Exit:** `/` renders with design tokens; `npm run build` succeeds.

### Slice B — Marketing + auth chrome

1. Landing (hero, how it works, trust/limits, CTA)  
2. Sign-in / sign-up / forgot-password UI + mock session  
3. Route protection for citizen area  

**Exit:** User can “sign in” and land on an empty-but-designed dashboard.

### Slice C — Citizen home + history

1. Dashboard with recent demo cases  
2. `/cases` list: filters by status, empty state, error state  
3. States: loading skeletons, empty, error  

**Exit:** Navigation between dashboard and history feels complete.

### Slice D — Create case + upload + processing

1. Multi-step `/cases/new`  
2. Upload + description UIs (accessible dropzone)  
3. Create mock case → `/cases/[id]/processing` → auto-advance to analysis  
4. Honest demo labeling on processing steps  

**Exit:** Full create → wait → analysis path with a fixture analysis.

### Slice E — Analysis dashboard (quality focus)

1. All required sections as separate components  
2. Desktop split view + mobile tabs  
3. Progressive disclosure, jump nav, semantic colours  
4. Empty subsections when data missing  
5. Document preview for image/PDF-or-fallback  

**Exit:** Analysis page is the portfolio piece of Phase 1.

### Slice F — Ask AI

1. Panel/sheet + thread + composer + suggestions  
2. Mock replies grounded in the open case’s analysis  
3. Persistent “not a lawyer” on every assistant message  

**Exit:** Conversation feels bound to the case, not a generic chatbot.

### Slice G — Lawyer preview

1. `/lawyers` grid + filters  
2. Profile page  
3. Disabled/demo consultation CTA  

**Exit:** Citizens can browse demo advocates without a marketplace.

### Slice H — Polish

1. Keyboard, focus, reduced motion, skip link  
2. Responsive pass (320 / 768 / 1024 / 1440)  
3. Copy pass (no lorem, consistent disclaimer)  
4. Light tests for domain helpers + mock repo  
5. 404 and analysis `not_found` pages  

**Exit:** Phase 1 prototype ready for stakeholder review.

### Order of priority if time is cut

1. Design system + analysis page + mock analysis  
2. Create + processing  
3. Landing + auth + dashboard  
4. Ask AI  
5. Lawyer preview  
6. Extra motion / PDF preview  

---

## 12. Non-functional requirements

- **Performance:** Marketing LCP from static RSC; analysis page may be client-heavy — code-split chat and PDF viewer.  
- **Security (even in mock):** No secrets in client; never log full document text to `console` in a way we’d copy to production.  
- **Legal/UX risk:** Criminal-adjacent demo copy must encourage official channels and legal aid, not “how to evade”.  
- **Browser:** Last two Chrome/Safari/Firefox; iOS Safari is a first-class target.

---

## 13. Success criteria (Phase 1)

A reviewer on a phone can:

1. Understand what NyayaSetu is and what it is **not** from the landing page.  
2. Sign in (demo) and create a case from a document or a story.  
3. See a clear processing state, then a readable analysis with every required section.  
4. Open Ask AI and get a demo answer that does not impersonate an advocate.  
5. Open a lawyer profile and understand that matching is not live.  
6. Never be unsure whether data is demo vs real legal advice.

---

## 14. Next step after this plan

Implement **Slice A** only after this plan is accepted (or adjusted). First code commit: Next.js scaffold + tokens + domain types + mock services, not a single 2,000-line page.
