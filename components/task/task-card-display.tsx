import { StyleSheet, View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import type { MicroTask } from '@/types/task';

interface TaskCardDisplayProps {
  task: MicroTask;
}

const CONTEXT_LABELS: Record<string, string> = {
  mobile: '移动中可做',
  focused: '需要专注',
  any: '随时可做',
};

const LOAD_CONFIG: Record<string, { label: string; color: string }> = {
  low: { label: '轻松', color: '#4CAF50' },
  medium: { label: '适中', color: '#FF9800' },
  high: { label: '专注', color: '#F44336' },
};

export function TaskCardDisplay({ task }: TaskCardDisplayProps) {
  const loadConfig = LOAD_CONFIG[task.cognitiveLoad];

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{task.title}</Text>

      <View style={styles.badges}>
        <View style={styles.badge}>
          <MaterialIcons name="schedule" size={16} color="#666" />
          <Text style={styles.badgeText}>~{task.estimate} min</Text>
        </View>

        <View style={styles.badge}>
          <MaterialIcons name="place" size={16} color="#666" />
          <Text style={styles.badgeText}>{CONTEXT_LABELS[task.requiredContext]}</Text>
        </View>

        <View style={[styles.badge, { backgroundColor: loadConfig.color + '20' }]}>
          <View style={[styles.loadDot, { backgroundColor: loadConfig.color }]} />
          <Text style={[styles.badgeText, { color: loadConfig.color }]}>
            {loadConfig.label}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    marginHorizontal: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 20,
    lineHeight: 30,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  loadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
