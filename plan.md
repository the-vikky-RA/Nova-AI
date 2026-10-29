# Nova AI — implementation and design plan

## Scope

Nova AI is a premium AI workspace organized around one persistent shell: a responsive left rail for navigation, a focused main workspace, and a small utility rail for account state and context. The first deliverable prioritizes the dashboard and chat loop, with credible entry points for Image Studio, Document AI, Code Assistant, Voice Assistant, history, and settings. Chat uses the project-provided Manus AI service through a server-side tRPC procedure when available. Image, document, and voice surfaces are clearly labeled as setup-aware workspaces until their corresponding service/storage pipelines are configured; no fake results are shown.

## Architecture

- `client/src/pages/Home.tsx`: application shell, route-like section switching, dashboard, chat, feature workspace cards, history, and settings views.
- `client/src/index.css`: Nova-specific tokens, responsive layout, atmospheric background, focus states, and motion.
- `client/src/App.tsx`: dark-first theme provider and route entry.
- `server/routers.ts`: public chat procedure with bounded input and server-side Manus API call; auth routes remain supplied by the starter.
- `server/_core/env.ts`: existing environment access, including `MANUS_API_URL` and `MANUS_API_KEY`.
- `drizzle/schema.ts` and `server/db.ts`: supplied user schema remains available for authenticated expansion; this first pass keeps guest conversation state local and avoids writing sensitive text into storage without a conversation schema and ownership rules.
- `public/manus-routes.json`: declared page routes for the managed preview crawler.
- `README.md`: setup, real-service behavior, and known limitations.

## Design

### Style options

- **Midnight Instrument Panel** — 0.07: an editorial dark workspace with measured chrome, compact labels, and a glowing signal as the only expressive accent.
- **Aurora Glass Atelier** — 0.06: a gallery-like interface with soft translucent cards, blurred color fields, and more visible atmospheric depth.
- **Monochrome Mission Control** — 0.05: a near-black operations console with strict grids, dense data hierarchy, and restrained color coding.

### Chosen movement: Midnight Instrument Panel

Nova should feel like a trusted instrument for thinking, not a toy or a generic chatbot. The visual language is a dark editorial control room: precise typography, quiet borders, subtle depth, and one living orb that signals the AI presence.

### Core principles

1. **Signal over spectacle** — use blue-violet light to direct attention, not to fill every surface.
2. **Calm density** — pair spacious hero areas with compact metadata and clear next actions.
3. **One continuous workspace** — navigation changes the work mode without breaking the product shell.
4. **Honest capability** — loading, demo, and setup states are explicit and useful.

### Color philosophy

#080B14 is the quiet base, with #101525 for secondary zones and #141B2D for cards. #6C63FF is Nova's signature indigo-violet signal and #00D4FF is used sparingly for live/available states. #F5F7FF is reserved for primary intent; #A3ADC2 carries supporting context; #283149 defines boundaries without hard boxes.

### Layout paradigm

Use a left-aligned rail and a wide, readable work canvas rather than a centered marketing grid. The dashboard starts with a calm top bar, a large prompt composition, then branches into recent work and capability shortcuts. Mobile collapses the rail into a compact top bar and a horizontal mode selector.

### Signature elements

- A small four-point Nova mark paired with a thin indigo-to-cyan signal line.
- A softly breathing AI orb with layered radial rings and no distracting particle field.
- Tiny uppercase eyebrow labels and status pills that make the interface feel instrument-like.

### Interaction philosophy and animation

Every interactive element should provide immediate feedback: hover lift is 1–2px, active surfaces brighten their border, and sending a message transitions the prompt into the chat workspace. Use 180–240ms ease-out transitions. The orb uses a slow 5–6s breathing loop; loading uses a restrained pulse; avoid scroll hijacking and avoid decorative motion on mobile when it adds no clarity.

### Typography

Use Inter for interface text with a clear hierarchy: 12px uppercase tracking for metadata, 14px labels, 15–16px body, 20–28px section titles, and a 48–64px dashboard statement on desktop that scales to 34px on mobile. Use a monospaced face only for capability metadata and code previews.

### Brand essence and voice

Nova is a composed AI workspace for people who move between ideas, documents, code, and creative work. Personality: precise, curious, quietly confident.

Headlines should be direct and invitational: “Make space for the next idea.” CTAs should feel like motion: “Open a new thread” and “Explore the studio.”

### Wordmark and signature color

The wordmark uses `Nova` in a high-contrast semibold treatment with a four-point star mark that aligns to the x-height. The ownable brand color is `#6C63FF`, a balanced indigo that feels intelligent and premium without the urgency of pure electric blue.

## Data and service boundaries

- Chat requests are validated with zod and sent server-side to `$MANUS_API_URL/v1/chat/completions` using `$MANUS_API_KEY`; absent credentials produce a clear setup response, not fabricated assistant text.
- Guest UI state is held in memory/local storage only for temporary non-sensitive mock history. Persistent authenticated conversations remain a documented next step until schema and ownership rules are added.
- Image Studio, Document AI, and Voice Assistant expose ready-to-configure UI states and explain what is unavailable; they do not claim to have generated, extracted, or recognized anything without a backing call.
- Manus OAuth remains the supplied authentication provider and is surfaced through the profile/login action.

## Build workflow

Implement the shell and styles first, add the chat procedure and UI state transitions second, then run TypeScript checks and the production build. Start the managed dev server after meaningful content exists, verify `/api/health` and `/manus-routes.json`, review diagnostics, and checkpoint the completed changes to the canonical repository.
