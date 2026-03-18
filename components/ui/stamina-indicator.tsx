import { StyleSheet, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface StaminaIndicatorProps {
  current: number;
  max: number;
}

export function StaminaIndicator({ current, max }: StaminaIndicatorProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: max }, (_, i) => (
        <MaterialIcons
          key={i}
          name="bolt"
          size={20}
          color={i < current ? '#FFD700' : '#D0D0D0'}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});
