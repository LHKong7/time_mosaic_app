import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { BUCKET_COLORS } from '@/constants/task-config';
import type { TimeBucket } from '@/types/task';

interface CapsuleAnimationProps {
  isPlaying: boolean;
  timeBucket: TimeBucket | null;
  onComplete: () => void;
}

export function CapsuleAnimation({ isPlaying, timeBucket, onComplete }: CapsuleAnimationProps) {
  const scale = useSharedValue(0);
  const translateY = useSharedValue(80);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isPlaying) {
      opacity.value = 1;
      scale.value = withSequence(
        withSpring(1.3, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 12, stiffness: 150 })
      );
      translateY.value = withSpring(0, { damping: 12, stiffness: 100 });
      rotate.value = withTiming(360, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      });

      // Trigger completion after animation
      const timer = setTimeout(() => {
        onComplete();
      }, 1200);

      return () => clearTimeout(timer);
    } else {
      scale.value = 0;
      translateY.value = 80;
      rotate.value = 0;
      opacity.value = 0;
    }
  }, [isPlaying]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const color = timeBucket ? BUCKET_COLORS[timeBucket] : '#9C27B0';

  return (
    <Animated.View style={[styles.capsule, { backgroundColor: color }, animatedStyle]}>
      <MaterialIcons name="help-outline" size={40} color="rgba(255,255,255,0.9)" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  capsule: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
