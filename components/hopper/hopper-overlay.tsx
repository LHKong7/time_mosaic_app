import { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Keyboard,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Extrapolation,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useInbox } from '@/contexts/inbox-context';
import { ShredderAnimation } from './shredder-animation';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface HopperOverlayProps {
  visible: boolean;
  onDismiss: () => void;
}

type Phase = 'input' | 'shredding' | 'done';

export function HopperOverlay({ visible, onDismiss }: HopperOverlayProps) {
  const { dumpTask } = useInbox();
  const [text, setText] = useState('');
  const [phase, setPhase] = useState<Phase>('input');
  const inputRef = useRef<TextInput>(null);

  const slideY = useSharedValue(-SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setPhase('input');
      setText('');
      slideY.value = withSpring(0, { damping: 20, stiffness: 120 });
      backdropOpacity.value = withTiming(1, { duration: 300 });
      // Auto-focus the input after animation settles
      setTimeout(() => inputRef.current?.focus(), 400);
    } else {
      slideY.value = withTiming(-SCREEN_HEIGHT, {
        duration: 300,
        easing: Easing.in(Easing.cubic),
      });
      backdropOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [visible]);

  const overlayStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slideY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const handleDump = () => {
    if (!text.trim()) return;
    Keyboard.dismiss();
    dumpTask(text.trim(), 'text');
    setPhase('shredding');
  };

  const handleShredComplete = () => {
    setPhase('done');
    // Auto-dismiss after brief pause
    setTimeout(() => {
      onDismiss();
    }, 300);
  };

  const handleClose = () => {
    Keyboard.dismiss();
    onDismiss();
  };

  return (
    <>
      {/* Backdrop */}
      {visible && (
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        </Animated.View>
      )}

      {/* Hopper Panel */}
      <Animated.View style={[styles.panel, overlayStyle]} pointerEvents={visible ? 'auto' : 'none'}>
        {/* Drag handle */}
        <View style={styles.handleBar}>
          <View style={styles.handle} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MaterialIcons name="filter-list" size={24} color="#546E7A" />
            <Text style={styles.title}>记忆漏斗</Text>
          </View>
          <Pressable onPress={handleClose} hitSlop={12}>
            <MaterialIcons name="close" size={22} color="#90A4AE" />
          </Pressable>
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>把脑子里的东西倒出来，不用想太多</Text>

        {phase === 'input' && (
          <>
            {/* Giant Input */}
            <View style={styles.inputContainer}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder="下周要交述职报告..."
                placeholderTextColor="#B0BEC5"
                multiline
                maxLength={500}
                value={text}
                onChangeText={setText}
                textAlignVertical="top"
              />
            </View>

            {/* Bottom actions */}
            <View style={styles.actions}>
              {/* Voice button (placeholder) */}
              <Pressable style={styles.voiceButton}>
                <MaterialIcons name="mic" size={24} color="#90A4AE" />
              </Pressable>

              {/* Dump button */}
              <Pressable
                style={[
                  styles.dumpButton,
                  !text.trim() && styles.dumpButtonDisabled,
                ]}
                onPress={handleDump}
                disabled={!text.trim()}
              >
                <MaterialIcons
                  name="whatshot"
                  size={22}
                  color={text.trim() ? '#fff' : '#B0BEC5'}
                />
                <Text
                  style={[
                    styles.dumpButtonText,
                    !text.trim() && styles.dumpButtonTextDisabled,
                  ]}
                >
                  丢入黑洞
                </Text>
              </Pressable>
            </View>
          </>
        )}

        {phase === 'shredding' && (
          <View style={styles.shredderArea}>
            <ShredderAnimation
              isPlaying
              text={text}
              onComplete={handleShredComplete}
            />
            <Text style={styles.shredderHint}>正在粉碎焦虑...</Text>
          </View>
        )}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 100,
  },
  panel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 101,
    backgroundColor: '#FAFBFC',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingBottom: 20,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    minHeight: 380,
  },
  handleBar: {
    alignItems: 'center',
    paddingTop: 56,
    paddingBottom: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CFD8DC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#263238',
  },
  subtitle: {
    fontSize: 13,
    color: '#90A4AE',
    paddingHorizontal: 24,
    marginTop: 4,
    marginBottom: 16,
  },
  inputContainer: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    minHeight: 120,
    maxHeight: 180,
  },
  input: {
    fontSize: 18,
    lineHeight: 26,
    color: '#263238',
    padding: 16,
    minHeight: 120,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 16,
  },
  voiceButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ECEFF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dumpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#263238',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
  },
  dumpButtonDisabled: {
    backgroundColor: '#ECEFF1',
  },
  dumpButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  dumpButtonTextDisabled: {
    color: '#B0BEC5',
  },
  shredderArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  shredderHint: {
    fontSize: 14,
    color: '#78909C',
    marginTop: 8,
    fontWeight: '500',
  },
});
