import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
 * Filled cells render as raised/beveled blocks: a gradient fill plus a thin
 * lighter top-highlight edge and a darker bottom-shadow edge, so the board
 * reads as real depth instead of flat color squares.
 */
function CellComponent({ size, value, previewState }: CellProps) {
  if (value !== null) {
    const [top, bottom] = blocks[value % blocks.length];
    const filledRadius = Math.max(radius.sm, Math.min(10, size * 0.28));
    return (
      <View style={{ width: size, height: size, borderRadius: filledRadius, overflow: 'hidden' }}>
        <LinearGradient
          colors={[top, bottom]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        {/* top-edge highlight */}
        <View style={[styles.highlight, { width: size - 4 }]} />
        {/* bottom-edge shadow */}
        <View style={[styles.shadowEdge, { width: size - 4 }]} />
        {previewState === 'clearing' && <View style={[StyleSheet.absoluteFillObject, styles.clearOverlay]} />}
      </View>
    );
  }

  const style = [
    styles.base,
    { width: size, height: size, borderRadius: radius.sm },
    styles.empty,
    previewState === 'valid' ? styles.valid : null,
    previewState === 'invalid' ? styles.invalid : null,
  ];

  return <View style={style} />;
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
  valid: {
    borderWidth: 1.5,
    borderColor: color.accent,
    backgroundColor: `${color.accent}40`,
  },
  invalid: {
    backgroundColor: cellState.invalidFill,
    borderWidth: 1.5,
    borderColor: cellState.invalidBorder,
  },
  clearOverlay: {
    backgroundColor: cellState.clearFill,
    opacity: 0.75,
  },
  highlight: {
    position: 'absolute',
    top: 1.5,
    left: 2,
    height: 2,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  shadowEdge: {
    position: 'absolute',
    bottom: 1.5,
    left: 2,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
});
