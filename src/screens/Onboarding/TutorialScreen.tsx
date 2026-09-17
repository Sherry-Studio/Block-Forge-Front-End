import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAnimatedRef } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Board } from '@/components/Board';
import { TrayPiece } from '@/components/TrayPiece';
import { Button } from '@/components/Button';
import { BOARD_SIZE, createEmptyBoard, indexOf, place, RunState } from '@/game/engine';
import { shapeById } from '@/game/shapes';
import { SettingsRepository } from '@/storage/SettingsRepository';
import { color, space } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

const STEPS = [
  { title: 'Drag a piece', body: 'Drag the highlighted piece onto the glowing cell.' },
  { title: 'Fill a row', body: 'Complete the row to prepare it for clearing.' },
  { title: 'Watch it clear', body: 'A full row or column clears automatically.' },
  { title: 'Chain a combo', body: 'Clear lines on consecutive placements to build combo.' },
  { title: 'Ready to play', body: "You've got the basics — let's play for real." },
];

function stepState(step: number): RunState {
  const board = createEmptyBoard();
  if (step >= 1) {
    for (let c = 0; c < BOARD_SIZE - 1; c++) board[indexOf(0, c)] = 0;
  }
  return {
    board,
    tray: [{ shape: shapeById(step === 0 ? '1x1' : '1x1'), colorIndex: 0 }, null, null],
    score: 0,
    lines: 0,
    combo: 0,
    bestCombo: 0,
    placed: 0,
    seed: 1,
    startedAt: 0,
  };
}

export function TutorialScreen() {
  const navigation = useNavigation<any>();
  const boardRef = useAnimatedRef<View>();
  const [step, setStep] = useState(0);
  const [run, setRun] = useState<RunState>(() => stepState(0));
  const [previewIndices, setPreviewIndices] = useState<number[]>([]);
  const [previewValid, setPreviewValid] = useState(true);

  const finish = () => {
    SettingsRepository.setOnboardingDone(true);
    navigation.getParent()?.navigate('Main');
  };

  const goNext = () => {
    if (step >= STEPS.length - 1) {
      finish();
      return;
    }
    const next = step + 1;
    setStep(next);
    setRun(stepState(next));
  };

  const handleDragEnd = (trayIndex: number, row: number, col: number, valid: boolean) => {
    setPreviewIndices([]);
    if (valid) {
      try {
        const result = place(run, trayIndex, row, col);
        setRun(result.nextState);
        setTimeout(goNext, 400);
      } catch {
        // ignore invalid placement race
      }
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.stepLabel}>STEP {step + 1} OF {STEPS.length}</Text>
        <Text style={styles.title}>{STEPS[step].title}</Text>
        <Text style={styles.body}>{STEPS[step].body}</Text>
      </View>

      <Board ref={boardRef} board={run.board} previewIndices={previewIndices} previewValid={previewValid} />

      <View style={styles.tray}>
        <TrayPiece
          index={0}
          piece={run.tray[0]}
          cellSize={20}
          gap={2}
          boardRef={boardRef}
          boardBoard={run.board}
          hapticsEnabled
          onDragStart={() => {}}
          onHoverChange={(indices, valid) => {
            setPreviewIndices(indices);
            setPreviewValid(valid);
          }}
          onDragEnd={handleDragEnd}
          onGhostMove={() => {}}
          onAccessiblePlace={() => goNext()}
        />
      </View>

      <View style={styles.footer}>
        <Button label={step === STEPS.length - 1 ? "Let's play" : 'Skip step'} variant="secondary" onPress={goNext} />
        <Button label="Skip tutorial" variant="ghost" onPress={finish} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg, padding: space.xxl, gap: space.lg },
  header: { gap: space.xs },
  stepLabel: { ...textStyle('badge'), color: color.textFaint },
  title: { ...textStyle('h1'), color: color.text },
  body: { ...textStyle('body'), color: color.textMuted },
  tray: { alignItems: 'center' },
  footer: { gap: space.sm },
});
