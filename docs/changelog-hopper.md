# The Hopper (记忆漏斗) — Zero-Friction Task Dump

## Summary

Implemented "The Hopper" — a pull-down overlay for dumping raw tasks/anxieties into the app with zero friction. No categories, no deadlines, no priority selection. Just text in, shredder animation, done.

## User Flow

```
首页下拉 → 弹出记忆漏斗面板 → 巨型输入框 → 输入模糊焦虑 → 点击"丢入黑洞" → 粉碎动画 → 自动返回扭蛋机
```

## Files Created

### Types
- `types/task.ts` — Added `RawTask` interface (id, text, createdAt, source, processed)
- `types/mosaic.ts` — PuzzlePiece, DailyCanvas, PieceShape types (for future use)
- `types/context.ts` — EnergyLevel, MotionState, ContextSnapshot types (for future use)

### State Management
- `contexts/inbox-context.tsx` — InboxProvider with `dumpTask()` convenience method. Stores raw unprocessed tasks. Actions: ADD_TASK, MARK_PROCESSED.

### Hopper Components
- `components/hopper/hopper-overlay.tsx` — Full overlay panel that slides down from top. Contains:
  - Giant multiline TextInput (placeholder: "下周要交述职报告...")
  - Mic button placeholder (for future voice input)
  - "丢入黑洞" submit button (disabled when empty)
  - Shredder animation phase after submit
  - Auto-dismiss on completion
- `components/hopper/shredder-animation.tsx` — Text-to-void animation:
  - Characters split apart and fly outward
  - Then sucked into a spinning black hole (cyclone icon)
  - Black hole implodes, green checkmark appears
  - ~2s total duration
- `components/hopper/pull-down-hint.tsx` — Subtle bouncing chevron at top of home screen to hint at pull-down gesture

### Services (for future use)
- `services/ai/task-matcher.ts` — Weighted scoring algorithm (timeFit 0.30, contextFit 0.25, energyFit 0.20, priority 0.15, freshness 0.10)
- `services/mosaic/piece-generator.ts` — Generates puzzle pieces from completed tasks

### Constants
- `constants/mosaic-config.ts` — Shape mappings, cell counts, piece colors

## Files Modified

- `app/_layout.tsx` — Added GestureHandlerRootView wrapper + InboxProvider
- `app/(tabs)/index.tsx` — Added pan gesture detector (pull-down triggers hopper), PullDownHint, HopperOverlay component
- `types/task.ts` — Added RawTask interface

## Architecture Decisions

- **Pull-down gesture**: Uses `react-native-gesture-handler` Gesture.Pan() with logarithmic damping. Threshold of 80px triggers the hopper.
- **Overlay approach**: The hopper is a component overlay within the home screen (not a route/modal), so it feels like part of the home screen interaction.
- **Phase machine**: The hopper has 3 phases: `input` → `shredding` → `done`. Auto-dismiss after shredding completes.
- **Inbox storage**: Raw tasks stored in InboxContext (in-memory). Will be persisted to SQLite later and processed by AI task shredder.

## Next Steps

- Wire inbox tasks to AI shredder (Claude API) for automatic decomposition
- Add voice input via expo-speech or native speech recognition
- Add external share intent handler for receiving content from other apps
- Persist inbox to SQLite
