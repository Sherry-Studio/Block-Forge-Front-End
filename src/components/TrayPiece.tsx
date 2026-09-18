import React from 'react';
import { AccessibilityActionEvent, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  AnimatedRef,
  measure,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Piece } from '@/game/engine';
import { fitsWorklet, originForWorklet } from '@/games/blockforge/dragMath';
import { GHOST_OFFSET_Y, TRAY_HIT_HEIGHT, TRAY_HIT_WIDTH } from '@/games/blockforge/constants';
import { LinearGradient } from 'expo-linear-gradient';
import { blocks, radius } from '@/theme/tokens';

interface TrayPieceProps {
  piece: Piece | null;
  index: number;
  cellSize: number;
  gap: number;
  boardRef: AnimatedRef<View>;
  boardBoard: (number | null)[];
  hapticsEnabled: boolean;
  onDragStart: (index: number) => void;
  onHoverChange: (previewIndices: number[], valid: boolean) => void;
  onDragEnd: (index: number, row: number, col: number, valid: boolean) => void;
  onGhostMove: (screenX: number, screenY: number, visible: boolean) => void;
  /** Fallback for accessibility / no-gesture play: place at the board centre. */
  onAccessiblePlace: (index: number) => void;
}

export function TrayPiece({
  piece,
  index,
  cellSize,
  gap,
  boardRef,
  boardBoard,
  hapticsEnabled,
  onDragStart,
  onHoverChange,
  onDragEnd,
  onGhostMove,
  onAccessiblePlace,
}: TrayPieceProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const dragging = useSharedValue(false);
  const boardBoardRef = React.useRef(boardBoard);
  boardBoardRef.current = boardBoard;

  const lastCellIndex = useSharedValue(-1);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  const notifyHover = (indices: number[], valid: boolean) => {
    onHoverChange(indices, valid);
  };

  const notifyEnd = (row: number, col: number, valid: boolean) => {
    onDragEnd(index, row, col, valid);
  };

  const pan = Gesture.Pan()
    .enabled(!!piece)
    .onBegin(() => {
      'worklet';
      if (hapticsEnabled) runOnJS(Haptics.selectionAsync)();
      scale.value = withTiming(0.86, { duration: 120 });
      opacity.value = withTiming(0.35, { duration: 120 });
      dragging.value = true;
      runOnJS(onDragStart)(index);
    })
    .onUpdate((e) => {
      'worklet';
      translateX.value = e.translationX;
      translateY.value = e.translationY;

      const boardMeasure = measure(boardRef as any);
      if (!boardMeasure || !piece) return;

      const padding = 10;
      const boardGap = 4;
      const boardSize = boardMeasure.width;
      const size = (boardSize - padding * 2 - boardGap * 7) / 8;
      const fingerX = e.absoluteX - boardMeasure.pageX - GHOST_OFFSET_Y * 0;
      const fingerY = e.absoluteY - boardMeasure.pageY - GHOST_OFFSET_Y;

      const hoverCol = (fingerX - padding) / (size + boardGap);
      const hoverRow = (fingerY - padding) / (size + boardGap);
      const clampedRow = Math.max(0, Math.min(7, hoverRow));
      const clampedCol = Math.max(0, Math.min(7, hoverCol));

      const [originRow, originCol] = originForWorklet(piece.shape.cells, clampedRow, clampedCol);
      const key = originRow * 100 + originCol;
      if (key !== lastCellIndex.value) {
        lastCellIndex.value = key;
        const valid = fitsWorklet(piece.shape.cells, originRow, originCol, boardBoardRef.current);
        const indices = piece.shape.cells.map(([dr, dc]) => (originRow + dr) * 8 + (originCol + dc));
        runOnJS(notifyHover)(indices, valid);
      }

      runOnJS(onGhostMove)(e.absoluteX, e.absoluteY - GHOST_OFFSET_Y, true);
    })
    .onEnd((e) => {
      'worklet';
      const boardMeasure = measure(boardRef as any);
      let valid = false;
      let originRow = 0;
      let originCol = 0;
      if (boardMeasure && piece) {
        const padding = 10;
        const boardGap = 4;
        const size = (boardMeasure.width - padding * 2 - boardGap * 7) / 8;
        const fingerX = e.absoluteX - boardMeasure.pageX;
        const fingerY = e.absoluteY - boardMeasure.pageY - GHOST_OFFSET_Y;
        const hoverCol = Math.max(0, Math.min(7, (fingerX - padding) / (size + boardGap)));
        const hoverRow = Math.max(0, Math.min(7, (fingerY - padding) / (size + boardGap)));
        [originRow, originCol] = originForWorklet(piece.shape.cells, hoverRow, hoverCol);
        valid = fitsWorklet(piece.shape.cells, originRow, originCol, boardBoardRef.current);
      }

      dragging.value = false;
      runOnJS(onGhostMove)(0, 0, false);

      if (valid) {
        opacity.value = withTiming(0, { duration: 80 });
        runOnJS(notifyEnd)(originRow, originCol, true);
      } else {
        translateX.value = withSpring(0, { damping: 16 });
        translateY.value = withSpring(0, { damping: 16 });
        scale.value = withSpring(1, { damping: 16 });
        opacity.value = withTiming(1, { duration: 200 });
        runOnJS(notifyEnd)(originRow, originCol, false);
      }
      lastCellIndex.value = -1;
    });

  const handleAccessibilityAction = (event: AccessibilityActionEvent) => {
    if (event.nativeEvent.actionName === 'placeAt') {
      onAccessiblePlace(index);
    }
  };

  if (!piece) {
    return <View style={[styles.slot, { width: TRAY_HIT_WIDTH, height: TRAY_HIT_HEIGHT }]} />;
  }

  const [top, bottom] = blocks[piece.colorIndex % blocks.length];
  const maxCol = Math.max(...piece.shape.cells.map((c) => c[1]));
  const maxRow = Math.max(...piece.shape.cells.map((c) => c[0]));
  const shapeCellSize = Math.min(20, (TRAY_HIT_WIDTH - 16) / (maxCol + 1));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[styles.slot, { width: TRAY_HIT_WIDTH, height: TRAY_HIT_HEIGHT }, style]}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`${piece.shape.id} shape, ${piece.shape.cells.length} cells`}
        accessibilityActions={[{ name: 'placeAt', label: 'Place on board' }]}
        onAccessibilityAction={handleAccessibilityAction}
      >
        <View style={styles.shapeWrap}>
          {piece.shape.cells.map(([r, c], i) => (
            <LinearGradient
              key={i}
              colors={[top, bottom]}
              start={{ x: 0.2, y: 0 }}
              end={{ x: 0.8, y: 1 }}
              style={{
                position: 'absolute',
                width: shapeCellSize,
                height: shapeCellSize,
                left: c * (shapeCellSize + 2),
                top: r * (shapeCellSize + 2),
                borderRadius: radius.sm,
              }}
            />
          ))}
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  slot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shapeWrap: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
