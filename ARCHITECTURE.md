# Architecture

## Why a registry, not a hardcoded game

Block Forge is the first of a planned multi-game platform (Puzzle, Strategy, Action, Arcade,
Racing, Adventure). If Home and the Games Hub were written against Block Forge specifically,
every new title would mean touching both screens again, re-testing existing games in the
process, and accumulating special cases. Instead, every screen that lists games
(`HomeScreen`, `GamesHubScreen`, `CategoryScreen`) reads from a single array:

```
src/games/registry.ts  ->  GAME_REGISTRY: GameDefinition[]
```

```ts
interface GameDefinition {
  id: string;
  title: string;
  category: 'Puzzle' | 'Strategy' | 'Action' | 'Arcade' | 'Racing' | 'Adventure';
  description: string;
  icon: string;
  artwork?: string;
  status: 'playable' | 'coming_soon' | 'locked';
  playable: boolean;
  route?: string;      // navigation target when playable
  accent: string;      // hex used for cards/badges/glows
  version: string;
  features: string[];
}
```

`GameDetailScreen` is a single reusable template that branches on `game.playable` — it renders
identically for Block Forge and for a coming-soon title like Neon Raid, just with a different
final action (Play vs. a "Coming Soon" card).

## Layer boundaries

```
screens/      -> UI only. Reads stores/queries, never touches storage or the engine directly
                 for anything beyond calling store actions.
store/        -> Zustand. Thin wrappers around storage/repositories + the pure engine.
game/         -> Pure TypeScript engine. No React, no RN, no I/O. Fully unit-testable.
storage/      -> The ONLY code allowed to call MMKV / expo-secure-store. Everything else goes
                 through these repositories.
api/          -> Network client, TanStack Query hooks, and the offline outbox queue.
games/        -> Per-game registry + game-specific glue (e.g. blockforge/dragMath.ts, which
                 duplicates a few pure engine functions as Reanimated worklets for UI-thread
                 drag math — see "Drag and drop" below).
components/   -> Presentational, theme-token-driven, reusable across screens and (in principle)
                 across future games.
theme/        -> tokens.ts / typography.ts / motion.ts. No component should import a raw hex
                 value or a magic animation duration.
```

## The Block Forge engine

`src/game/engine.ts` has no React or React Native imports and can be tested with plain Jest
(`src/game/engine.test.ts`, 18 tests). Its only mutation entry point is `place(state, trayIndex,
row, col)`, which:

1. Copies the board once (`state.board.slice()`), places the piece.
2. Scans all 8 rows and 8 columns for full lines, clears them (row+column overlap counts as two
   separate lines per the scoring spec).
3. Computes the new combo (`min(8, combo + linesCleared)` on a clear, `0` otherwise) and the score
   gain (`cells*10 + lines*100*max(1, combo)`).
4. Refills the tray when it's fully consumed, using a seeded `mulberry32` PRNG advanced
   deterministically from the run's own seed — this is what makes daily challenges reproducible.
5. Checks `anyFits` against the resulting board + tray to report `isGameOver`.

`refillTray` rerolls (up to 8 attempts) when a draw would leave the player with no valid move and
the board still has >= 12 free cells, so games don't end on an unlucky draw when there was
clearly room to keep playing.

## Drag and drop: UI thread vs. JS thread

The spec calls for zero board re-renders driven by React state during a drag. To get there
without lifting the entire engine onto the UI thread, `src/games/blockforge/dragMath.ts` holds
worklet-safe duplicates of the handful of *pure, allocation-light* functions actually needed
during a drag (`fitsWorklet`, `originForWorklet`, `indexOfWorklet`) — these have no imports beyond
a board-size constant, so Reanimated can run them per-frame with no bridge hop.

`TrayPiece.tsx`'s `Gesture.Pan()`:
- `onBegin`: scales the piece to 0.86 and fades it to 0.35 opacity via shared values, fires a
  selection haptic.
- `onUpdate`: reads the board's on-screen frame via `measure(boardRef)` (also worklet-safe, no
  bridge hop), computes the hover cell, and only calls back into JS (`runOnJS`) when the
  *resolved origin cell* actually changes — not on every pixel of finger movement. That JS
  callback updates a small `previewIndices` React state array, which is what causes `Board` to
  re-render the (at most ~12) affected `Cell`s.
- `onEnd`: re-resolves the final cell, and either commits the placement through `useGameStore` or
  springs the piece back with no haptic if invalid.

This is a deliberate, documented compromise against the "shared values only, never React state"
ideal: geometry math is 100% UI-thread, but the *result* of that math (a handful of integers) is
bridged to React state only on change, which keeps the design's performance intent (large parts
of a drag are UI-thread; re-renders are bounded and infrequent) without requiring the whole board
tree to live in Reanimated's world.

## Persistence & offline

Every piece of local state has an owning repository in `src/storage/`:

| Repository | Backing | Data |
| --- | --- | --- |
| `GameRepository` | MMKV | Active `RunState`, written after every placement |
| `ScoreRepository` | MMKV | Best score / runs / lines / blocks / best combo, and the daily streak |
| `SettingsRepository` | MMKV | Sound/music/haptics/reduced-motion/language, onboarding flag |
| `RewardRepository` | MMKV | Achievement progress/state |
| `UserRepository` | expo-secure-store | Auth token (sensitive, so not MMKV) |

Nothing outside `src/storage/` calls MMKV or secure-store directly — Zustand stores and screens
go through these repositories, which keeps persistence swappable (e.g. moving to SQLite later
touches one file per concern, not every screen).

`src/api/outbox.ts` queues mutations attempted while offline (achievement claims, daily-challenge
completion, future score submissions) with a generated idempotency key, and flushes them
newest-first via a caller-supplied `sender` function once connectivity returns.

## Adding a new game — checklist

1. **Registry entry**: add a `GameDefinition` to `GAME_REGISTRY` in `src/games/registry.ts` with
   `status: 'coming_soon'` and `playable: false` to start. It immediately appears in Home's
   category rows and the Games Hub — no other file changes needed for it to be *browsable*.
2. **Module folder**: create `src/games/<new-game>/` mirroring Block Forge's shape:
   `engine.ts`, `components/`, `screens/`, `hooks/`, `state/`, `types.ts`, `utils/`,
   `animations/`, `constants.ts`. Keep the engine pure/framework-free like Block Forge's.
3. **Screens**: build the game's own screens under `src/screens/<new-game>/` (or reuse
   `GameDetailScreen`'s template if the game doesn't need bespoke detail UI).
4. **Route**: register the new screens in the relevant navigation stack
   (`src/app/navigation/*.tsx`) and set `route` on the registry entry to the entry screen's name.
5. **Assets**: add artwork; until then the registry entry's `accent` color drives a gradient
   placeholder card, matching the "gradient placeholders when art missing" offline rule.
6. **Flip the switch**: once playable, set `status: 'playable'` and `playable: true` on the
   registry entry.

At no point in that checklist do you edit `HomeScreen.tsx` or `GamesHubScreen.tsx` — that is the
architectural guarantee this registry pattern is meant to provide.
