import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAnimatedRef } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Board } from '@/components/Board';
import { TrayPiece } from '@/components/TrayPiece';
import { Ghost } from '@/components/Ghost';
import { ScorePop } from '@/components/ScorePop';
import { ComboBadge } from '@/components/ComboBadge';
import { Button } from '@/components/Button';
import { Sheet } from '@/components/Sheet';
import { StatGrid } from '@/components/StatGrid';
import { BOARD_SIZE, TRAY_SIZE } from '@/game/engine';
import { useGameStore } from '@/store/game';
import { useSettingsStore } from '@/store/settings';
import { useUserStore } from '@/store/user';
import { useWalletStore } from '@/store/wallet';
import { useHaptics } from '@/game/hooks/useHaptics';
import { ScoreRepository } from '@/storage/ScoreRepository';
import { NO_MOVE_HOLD_MS } from '@/games/blockforge/constants';
import { color, radius, space } from '@/theme/tokens';
import { textStyle, tabularNums } from '@/theme/typography';

interface Pop {
  id: number;
  value: number;
  x: number;
  y: number;
}

export function PlayScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const isDaily = route.params?.mode === 'daily';

  const run = useGameStore((s) => s.run);
  const lastGain = useGameStore((s) => s.lastGain);
  const lastClearedIndices = useGameStore((s) => s.lastClearedIndices);
  const isGameOver = useGameStore((s) => s.isGameOver);
  const startNewRun = useGameStore((s) => s.startNewRun);
  const resumeRun = useGameStore((s) => s.resumeRun);
  const placeAt = useGameStore((s) => s.placeAt);
  const endRun = useGameStore((s) => s.endRun);

  const hapticsEnabled = useSettingsStore((s) => s.settings.hapticsEnabled);
  const haptics = useHaptics();
  const stats = useUserStore((s) => s.stats);
  const addCoins = useWalletStore((s) => s.addCoins);

  const boardRef = useAnimatedRef<View>();
  const [pauseVisible, setPauseVisible] = useState(false);
  const [exitConfirmVisible, setExitConfirmVisible] = useState(false);
  const [noValidMove, setNoValidMove] = useState(false);
  const [showGameOverCard, setShowGameOverCard] = useState(false);
  const [previewIndices, setPreviewIndices] = useState<number[]>([]);
  const [previewValid, setPreviewValid] = useState(true);
  const [clearingIndices, setClearingIndices] = useState<number[]>([]);
  const [ghost, setGhost] = useState<{ x: number; y: number; visible: boolean; trayIndex: number } | null>(null);
  const [pops, setPops] = useState<Pop[]>([]);
  const popId = useRef(0);

  useEffect(() => {
    if (!resumeRun()) {
      startNewRun(isDaily ? route.params?.seed : undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      setExitConfirmVisible(true);
      return true;
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!run) return;
    if (isGameOver) {
      const timer = setTimeout(() => {
        setShowGameOverCard(true);
        haptics.notify();
        addCoins(Math.max(1, Math.round(run.score / 10)));
        if (isDaily) {
          ScoreRepository.recordDailyCompletion(new Date().toISOString().slice(0, 10));
        }
      }, NO_MOVE_HOLD_MS);
      setNoValidMove(true);
      return () => clearTimeout(timer);
    }
    setNoValidMove(false);
    setShowGameOverCard(false);
  }, [isGameOver, run, haptics]);

  useEffect(() => {
    if (lastClearedIndices.length > 0) {
      setClearingIndices(lastClearedIndices);
      haptics.notify();
      const t = setTimeout(() => setClearingIndices([]), 230);
      return () => clearTimeout(t);
    }
  }, [lastClearedIndices, haptics]);

  if (!run) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.loadingText}>Preparing board...</Text>
      </SafeAreaView>
    );
  }

  const gap = 4;

  const handleDragStart = () => {
    setClearingIndices([]);
  };

  const handleHoverChange = (indices: number[], valid: boolean) => {
    setPreviewIndices(indices);
    setPreviewValid(valid);
  };

  const handleGhostMove = (x: number, y: number, visible: boolean, trayIndex: number) => {
    setGhost(visible ? { x, y, visible, trayIndex } : null);
  };

  const handleDragEnd = (trayIndex: number, row: number, col: number, valid: boolean) => {
    setGhost(null);
    setPreviewIndices([]);
    if (valid) {
      const before = run.score;
      placeAt(trayIndex, row, col);
      haptics.impact();
      popId.current += 1;
      setPops((prev) => [
        ...prev,
        { id: popId.current, value: run.score - before || lastGain, x: 160, y: 160 },
      ]);
    }
  };

  const handleAccessiblePlace = (trayIndex: number) => {
    const piece = run.tray[trayIndex];
    if (!piece) return;
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        try {
          placeAt(trayIndex, row, col);
          haptics.impact();
          return;
        } catch {
          continue;
        }
      }
    }
  };

  const handleRetry = () => {
    endRun();
    startNewRun();
    setShowGameOverCard(false);
  };

  const handleExit = () => {
    endRun();
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable
          style={styles.pauseBtn}
          onPress={() => setPauseVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Pause"
        >
          <View style={styles.pauseGlyph}>
            <View style={styles.pauseBar} />
            <View style={styles.pauseBar} />
          </View>
        </Pressable>
        <View style={styles.scoreCol}>
          <Text style={styles.scoreLabel}>SCORE</Text>
          <Text style={styles.score}>{run.score}</Text>
        </View>
        <View style={styles.bestCol}>
          <Text style={styles.bestLabel}>BEST</Text>
          <Text style={styles.bestValue}>{stats.bestScore}</Text>
        </View>
      </View>

      <ComboBadge combo={run.combo} />

      <View style={styles.boardWrap}>
        <Board
          ref={boardRef}
          board={run.board}
          previewIndices={previewIndices}
          previewValid={previewValid}
          clearingIndices={clearingIndices}
        />
        {ghost && run.tray[ghost.trayIndex] && (
          <Ghost
            shape={run.tray[ghost.trayIndex]!.shape}
            colorIndex={run.tray[ghost.trayIndex]!.colorIndex}
            cellSize={34}
            gap={gap}
            animatedStyle={{ transform: [{ translateX: ghost.x - 40 }, { translateY: ghost.y - 40 }] } as any}
          />
        )}
        {pops.map((p) => (
          <ScorePop key={p.id} value={p.value} x={p.x} y={p.y} onDone={() => setPops((prev) => prev.filter((x) => x.id !== p.id))} />
        ))}
      </View>

      {noValidMove && !showGameOverCard && (
        <Text style={styles.noMoveToast} accessibilityLiveRegion="polite">
          No valid move left...
        </Text>
      )}

      <View style={styles.tray}>
        {Array.from({ length: TRAY_SIZE }).map((_, i) => (
          <TrayPiece
            key={i}
            index={i}
            piece={run.tray[i]}
            cellSize={20}
            gap={2}
            boardRef={boardRef}
            boardBoard={run.board}
            hapticsEnabled={hapticsEnabled}
            onDragStart={handleDragStart}
            onHoverChange={handleHoverChange}
            onDragEnd={handleDragEnd}
            onGhostMove={(x, y, visible) => handleGhostMove(x, y, visible, i)}
            onAccessiblePlace={handleAccessiblePlace}
          />
        ))}
      </View>

      <Sheet visible={pauseVisible} onClose={() => setPauseVisible(false)}>
        <Text style={styles.sheetTitle}>Paused</Text>
        <Button label="Resume" variant="filled" onPress={() => setPauseVisible(false)} style={styles.sheetButton} />
        <Button
          label="Exit to Home"
          variant="ghost"
          onPress={() => {
            setPauseVisible(false);
            setExitConfirmVisible(true);
          }}
          style={styles.sheetButton}
        />
      </Sheet>

      <Sheet visible={exitConfirmVisible} onClose={() => setExitConfirmVisible(false)}>
        <Text style={styles.sheetTitle}>Exit run?</Text>
        <Text style={styles.sheetBody}>Your progress is saved, but this run will end.</Text>
        <Button label="Exit" onPress={handleExit} style={styles.sheetButton} />
        <Button
          label="Keep Playing"
          variant="secondary"
          onPress={() => setExitConfirmVisible(false)}
          style={styles.sheetButton}
        />
      </Sheet>

      <Sheet visible={showGameOverCard} onClose={() => {}}>
        <Text style={styles.gameOverLabel}>GAME OVER</Text>
        <Text style={styles.finalScore}>{run.score}</Text>
        <StatGrid
          columns={2}
          items={[
            { label: 'Best', value: stats.bestScore },
            { label: 'Lines', value: run.lines },
            { label: 'Best Combo', value: `x${run.bestCombo}` },
            { label: 'Coins', value: Math.max(1, Math.round(run.score / 10)) },
          ]}
        />
        <Button label="Play Again" variant="filled" onPress={handleRetry} style={styles.sheetButton} />
        <View style={styles.rowButtons}>
          <Button label="Home" variant="ghost" onPress={handleExit} style={styles.rowButton} />
        </View>
      </Sheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg, padding: space.lg },
  loadingText: { ...textStyle('body'), color: color.textMuted, textAlign: 'center', marginTop: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: space.sm },
  pauseBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: color.raised,
    borderWidth: 1,
    borderColor: color.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseGlyph: { flexDirection: 'row', gap: 3 },
  pauseBar: { width: 3, height: 12, borderRadius: 1.5, backgroundColor: color.textMuted },
  scoreCol: { alignItems: 'center' },
  scoreLabel: { ...textStyle('caption'), color: color.textFaint },
  score: { ...textStyle('display'), ...tabularNums, color: color.text },
  bestCol: { alignItems: 'flex-end', minWidth: 36 },
  bestLabel: { ...textStyle('caption'), color: color.textFaint },
  bestValue: { ...textStyle('body'), ...tabularNums, color: color.textMuted, fontWeight: '600' },
  boardWrap: { marginTop: space.md },
  tray: { flexDirection: 'row', justifyContent: 'space-evenly', marginTop: space.xl },
  noMoveToast: {
    ...textStyle('body'),
    color: color.danger,
    textAlign: 'center',
    marginTop: space.sm,
  },
  sheetTitle: { ...textStyle('h1'), color: color.text, marginBottom: space.md },
  sheetBody: { ...textStyle('body'), color: color.textMuted, marginBottom: space.lg },
  sheetButton: { marginTop: space.sm },
  gameOverLabel: { ...textStyle('caption'), color: color.textFaint, textAlign: 'center', letterSpacing: 1 },
  finalScore: { ...textStyle('display'), ...tabularNums, color: color.accent300, marginBottom: space.md, textAlign: 'center' },
  rowButtons: { flexDirection: 'row', justifyContent: 'center', marginTop: space.sm },
  rowButton: { flex: 1 },
});
