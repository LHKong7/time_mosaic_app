import { useState, useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useGacha } from '@/contexts/gacha-context';
import { QuickButtons } from '@/components/capsule-machine/quick-buttons';
import { CapsuleAnimation } from '@/components/capsule-machine/capsule-animation';
import { StaminaIndicator } from '@/components/ui/stamina-indicator';
import { HopperOverlay } from '@/components/hopper/hopper-overlay';
import { PullDownHint } from '@/components/hopper/pull-down-hint';
import { MAX_STAMINA } from '@/constants/task-config';
import type { TimeBucket } from '@/types/task';

const PULL_THRESHOLD = 80;

export default function HomeScreen() {
  const { state, dispatch } = useGacha();
  const router = useRouter();
  const [hopperVisible, setHopperVisible] = useState(false);

  const pullOffset = useSharedValue(0);

  const openHopper = useCallback(() => setHopperVisible(true), []);
  const closeHopper = useCallback(() => setHopperVisible(false), []);

  const panGesture = Gesture.Pan()
    .activeOffsetY(10)
    .onUpdate((e) => {
      if (e.translationY > 0) {
        // Dampen the pull: logarithmic resistance
        pullOffset.value = Math.min(e.translationY * 0.5, 120);
      }
    })
    .onEnd((e) => {
      if (e.translationY > PULL_THRESHOLD) {
        runOnJS(openHopper)();
      }
      pullOffset.value = withSpring(0, { damping: 20, stiffness: 200 });
    });

  const pullStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pullOffset.value }],
  }));

  const handleSelectTime = (bucket: TimeBucket) => {
    dispatch({ type: 'SELECT_TIME', bucket });
  };

  const handleAnimationComplete = () => {
    dispatch({ type: 'ANIMATION_COMPLETE' });
    router.push('/task-card');
  };

  return (
    <SafeAreaView style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.content, pullStyle]}>
          {/* Pull-down hint */}
          <PullDownHint />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>碎片时间拼图</Text>
            <StaminaIndicator current={state.stamina} max={MAX_STAMINA} />
          </View>

          {/* Machine Area */}
          <View style={styles.machineArea}>
            <View style={styles.machineBody}>
              <View style={styles.machineGlobe}>
                {state.phase === 'animating' ? (
                  <CapsuleAnimation
                    isPlaying
                    timeBucket={state.selectedTimeBucket}
                    onComplete={handleAnimationComplete}
                  />
                ) : (
                  <View style={styles.machineIdle}>
                    <MaterialIcons name="casino" size={64} color="#B0BEC5" />
                    <Text style={styles.machineHint}>选择时间，开启扭蛋</Text>
                  </View>
                )}
              </View>
              <View style={styles.machineSlot} />
            </View>
          </View>

          {/* Quick Buttons */}
          <View style={styles.buttonsArea}>
            <QuickButtons
              onSelect={handleSelectTime}
              disabled={state.phase !== 'idle'}
            />
          </View>
        </Animated.View>
      </GestureDetector>

      {/* Hopper Overlay */}
      <HopperOverlay visible={hopperVisible} onDismiss={closeHopper} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  machineArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  machineBody: {
    alignItems: 'center',
  },
  machineGlobe: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  machineIdle: {
    alignItems: 'center',
    gap: 12,
  },
  machineHint: {
    fontSize: 14,
    color: '#90A4AE',
    fontWeight: '500',
  },
  machineSlot: {
    width: 100,
    height: 16,
    backgroundColor: '#CFD8DC',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginTop: -2,
  },
  buttonsArea: {
    paddingBottom: 40,
  },
});
