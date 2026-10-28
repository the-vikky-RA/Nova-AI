# Nova AI delivery TODO

## 1. Premium responsive application shell and dashboard

- [x] Nova AI loads as a polished product, not a placeholder chatbot.
- [x] The dashboard includes Nova branding, the tagline “One AI. Infinite Possibilities.”, a personalized greeting, the heading “What can I help you create today?”, the subtitle “Ask anything. Create anything. Explore everything.”, a large prompt composer, send/voice/attachment controls, quick-access feature cards, recent conversations, suggested prompts, and profile/settings access.
- [x] The visual system uses the requested dark navy/black base, indigo and cyan accents, restrained glassmorphism, consistent rounded corners, accessible contrast, and responsive behavior for mobile, tablet, laptop, and desktop.
- [x] Navigation works between Home, Chat, Image Studio, Document AI, Code Assistant, Voice Assistant, History, and Settings without horizontal overflow.

## 2. Chat interaction and honest AI service state

- [x] Users can submit multiline text from the dashboard or Chat view and see their user message, loading state, assistant response, error state, and a clear retry path.
- [x] Chat responses render Markdown-like formatting, show copy actions, and preserve the conversation title and message sequence in the current session.
- [x] The server validates chat input and keeps platform API credentials server-side; it calls the configured Manus LLM service when available.
- [x] Missing AI credentials or empty service output produce a helpful setup/unavailable state and never a fabricated AI result.

## 3. Capability workspaces

- [ ] Image Studio includes prompt editing, style selection, aspect-ratio selection, a generation action, gallery/history structure, and explicit unavailable/setup handling when the image service is not wired.
- [ ] Document AI includes PDF/text upload affordances, file validation messaging, selected-file state, processing state, and explicit extraction/summarization setup boundaries.
- [x] Code Assistant includes language selection, generate/explain/debug intent controls, a code-oriented prompt area, and a clear statement that arbitrary submitted code is not executed.
- [x] Voice Assistant includes microphone/listening/processing/error states and does not claim successful transcription or speech when browser/API support is unavailable.

## 4. History, settings, and authentication entry points

- [x] History includes search, date-grouped conversation rows, open/delete affordances, and a guest-session limitation message where durable persistence is not configured.
- [ ] Settings includes profile, theme, language, notifications, personalization, privacy/data controls, and sign-out/login entry points.
- [x] Supplied Manus OAuth/session behavior remains intact and is never replaced with a simulated user.

## 5. Project readiness and verification

- [x] `client/public/manus-routes.json`, README, environment guidance, and `.gitignore` are present and synchronized with the implemented routes.
- [x] TypeScript diagnostics and `pnpm check` complete without actionable errors.
- [x] The production build completes successfully.
- [x] `/api/health` and `/manus-routes.json` respond successfully from the running app.
- [x] Known limitations and exact configuration steps are documented before delivery.
