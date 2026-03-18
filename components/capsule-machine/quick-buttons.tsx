import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { TIME_BUCKETS, BUCKET_COLORS, BUCKET_LABELS } from '@/constants/task-config';
import type { TimeBucket } from '@/types/task';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface QuickButtonsProps {
  onSelect: (bucket: TimeBucket) => void;
  disabled: boolean;
}

function QuickButton({
  bucket,
  onSelect,
  disabled,
}: {
  bucket: TimeBucket;
  onSelect: (b: TimeBucket) => void;
  disabled: boolean;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={[
        styles.button,
        { backgroundColor: disabled ? '#B0BEC5' : BUCKET_COLORS[bucket] },
        animatedStyle,
      ]}
      onPressIn={() => {
        scale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 10, stiffness: 200 });
      }}
      onPress={() => {
        if (!disabled) onSelect(bucket);
      }}
      disabled={disabled}
    >
      <Text style={styles.buttonTime}>{bucket}</Text>
      <Text style={styles.buttonLabel}>min</Text>
    </AnimatedPressable>
  );
}

export function QuickButtons({ onSelect, disabled }: QuickButtonsProps) {
  return (
    <View style={styles.container}>
      {TIME_BUCKETS.map((bucket) => (
        <QuickButton
          key={bucket}
          bucket={bucket}
          onSelect={onSelect}
          disabled={disabled}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 20,
  },
  button: {
    width: 90,
    height: 90,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonTime: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  buttonLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
});
