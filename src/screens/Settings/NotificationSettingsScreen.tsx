import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/Card';
import { Toggle } from '@/components/Toggle';
import { SimpleDetailLayout } from './SimpleDetailLayout';
import { color, space } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

/** Local-only preferences (no push token wiring yet — this repo has no backend). */
export function NotificationSettingsScreen() {
  const [dailyReminder, setDailyReminder] = useState(true);
  const [achievementAlerts, setAchievementAlerts] = useState(true);

  return (
    <SimpleDetailLayout title="Notifications">
      <Card style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Daily challenge reminder</Text>
          <Toggle value={dailyReminder} onChange={setDailyReminder} accessibilityLabel="Daily challenge reminder" />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Achievement alerts</Text>
          <Toggle value={achievementAlerts} onChange={setAchievementAlerts} accessibilityLabel="Achievement alerts" />
        </View>
      </Card>
    </SimpleDetailLayout>
  );
}

const styles = StyleSheet.create({
  card: { gap: space.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { ...textStyle('h2'), color: color.text },
});
