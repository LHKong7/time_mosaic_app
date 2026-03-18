# Landing Page Implementation - Time Gacha Machine

## Summary

Implemented the core landing page with the "Time Gacha Machine" (时间扭蛋机) interaction, including tab navigation, gacha animation, task card modal, and stamina system.

## Files Created

### Foundation (copied from app-example with modifications)
- `components/themed-text.tsx` — Themed text component
- `components/themed-view.tsx` — Themed view component
- `components/haptic-tab.tsx` — Tab bar haptic feedback
- `components/ui/icon-symbol.tsx` — Icon mapping (added dice/grid-view/account-circle for tabs)
- `components/ui/icon-symbol.ios.tsx` — iOS SF Symbols variant
- `constants/theme.ts` — Color and font constants
- `hooks/use-color-scheme.ts` — Color scheme hook
- `hooks/use-color-scheme.web.ts` — Web color scheme hook
- `hooks/use-theme-color.ts` — Theme color resolution

### Types & Constants
- `types/task.ts` — Core types: `TimeBucket`, `MicroTask`, `ContextType`, `CognitiveLoad`
- `constants/task-config.ts` — Time buckets, stamina config, bucket colors/labels
- `constants/mock-tasks.ts` — 15 mock micro-tasks across various time/context/load categories

### State Management
- `contexts/gacha-context.tsx` — React Context + useReducer managing gacha state machine (idle → animating → showing_card), stamina (0-5), task matching from mock data, skip logic

### Navigation
- `app/_layout.tsx` — Modified: root Stack with ThemeProvider, GachaProvider, (tabs) group, task-card modal route
- `app/(tabs)/_layout.tsx` — Three-tab navigator: 扭蛋 (home), 拼图 (mosaic), 我的 (profile)
- `app/(tabs)/index.tsx` — Home screen with gacha machine UI
- `app/(tabs)/mosaic.tsx` — Placeholder mosaic tab
- `app/(tabs)/profile.tsx` — Placeholder profile tab
- `app/task-card.tsx` — Task card modal with start/skip actions

### Components
- `components/capsule-machine/quick-buttons.tsx` — 3/5/15 min selection buttons with Reanimated spring press animation
- `components/capsule-machine/capsule-animation.tsx` — Gacha pop-out animation (scale + translate + rotate with Reanimated 4)
- `components/task/task-card-display.tsx` — Task card UI with title, time estimate, context, and cognitive load badges
- `components/ui/stamina-indicator.tsx` — Lightning bolt stamina display (filled/empty)

### Deleted
- `app/index.tsx` — Removed to avoid routing conflict with `app/(tabs)/index.tsx`

## Architecture Decisions

- **State**: React Context + useReducer (no Zustand yet since it's not installed). State shape designed for easy migration to Zustand later.
- **Animation**: Pure Reanimated 4 (withSpring, withSequence, withTiming, layout animations). No Lottie dependency needed.
- **Mock data**: 15 mock MicroTasks for testing. Task matching randomly selects from candidates filtered by time bucket and skipped IDs.
- **Stamina**: Starts at 5, each "skip" costs 1, "start timer" restores 2 (capped at 5). Skip button disabled at 0.

## Next Steps

- Install Zustand and migrate from Context to store
- Implement actual timer/countdown screen
- Add expo-sqlite for task persistence
- Integrate AI task decomposition (Claude API)
- Build mosaic/puzzle system
