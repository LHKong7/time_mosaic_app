import type { MicroTask, TimeBucket } from '@/types/task';
import type { ContextSnapshot } from '@/types/context';

interface MatchParams {
  timeBucket: TimeBucket;
  context: ContextSnapshot;
  excludeIds: string[];
}

interface ScoredTask {
  task: MicroTask;
  score: number;
}

const WEIGHTS = {
  timeFit: 0.30,
  contextFit: 0.25,
  energyFit: 0.20,
  priority: 0.15,
  freshness: 0.10,
};

function timeFitScore(estimate: number, bucket: TimeBucket): number {
  return 1 - Math.abs(estimate - bucket) / bucket;
}

function contextFitScore(
  required: MicroTask['requiredContext'],
  motionState: ContextSnapshot['motionState']
): number {
  if (required === 'any') return 0.7;
  if (motionState === 'stationary') return 1.0; // stationary can do anything
  // mobile context (walking/commuting)
  if (required === 'mobile') return 1.0;
  return 0; // focused tasks can't be done while moving
}

function energyFitScore(
  cognitiveLoad: MicroTask['cognitiveLoad'],
  energyLevel: ContextSnapshot['energyLevel']
): number {
  const loadRank = { low: 1, medium: 2, high: 3 };
  const energyRank = { low: 1, medium: 2, high: 3 };
  return loadRank[cognitiveLoad] <= energyRank[energyLevel] ? 1.0 : 0;
}

// For MVP without parent task data, use a fixed moderate priority
function priorityScore(): number {
  return 0.66; // equivalent to priority=2 → (4-2)/3
}

// For MVP without createdAt on tasks, use a fixed moderate freshness
function freshnessScore(): number {
  return 0.5;
}

export function matchTask(
  candidates: MicroTask[],
  params: MatchParams
): MicroTask | null {
  const { timeBucket, context, excludeIds } = params;

  const eligible = candidates.filter(
    (t) =>
      t.estimate <= timeBucket &&
      t.status === 'pending' &&
      !excludeIds.includes(t.id)
  );

  if (eligible.length === 0) return null;

  const scored: ScoredTask[] = eligible.map((task) => {
    const score =
      WEIGHTS.timeFit * timeFitScore(task.estimate, timeBucket) +
      WEIGHTS.contextFit * contextFitScore(task.requiredContext, context.motionState) +
      WEIGHTS.energyFit * energyFitScore(task.cognitiveLoad, context.energyLevel) +
      WEIGHTS.priority * priorityScore() +
      WEIGHTS.freshness * freshnessScore();

    return { task, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Add slight randomness among top candidates to avoid always returning same task
  const topScore = scored[0].score;
  const topTier = scored.filter((s) => topScore - s.score < 0.05);
  const pick = topTier[Math.floor(Math.random() * topTier.length)];

  return pick.task;
}
