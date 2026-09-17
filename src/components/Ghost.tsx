import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { Shape } from '@/game/shapes';
import { blocks, radius } from '@/theme/tokens';

interface GhostProps {
  shape: Shape;
  colorIndex: number;
  cellSize: number;
  gap: number;
  animatedStyle: AnimatedStyle;
}

/** Floating preview of the piece currently being dragged, positioned by the
 * caller's animated style (driven entirely by shared values on the UI thread). */
export function Ghost({ shape, colorIndex, cellSize, gap, animatedStyle }: GhostProps) {
  const [top] = blocks[colorIndex % blocks.length];
  const maxCol = Math.max(...shape.cells.map((c) => c[1]));
  const maxRow = Math.max(...shape.cells.map((c) => c[0]));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        { width: (maxCol + 1) * (cellSize + gap), height: (maxRow + 1) * (cellSize + gap) },
        animatedStyle,
      ]}
    >
      {shape.cells.map(([r, c], i) => (
        <Animated.View
          key={i}
          style={[
            styles.cell,
            {
              width: cellSize,
              height: cellSize,
              left: c * (cellSize + gap),
              top: r * (cellSize + gap),
              backgroundColor: top,
            },
          ]}
        />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 50,
  },
  cell: {
    position: 'absolute',
    borderRadius: radius.sm,
    opacity: 0.92,
  },
});
