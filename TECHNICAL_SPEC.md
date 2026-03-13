# 碎片时间拼图 (Time Mosaic) — 技术规格文档

> 版本：v1.0
> 最后更新：2026-03-13
> 对应 PRD：碎片时间拼图 (Time Mosaic) v1

---

## 一、技术栈总览

| 层级 | 技术选型 | 版本 | 说明 |
|------|----------|------|------|
| 框架 | Expo (Managed) | 54.x | 跨平台 React Native 开发框架 |
| 运行时 | React Native | 0.81.x | New Architecture 已启用 |
| UI 层 | React | 19.x | React Compiler 实验性功能已开启 |
| 语言 | TypeScript | 5.9.x | 严格模式（strict: true） |
| 路由 | Expo Router | 6.x | 基于文件系统的路由，支持 Typed Routes |
| 导航 | React Navigation | 7.x | Bottom Tabs + Stack Navigator |
| 动画 | React Native Reanimated | 4.x | 用于拼图动画、扭蛋机交互、倒计时 |
| 状态管理 | Zustand | — | 轻量级，需新增 |
| 本地存储 | expo-sqlite | — | 任务/拼图数据本地持久化，需新增 |
| AI 接口 | Anthropic Claude API | — | 任务拆解引擎，需新增 |
| 推送 | Expo Notifications | — | 碎片时间提醒，需新增 |
| 传感器 | expo-sensors / expo-location | — | 环境感知（加速度计/GPS），需新增 |

---

## 二、项目目录结构（目标态）

```
time-mosaic-app/
├── app/                            # Expo Router 文件路由
│   ├── _layout.tsx                 # 根布局（ThemeProvider + 全局状态）
│   ├── (tabs)/
│   │   ├── _layout.tsx             # Tab 导航配置
│   │   ├── index.tsx               # 首页 — 时间扭蛋机
│   │   ├── mosaic.tsx              # 拼图画廊 — 每日视觉画作
│   │   └── profile.tsx             # 个人中心 — 精力设置/收集荣誉
│   ├── task-card.tsx               # 任务卡片（全屏 Modal）
│   ├── timer.tsx                   # 倒计时/沉浸模式
│   └── task-manager.tsx            # 任务管理（添加/AI拆解）
├── components/
│   ├── ui/                         # 基础 UI 组件
│   │   ├── icon-symbol.tsx
│   │   ├── icon-symbol.ios.tsx
│   │   ├── collapsible.tsx
│   │   ├── button.tsx              # 通用按钮（新增）
│   │   ├── slider.tsx              # 精力滑块（新增）
│   │   └── card.tsx                # 卡片容器（新增）
│   ├── capsule-machine/            # 扭蛋机模块（新增）
│   │   ├── time-dial.tsx           # 时间刻度盘
│   │   ├── quick-buttons.tsx       # 3min / 5min / 15min 快捷按钮
│   │   └── capsule-animation.tsx   # 扭蛋弹出动画
│   ├── task/                       # 任务相关组件（新增）
│   │   ├── task-card.tsx           # 任务卡片展示
│   │   ├── task-input.tsx          # 任务输入表单
│   │   └── shredder-preview.tsx    # AI 拆解预览
│   ├── timer/                      # 计时器模块（新增）
│   │   ├── countdown-ring.tsx      # 环形倒计时
│   │   └── immersive-overlay.tsx   # 沉浸模式遮罩
│   ├── mosaic/                     # 拼图系统（新增）
│   │   ├── puzzle-piece.tsx        # 单个拼图块
│   │   ├── daily-canvas.tsx        # 每日画布
│   │   ├── pixel-art-renderer.tsx  # 像素画渲染器
│   │   └── share-poster.tsx        # 分享海报生成
│   ├── themed-text.tsx
│   ├── themed-view.tsx
│   ├── parallax-scroll-view.tsx
│   ├── haptic-tab.tsx
│   ├── hello-wave.tsx
│   └── external-link.tsx
├── stores/                         # Zustand 状态管理（新增）
│   ├── task-store.ts               # 任务状态
│   ├── timer-store.ts              # 计时器状态
│   ├── mosaic-store.ts             # 拼图/视觉奖励状态
│   ├── context-store.ts            # 环境感知状态
│   └── user-store.ts               # 用户偏好/精力值/体力值
├── services/                       # 业务服务层（新增）
│   ├── ai/
│   │   ├── task-shredder.ts        # AI 任务粉碎机
│   │   ├── prompt-templates.ts     # LLM Prompt 模板
│   │   └── task-matcher.ts         # 任务匹配算法
│   ├── context/
│   │   ├── motion-detector.ts      # 运动状态检测
│   │   ├── location-tracker.ts     # 位置/Wi-Fi 环境识别
│   │   └── context-engine.ts       # 综合场景判定
│   ├── mosaic/
│   │   ├── piece-generator.ts      # 拼图块生成算法
│   │   ├── canvas-composer.ts      # 画布合成
│   │   └── skin-manager.ts         # 拼图皮肤管理
│   └── storage/
│       ├── database.ts             # SQLite 数据库初始化
│       ├── task-repository.ts      # 任务 CRUD
│       └── mosaic-repository.ts    # 拼图数据 CRUD
├── constants/
│   ├── theme.ts                    # 颜色与字体
│   ├── task-config.ts              # 任务配置常量（新增）
│   └── mosaic-config.ts            # 拼图系统常量（新增）
├── hooks/
│   ├── use-color-scheme.ts
│   ├── use-color-scheme.web.ts
│   ├── use-theme-color.ts
│   ├── use-countdown.ts            # 倒计时 Hook（新增）
│   ├── use-context-sensing.ts      # 环境感知 Hook（新增）
│   └── use-haptic.ts               # 触觉反馈 Hook（新增）
├── types/                          # TypeScript 类型定义（新增）
│   ├── task.ts
│   ├── mosaic.ts
│   └── context.ts
├── assets/
│   ├── images/
│   ├── animations/                 # Lottie/Reanimated 动画资源（新增）
│   └── mosaic-skins/               # 拼图皮肤资源（新增）
└── scripts/
    └── reset-project.js
```

---

## 三、数据模型设计

### 3.1 核心实体

```typescript
// types/task.ts

/** 原始大任务 */
interface Task {
  id: string;
  title: string;                    // 用户输入的任务标题
  description?: string;             // 可选描述
  createdAt: number;                // Unix 时间戳
  status: 'pending' | 'in_progress' | 'completed';
  priority: 1 | 2 | 3;             // 1=高 2=中 3=低
  totalEstimate: number;            // 总预估时间（分钟）
  microTasks: MicroTask[];          // AI 拆解后的微任务
  tags: string[];                   // 用户标签
}

/** 原子化微任务 */
interface MicroTask {
  id: string;
  parentTaskId: string;
  title: string;                    // 微任务标题
  estimate: number;                 // 预估时间（分钟），≤ 15
  requiredContext: ContextType;     // 所需场景
  cognitiveLoad: 'low' | 'medium' | 'high';  // 认知负荷
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  completedAt?: number;
  order: number;                    // 在父任务中的顺序
}

/** 时间段枚举 */
type TimeBucket = 3 | 5 | 15;

/** 场景类型 */
type ContextType = 'mobile' | 'focused' | 'any';
```

```typescript
// types/mosaic.ts

/** 拼图块 */
interface PuzzlePiece {
  id: string;
  microTaskId: string;
  shape: PieceShape;               // 形状由时长决定
  colorTheme: string;              // 色彩主题
  earnedAt: number;                // 获得时间
  duration: number;                // 实际花费时间（分钟）
}

/** 拼图块形状 — 由任务时长映射 */
type PieceShape =
  | 'dot'       // 1-2 min
  | 'bar'       // 3 min
  | 'square'    // 5 min
  | 'L-shape'   // 10 min
  | 'T-shape';  // 15 min

/** 每日画布 */
interface DailyCanvas {
  date: string;                    // YYYY-MM-DD
  pieces: PuzzlePiece[];
  templateId: string;              // 像素画模板 ID
  completionRate: number;          // 0-1
  isShared: boolean;
}

/** 拼图皮肤 */
interface MosaicSkin {
  id: string;
  name: string;
  previewUri: string;
  unlockCondition: 'streak_7d' | 'total_100' | 'special_event';
  isUnlocked: boolean;
}
```

```typescript
// types/context.ts

/** 环境感知快照 */
interface ContextSnapshot {
  motionState: 'stationary' | 'walking' | 'commuting';
  connectedWifi?: string;
  energyLevel: 'low' | 'medium' | 'high';  // 用户手动设置
  timestamp: number;
}

/** 用户状态 */
interface UserState {
  stamina: number;                  // 虚拟体力值（0-5），"换一个"消耗 1
  staminaLastRefill: number;        // 上次恢复时间
  dailyStreak: number;              // 连续完成天数
  totalCompleted: number;           // 累计完成微任务数
  energyLevel: 'low' | 'medium' | 'high';
}
```

### 3.2 本地数据库 Schema（SQLite）

```sql
-- 任务表
CREATE TABLE tasks (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT,
  created_at    INTEGER NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending',
  priority      INTEGER NOT NULL DEFAULT 2,
  total_estimate INTEGER,
  tags          TEXT  -- JSON array
);

-- 微任务表
CREATE TABLE micro_tasks (
  id              TEXT PRIMARY KEY,
  parent_task_id  TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  estimate        INTEGER NOT NULL CHECK(estimate <= 15),
  required_context TEXT NOT NULL DEFAULT 'any',
  cognitive_load  TEXT NOT NULL DEFAULT 'medium',
  status          TEXT NOT NULL DEFAULT 'pending',
  completed_at    INTEGER,
  sort_order      INTEGER NOT NULL DEFAULT 0
);

-- 拼图块表
CREATE TABLE puzzle_pieces (
  id              TEXT PRIMARY KEY,
  micro_task_id   TEXT NOT NULL REFERENCES micro_tasks(id),
  shape           TEXT NOT NULL,
  color_theme     TEXT NOT NULL,
  earned_at       INTEGER NOT NULL,
  duration        INTEGER NOT NULL
);

-- 每日画布表
CREATE TABLE daily_canvases (
  date            TEXT PRIMARY KEY,  -- YYYY-MM-DD
  template_id     TEXT NOT NULL,
  completion_rate REAL NOT NULL DEFAULT 0,
  is_shared       INTEGER NOT NULL DEFAULT 0
);

-- 用户状态（单行表）
CREATE TABLE user_state (
  id                  INTEGER PRIMARY KEY CHECK(id = 1),
  stamina             INTEGER NOT NULL DEFAULT 5,
  stamina_last_refill INTEGER NOT NULL,
  daily_streak        INTEGER NOT NULL DEFAULT 0,
  total_completed     INTEGER NOT NULL DEFAULT 0,
  energy_level        TEXT NOT NULL DEFAULT 'medium'
);

-- 索引
CREATE INDEX idx_micro_tasks_parent ON micro_tasks(parent_task_id);
CREATE INDEX idx_micro_tasks_status ON micro_tasks(status, required_context, cognitive_load);
CREATE INDEX idx_puzzle_pieces_date ON puzzle_pieces(earned_at);
```

---

## 四、核心模块技术方案

### 4.1 时间扭蛋机（首页）

**路由**：`app/(tabs)/index.tsx`

**交互流程**：

```
用户进入 → 展示时间刻度盘 + 3个快捷按钮
                    ↓
         点击时间按钮（3/5/15 min）
                    ↓
     触发 capsule-animation（扭蛋弹出动效）
                    ↓
       调用 TaskMatcher.match(timeBucket, context)
                    ↓
         全屏 Modal 展示唯一任务卡片
                    ↓
        "开始计时" → 进入 timer.tsx
        "换一个"  → 消耗体力值，重新匹配
```

**关键实现**：

```typescript
// services/ai/task-matcher.ts

interface MatchParams {
  timeBucket: TimeBucket;
  context: ContextSnapshot;
  excludeIds: string[];           // 已跳过的任务 ID
}

interface MatchResult {
  microTask: MicroTask;
  matchScore: number;             // 匹配分数（调试用）
}

function matchTask(params: MatchParams): MatchResult | null {
  // 1. 过滤：时间 ≤ timeBucket 且 status = 'pending'
  // 2. 过滤：requiredContext 匹配当前场景
  // 3. 过滤：cognitiveLoad ≤ 当前精力等级
  // 4. 排序：priority DESC → estimate 与 timeBucket 的差值 ASC → order ASC
  // 5. 排除已跳过的 excludeIds
  // 6. 返回得分最高的 1 条
}
```

**动画方案**（Reanimated 4）：

- 快捷按钮点击 → `withSpring` 缩放反弹效果
- 扭蛋弹出 → `withSequence` 组合：旋转 → 弹跳 → 卡片展开
- 卡片切换（换一个）→ `withTiming` 左滑消失 + 右侧新卡片滑入

### 4.2 AI 任务粉碎机

**路由**：`app/task-manager.tsx`

**调用流程**：

```
用户输入大任务标题
        ↓
  调用 TaskShredder.shred(title)
        ↓
  构建 Prompt → 调用 Claude API
        ↓
  解析返回的 JSON → 校验约束
        ↓
  写入 SQLite → 更新 task-store
```

**Prompt 设计**：

```typescript
// services/ai/prompt-templates.ts

const SHRED_PROMPT = `
你是一个任务拆解专家。请将以下任务拆解为可执行的原子化微任务。

规则：
1. 每个微任务的预估时间 ≤ 15 分钟
2. 微任务标题必须是具体的、可执行的动作（以动词开头）
3. 标注每个微任务所需的场景：mobile（移动中可做）/ focused（需专注）/ any（任意）
4. 标注认知负荷：low / medium / high
5. 考虑任务切换的认知摩擦时间 Δt（通常 1-2 分钟）

任务：{taskTitle}
{taskDescription}

请以 JSON 格式返回：
{
  "totalEstimate": <总时间（分钟）>,
  "switchOverhead": <认知摩擦总时间>,
  "microTasks": [
    {
      "title": "<微任务标题>",
      "estimate": <预估分钟数>,
      "requiredContext": "mobile | focused | any",
      "cognitiveLoad": "low | medium | high",
      "order": <执行顺序>
    }
  ]
}
`;
```

**校验逻辑**：

```typescript
// services/ai/task-shredder.ts

function validateShredResult(result: ShredResult): boolean {
  const { microTasks, totalEstimate, switchOverhead } = result;

  // 约束 1：每个微任务 ≤ 15 分钟
  const allUnder15 = microTasks.every(t => t.estimate <= 15);

  // 约束 2：T_total = Σt_i + Δt
  const sumEstimates = microTasks.reduce((s, t) => s + t.estimate, 0);
  const isConsistent = Math.abs(totalEstimate - (sumEstimates + switchOverhead)) < 2;

  // 约束 3：至少拆出 2 个微任务
  const hasMinTasks = microTasks.length >= 2;

  return allUnder15 && isConsistent && hasMinTasks;
}
```

**API 调用**（使用 Anthropic SDK）：

```typescript
// services/ai/task-shredder.ts

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: CLAUDE_API_KEY });

async function shredTask(title: string, description?: string): Promise<ShredResult> {
  const prompt = SHRED_PROMPT
    .replace('{taskTitle}', title)
    .replace('{taskDescription}', description ?? '');

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type');

  const result: ShredResult = JSON.parse(content.text);

  if (!validateShredResult(result)) {
    throw new Error('AI shred result failed validation');
  }

  return result;
}
```

### 4.3 环境感知过滤器

**传感器数据采集**：

```typescript
// services/context/motion-detector.ts

import { Accelerometer } from 'expo-sensors';

/**
 * 运动状态判定逻辑：
 * - 静止：加速度变化 < 0.1g 持续 30 秒
 * - 步行：周期性加速度波动 0.1g ~ 0.5g
 * - 通勤：持续高频振动 + GPS 速度 > 20km/h
 */
function startMotionDetection(
  onStateChange: (state: MotionState) => void
): { stop: () => void } {
  const subscription = Accelerometer.addListener(({ x, y, z }) => {
    const magnitude = Math.sqrt(x * x + y * y + z * z);
    // 滑动窗口分析 magnitude 变化模式
    // 更新 motionState
  });

  Accelerometer.setUpdateInterval(500); // 500ms 采样

  return { stop: () => subscription.remove() };
}
```

**场景综合判定**：

```typescript
// services/context/context-engine.ts

function determineContext(
  motion: MotionState,
  wifi: string | null,
  energy: EnergyLevel
): ContextSnapshot {
  let motionState: ContextSnapshot['motionState'];

  if (motion === 'commuting') {
    motionState = 'commuting';
  } else if (motion === 'walking') {
    motionState = 'walking';
  } else {
    motionState = 'stationary';
  }

  return {
    motionState,
    connectedWifi: wifi ?? undefined,
    energyLevel: energy,
    timestamp: Date.now(),
  };
}

/**
 * 场景 → 任务过滤映射
 *
 * commuting → requiredContext = 'mobile'
 * walking   → requiredContext = 'mobile'
 * stationary + high energy → 不过滤
 * stationary + low energy  → cognitiveLoad = 'low'
 */
function getTaskFilter(context: ContextSnapshot): TaskFilter {
  const filter: TaskFilter = {};

  if (context.motionState !== 'stationary') {
    filter.requiredContext = 'mobile';
  }

  if (context.energyLevel === 'low') {
    filter.maxCognitiveLoad = 'low';
  } else if (context.energyLevel === 'medium') {
    filter.maxCognitiveLoad = 'medium';
  }

  return filter;
}
```

### 4.4 拼图系统

**拼图块生成**：

```typescript
// services/mosaic/piece-generator.ts

const SHAPE_MAP: Record<string, PieceShape> = {
  '1-2': 'dot',
  '3':   'bar',
  '5':   'square',
  '10':  'L-shape',
  '15':  'T-shape',
};

function generatePiece(microTask: MicroTask, actualDuration: number): PuzzlePiece {
  const bucket = actualDuration <= 2 ? '1-2'
    : actualDuration <= 3 ? '3'
    : actualDuration <= 5 ? '5'
    : actualDuration <= 10 ? '10'
    : '15';

  return {
    id: generateId(),
    microTaskId: microTask.id,
    shape: SHAPE_MAP[bucket],
    colorTheme: deriveColorFromTask(microTask),
    earnedAt: Date.now(),
    duration: actualDuration,
  };
}
```

**每日画布渲染**（使用 `react-native-skia` 或 Canvas）：

```typescript
// components/mosaic/daily-canvas.tsx

// 核心渲染逻辑概要：
// 1. 获取当天所有 puzzle_pieces
// 2. 根据 templateId 加载像素画模板（10x10 ~ 20x20 网格）
// 3. 将 pieces 按 earnedAt 顺序填入网格
// 4. 每个 piece 的 shape 决定它占据的格子数和排列
// 5. 未填充区域显示灰色占位
// 6. completionRate = 已填格子数 / 总格子数
```

**分享海报生成**：

```typescript
// components/mosaic/share-poster.tsx

// 使用 react-native-view-shot 将画布截图
// 叠加用户统计文案：
// "今天我在通勤途中捡回了 {totalMinutes} 分钟，
//  累计拼凑了{canvasName}。你也来试试？"
// 导出为图片供社交分享
```

### 4.5 计时器与沉浸模式

```typescript
// hooks/use-countdown.ts

import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

function useCountdown(totalSeconds: number) {
  const remaining = useSharedValue(totalSeconds);
  const progress = useSharedValue(0);   // 0 → 1

  // 环形进度条动画
  const ringStyle = useAnimatedStyle(() => ({
    // SVG arc 或 Skia path 的 strokeDashoffset
    // 基于 progress.value 计算
  }));

  function start() {
    remaining.value = withTiming(0, { duration: totalSeconds * 1000 });
    progress.value = withTiming(1, { duration: totalSeconds * 1000 });
  }

  function pause() { /* cancelAnimation */ }
  function resume() { /* 从当前值继续 */ }

  return { remaining, progress, ringStyle, start, pause, resume };
}
```

---

## 五、状态管理设计（Zustand）

```typescript
// stores/task-store.ts

import { create } from 'zustand';

interface TaskStore {
  tasks: Task[];
  currentMicroTask: MicroTask | null;
  skippedIds: string[];

  // Actions
  addTask: (task: Task) => void;
  shredTask: (taskId: string) => Promise<void>;
  drawTask: (timeBucket: TimeBucket, context: ContextSnapshot) => void;
  skipTask: () => void;
  completeTask: (actualDuration: number) => void;
}
```

```typescript
// stores/user-store.ts

interface UserStore {
  stamina: number;                   // 体力值 0-5
  energyLevel: EnergyLevel;
  dailyStreak: number;

  // Actions
  consumeStamina: () => boolean;     // 换一个时消耗，返回是否成功
  refillStamina: () => void;         // 每小时自动恢复 1 点
  setEnergyLevel: (level: EnergyLevel) => void;
  incrementStreak: () => void;
}
```

```typescript
// stores/mosaic-store.ts

interface MosaicStore {
  todayCanvas: DailyCanvas | null;
  pieces: PuzzlePiece[];
  skins: MosaicSkin[];

  // Actions
  addPiece: (piece: PuzzlePiece) => void;
  loadTodayCanvas: () => Promise<void>;
  unlockSkin: (skinId: string) => void;
  generateShareImage: () => Promise<string>;  // 返回本地图片 URI
}
```

---

## 六、页面路由与导航结构

```
Root Stack (app/_layout.tsx)
├── (tabs)  ← Tab Navigator
│   ├── index       — 时间扭蛋机（首页）
│   ├── mosaic      — 拼图画廊
│   └── profile     — 个人中心
├── task-card       — 任务卡片 (modal presentation)
├── timer           — 倒计时沉浸模式 (fullScreenModal)
└── task-manager    — 任务管理/AI拆解 (modal presentation)
```

**Tab 图标映射**：

| Tab | iOS (SF Symbol) | Android (Material Icon) |
|-----|-----------------|------------------------|
| 首页 | `dice` | `casino` |
| 拼图 | `square.grid.3x3.fill` | `grid-view` |
| 我的 | `person.crop.circle` | `account-circle` |

---

## 七、关键算法

### 7.1 任务匹配评分算法

```
Score(microTask, timeBucket, context) =
    w1 × timeFit(estimate, timeBucket)
  + w2 × contextFit(requiredContext, context.motionState)
  + w3 × energyFit(cognitiveLoad, context.energyLevel)
  + w4 × priorityScore(parentTask.priority)
  + w5 × freshnessScore(parentTask.createdAt)

其中：
  w1=0.30, w2=0.25, w3=0.20, w4=0.15, w5=0.10

  timeFit = 1 - |estimate - timeBucket| / timeBucket
  contextFit = requiredContext 匹配 ? 1.0 : requiredContext='any' ? 0.7 : 0
  energyFit = cognitiveLoad ≤ energyLevel ? 1.0 : 0
  priorityScore = (4 - priority) / 3
  freshnessScore = min(1, daysSinceCreated / 7)  // 越久越紧急
```

### 7.2 体力值恢复机制

```
初始体力 = 5
每次"换一个" → stamina -= 1
每小时自动恢复 → stamina = min(5, stamina + 1)
完成一个任务 → stamina = min(5, stamina + 2)
stamina = 0 时 → 禁用"换一个"按钮，仅可"开始计时"
```

### 7.3 连续打卡判定

```
每日至少完成 1 个微任务 → dailyStreak += 1
连续 7 天 → 解锁当周限定皮肤
中断 → dailyStreak = 0（但已解锁皮肤不收回）
```

---

## 八、非功能需求

### 8.1 性能指标

| 指标 | 目标值 |
|------|--------|
| 首屏加载（冷启动） | < 2 秒 |
| 任务匹配响应 | < 100ms（本地计算） |
| AI 拆解响应 | < 5 秒（网络请求） |
| 扭蛋动画帧率 | 60fps（Reanimated UI 线程） |
| SQLite 查询 | < 50ms |
| 包体积（iOS） | < 30MB |

### 8.2 离线策略

- 本地 SQLite 存储所有任务和拼图数据，**核心功能完全离线可用**
- AI 拆解功能需要网络，离线时降级为手动拆解模式
- 传感器数据全部本地处理，不上传

### 8.3 隐私与安全

- 位置/传感器数据仅在本地处理，不传输至服务端
- AI API 调用仅发送任务标题和描述，不包含用户身份信息
- API Key 通过 `expo-secure-store` 存储，不硬编码

---

## 九、分阶段实施计划

### Phase 1 — MVP（4 周）

> 目标：验证"时间扭蛋"核心交互

| 周次 | 交付内容 |
|------|----------|
| W1 | 项目脚手架搭建、数据库 Schema、类型定义、Zustand stores |
| W2 | 首页扭蛋机 UI（快捷按钮 + 弹出动画）、手动添加任务、任务匹配算法 |
| W3 | 倒计时/沉浸模式、任务完成流程、体力值机制 |
| W4 | 基础拼图系统（块生成 + 每日画布）、整体联调 |

**MVP 范围**：
- 手动输入任务 + 手动拆解为微任务
- 时间快捷按钮（3/5/15 min）
- 本地任务匹配（无 AI，无场景感知）
- 基础倒计时
- 简易拼图块累积展示

### Phase 2 — AI 增强（3 周）

| 周次 | 交付内容 |
|------|----------|
| W5 | Claude API 集成、Prompt 调优、AI 拆解结果校验 |
| W6 | 环境感知模块（加速度计 + Wi-Fi 检测）、精力值滑块 |
| W7 | 任务匹配算法升级（加入场景权重）、压力测试 |

### Phase 3 — 视觉与社交（2 周）

| 周次 | 交付内容 |
|------|----------|
| W8 | 像素画模板系统、每日画布渲染、拼图皮肤解锁 |
| W9 | 分享海报生成、连续打卡奖励、皮肤收藏页 |

### Phase 4 — 打磨与发布（2 周）

| 周次 | 交付内容 |
|------|----------|
| W10 | 动画打磨、深色模式适配、无障碍支持 |
| W11 | 性能优化、App Store / Google Play 提审准备 |

---

## 十、依赖清单（需新增）

```json
{
  "dependencies": {
    "zustand": "^5.x",
    "expo-sqlite": "~15.x",
    "expo-sensors": "~14.x",
    "expo-location": "~18.x",
    "expo-notifications": "~0.30.x",
    "expo-secure-store": "~14.x",
    "@anthropic-ai/sdk": "^0.52.x",
    "@shopify/react-native-skia": "^1.x",
    "react-native-view-shot": "^4.x",
    "react-native-share": "^11.x",
    "uuid": "^11.x"
  }
}
```

---

## 十一、风险与应对

| 风险 | 影响 | 应对策略 |
|------|------|----------|
| AI 拆解结果质量不稳定 | 微任务不合理，用户信任降低 | 严格校验 + 用户可手动编辑拆解结果 |
| 传感器在不同设备表现差异大 | 场景误判 | 设置置信度阈值，低置信度时回退为"any"场景 |
| 体力值机制引发用户反感 | 用户流失 | A/B 测试体力值消耗速率，保留关闭选项 |
| 离线时无法使用 AI 拆解 | 功能降级 | 引导用户手动拆解，UI 上不强依赖 AI |
| 像素画渲染性能 | 低端设备卡顿 | 限制网格最大尺寸，使用 Skia 硬件加速 |
