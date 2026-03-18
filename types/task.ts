export type TimeBucket = 3 | 5 | 15;

export type ContextType = 'mobile' | 'focused' | 'any';

export type CognitiveLoad = 'low' | 'medium' | 'high';

export interface MicroTask {
  id: string;
  parentTaskId: string;
  title: string;
  estimate: number;
  requiredContext: ContextType;
  cognitiveLoad: CognitiveLoad;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  completedAt?: number;
  order: number;
}

/** Raw task dumped into the inbox — unprocessed, no structure required */
export interface RawTask {
  id: string;
  text: string;
  createdAt: number;
  source: 'text' | 'voice' | 'share';
  processed: boolean;
}
