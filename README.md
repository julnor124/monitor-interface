# Monitor Interface

View-only TV interface built with React, TypeScript, and Vite.

## Quick Start

```bash
npm install
npm run dev
```

## Runtime Modes

The app supports mock or backend-backed data adapters.

- `VITE_USE_MOCK_API` - `true` (default) uses `*MockApi` adapters
- `VITE_API_BASE_URL` - base URL for HTTP adapters (default `/api`)

Example:

```bash
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=https://your-backend.example.com/api
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests (Vitest)
- `npm run typecheck` - Run strict TypeScript checks (`tsc --noEmit`)

## Quality Gate

```bash
npm run typecheck && npm run lint && npm run test && npm run build
```

## Architecture

The app is structured as feature-first modules with a dedicated app shell.

```text
src/
  app/
    App.tsx
    layout/
    providers/
  features/
    commander/
      types.ts
      components/
      hooks/
    passes/
      api/
      components/
      hooks/
      types.ts
    signal/
      api/
      components/
    tracking/
      api/
      components/
      hooks/
    ui/
      components/
      hooks/
  shared/
    components/
  test/
```

### Boundary Rules

- `src/app` contains shell concerns only (stage/layout/providers).
- Feature logic stays inside `src/features/<feature>`.
- API boundaries live in feature `api` modules:
  - `contracts.ts` (runtime schemas via zod)
  - `mappers.ts` (DTO to view model)
  - `*Api.ts` (feature interface)
  - `*MockApi.ts` (mock implementation)
- Reusable cross-feature UI belongs in `src/shared/components`.

## Backend Integration

Detailed backend documentation is available in:

- `docs/backend-integration-playbook.md`

This includes endpoint expectations, DTO contracts, error handling, rollout strategy, and testing guidance.

## Display Notes (TV Target)

- Designed for a fixed `1920x1080` canvas.
- `TvStage` applies uniform scaling and letterboxing while preserving pixel layout.
- Interface is view-only (no interactive control flow).
