import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  withSpring,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface ShredderAnimationProps {
  isPlaying: boolean;
  text: string;
  onComplete: () => void;
}

/** Individual text fragment that gets "sucked in" */
function Fragment({
  char,
  index,
  total,
  isPlaying,
}: {
  char: string;
  index: number;
  total: number;
  isPlaying: boolean;
}) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    if (!isPlaying) {
      translateY.value = 0;
      translateX.value = 0;
      scale.value = 1;
      opacity.value = 1;
      rotate.value = 0;
      return;
    }

    const delay = index * 40;
    const spreadX = (Math.random() - 0.5) * 60;

    translateX.value = withDelay(
      delay,
      withSequence(
        withTiming(spreadX, { duration: 200, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 300, easing: Easing.in(Easing.cubic) })
      )
    );
    translateY.value = withDelay(
      delay,
      withSequence(
        withTiming(-20, { duration: 150, easing: Easing.out(Easing.quad) }),
        withTiming(120, { duration: 350, easing: Easing.in(Easing.cubic) })
      )
    );
    scale.value = withDelay(
      delay,
      withSequence(
        withTiming(1.2, { duration: 150 }),
        withTiming(0, { duration: 350, easing: Easing.in(Easing.cubic) })
      )
    );
    opacity.value = withDelay(
      delay,
      withSequence(
        withTiming(1, { duration: 200 }),
        withTiming(0, { duration: 300 })
      )
    );
    rotate.value = withDelay(
      delay,
      withTiming((Math.random() - 0.5) * 720, { duration: 500 })
    );
  }, [isPlaying]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.Text style={[styles.fragment, animStyle]}>{char}</Animated.Text>
  );
}

export function ShredderAnimation({ isPlaying, text, onComplete }: ShredderAnimationProps) {
  const funnelScale = useSharedValue(0);
  const funnelOpacity = useSharedValue(0);
  const checkScale = useSharedValue(0);

  useEffect(() => {
    if (!isPlaying) {
      funnelScale.value = 0;
      funnelOpacity.value = 0;
      checkScale.value = 0;
      return;
    }

    // Funnel appears
    funnelOpacity.value = withTiming(1, { duration: 200 });
    funnelScale.value = withSpring(1, { damping: 12, stiffness: 150 });

    // After fragments are consumed, show checkmark
    const totalDuration = Math.min(text.length * 40 + 600, 2000);
    const timer = setTimeout(() => {
      funnelScale.value = withSequence(
        withSpring(1.2, { damping: 8 }),
        withSpring(0, { damping: 15 })
      );
      checkScale.value = withSequence(
        withDelay(200, withSpring(1.3, { damping: 8, stiffness: 200 })),
        withSpring(1, { damping: 12 })
      );
    }, totalDuration);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, totalDuration + 800);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [isPlaying]);

  const funnelStyle = useAnimatedStyle(() => ({
    transform: [{ scale: funnelScale.value }],
    opacity: funnelOpacity.value,
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  // Take up to 20 chars for the fragment animation
  const displayChars = text.slice(0, 20).split('');

  return (
    <View style={styles.container}>
      {/* Fragments flying into the funnel */}
      <View style={styles.fragmentsContainer}>
        {isPlaying &&
          displayChars.map((char, i) => (
            <Fragment
              key={`${i}-${char}`}
              char={char}
              index={i}
              total={displayChars.length}
              isPlaying={isPlaying}
            />
          ))}
      </View>

      {/* Black hole funnel */}
      <Animated.View style={[styles.funnel, funnelStyle]}>
        <View style={styles.funnelInner}>
          <MaterialIcons name="cyclone" size={48} color="#fff" />
        </View>
      </Animated.View>

      {/* Success checkmark */}
      <Animated.View style={[styles.check, checkStyle]}>
        <MaterialIcons name="check-circle" size={56} color="#4CAF50" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  fragmentsContainer: {
    position: 'absolute',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    top: 20,
    width: 280,
  },
  fragment: {
    fontSize: 20,
    fontWeight: '700',
    color: '#546E7A',
    marginHorizontal: 1,
  },
  funnel: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#263238',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  funnelInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    position: 'absolute',
  },
});
