# TASKS-Love-Diary.md — 开发任务计划表

> 关联 SPEC：[SPEC-Love-Diary.md](./SPEC-Love-Diary.md)  
> 总预估算：~60-80 小时 (L 级任务为主)  
> 更新：随开发进度实时维护状态

---

## Phase A — 项目基础设施 (P0 · 阻塞)

| Task ID | 描述 | 依赖 | 预估 | 优先级 | 关联 SPEC | 状态 |
|---|---|---|---|---|---|---|
| T-001 | 使用 `npm create vite@latest` 初始化 Vue 3 + TS 项目骨架 | — | XS | P0 | SPEC §3.1 | Todo |
| T-002 | 配置 Tailwind CSS 3.4，映射 DESIGN.md 全部颜色/字体/圆角/间距 token 到 tailwind.config | T-001 | S | P0 | DESIGN.md | Todo |
| T-003 | 配置 ESLint + Prettier + tsconfig (strict)，安装 Vitest + @vue/test-utils | T-001 | S | P0 | CLAUDE.md | Todo |
| T-004 | 创建 Vue Router 实例，定义 6 条路由 + `/` 重定向，创建 6 个页面占位 SFC | T-001 | S | P0 | SPEC §3.2 | Todo |
| T-005 | 创建 Pinia 实例 + localStorage 持久化插件 (init load + auto-save)，定义 version 字段 | T-001 | M | P0 | SPEC §3.3-3.5 | Todo |
| T-006 | 创建 AppShell.vue 布局组件 + 底部 6 标签导航栏 (含 icon 选中态高亮) | T-004 | M | P0 | SPEC §3.2 | Todo |

---

## Phase B — 设计系统基础组件 (P1 · 高)

| Task ID | 描述 | 依赖 | 预估 | 优先级 | 关联 SPEC | 状态 |
|---|---|---|---|---|---|---|
| T-007 | `DiaryCard.vue` — 温润细线边框 + 柔和阴影卡片，支持 `completed` 暖色变体 | T-002 | S | P1 | DESIGN.md §7.1 | Todo |
| T-008 | `DiaryButton.vue` — 圆角按钮，含 `:active` 按压反馈 + loading/disabled 态 | T-002 | S | P1 | DESIGN.md §7.2 | Todo |
| T-009 | `DiaryInput.vue` — 圆角输入框，含 focus 高亮 + 字数统计 | T-002 | S | P1 | DESIGN.md §7.3 | Todo |
| T-010 | `DiaryBadge.vue` — 圆角小标签/打卡天数环比 | T-002 | XS | P1 | DESIGN.md §7.4 | Todo |
| T-011 | `AvatarStatus.vue` — 双人头像组件，支持状态标签、弹跳动画触发 | T-002 | S | P1 | SPEC §2.1 | Todo |
| T-012 | `HeartBurst.vue` — 爱心飘浮粒子动效组件 (Teleport to body, 自清理) | — | S | P1 | DESIGN.md §5.3 | Todo |
| T-013 | `EmptyState.vue` — 空状态占位组件，含引导文案 + 创建入口 | — | S | P1 | SPEC §4 | Todo |
| T-014 | `WeatherPicker.vue` — 天气表情选择器 (☀️🌤️⛅🌧️⛈️❄️🌈)，圆形按钮组 | T-008 | S | P1 | SPEC §2.2 | Todo |
| T-015 | `ImageUploader.vue` — 图片选择 → Base64 压缩 → 缩略图预览 + 删除 | — | M | P1 | SPEC §3.5 | Todo |
| T-016 | `TimelineItem.vue` — 时间轴线装饰 + 左侧日期标记 + 右侧内容插槽 | T-007 | S | P1 | SPEC §2.2 | Todo |

---

## Phase C — Pinia 数据层 (P1 · 高)

| Task ID | 描述 | 依赖 | 预估 | 优先级 | 关联 SPEC | 状态 |
|---|---|---|---|---|---|---|
| T-017 | `useDashboardStore` — 纪念日、双人状态、状态选项管理 | T-005 | S | P1 | SPEC §3.3 | Todo |
| T-018 | `useFragmentsStore` — 生活碎片 CRUD，时间排序，分页 | T-005 | M | P1 | SPEC §3.3 | Todo |
| T-019 | `useGrowStore` — 习惯定义、打卡记录、连续天数计算、热力图数据 | T-005 | M | P1 | SPEC §3.3 | Todo |
| T-020 | `useFootprintsStore` — 旅行便签 CRUD，照片墙管理 | T-005 | S | P1 | SPEC §3.3 | Todo |
| T-021 | `useBucketListStore` — 心愿 CRUD，完成标记，统计计算 | T-005 | S | P1 | SPEC §3.3 | Todo |
| T-022 | `useCareStore` — 经期记录、周期计算、预测算法、提醒逻辑 | T-005 | M | P1 | SPEC §3.3 | Todo |

---

## Phase D — 页面实现 (P1-P2)

### D1: 首页看板

| Task ID | 描述 | 依赖 | 预估 | 优先级 | 关联 SPEC | 状态 |
|---|---|---|---|---|---|---|
| T-023 | `DashboardPage.vue` — 页面布局：倒计时区 + 状态栏 + 提醒横幅 | T-006 T-011 T-017 | M | P1 | SPEC §2.1 | Todo |
| T-024 | `CountdownTimer.vue` — 恋爱天数大数字展示，实时更新，弹入动画 | T-007 | S | P1 | SPEC §2.1 | Todo |
| T-025 | `StatusBar.vue` — 双人状态卡 (我 + 她)，支持状态切换 Picker | T-011 T-017 | M | P1 | SPEC §2.1 | Todo |
| T-026 | `PatInteraction.vue` — 拍一拍交互逻辑：点击 → 弹跳 + 爱心 + 震动 | T-011 T-012 | M | P1 | SPEC §2.1 | Todo |
| T-027 | `CareReminder.vue` — 经期提醒横幅，数据来自 useCareStore | T-007 T-022 | S | P1 | SPEC §2.1 | Todo |

### D2: 生活碎片

| Task ID | 描述 | 依赖 | 预估 | 优先级 | 关联 SPEC | 状态 |
|---|---|---|---|---|---|---|
| T-028 | `FragmentsPage.vue` — 时间轴列表 + 上拉加载 + 空状态 | T-016 T-018 T-013 | M | P1 | SPEC §2.2 | Todo |
| T-029 | `FragmentCard.vue` — 碎片卡片：文字、图片缩略网格、视频标识、天气 emoji | T-007 T-010 | M | P1 | SPEC §2.2 | Todo |
| T-030 | `FragmentForm.vue` — 发布表单 Modal：文字 + 上传图片 + 上传视频 + 天气选择 | T-009 T-014 T-015 | L | P1 | SPEC §2.2 | Todo |
| T-031 | `FragmentDetail.vue` — 碎片详情展开：大图滑动、视频播放、全文 | T-007 | M | P1 | SPEC §2.2 | Todo |

### D3: 自我提升

| Task ID | 描述 | 依赖 | 预估 | 优先级 | 关联 SPEC | 状态 |
|---|---|---|---|---|---|---|
| T-032 | `GrowPage.vue` — 习惯列表 + 添加习惯入口 | T-006 T-019 | M | P1 | SPEC §2.3 | Todo |
| T-033 | `HabitCard.vue` — 习惯卡片：名称、连续天数 badge、热力图、双方打卡按钮 | T-007 T-010 | L | P1 | SPEC §2.3 | Todo |
| T-034 | `CheckInButton.vue` — 打卡按钮：弹跳 + ✅ 反馈 + 短暂高亮 | T-008 | M | P1 | SPEC §2.3 | Todo |
| T-035 | `HeatmapGrid.vue` — 7×N 热力图小方格组件 (GitHub 风格) | — | M | P2 | SPEC §2.3 | Todo |

### D4: 旅行便签

| Task ID | 描述 | 依赖 | 预估 | 优先级 | 关联 SPEC | 状态 |
|---|---|---|---|---|---|---|
| T-036 | `FootprintsPage.vue` — 拍立得卡片列表 | T-006 T-020 | M | P1 | SPEC §2.4 | Todo |
| T-037 | `PolaroidCard.vue` — 拍立得风格卡片：白边 + 阴影 + 手写体地名 + 日期 | T-007 | M | P1 | SPEC §2.4 | Todo |
| T-038 | `FootprintForm.vue` — 创建旅行便签表单：目的地、日期范围、照片、Vlog | T-009 T-015 | L | P1 | SPEC §2.4 | Todo |
| T-039 | `FootprintDetail.vue` — 旅行详情：照片墙滑动、Vlog 本地播放、手写体备注 | T-007 | L | P1 | SPEC §2.4 | Todo |
| T-040 | `PhotoWall.vue` — 3 列照片网格 + 点击大图查看 (Swipe 手势) | — | M | P2 | SPEC §2.4 | Todo |

### D5: 心愿清单

| Task ID | 描述 | 依赖 | 预估 | 优先级 | 关联 SPEC | 状态 |
|---|---|---|---|---|---|---|
| T-041 | `BucketListPage.vue` — 心愿分组列表 + 顶部统计 | T-006 T-021 | M | P1 | SPEC §2.5 | Todo |
| T-042 | `BucketCard.vue` — 心愿卡片：未完成/已完成双态 + 展开动画 | T-007 T-010 | M | P1 | SPEC §2.5 | Todo |
| T-043 | `BucketCompleteForm.vue` — 完成表单：合照、视频、感想，卡片内嵌展开 | T-009 T-015 | M | P1 | SPEC §2.5 | Todo |
| T-044 | `BucketStats.vue` — 顶部进度条 + "已完成 X / Y" 统计 | T-010 | S | P2 | SPEC §2.5 | Todo |

### D6: 呵护日历

| Task ID | 描述 | 依赖 | 预估 | 优先级 | 关联 SPEC | 状态 |
|---|---|---|---|---|---|---|
| T-045 | `CarePage.vue` — 日历页面：月视图 + 经期标记 + 预测显示 | T-006 T-022 | L | P1 | SPEC §2.6 | Todo |
| T-046 | `CycleCalendar.vue` — 月历组件：日期格子、经期高亮、小红点、预测虚线 | T-007 | L | P1 | SPEC §2.6 | Todo |
| T-047 | `CyclePredict.vue` — 预测算法显示：下次预测日期 + 平均周期天数 | T-022 | S | P2 | SPEC §2.6 | Todo |

---

## Phase E — PWA 与收尾 (P2-P3)

| Task ID | 描述 | 依赖 | 预估 | 优先级 | 关联 SPEC | 状态 |
|---|---|---|---|---|---|---|
| T-048 | 配置 `vite-plugin-pwa`：manifest.json + generateSW + 图标生成 | T-001 | M | P2 | SPEC §5.3 | Todo |
| T-049 | 设计 & 生成 PWA 图标 (192/512px，阳光暖色主题) | T-048 | S | P2 | SPEC §5.3 | Todo |
| T-050 | 全局页面过渡动画：`<RouterView v-slot>` + `<Transition>` fade-slide | T-004 | S | P2 | DESIGN.md §5 | Todo |
| T-051 | 触觉反馈 composable `useHaptic.ts`：封装 navigator.vibrate，降级静默 | — | XS | P2 | SPEC §2.1 | Todo |
| T-052 | `useImageUpload.ts` composable：图片选择 → Canvas 压缩 → Base64 | — | M | P2 | SPEC §3.5 | Todo |
| T-053 | LocalStorage 容量检测：写入前估算余量，超限 Toast 警告 | T-005 | S | P2 | SPEC §4 | Todo |
| T-054 | 全局错误边界 + 未捕获 Promise 错误 Toast | T-001 | S | P3 | SPEC §4 | Todo |
| T-055 | a11y 审查：aria-label、键盘导航、颜色对比度、prefers-reduced-motion | ALL | M | P3 | SPEC §5.2 | Todo |
| T-056 | 整体集成测试：6 个页面完整流程 + LocalStorage 持久化验证 | ALL | M | P3 | — | Todo |
| T-057 | 首次使用引导流程：恋爱纪念日设置 → 状态选择 → 引导文案 3 步 | T-006 T-017 | M | P3 | SPEC §4 | Todo |

---

## Task Dependency Graph

```
Phase A (Foundation)
  T-001 ──→ T-002 ──→ T-003
   │         │
   │         └──→ Phase B (Base Components) T-007 ~ T-016
   │
   ├──→ T-004 (Router) ──→ T-006 (AppShell + BottomNav)
   │
   └──→ T-005 (Pinia Plugin) ──→ Phase C (Stores) T-017 ~ T-022
                                      │
                                      └──→ Phase D (Pages) T-023 ~ T-047
                                              │
                                              └──→ Phase E (PWA & Polish) T-048 ~ T-057
```

---

## 统计汇总

| 优先级 | 数量 | 说明 |
|---|---|---|
| P0 | 6 | 项目骨架，阻塞所有后续开发 |
| P1 | 34 | 核心功能，MVP 必须 |
| P2 | 13 | 增强体验，可后续迭代 |
| P3 | 4 | 收尾打磨 |
| **总计** | **57** | |

| 预估 | 数量 |
|---|---|
| XS (<1h) | 3 |
| S (1-3h) | 21 |
| M (3-8h) | 25 |
| L (1-2d) | 8 |
| **总预估算** | **~240-330h** (约 6-8 周单兵开发) |

---

*TASKS.md 随 SPEC 变更同步更新。每次任务状态变更需在 commit message 中引用 Task ID。*
