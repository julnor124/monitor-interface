# Backend Integration Playbook

This document explains how to connect `monitor-interface` to a real backend while keeping the current feature-first boundaries intact.

## Goals

- Keep UI and feature logic stable while swapping data sources.
- Reuse existing contracts/mappers/API adapters.
- Preserve reliable behavior for a display-critical 1920x1080 TV interface.

## Current Adapter Model

Each feature uses the same adapter pattern:

- `contracts.ts` - runtime DTO validation with `zod`
- `mappers.ts` - convert DTOs into UI-ready view models
- `*Api.ts` - feature API interface
- `*MockApi.ts` - current development implementation
- `*HttpApi.ts` - real backend implementation (already added)

Commander data loading switches by env flags and uses:

- `src/shared/config/runtimeConfig.ts`
- `src/shared/api/httpClient.ts`

## Environment Configuration

Use these variables:

- `VITE_USE_MOCK_API`
  - `true` (default): use mock adapters
  - `false`: use HTTP adapters
- `VITE_API_BASE_URL`
  - Base URL prefix for backend API routes
  - Default: `/api`

Suggested `.env` examples:

```bash
# local mock mode
VITE_USE_MOCK_API=true
VITE_API_BASE_URL=/api
```

```bash
# backend mode
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=https://backend.example.com/api
```

## Expected Endpoints

Current HTTP adapters call:

- `GET /passes/cards`
- `GET /passes/inactive`
- `GET /signal/config`
- `GET /tracking/config`

These are resolved as:

- `${VITE_API_BASE_URL}/passes/cards`
- `${VITE_API_BASE_URL}/passes/inactive`
- `${VITE_API_BASE_URL}/signal/config`
- `${VITE_API_BASE_URL}/tracking/config`

## DTO Contract Expectations

### Pass Cards (`/passes/cards`)

Array of:

- `name: string`
- `passIndex: number` (int, >= 0)
- `passName: string`
- `modeLabel: "PROG" | "TRACK"`
- `seedAz: number`
- `seedEl: number`
- `seedBars: [number, number, number]`
- `forceAlarm?: boolean`

### Inactive Cards (`/passes/inactive`)

Array of:

- `name: string`
- `date: string`
- `time: string`

### Signal Config (`/signal/config`)

Object:

- `labels: [string, string, string]`

### Tracking Config (`/tracking/config`)

Object:

- `azLabel: string`
- `elLabel: string`

## Error Handling and Retry Behavior

All HTTP requests go through `fetchJson(...)` in `src/shared/api/httpClient.ts`.

Behavior:

- Retries transient failures automatically
  - network errors
  - HTTP `429`
  - HTTP `5xx`
- Exponential backoff defaults
  - retries: `2`
  - initial delay: `250ms`
  - multiplier: `2`
- Maps failures into `ApiError`
  - `message`
  - optional `status`
  - optional `causeData`

Commander UI fallback:

- Shows loading panel while first fetch resolves
- Shows `Data unavailable` panel if loading fails

## Rollout Plan

1. **Schema lock**
   - Confirm backend payloads match `contracts.ts` in each feature.
2. **Mock parity**
   - Keep mock and backend responses aligned while backend stabilizes.
3. **Staging switch**
   - Set `VITE_USE_MOCK_API=false` against staging URL.
4. **Visual verification**
   - Check active/upcoming/alarm ordering and countdown behavior on real data.
5. **Production cutover**
   - Flip env in deployment and keep mock fallback available for local/dev.

## Testing Strategy

Before and after backend switch, run:

```bash
npm run typecheck && npm run lint && npm run test && npm run build
```

Recommended backend-specific additions:

- Contract tests against real API responses (or recorded fixtures)
- One smoke test that validates all four endpoints return contract-valid payloads
- Snapshot check for key pass-card visual states with representative backend fixtures

## Operational Notes

- Keep endpoint strings centralized in adapters to avoid drift.
- If API auth is added later, extend `httpClient.ts` once rather than per feature.
- Maintain view-only guarantees in UI even when backend adds additional control fields.
