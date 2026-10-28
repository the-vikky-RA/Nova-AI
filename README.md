# Nova AI

Nova AI is a premium, dark-first AI workspace built with React, TypeScript, Vite, Express, tRPC, and Drizzle. The product shell brings chat, visual exploration, document analysis, code assistance, voice input, history, and settings into one responsive interface.

## Run locally

```bash
pnpm install
pnpm dev
```

The development server listens on `PORT` (default `3000`). Useful checks are:

```bash
pnpm check
pnpm test
pnpm build
```

The managed Webdev project supplies its runtime environment. Server-side AI requests use `MANUS_API_URL` and `MANUS_API_KEY` when those values are available. They are never embedded in the browser. The chat procedure calls the platform's OpenAI-compatible `/v1/chat/completions` endpoint and returns an honest setup or service error when the capability is unavailable.

## Product behavior

The dashboard, navigation, prompt composer, chat state, Markdown-style response rendering, copy actions, Image Studio controls, document validation, code assistant flow, browser voice capability detection, history filtering, settings, and guest-mode boundaries are implemented. Manus OAuth remains the supplied account flow; use the profile or settings actions to sign in.

Image generation, private document extraction, durable authenticated conversation history, and speech-to-text persistence are intentionally guarded behind their service/storage pipelines. The UI labels these boundaries instead of showing fake results. The Code Assistant can call the same server-side AI service for suggestions, but it does not execute submitted code.

## Data and security notes

Guest conversations are kept in the current application session. Durable account-based conversation persistence should be added with an explicit conversation schema, server-side ownership checks, and migrations before storing user content. The managed database and supplied `users` table are available for that next step. Do not add private keys to `.env` files committed to the repository.

## Project structure

- `client/src/pages/Home.tsx` contains the main Nova workspace shell and views.
- `client/src/index.css` contains the Nova design system and responsive layout.
- `server/routers.ts` contains the validated chat procedure and supplied auth routes.
- `server/_core/llm.ts` contains the platform LLM helper.
- `drizzle/` and `server/db.ts` contain the managed database foundation.
- `public/manus-routes.json` declares the managed page routes.
- `plan.md` and `TODO.md` document the design choices and delivery outcomes.
