# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Time Mosaic (碎片时间拼图)** — a React Native mobile app that turns fragmented spare time into productive micro-task sessions through a "gacha machine" metaphor. Users select a time bucket (3/5/15 min), get matched with a micro-task, complete it with a countdown timer, and earn puzzle pieces that form a daily pixel art canvas.

The project is in early development — the `app/` directory has been reset to a blank state (scaffold only). The full starter example code lives in `app-example/`. The target architecture is defined in `TECHNICAL_SPEC.md`.

## Tech Stack

- **Framework**: Expo 54 (Managed workflow), React Native 0.81 with New Architecture enabled
- **Language**: TypeScript 5.9 (strict mode)
- **Routing**: Expo Router 6 (file-based routing with typed routes)
- **UI/Animation**: React Native Reanimated 4, React 19 with React Compiler enabled
- **State Management**: Zustand (to be added)
- **Local Storage**: expo-sqlite (to be added)
- **AI**: Anthropic Claude API via `@anthropic-ai/sdk` (to be added)
- **Path alias**: `@/*` maps to project root (configured in tsconfig.json)

## Commands

```bash
npm install          # Install dependencies
npx expo start       # Start dev server (press a/i/w for Android/iOS/Web)
npm run android      # Start on Android
npm run ios          # Start on iOS
npm run web          # Start on Web
npm run lint         # Run ESLint (expo lint)
```

## Architecture

### Navigation Structure (target)

```
Root Stack (app/_layout.tsx)
├── (tabs)/
│   ├── index.tsx       — Home: "Time Gacha Machine" (capsule machine)
│   ├── mosaic.tsx      — Puzzle Gallery: daily pixel art canvas
│   └── profile.tsx     — Profile: energy settings, achievements
├── task-card.tsx       — Task card detail (modal)
├── timer.tsx           — Countdown / immersive mode (fullscreen modal)
└── task-manager.tsx    — Task management / AI decomposition (modal)
```

### Key Modules (to be built)

- **Task Matcher** (`services/ai/task-matcher.ts`): Scores and matches micro-tasks to time slots using weighted criteria (time fit, context fit, energy fit, priority, freshness)
- **AI Task Shredder** (`services/ai/task-shredder.ts`): Calls Claude API to decompose large tasks into ≤15-min micro-tasks with context and cognitive load annotations
- **Context Engine** (`services/context/`): Uses accelerometer + Wi-Fi to detect motion state (stationary/walking/commuting) and filter tasks accordingly
- **Mosaic System** (`services/mosaic/`): Generates puzzle pieces from completed tasks (shape determined by duration), renders them on a daily pixel art canvas
- **Zustand Stores** (`stores/`): task-store, timer-store, mosaic-store, context-store, user-store

### Core Data Flow

```
User selects time (3/5/15 min) → Gacha animation → TaskMatcher scores pending micro-tasks
→ Show top-match card → User starts timer → Countdown/immersive mode
→ Task complete → Generate puzzle piece → Place on daily canvas
```

### Key Constraints

- Micro-tasks must be ≤ 15 minutes
- User has a "stamina" system (0-5 points) that limits task re-rolls; recovers 1/hour or 2 on task completion
- All core features must work offline; AI decomposition degrades to manual mode without network
- Sensor data stays on-device; API calls send only task title/description
- API keys stored via `expo-secure-store`, never hardcoded

## Metro Config Note

Metro is configured with polling-based file watching (watchman disabled) for compatibility with network/shared filesystems (e.g. Parallels shared folders). See `metro.config.js`.


## extra
Once you finished a coding task, you should write down a markdown documentation to record what you have changed and track your changes for further development.
