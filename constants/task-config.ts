import type { TimeBucket } from '@/types/task';

export const TIME_BUCKETS: readonly TimeBucket[] = [3, 5, 15] as const;

export const MAX_STAMINA = 5;
export const INITIAL_STAMINA = 5;

export const BUCKET_COLORS: Record<TimeBucket, string> = {
  3: '#4CAF50',
  5: '#2196F3',
  15: '#9C27B0',
};

export const BUCKET_LABELS: Record<TimeBucket, string> = {
  3: '3 min',
  5: '5 min',
  15: '15 min',
};
