# SPEC-Love-Diary.md — Love Diary 完整功能规格说明书

> 版本：v1.0.0  
> 状态：Draft → Review  
> 关联文档：`DESIGN.md` | `TASKS-Love-Diary.md`

---

## 1. Overview（概述）

Love Diary（恋爱日记）是一款专属于一对恋人的移动端 PWA 单机应用。以温暖阳光与柔和浪漫为视觉基调，提供恋爱纪念、生活记录、习惯养成、旅行手帐、心愿清单、经期呵护六大模块。所有数据以 Pinia + LocalStorage 本地持久化，多媒体资源使用 Base64 编码存储。

### 1.1 技术约束

| 约束项 | 说明 |
|---|---|
| 平台 | 移动端 PWA (standalone)，主攻 375-480px 宽 |
| 离线 | 全功能离线可用，无需网络请求 |
| 存储上限 | LocalStorage 通常 5MB，需做容量提示 |
| 多媒体 | 图片/视频以 Base64 存 LocalStorage，单文件建议 <2MB |
| 触觉反馈 | 使用 `navigator.vibrate`（需 HTTPS 或 localhost） |

---

## 2. User Stories & Acceptance Criteria（用户故事）

### 2.1 首页看板 (Dashboard)

```gherkin
Feature: 首页看板
  作为用户，我希望打开 App 就能看到恋爱纪念日倒计时和双方的实时状态，
  还能通过"拍一拍"互动，让我感受到恋爱的温暖。

  Scenario: 查看恋爱天数
    Given 用户已在 Pinia 中设置了恋爱开始日期
    When 用户打开首页
    Then 页面顶部显示精确到天的倒计时（格式："我们在一起的第 XXX 天"）
    And 数字使用大号 display 字体（--text-3xl），附带轻柔弹入动画

  Scenario: 查看双人状态
    Given 首页加载完成
    When 用户查看状态栏
    Then 左侧显示"我"的头像、昵称、当前状态
    And 右侧显示"她"的头像、昵称、当前状态
    And 状态从预设列表选择（学习中📚、干饭中🍜、睡觉中💤、搬砖中💼、想你中💕、自定义）

  Scenario: 拍一拍互动
    Given 首页双人状态栏已渲染
    When 用户点击对方的头像
    Then 被点击的头像播放轻柔弹跳动画（soft-bounce-in，150ms）
    And 从头像上方冒出 1-3 颗爱心（heart-float 动画）
    And 触发 navigator.vibrate(15) 短暂震动

  Scenario: 贴心提醒（经期模式）
    Given 呵护日历检测到今天在经期 ± 2 天内
    When 用户打开首页
    Then 看板顶部显示一条暖色提醒横幅
    And 横幅文案："🩰 她这几天需要被特别照顾哦～准备红糖水和热牛奶吧！"
```

### 2.2 生活碎片 (Life Fragments)

```gherkin
Feature: 生活碎片
  作为用户，我希望以时间轴形式记录和回顾日常点滴，
  支持文字、图片、视频、天气表情，让每一天都有迹可循。

  Scenario: 时间轴瀑布流浏览
    Given 已有若干条生活碎片记录
    When 用户进入生活碎片页面
    Then 以时间轴形式从近到远排列（垂直列表，带时间线装饰）
    And 每条卡片显示：日期、天气表情、文字内容、图片缩略图、视频占位标识
    And 支持上拉加载更多（每页 10 条）

  Scenario: 发布新的生活碎片
    Given 用户在生活碎片页面
    When 用户点击底部"+"按钮
    Then 弹出发布表单，包含：
      - 心情文字输入（Textarea，最多 500 字）
      - 多图上传（调用相机或相册，Base64 编码存储）
      - 视频上传（录制或选择，Base64 编码存储，单视频限 30 秒 / 10MB）
      - 天气选择器（表情包风格：☀️🌤️⛅🌧️⛈️❄️🌈）
    And 点击"发布"后卡片以 card-enter 动画插入时间轴顶部

  Scenario: 查看碎片详情
    Given 时间轴列表中存在某条碎片卡片
    When 用户点击卡片
    Then 卡片展开，完整展示所有照片（swipe 滑动浏览）和视频播放
    And 显示完整文字内容
```

### 2.3 自我提升 (Grow Together)

```gherkin
Feature: 自我提升
  作为用户，我希望和伴侣一起养成好习惯，通过打卡记录互相激励，
  看到彼此的连续打卡天数。

  Scenario: 查看习惯列表
    Given 用户进入自我提升页面
    When 页面加载完成
    Then 显示习惯卡片列表，每张卡片包含：
      - 习惯名称 & 图标
      - 连续打卡天数（大号数字 badge）
      - 本月打卡热力图（7 列 × N 行的小方格）
      - 双方各自的打卡状态

  Scenario: 我完成打卡
    Given 用户点击自己的打卡按钮
    When 打卡成功
    Then 按钮播放弹跳动画，弹出 ✅
    And 连续打卡天数 +1
    And 习惯卡片短暂高亮表示完成

  Scenario: 她完成打卡
    Given 用户（帮她）点击打卡按钮
    When 打卡成功
    Then 按钮播放弹跳动画，弹出 ✅
    And 连续打卡天数 +1
    And 习惯卡片短暂高亮表示完成

  Scenario: 错过打卡
    Given 某习惯上次打卡距今已超过 1 天
    When 用户查看该习惯卡片
    Then 连续天数重置显示为 0
    And 卡片边框变为虚线（--border-dashed），提示断签
```

### 2.4 旅行便签 (Footprints)

```gherkin
Feature: 旅行便签
  作为用户，我希望以拍立得/手帐风格记录我们一起走过的地方，
  滑动浏览合照，让每一段旅程都有实体感。

  Scenario: 旅行便签列表
    Given 用户进入旅行便签页面
    When 页面加载完成
    Then 以拍立得风格卡片展示每次旅行，卡片含：
      - 手写体风格的目的地名称
      - 旅行日期
      - 封面照片（拍立得白边效果）
    And 卡片按时间从近到远排列

  Scenario: 查看旅行详情
    Given 旅行便签列表中存在某条记录
    When 用户点击拍立得卡片
    Then 卡片翻转/展开，展示：
      - 完整照片墙（水平滑动浏览，3 列网格）
      - Vlog 视频占位（本地视频 Base64 播放）
      - 旅行备注（手写字体风格）

  Scenario: 创建旅行便签
    Given 用户在旅行便签页面
    When 用户点击"+"新建
    Then 弹出创建表单，包含：
      - 目的地名称
      - 旅行日期选择器（支持日期范围）
      - 照片上传（多张，Base64）
      - Vlog 视频上传（可选，Base64）
      - 备注（手写字体 Textarea）
```

### 2.5 心愿清单 (Bucket List)

```gherkin
Feature: 心愿清单
  作为用户，我希望和伴侣一起列出"要做的 100 件事"，
  完成时上传合照和视频留念，看着灰色卡片一张张变成暖色。

  Scenario: 查看心愿列表
    Given 用户进入心愿清单页面
    When 页面加载完成
    Then 显示心愿卡片列表，分为"未完成"和"已完成"两组
    And 未完成卡片为白色底 + 虚线边框
    And 已完成卡片为 sunshine-100 暖色底 + 实线 sunshine-300 边框
    And 顶部统计显示："已完成 X / Y"

  Scenario: 完成心愿
    Given 某心愿处于未完成状态
    When 用户点击该卡片
    Then 卡片向下展开，显示完成表单：
      - 打卡合照上传（可选，支持多张）
      - 纪念视频上传（可选）
      - 完成感想文字（可选）
    And 点击"标记完成"后，卡片过渡为暖色完成态（0.4s 过渡动画）

  Scenario: 添加自定义心愿
    Given 用户在心愿清单页面
    When 用户点击"+"按钮
    Then 弹出简洁输入框，输入心愿名称后回车确认
    And 新卡片以 card-enter 动画插入未完成列表顶部
```

### 2.6 呵护日历 (Care Calendar)

```gherkin
Feature: 呵护日历
  作为用户（男友），我希望记录女友的经期周期，
  提前收到贴心提醒，在特殊时期给她更好的照顾。

  Scenario: 记录经期
    Given 用户在呵护日历页面
    When 用户点击日历上的某一天
    Then 该天标记为经期日（薰衣草粉底色 + 小红点）
    And 自动根据历史数据预测下一次经期日期（取最近 3 个月平均周期）

  Scenario: 预测与提醒
    Given 呵护日历已记录 ≥ 2 次经期
    When 当前日期接近预测经期 ± 2 天
    Then 首页看板自动显示贴心提醒横幅
    And 经期当天日历高亮显示

  Scenario: 隐私保护
    Given 呵护日历包含敏感健康数据
    When 应用在后台或预览列表中
    Then 日历页面标题不包含明显经期暗示词（使用"呵护日历 🌸"代称）
    And App 图标不体现此项功能
```

---

## 3. Technical Approach（技术方案）

### 3.1 架构总览

```
┌─────────────────────────────────────────┐
│              Vue 3 App Shell            │
│  ┌───────────────────────────────────┐  │
│  │        Vue Router (6 routes)      │  │
│  │  /dashboard  /fragments  /grow    │  │
│  │  /footprints /bucketlist /care   │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │       Pinia Stores (6 stores)     │  │
│  │  dashboard  fragments  grow       │  │
│  │  footprints  bucketlist  care     │  │
│  │      ↕ localStorage plugin        │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │    Component Tree (DESIGN.md UI)  │  │
│  │  DiaryCard / DiaryButton / ...    │  │
│  │  CountdownTimer / StatusBar / ... │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### 3.2 路由设计

| Path | Page | Store |
|---|---|---|
| `/` | 重定向到 `/dashboard` | — |
| `/dashboard` | 首页看板 | `useDashboardStore` |
| `/fragments` | 生活碎片 | `useFragmentsStore` |
| `/grow` | 自我提升 | `useGrowStore` |
| `/footprints` | 旅行便签 | `useFootprintsStore` |
| `/bucketlist` | 心愿清单 | `useBucketListStore` |
| `/care` | 呵护日历 | `useCareStore` |

### 3.3 数据模型 (Pinia Store Shapes)

```ts
// ---- Dashboard Store ----
interface DashboardState {
  anniversaryDate: string          // ISO日期 "2024-01-01"
  userStatus: 'studying' | 'eating' | 'sleeping' | 'working' | 'missing' | string
  partnerStatus: string
  statusOptions: StatusOption[]
}

// ---- Fragments Store ----
interface Fragment {
  id: string
  createdAt: string                // ISO datetime
  text: string                     // 最多 500 字
  weather: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy' | 'rainbow'
  images: string[]                 // Base64[]
  video?: string                   // Base64
}
interface FragmentsState { items: Fragment[] }

// ---- Grow Store ----
interface Habit {
  id: string
  name: string
  icon: string                     // emoji
  streakMe: number                 // 我的连续天数
  streakHer: number                // 她的连续天数
  history: Record<string, { me: boolean; her: boolean }> // "2026-05-28" -> {...}
}
interface GrowState { habits: Habit[] }

// ---- Footprints Store ----
interface Footprint {
  id: string
  destination: string
  dateRange: [string, string]
  photos: string[]                 // Base64[]
  vlog?: string                    // Base64
  notes: string
}
interface FootprintsState { items: Footprint[] }

// ---- BucketList Store ----
interface BucketItem {
  id: string
  title: string
  completed: boolean
  completedAt?: string
  photos: string[]                 // 完成后上传的合照
  video?: string
  note?: string                    // 完成感想
}
interface BucketListState { items: BucketItem[] }

// ---- Care Store ----
interface CareState {
  cycleRecords: string[]           // ISO 日期数组
  predictedNext?: string           // 预测下次日期
  avgCycleDays: number             // 平均周期天数（默认 28）
}
```

### 3.4 LocalStorage 键名约定

```
love-diary:dashboard
love-diary:fragments
love-diary:grow
love-diary:footprints
love-diary:bucketlist
love-diary:care
love-diary:version  (用于数据迁移)
```

### 3.5 Base64 图片处理策略

```ts
// composables/useImageUpload.ts
async function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// 压缩建议：限制最大宽度 800px，质量 0.7
// 控制单个 Base64 字符串 < 500KB
```

---

## 4. Edge Cases & Errors（边界与异常）

| 场景 | 处理方案 |
|---|---|
| LocalStorage 满 (QuotaExceededError) | Toast 提示"存储空间不足，请清理旧照片"，引导删除 |
| 首次使用无数据 | 各页面展示空状态插画 + 引导文案，引导创建第一条记录 |
| 图片加载失败 (Base64 损坏) | 显示占位图（虚线框 + 照片 icon） |
| 视频 Base64 过大 (>10MB) | 上传时校验文件大小，超限拒绝并提示 |
| 恋爱纪念日未设置 | 首页引导弹窗，输入日期后开始计算 |
| 经期数据不足 2 条 | 不显示预测，仅标记已有记录 |
| PWA 离线状态 | 全功能可用（本就是单机应用） |
| 日期穿越 (用户改了系统时间) | 以 `Date.now()` 为准，不信任系统时钟偏移 |
| 同一打卡日重复点击 | 防抖处理，1 秒内忽略重复点击 |

---

## 5. Non-Functional Requirements（非功能需求）

### 5.1 性能

- FCP (First Contentful Paint) < 1.5s（PWA 冷启动）
- 页面切换动画帧率 ≥ 30fps
- 图片列表虚拟滚动（超过 50 条时用 `vue-virtual-scroller`）

### 5.2 可访问性 (a11y)

- 所有交互元素最小触控区域 44×44px
- 颜色对比度 ≥ AA 级（文字/背景）
- 按钮/链接有 `role` / `aria-label`（图标按钮）
- `prefers-reduced-motion` 时禁用动画

### 5.3 PWA

- `manifest.json` 含中文名"恋爱日记"
- Service Worker 缓存所有静态资源
- 图标 192×192 + 512×512（阳光粉色主题）
- `apple-mobile-web-app-status-bar-style: default`
- `theme-color: #FFF9E6`

### 5.4 隐私

- 无任何网络请求，数据不出设备
- 呵护日历页面标题模糊化
- App 切换器中的截图不显示经期信息

---

## 6. Acceptance Criteria Checklist（验收清单）

### 首页看板
- [ ] 恋爱天数倒计时正确显示
- [ ] 双人状态栏展示双方头像、昵称、状态
- [ ] 点击对方头像触发动效 + 震动
- [ ] 经期提醒横幅在预测日 ± 2 天出现

### 生活碎片
- [ ] 时间轴列表正确按时间排列
- [ ] 发布表单：文字 + 图片 + 视频 + 天气选择
- [ ] 卡片展开查看详情
- [ ] 空状态引导创建

### 自我提升
- [ ] 习惯列表含打卡天数、热力图
- [ ] 我打卡 → ✅ + 高亮反馈
- [ ] 她打卡 → ✅ + 高亮反馈
- [ ] 断签重置与虚线提示

### 旅行便签
- [ ] 拍立得风格卡片列表
- [ ] 详情展开：照片滑动 + Vlog 播放
- [ ] 创建/编辑旅行便签

### 心愿清单
- [ ] 未完成/已完成分组
- [ ] 完成时展开上传照片/视频
- [ ] 卡片颜色过渡（灰→暖色）
- [ ] 顶部统计数字

### 呵护日历
- [ ] 日历标记经期日
- [ ] ≥ 2 条记录后显示预测
- [ ] 首页提醒横幅联动
- [ ] 页面标题隐私化

---

*SPEC 结束。下一步：创建 TASKS.md 将以上拆解为可执行的开发任务。*
