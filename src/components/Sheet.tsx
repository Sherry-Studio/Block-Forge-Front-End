import React, { PropsWithChildren } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { color, radius, space } from '@/theme/tokens';

interface SheetProps extends PropsWithChildren {
  visible: boolean;
  onClose: () => void;
}

/** Bottom sheet used for pause menus, exit confirms, and unlock modals. */
export function Sheet({ visible, onClose, children }: SheetProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close">
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(10,10,16,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: color.card,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderWidth: 1,
    borderColor: color.hairline,
    padding: space.xxl,
    paddingBottom: space.xxl * 1.5,
  },
});
