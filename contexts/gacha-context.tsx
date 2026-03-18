import { createContext, useContext, useReducer, type ReactNode } from 'react';

import { INITIAL_STAMINA, MAX_STAMINA } from '@/constants/task-config';
import { MOCK_MICRO_TASKS } from '@/constants/mock-tasks';
import type { MicroTask, TimeBucket } from '@/types/task';

type Phase = 'idle' | 'animating' | 'showing_card';

interface GachaState {
  stamina: number;
  currentTask: MicroTask | null;
  selectedTimeBucket: TimeBucket | null;
  skippedIds: string[];
  phase: Phase;
}

type GachaAction =
  | { type: 'SELECT_TIME'; bucket: TimeBucket }
  | { type: 'ANIMATION_COMPLETE' }
  | { type: 'SKIP_TASK' }
  | { type: 'START_TIMER' }
  | { type: 'RESET' };

function matchTask(bucket: TimeBucket, skippedIds: string[]): MicroTask | null {
  const candidates = MOCK_MICRO_TASKS.filter(
    (t) => t.estimate <= bucket && t.status === 'pending' && !skippedIds.includes(t.id)
  );
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function gachaReducer(state: GachaState, action: GachaAction): GachaState {
  switch (action.type) {
    case 'SELECT_TIME':
      return {
        ...state,
        selectedTimeBucket: action.bucket,
        skippedIds: [],
        phase: 'animating',
      };

    case 'ANIMATION_COMPLETE': {
      const task = matchTask(state.selectedTimeBucket!, state.skippedIds);
      return {
        ...state,
        currentTask: task,
        phase: 'showing_card',
      };
    }

    case 'SKIP_TASK': {
      if (state.stamina <= 0 || !state.currentTask) return state;
      const newSkippedIds = [...state.skippedIds, state.currentTask.id];
      const nextTask = matchTask(state.selectedTimeBucket!, newSkippedIds);
      return {
        ...state,
        stamina: state.stamina - 1,
        skippedIds: newSkippedIds,
        currentTask: nextTask,
      };
    }

    case 'START_TIMER':
      return {
        ...state,
        phase: 'idle',
        currentTask: null,
        selectedTimeBucket: null,
        skippedIds: [],
        stamina: Math.min(MAX_STAMINA, state.stamina + 2),
      };

    case 'RESET':
      return {
        ...state,
        phase: 'idle',
        currentTask: null,
        selectedTimeBucket: null,
        skippedIds: [],
      };

    default:
      return state;
  }
}

const initialState: GachaState = {
  stamina: INITIAL_STAMINA,
  currentTask: null,
  selectedTimeBucket: null,
  skippedIds: [],
  phase: 'idle',
};

const GachaContext = createContext<{
  state: GachaState;
  dispatch: React.Dispatch<GachaAction>;
}>({ state: initialState, dispatch: () => {} });

export function GachaProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gachaReducer, initialState);
  return (
    <GachaContext.Provider value={{ state, dispatch }}>
      {children}
    </GachaContext.Provider>
  );
}

export function useGacha() {
  return useContext(GachaContext);
}
