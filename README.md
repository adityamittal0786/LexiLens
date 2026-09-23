# LexiLens
**AI Legal Document Intelligence**

> *Understand the fine print. Before it matters.*

---

## 1. Problem Statement
Legal agreements are often long, dense, and full of complex phrasing. Freelancers, small business owners, consumers, and non-lawyers routinely encounter contracts—such as master service agreements, non-disclosure agreements, commercial leases, and employment contracts—without having an immediate, affordable way to identify hidden traps, unilateral obligations, or unstated risks before signing.

Traditional approaches either force individuals to sign blindly or rely on generic chatbots that frequently hallucinate non-existent clauses, misquote provisions, or produce misleading legal advice.

---

## 2. Solution & Key Capabilities
**LexiLens** bridges this critical access gap by providing grounded document intelligence. It translates complex legal provisions into plain English, detects one-sided obligations, flags missing terms, compares contract versions, and structures briefing questions for legal counsel.

### Core Workflows:
1. **Document Upload & Extraction**:
   - Securely ingest contracts via text paste or file upload (`.txt`, `.pdf`, `.docx`, `.md`, `.rtf`).
   - Clean, sanitize, and validate document text while stripping malicious control characters.
2. **Plain-English Clause Translation**:
   - Classify clauses into core categories (Payment, Term, Termination, Liability, Indemnification, Intellectual Property, Restrictive Covenants, Dispute Resolution, Governing Law).
   - Provide plain-English summaries, pinpoint who each clause affects, and highlight exact supporting quotes.
3. **Potential Concern Detection**:
   - Detect asymmetric liability, uncapped indemnities, post-termination non-competes, lock-in clauses, and absent payment remedies.
   - Present findings with objective, neutral phrasing (*"Potential concern"*, *"Worth reviewing"*, *"Unclear provision"*).
4. **Before You Sign Scorecard**:
   - Diagnostic review covering auto-renewals, intellectual property transfer triggers, late fees, and dispute mechanisms.
5. **Grounded Document Q&A (Ask Lexi)**:
   - Real-time answers strictly verified against document excerpts.
   - If a topic is not present in the contract, LexiLens explicitly states: *"This topic is not explicitly mentioned or defined anywhere in this contract."*
6. **Side-by-Side Version Comparison**:
   - Contrast draft versions (e.g., V1 vs. V2) to highlight added, removed, and modified provisions.
7. **Lawyer Briefing Packet**:
   - Generate structured questions and executive summaries formatted for consultation with a qualified legal professional.
8. **Action Checklist with Real-Time Sync**:
   - Prioritized task tracking synchronized live across browser tabs using Server-Sent Events (SSE).

---

## 3. System Architecture

```
                                  ┌────────────────────────┐
                                  │   React 19 Frontend    │
                                  │ (Tailwind CSS, Motion) │
                                  └───────────┬────────────┘
                                              │ REST / SSE
                                              ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             Express Backend (server.ts)                          │
├────────────────────────────────┬─────────────────────────────────────────────────┤
│ • Security & Injection Guards  │ • Document Chunking & BM25-style Retrieval     │
│ • File & Payload Sanitizer     │ • Real-Time SSE Broadcast & Synchronization     │
└───────────────┬────────────────┴────────────────────────┬────────────────────────┘
                │                                         │
                ▼                                         ▼
┌───────────────────────────────┐         ┌────────────────────────────────────────┐
│      Google Gemini API        │         │   Deterministic Fallback Engines       │
│     (gemini-2.5-flash)        │         │  (Section Analyzers & Diff Matchers)   │
└───────────────────────────────┘         └────────────────────────────────────────┘
```

- **Frontend**: React 19 SPA built with Vite, TypeScript, Tailwind CSS, Lucide icons, and `motion/react`.
- **Backend**: Node.js and Express (`server.ts`) hosting dedicated proxy routes (`/api/analyze`, `/api/ask`, `/api/compare`, `/api/sync/events`).
- **Real-Time Collaboration**: Server-Sent Events (SSE) provide live state synchronization across multiple client sessions.

---

## 4. Gemini API Integration
LexiLens utilizes `@google/genai` with model `gemini-2.5-flash`:

- **Structured Output Schemas**: All analysis and comparison requests enforce strict JSON schemas (`Type.OBJECT`, `Type.ARRAY`, `Type.STRING`).
- **Temperature Configuration**: Configured with low temperatures (`0.1`–`0.2`) to minimize variance and prevent speculative legal interpretations.
- **Untrusted Content Demarcation**: Contract text is isolated within `<LEGAL_DOCUMENT_UNTRUSTED_CONTENT>` XML boundaries to prevent instruction hijacking.
- **Deterministic Offline Fallbacks**: If API quotas are exceeded or network connectivity drops, LexiLens transitions gracefully to local deterministic heuristics, guaranteeing uninterrupted service.

---

## 5. Security & Prompt Injection Defense

| Security Vector | Defense Implementation |
| :--- | :--- |
| **Prompt Injection** | Strict prompt boundary isolation; system instructions declare document content as untrusted data; heuristic detection of override patterns (`"Ignore previous instructions"`). |
| **File Validation** | Allowed extensions restricted to `.txt`, `.pdf`, `.docx`, `.md`, `.rtf`; maximum file size enforced at 10MB; empty files rejected. |
| **Path Traversal** | Filenames sanitized using `sanitizeFileName()` to eliminate `../`, `..\`, null bytes (`\0`), and control codes. |
| **Data Privacy** | No sensitive document contents are logged; API keys remain server-side; uploaded documents are kept in ephemeral session memory. |
| **XSS Prevention** | Text content rendered using standard React JSX data bindings; raw HTML injection is prevented. |

---

## 6. Automated Testing Suite
LexiLens features a 28-test automated test suite powered by Vitest:

```bash
npm test
```

- **Unit Tests (`src/__tests__/unit.test.ts`)**:
  - Validates file formats, sizes, and empty file rejections.
  - Verifies filename sanitization and directory traversal prevention.
  - Tests text chunking, section boundary detection, and quote verification.
  - Asserts neutral phrasing enforcement and legal disclaimer text.
- **Security Tests (`src/__tests__/security.test.ts`)**:
  - Evaluates prompt injection detection with adversarial inputs.
  - Checks null byte truncation attacks and directory traversal strings.
  - Enforces payload size limits and executable blocking.
- **Integration Tests (`src/__tests__/integration.test.ts`)**:
  - Validates complete `DocumentAnalysis` data structures.
  - Tests end-to-end question retrieval with quote verification.
  - Evaluates document comparison workflows across contract versions.
- **Service Tests (`src/__tests__/services.test.ts`)**:
  - Tests client API services and fallback logic under mock conditions.

---

## 7. Accessibility (WCAG 2.2 AA)
- **Keyboard Navigation**: All interactive elements are focusable via `Tab`, with visible focus rings (`:focus-visible`).
- **Reduced Motion Support**: Respects `@media (prefers-reduced-motion: reduce)` by suppressing transitions for motion-sensitive users.
- **Screen Reader Support**: Chat streams utilize `role="log"` and `aria-live="polite"`. Alert dialogs use `role="alert"`.
- **Semantic HTML**: Proper landmark elements (`<header>`, `<main>`, `<aside>`, `<nav>`, `<footer>`) with touch targets exceeding 44×44px.

---

## 8. Getting Started & Setup

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
# Clone the repository
git clone <repo-url>
cd lexilens

# Install dependencies
npm install

# Configure environment variables
# Copy .env.example and add your Gemini API key (optional - fallback heuristics activate if omitted)
cp .env.example .env
```

### Running Locally
```bash
# Start development server
npm run dev

# Run automated tests
npm test

# Run linter
npm run lint

# Build for production
npm run build
```

---

## 9. Limitations
- **Document Quality**: Analysis quality depends on clear, readable text. Scanned documents with degraded OCR may require retyping.
- **Jurisdictional Context**: LexiLens highlights differences across general common law, India, US, and UK frameworks, but does not provide exhaustive regional regulatory audits.
- **Non-Advisory Scope**: LexiLens does not negotiate on your behalf or provide legal representation.

---

## 10. Legal Disclaimer
**LexiLens provides legal information and document-analysis assistance, not legal advice. For important legal decisions, consult a qualified legal professional.**
