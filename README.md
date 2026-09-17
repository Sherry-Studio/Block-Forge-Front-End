# Block Forge

Block Forge is the first playable title on Sherry Studio's multi-game mobile platform. This
repository is the Alpha frontend: an Expo / React Native / TypeScript app built around a **game
registry** so that adding future titles (Color Shift, Grid Command, Empire Tactic, Neon Raid,
Orbit Rush, Street Pulse, Lost Signal, ...) never requires rewriting Home or the Games Hub.

## Overview

- **Stack**: React Native 0.74 (Expo SDK 51), TypeScript (strict), React Navigation (native
  stack + bottom tabs), Zustand, TanStack Query, MMKV + expo-secure-store, react-native-gesture-
  handler, react-native-reanimated v3, expo-haptics.
- **Gameplay**: an 8x8 grid puzzle. Drag any of 3 tray pieces onto the board, clear full rows/
  columns, and chain combos (up to x8) for a higher score. Classic mode is endless and fully
  offline; Daily Challenge uses a seeded PRNG so every player gets the same board each day.
- **Architecture**: the game engine (`src/game`) is pure, framework-free TypeScript with no React
  dependency, so it is trivially unit-testable and reusable outside of this app if needed. The
  game registry (`src/games/registry.ts`) is the single source of truth for every game on the
  platform; Home and the Games Hub render purely from that data.

## Getting started

```bash
npm install
cp .env.example .env   # fill in values if you have a backend to point at
npm run start           # expo start
```

Then:
- Press `a` to open in an Android emulator, `i` for iOS simulator, or scan the QR code with
  Expo Go on a physical device.
- `npm run android` / `npm run ios` / `npm run web` start directly against that platform.

### Environment variables

See `.env.example`. None are required to run Classic play, which is fully offline. They matter
once the sibling `backend` repo is wired up for catalog sync, leaderboards, and daily challenge
verification:

| Variable | Purpose |
| --- | --- |
| `API_BASE_URL` | Base URL for the backend API |
| `API_DEBUG_LOGGING` | Verbose network logging in dev builds |
| `ANALYTICS_WRITE_KEY` | Analytics/crash reporting key |
| `FEATURE_DAILY_CHALLENGE` / `FEATURE_LEADERBOARD` / `FEATURE_SHOP` | Feature flags |

## Project structure

```
src/
  app/            navigation graph, providers, deep links
  game/           engine.ts, shapes.ts, rng.ts, engine.test.ts — pure, framework-free, reusable
  games/          game registry + per-game modules (blockforge fully implemented; the other 7
                  games are registry-only "coming soon" entries)
  screens/        one folder per route (Home, GamesHub, GameDetail, Play, Profile, ...)
  components/     Board, Cell, TrayPiece, Ghost, ScorePop, ComboBadge, Button, Card, Tag, Sheet,
                  Toggle, EmptyState, ErrorState, LoadingState
  store/          Zustand stores: game.ts, user.ts, catalog.ts, settings.ts
  api/            client.ts (fetch wrapper), queries/ (TanStack Query hooks), outbox.ts
  storage/        MMKV/secure-store repositories — the only code allowed to touch persistence
  theme/          tokens.ts, typography.ts, motion.ts — the single source of design tokens
```

## Game architecture

The engine lives entirely in `src/game/engine.ts` (plus `shapes.ts` and `rng.ts`) and has **zero
React or React Native imports**. It exposes:

- `fits(shape, row, col, board)` / `anyFits(board, tray)` — placement validity checks.
- `originFor(shape, hoverRow, hoverCol)` — centre-anchors and clamps a shape under a hover point.
- `place(state, trayIndex, row, col)` — the only mutation entry point; returns a new `RunState`
  plus the cleared cell indices, score gain, new combo, and whether the run is now over.
- `createRun(seed?)` / `createDailyRun(date?)` — starts a fresh run, optionally from a specific
  seed (daily challenges derive their seed from the UTC calendar date via `mulberry32`).

Scoring: `gain = cells*10 + lines*100*max(1, combo)`. Combo increments by the number of lines
cleared on a scoring placement, resets to 0 on a placement that clears nothing, and caps at x8.
Row and column clears in the same placement count as separate lines.

The UI layer (`src/components/TrayPiece.tsx`, `src/games/blockforge/dragMath.ts`) duplicates the
handful of pure geometry functions (`fits`, `originFor`) as Reanimated worklets so drag/hover
math runs on the UI thread without a JS bridge hop per frame — the board only re-renders when the
hovered cell actually changes, not on every pointer-move event.

See `ARCHITECTURE.md` for the full breakdown, including the exact checklist for adding a new game.

## Testing

```bash
npm test          # runs the Jest suite once
npm run test:watch
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
```

`src/game/engine.test.ts` covers placement validity, single/multi-line clears, combo increment/
reset/cap, the score formula, game-over detection (full board and no-valid-move board), and
seeded RNG determinism — 18 tests, all passing (`npm test`).

## Persistence & offline behavior

- **MMKV** (`src/storage/mmkv.ts`) backs the active run, local stats, streak, settings,
  onboarding flag, and catalog cache — all synchronous, all offline.
- **expo-secure-store** backs the auth token (`UserRepository`) since it's sensitive.
- Components never touch MMKV/secure-store directly; they go through
  `GameRepository` / `ScoreRepository` / `SettingsRepository` / `UserRepository` /
  `RewardRepository`.
- **Outbox** (`src/api/outbox.ts`): mutations attempted while offline (achievement claims, score
  submissions, daily-challenge completion) are queued with an idempotency key and flushed
  newest-first on reconnect.
- Classic play, the tutorial, settings, and statistics are fully usable with no network at all.
  The Daily Challenge screen probes connectivity and falls back to an offline state; the
  Leaderboard screen falls back to the player's local best score when the query fails.

## Building

This Alpha has not been configured for EAS Build yet. Once ready:

```bash
npx eas build --platform android --profile preview
npx eas build --platform ios --profile preview
```

will need an `eas.json` and Apple/Google credentials, which are out of scope for this Alpha.

## Adding a new game

See the checklist in `ARCHITECTURE.md`. In short: add a `GameDefinition` to
`src/games/registry.ts`, create `src/games/<new-game>/`, and mark it `playable` once its screens
exist — Home and the Games Hub pick it up automatically.
