import React, { forwardRef, useMemo } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { BOARD_SIZE } from '@/game/engine';
import { color, radius } from '@/theme/tokens';
import { Cell, PreviewState } from './Cell';

interface BoardProps {
  board: (number | null)[];
  previewIndices?: number[];
  previewValid?: boolean;
  clearingIndices?: number[];
  onBoardLayout?: (e: LayoutChangeEvent) => void;
  padding?: number;
  gap?: number;
}

/** Renders the 8x8 board as plain Views (no canvas). Each cell is memoized
 * on its own value/preview state, so a single placement re-renders only the
 * handful of cells that changed. */
export const Board = forwardRef<View, BoardProps>(function Board(
  { board, previewIndices = [], previewValid = true, clearingIndices = [], onBoardLayout, padding = 10, gap = 4 },
  ref,
) {
  const [size, setSize] = React.useState(0);

  const previewSet = useMemo(() => new Set(previewIndices), [previewIndices]);
  const clearingSet = useMemo(() => new Set(clearingIndices), [clearingIndices]);

  const cellSize = size > 0 ? (size - padding * 2 - gap * (BOARD_SIZE - 1)) / BOARD_SIZE : 0;

  const handleLayout = (e: LayoutChangeEvent) => {
    setSize(e.nativeEvent.layout.width);
    onBoardLayout?.(e);
  };

  return (
    <View ref={ref} style={styles.well} onLayout={handleLayout}>
      <View style={[styles.grid, { padding, gap }]}>
        {Array.from({ length: BOARD_SIZE }).map((_, row) => (
          <View key={row} style={[styles.row, { gap }]}>
            {Array.from({ length: BOARD_SIZE }).map((_, col) => {
              const index = row * BOARD_SIZE + col;
              const value = board[index];
              let previewState: PreviewState = 'none';
              if (clearingSet.has(index)) previewState = 'clearing';
              else if (previewSet.has(index)) previewState = previewValid ? 'valid' : 'invalid';
              return cellSize > 0 ? (
                <Cell key={index} size={cellSize} value={value} previewState={previewState} />
              ) : (
                <View key={index} style={{ width: 1, height: 1 }} />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  well: {
    aspectRatio: 1,
    width: '100%',
    backgroundColor: color.boardWell,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: color.hairline,
    overflow: 'hidden',
  },
  grid: {
    flex: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
});
