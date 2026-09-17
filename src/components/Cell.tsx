import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { blocks, cellState, color, radius } from '@/theme/tokens';

export type PreviewState = 'none' | 'valid' | 'invalid' | 'clearing';

interface CellProps {
  size: number;
  value: number | null;
  previewState: PreviewState;
}

/**
 * Renders a single board cell. Memoized on (value, previewState) so a
 * placement only re-renders the handful of cells that actually changed.
 */
function CellComponent({ size, value, previewState }: CellProps) {
  const style = [
    styles.base,
    { width: size, height: size, borderRadius: radius.sm },
    value !== null ? filledStyle(value) : styles.empty,
    previewState === 'valid' && value === null ? validStyle(previewState) : null,
    previewState === 'invalid' ? styles.invalid : null,
    previewState === 'clearing' ? styles.clearing : null,
  ];

  return <View style={style} />;
}

function filledStyle(colorIndex: number) {
  const [top] = blocks[colorIndex % blocks.length];
  return { backgroundColor: top };
}

function validStyle(_state: PreviewState) {
  return { borderWidth: 1.5, borderColor: color.accent, backgroundColor: `${color.accent}55` };
}

export const Cell = memo(CellComponent, (prev, next) => {
  return (
    prev.value === next.value &&
    prev.previewState === next.previewState &&
    prev.size === next.size
  );
});

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
  },
  empty: {
    backgroundColor: cellState.emptyFill,
    borderColor: cellState.emptyInset,
  },
  invalid: {
    backgroundColor: cellState.invalidFill,
    borderWidth: 1.5,
    borderColor: cellState.invalidBorder,
  },
  clearing: {
    backgroundColor: cellState.clearFill,
    borderColor: color.accent,
  },
});
