import { BOARD_SIZE } from '@/game/engine';
import { Shape } from '@/game/shapes';

/**
 * Worklet-safe duplicates of the pure engine math needed on the UI thread
 * during drag. Kept intentionally tiny (no imports of non-worklet-safe
 * code) so Reanimated can run them per-frame without a JS thread hop.
 */

export function indexOfWorklet(row: number, col: number): number {
  'worklet';
  return row * BOARD_SIZE + col;
}

export function shapeBoundsWorklet(cells: [number, number][]): { rows: number; cols: number } {
  'worklet';
  let maxRow = 0;
  let maxCol = 0;
  for (let i = 0; i < cells.length; i++) {
    const [r, c] = cells[i];
    if (r > maxRow) maxRow = r;
    if (c > maxCol) maxCol = c;
  }
  return { rows: maxRow + 1, cols: maxCol + 1 };
}

export function originForWorklet(
  cells: [number, number][],
  hoverRow: number,
  hoverCol: number,
): [number, number] {
  'worklet';
  const { rows, cols } = shapeBoundsWorklet(cells);
  const centerRowOffset = (rows - 1) / 2;
  const centerColOffset = (cols - 1) / 2;
  let originRow = Math.round(hoverRow - centerRowOffset);
  let originCol = Math.round(hoverCol - centerColOffset);
  originRow = Math.max(0, Math.min(BOARD_SIZE - rows, originRow));
  originCol = Math.max(0, Math.min(BOARD_SIZE - cols, originCol));
  return [originRow, originCol];
}

export function fitsWorklet(
  cells: [number, number][],
  row: number,
  col: number,
  board: (number | null)[],
): boolean {
  'worklet';
  for (let i = 0; i < cells.length; i++) {
    const r = row + cells[i][0];
    const c = col + cells[i][1];
    if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) return false;
    if (board[indexOfWorklet(r, c)] !== null) return false;
  }
  return true;
}

export function cellsForOrigin(cells: [number, number][], row: number, col: number): number[] {
  'worklet';
  return cells.map(([dr, dc]) => indexOfWorklet(row + dr, col + dc));
}

export type ShapeCells = Shape['cells'];
