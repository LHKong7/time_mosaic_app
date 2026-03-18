import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';
import type { RawTask } from '@/types/task';

interface InboxState {
  tasks: RawTask[];
}

type InboxAction =
  | { type: 'ADD_TASK'; text: string; source: RawTask['source'] }
  | { type: 'MARK_PROCESSED'; id: string };

let counter = 0;

function inboxReducer(state: InboxState, action: InboxAction): InboxState {
  switch (action.type) {
    case 'ADD_TASK': {
      counter += 1;
      const task: RawTask = {
        id: `raw-${Date.now()}-${counter}`,
        text: action.text,
        createdAt: Date.now(),
        source: action.source,
        processed: false,
      };
      return { tasks: [task, ...state.tasks] };
    }

    case 'MARK_PROCESSED':
      return {
        tasks: state.tasks.map((t) =>
          t.id === action.id ? { ...t, processed: true } : t
        ),
      };

    default:
      return state;
  }
}

const initialState: InboxState = { tasks: [] };

const InboxContext = createContext<{
  state: InboxState;
  dispatch: React.Dispatch<InboxAction>;
  dumpTask: (text: string, source?: RawTask['source']) => void;
}>({
  state: initialState,
  dispatch: () => {},
  dumpTask: () => {},
});

export function InboxProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(inboxReducer, initialState);

  const dumpTask = useCallback(
    (text: string, source: RawTask['source'] = 'text') => {
      dispatch({ type: 'ADD_TASK', text, source });
    },
    [dispatch]
  );

  return (
    <InboxContext.Provider value={{ state, dispatch, dumpTask }}>
      {children}
    </InboxContext.Provider>
  );
}

export function useInbox() {
  return useContext(InboxContext);
}
