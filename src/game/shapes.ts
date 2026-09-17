/** A shape is a set of relative (row, col) cell offsets, normalized so the
 * minimum row/col is 0. Cell coordinates are [row, col] tuples. */
export type Cell = [number, number];

export interface Shape {
  id: string;
  cells: Cell[];
}

function shape(id: string, cells: Cell[]): Shape {
  return { id, cells };
}

/** The 10 canonical Block Forge piece shapes. */
export const SHAPES: Shape[] = [
  shape('1x1', [[0, 0]]),
  shape('2H', [
    [0, 0],
    [0, 1],
  ]),
  shape('3H', [
    [0, 0],
    [0, 1],
    [0, 2],
  ]),
  shape('2V', [
    [0, 0],
    [1, 0],
  ]),
  shape('3V', [
    [0, 0],
    [1, 0],
    [2, 0],
  ]),
  shape('2x2', [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ]),
  shape('L', [
    [0, 0],
    [1, 0],
    [2, 0],
    [2, 1],
  ]),
  shape('J', [
    [0, 1],
    [1, 1],
    [2, 1],
    [2, 0],
  ]),
  shape('T', [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 1],
  ]),
  shape('S', [
    [0, 1],
    [0, 2],
    [1, 0],
    [1, 1],
  ]),
];

export function shapeById(id: string): Shape {
  const found = SHAPES.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown shape id: ${id}`);
  return found;
}

export function shapeBounds(shape: Shape): { rows: number; cols: number } {
  let maxRow = 0;
  let maxCol = 0;
  for (const [r, c] of shape.cells) {
    if (r > maxRow) maxRow = r;
    if (c > maxCol) maxCol = c;
  }
  return { rows: maxRow + 1, cols: maxCol + 1 };
}
