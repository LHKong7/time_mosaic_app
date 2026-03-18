import { StyleSheet, View, Text, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
  SlideInRight,
  SlideOutLeft,
  FadeIn,
} from 'react-native-reanimated';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useGacha } from '@/contexts/gacha-context';
import { TaskCardDisplay } from '@/components/task/task-card-display';
import { StaminaIndicator } from '@/components/ui/stamina-indicator';
import { MAX_STAMINA, BUCKET_COLORS } from '@/constants/task-config';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function TaskCardScreen() {
  const { state, dispatch } = useGacha();
  const router = useRouter();

  const startScale = useSharedValue(1);
  const skipScale = useSharedValue(1);

  const startAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: startScale.value }],
  }));

  const skipAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: skipScale.value }],
  }));

  const handleStart = () => {
    dispatch({ type: 'START_TIMER' });
    router.back();
    // TODO: navigate to timer screen
  };

  const handleSkip = () => {
    if (state.stamina <= 0) return;
    dispatch({ type: 'SKIP_TASK' });
  };

  const handleClose = () => {
    dispatch({ type: 'RESET' });
    router.back();
  };

  const bucketColor = state.selectedTimeBucket
    ? BUCKET_COLORS[state.selectedTimeBucket]
    : '#9C27B0';

  if (!state.currentTask) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <MaterialIcons name="sentiment-dissatisfied" size={64} color="#B0BEC5" />
          <Text style={styles.emptyTitle}>没有匹配的任务</Text>
          <Text style={styles.emptySubtitle}>试试其他时间段，或添加更多任务</Text>
          <Pressable style={styles.backButton} onPress={handleClose}>
            <Text style={styles.backButtonText}>返回</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Close button */}
      <Pressable style={styles.closeButton} onPress={handleClose}>
        <MaterialIcons name="close" size={24} color="#666" />
      </Pressable>

      {/* Time bucket badge */}
      <Animated.View entering={FadeIn.duration(400)} style={styles.topBadge}>
        <View style={[styles.timeBadge, { backgroundColor: bucketColor }]}>
          <MaterialIcons name="schedule" size={18} color="#fff" />
          <Text style={styles.timeBadgeText}>
            {state.selectedTimeBucket} 分钟挑战
          </Text>
        </View>
      </Animated.View>

      {/* Task Card */}
      <View style={styles.cardArea}>
        <Animated.View
          key={state.currentTask.id}
          entering={SlideInRight.springify().damping(18)}
        >
          <TaskCardDisplay task={state.currentTask} />
        </Animated.View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <AnimatedPressable
          style={[styles.startButton, { backgroundColor: bucketColor }, startAnimatedStyle]}
          onPressIn={() => {
            startScale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
          }}
          onPressOut={() => {
            startScale.value = withSpring(1, { damping: 10, stiffness: 200 });
          }}
          onPress={handleStart}
        >
          <MaterialIcons name="play-arrow" size={24} color="#fff" />
          <Text style={styles.startButtonText}>开始计时</Text>
        </AnimatedPressable>

        <AnimatedPressable
          style={[
            styles.skipButton,
            state.stamina <= 0 && styles.skipButtonDisabled,
            skipAnimatedStyle,
          ]}
          onPressIn={() => {
            if (state.stamina > 0) {
              skipScale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
            }
          }}
          onPressOut={() => {
            skipScale.value = withSpring(1, { damping: 10, stiffness: 200 });
          }}
          onPress={handleSkip}
          disabled={state.stamina <= 0}
        >
          <Text style={[styles.skipButtonText, state.stamina <= 0 && styles.skipTextDisabled]}>
            换一个
          </Text>
          <View style={styles.staminaCost}>
            <StaminaIndicator current={state.stamina} max={MAX_STAMINA} />
          </View>
        </AnimatedPressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  closeButton: {
    position: 'absolute',
    top: 56,
    right: 20,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBadge: {
    alignItems: 'center',
    marginTop: 60,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timeBadgeText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  cardArea: {
    flex: 1,
    justifyContent: 'center',
  },
  actions: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  skipButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    gap: 6,
  },
  skipButtonDisabled: {
    opacity: 0.5,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  skipTextDisabled: {
    color: '#B0B0B0',
  },
  staminaCost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#455A64',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#90A4AE',
    textAlign: 'center',
  },
  backButton: {
    marginTop: 20,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#455A64',
  },
});
