import { RngFn, mulberry32, pickInt, randomSeed } from './rng';
import { SHAPES, Shape, shapeBounds } from './shapes';

export const BOARD_SIZE = 8;
export const CELL_COUNT = BOARD_SIZE * BOARD_SIZE;
export const TRAY_SIZE = 3;
export const COLOR_COUNT = 6;
export const MAX_COMBO = 8;
export const TRAY_REROLL_ATTEMPTS = 8;
export const TRAY_REROLL_MIN_FREE_CELLS = 12;

/** `null` = empty cell; otherwise the index (0..COLOR_COUNT-1) of the block color. */
export type Board = (number | null)[];

export interface Piece {
  shape: Shape;
  colorIndex: number;
}

export type Tray = (Piece | null)[];

export interface RunState {
  board: Board;
  tray: Tray;
  score: number;
  lines: number;
  combo: number;
  bestCombo: number;
  placed: number;
  seed: number;
  startedAt: number;
}

export interface PlaceResult {
  nextState: RunState;
  clearedIndices: number[];
  gain: number;
  newCombo: number;
  isGameOver: boolean;
}

export function createEmptyBoard(): Board {
  return new Array(CELL_COUNT).fill(null);
}

export function indexOf(row: number, col: number): number {
  return row * BOARD_SIZE + col;
}

export function coordsOf(index: number): [number, number] {
  return [Math.floor(index / BOARD_SIZE), index % BOARD_SIZE];
}

function inBounds(row: number, col: number): boolean {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

/** Does `shape`, anchored so its own (0,0) sits at (row,col), fit on `board`? */
export function fits(shape: Shape, row: number, col: number, board: Board): boolean {
  for (const [dr, dc] of shape.cells) {
    const r = row + dr;
    const c = col + dc;
    if (!inBounds(r, c)) return false;
    if (board[indexOf(r, c)] !== null) return false;
  }
  return true;
}

/** True if at least one piece in the tray fits somewhere on the board. */
export function anyFits(board: Board, tray: Tray): boolean {
  for (const piece of tray) {
    if (!piece) continue;
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (fits(piece.shape, row, col, board)) return true;
      }
    }
  }
  return false;
}

export function freeCellCount(board: Board): number {
  let free = 0;
  for (const cell of board) if (cell === null) free++;
  return free;
}

/**
 * Centre-anchors a shape's origin cell under a hover point (row, col treated
 * as the shape's visual centre), clamped so the shape stays on the board.
 */
export function originFor(shape: Shape, hoverRow: number, hoverCol: number): [number, number] {
  const { rows, cols } = shapeBounds(shape);
  const centerRowOffset = (rows - 1) / 2;
  const centerColOffset = (cols - 1) / 2;
  let originRow = Math.round(hoverRow - centerRowOffset);
  let originCol = Math.round(hoverCol - centerColOffset);
  originRow = Math.max(0, Math.min(BOARD_SIZE - rows, originRow));
  originCol = Math.max(0, Math.min(BOARD_SIZE - cols, originCol));
  return [originRow, originCol];
}

function randomPiece(rng: RngFn): Piece {
  const shape = SHAPES[pickInt(rng, SHAPES.length)];
  const colorIndex = pickInt(rng, COLOR_COUNT);
  return { shape, colorIndex };
}

/**
 * Fills every empty tray slot with a fresh random piece. If the resulting
 * tray would leave the player with no valid move and the board still has
 * plenty of room, reroll (bounded) so games don't end unfairly on a fluke
 * draw.
 */
export function refillTray(board: Board, tray: Tray, rng: RngFn): Tray {
  let attempt = 0;
  let candidate: Tray = tray;
  do {
    candidate = tray.map((slot) => slot ?? randomPiece(rng));
    attempt++;
    if (anyFits(board, candidate)) break;
    if (freeCellCount(board) < TRAY_REROLL_MIN_FREE_CELLS) break;
  } while (attempt < TRAY_REROLL_ATTEMPTS);
  return candidate;
}

export function createRun(seed: number = randomSeed()): RunState {
  const rng = mulberry32(seed);
  const board = createEmptyBoard();
  const tray = refillTray(board, [null, null, null], rng);
  return {
    board,
    tray,
    score: 0,
    lines: 0,
    combo: 0,
    bestCombo: 0,
    placed: 0,
    seed,
    startedAt: Date.now(),
  };
}

export function createDailyRun(date: Date = new Date()): RunState {
  // Imported lazily to avoid a circular import at module init time.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { seedFromUTCDate } = require('./rng');
  return createRun(seedFromUTCDate(date));
}

function rowIndices(row: number): number[] {
  const out: number[] = [];
  for (let c = 0; c < BOARD_SIZE; c++) out.push(indexOf(row, c));
  return out;
}

function colIndices(col: number): number[] {
  const out: number[] = [];
  for (let r = 0; r < BOARD_SIZE; r++) out.push(indexOf(r, col));
  return out;
}

function isLineFull(board: Board, indices: number[]): boolean {
  return indices.every((i) => board[i] !== null);
}

/** Places `piece` (from tray slot `trayIndex`) with its origin at (row, col). */
export function place(state: RunState, trayIndex: number, row: number, col: number): PlaceResult {
  const piece = state.tray[trayIndex];
  if (!piece) {
    throw new Error(`No piece in tray slot ${trayIndex}`);
  }
  if (!fits(piece.shape, row, col, state.board)) {
    throw new Error('Piece does not fit at the given position');
  }

  const board = state.board.slice();
  for (const [dr, dc] of piece.shape.cells) {
    board[indexOf(row + dr, col + dc)] = piece.colorIndex;
  }

  const fullRows: number[] = [];
  const fullCols: number[] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    if (isLineFull(board, rowIndices(r))) fullRows.push(r);
  }
  for (let c = 0; c < BOARD_SIZE; c++) {
    if (isLineFull(board, colIndices(c))) fullCols.push(c);
  }

  const clearedSet = new Set<number>();
  for (const r of fullRows) rowIndices(r).forEach((i) => clearedSet.add(i));
  for (const c of fullCols) colIndices(c).forEach((i) => clearedSet.add(i));
  const clearedIndices = Array.from(clearedSet);

  for (const i of clearedIndices) board[i] = null;

  const linesCleared = fullRows.length + fullCols.length;
  const cellsPlaced = piece.shape.cells.length;

  let newCombo: number;
  if (linesCleared > 0) {
    newCombo = Math.min(MAX_COMBO, state.combo + linesCleared);
  } else {
    newCombo = 0;
  }

  const gain = cellsPlaced * 10 + linesCleared * 100 * Math.max(1, newCombo);

  const tray = state.tray.slice();
  tray[trayIndex] = null;

  let rngSeed = state.seed;
  let nextTray = tray;
  if (tray.every((slot) => slot === null)) {
    // Tray fully consumed: refill and advance the seed deterministically.
    rngSeed = (state.seed * 1103515245 + 12345) >>> 0;
    const rng = mulberry32(rngSeed);
    nextTray = refillTray(board, tray, rng);
  }

  const isGameOver = !anyFits(board, nextTray);

  const nextState: RunState = {
    board,
    tray: nextTray,
    score: state.score + gain,
    lines: state.lines + linesCleared,
    combo: newCombo,
    bestCombo: Math.max(state.bestCombo, newCombo),
    placed: state.placed + 1,
    seed: rngSeed,
    startedAt: state.startedAt,
  };

  return { nextState, clearedIndices, gain, newCombo, isGameOver };
}

export function isBoardFull(board: Board): boolean {
  return board.every((cell) => cell !== null);
}
