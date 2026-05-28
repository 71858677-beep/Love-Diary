# Love Diary — Design System

> 设计哲学：温暖阳光 × 柔和浪漫 × 精致留白  
> 核心意象：午后阳光穿过窗纱的奶油色光晕、花瓣般的粉腮色、细腻而克制的浪漫

---

## 1. Color Palette（色彩体系）

### 1.1 阳光主题色

```css
:root {
  /* ===== 阳光奶油黄 — 主色调 ===== */
  --color-sunshine-50:  #FFFEF7;   /* 页面底色 */
  --color-sunshine-100: #FFF9E6;   /* 卡片底色 */
  --color-sunshine-200: #FFF2CC;   /* 强调背景、选中态 */
  --color-sunshine-300: #FFE999;   /* 边框、分隔条 */
  --color-sunshine-400: #FFD93D;   /* 主按钮、强调色 */
  --color-sunshine-500: #F5C800;   /* Hover 深色 */

  /* ===== 暖灰中性色 ===== */
  --color-warm-50:   #FAFAF8;
  --color-warm-100:  #F5F4F0;
  --color-warm-200:  #E8E5DF;
  --color-warm-300:  #D4D0C8;
  --color-warm-400:  #A9A49B;
  --color-warm-500:  #7A756E;
  --color-warm-600:  #5C5751;
  --color-warm-700:  #3E3A35;
  --color-warm-800:  #272420;
  --color-warm-900:  #141210;

  /* ===== 花瓣粉 — 浪漫强调 ===== */
  --color-rose-100:  #FFF5F5;
  --color-rose-200:  #FFE4E1;     /* 腮红粉、爱心色 */
  --color-rose-300:  #FFC0CB;
  --color-rose-400:  #F4A0B0;

  /* ===== 语义色 ===== */
  --color-success:    #86D9B6;     /* 打卡成功 — 薄荷绿 */
  --color-success-bg: #F0FAF4;
  --color-warning:    #FFB347;     /* 提醒 — 暖橙 */
  --color-warning-bg: #FFF8F0;
  --color-error:      #FF6B6B;     /* 错误 — 柔和红 */
  --color-error-bg:   #FFF0F0;
  --color-info:       #87CEEB;     /* 信息 — 天空蓝 */

  /* ===== 经期呵护模式 ===== */
  --color-cycle-bg:   #FFF0F5;     /* 薰衣草粉背景 */
  --color-cycle-accent: #E8D5E0;
}
```

### 1.2 Tailwind CSS 映射

```js
// tailwind.config.js
colors: {
  sunshine: {
    50:  '#FFFEF7',
    100: '#FFF9E6',
    200: '#FFF2CC',
    300: '#FFE999',
    400: '#FFD93D',
    500: '#F5C800',
  },
  warm: {
    50:  '#FAFAF8',
    100: '#F5F4F0',
    200: '#E8E5DF',
    300: '#D4D0C8',
    400: '#A9A49B',
    500: '#7A756E',
    600: '#5C5751',
    700: '#3E3A35',
    800: '#272420',
    900: '#141210',
  },
  rose: {
    100: '#FFF5F5',
    200: '#FFE4E1',
    300: '#FFC0CB',
    400: '#F4A0B0',
  },
}
```

---

## 2. Typography（字体系统）

### 2.1 Font Family

```css
--font-display:  'Playfair Display', 'Noto Serif SC', 'STSong', serif;   /* 标题/纪念日数字 */
--font-body:     'Nunito', 'PingFang SC', 'Microsoft YaHei', sans-serif;  /* 正文 */
--font-hand:     'Caveat', 'Kalam', cursive;                              /* 手写便签 */
```

### 2.2 Type Scale

| Token | Size / Line Height / Weight | Usage |
|---|---|---|
| `--text-xs` | `0.75rem / 1rem / 500` | 小标签、打卡天数 |
| `--text-sm` | `0.875rem / 1.25rem / 400` | 辅助文字、时间戳 |
| `--text-base` | `1rem / 1.6rem / 400` | 正文 |
| `--text-lg` | `1.125rem / 1.75rem / 500` | 卡片标题 |
| `--text-xl` | `1.25rem / 1.75rem / 600` | Section 标题 |
| `--text-2xl` | `1.5rem / 2rem / 700` | 页面标题 |
| `--text-3xl` | `2rem / 2.5rem / 700` | 倒计时数字 |
| `--text-hero` | `2.5rem / 1.2 / 700` | 纪念日大数字 |

### 2.3 Letter Spacing

| Token | Value | Usage |
|---|---|---|
| `--tracking-display` | `-0.01em` | 大标题/纪念日数字 |
| `--tracking-normal` | `0` | 正文 |
| `--tracking-label` | `0.03em` | 标签/按钮 |

---

## 3. Border & Radius（圆角与边框）

### 3.1 Border Radius

| Token | Tailwind | Value | Usage |
|---|---|---|---|
| `--radius-sm` | `rounded-lg` | `8px` | 小标签、Badge |
| `--radius-md` | `rounded-xl` | `12px` | 默认卡片/按钮 |
| `--radius-lg` | `rounded-2xl` | `16px` | Modal、大卡片 |
| `--radius-xl` | `rounded-3xl` | `24px` | 头像、特色面板 |
| `--radius-full` | `rounded-full` | `9999px` | Pill、圆形头像、打卡圈 |

### 3.2 边框

```css
/* 默认卡片边框 — 温润细线 */
--border-subtle: 1px solid var(--color-warm-200);

/* 强调边框 — 选中/悬停 */
--border-accent: 1.5px solid var(--color-sunshine-400);

/* 虚线变体 — 空状态/占位 */
--border-dashed: 1.5px dashed var(--color-warm-300);
```

---

## 4. Shadows（阴影）

> 柔和、温暖的投影风格，传达轻盈浪漫感。

```css
/* 极淡微投影 — 默认卡片 */
--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.03);

/* 标准浮起 — Hover 卡片 */
--shadow-md: 0 4px 16px -4px rgb(0 0 0 / 0.06), 0 2px 8px -2px rgb(0 0 0 / 0.04);

/* 深度浮起 — Modal / 重点浮层 */
--shadow-lg: 0 12px 32px -8px rgb(0 0 0 / 0.10), 0 4px 12px -4px rgb(0 0 0 / 0.06);

/* 暖光光晕 — 特殊强调元素（爱心、倒计时） */
--shadow-glow: 0 0 20px -4px rgb(255 217 61 / 0.25);
```

---

## 5. Motion（动效系统）

> 柔和自然，不过度弹跳。用于传达细腻的情感温度。

### 5.1 Duration Token

| Token | Value | Usage |
|---|---|---|
| `--duration-fast` | `150ms` | Hover 颜色切换、图标微交互 |
| `--duration-normal` | `250ms` | 展开/收起、Toggle |
| `--duration-slow` | `350ms` | 页面过渡、Modal 出现 |
| `--duration-enter` | `500ms` | 页面入场、Hero 动画 |
| `--duration-float` | `800ms` | 爱心飘浮 |

### 5.2 Easing Token

```css
/* 标准缓出 — 最常用 */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);

/* 柔和弹性 — 按钮按压、微交互 */
--ease-soft-bounce: cubic-bezier(0.34, 1.3, 0.64, 1);

/* 平滑出入 */
--ease-in-out: cubic-bezier(0.45, 0, 0.15, 1);
```

### 5.3 Keyframe Animations

```css
/* 轻柔弹入 */
@keyframes soft-bounce-in {
  0% { opacity: 0; transform: scale(0.92); }
  100% { opacity: 1; transform: scale(1); }
}

/* 爱心飘浮 */
@keyframes heart-float {
  0% { opacity: 1; transform: translateY(0) scale(1); }
  100% { opacity: 0; transform: translateY(-80px) scale(1.2); }
}

/* 卡片入场 */
@keyframes card-enter {
  0% { opacity: 0; transform: translateY(16px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* 数字滚动 */
@keyframes count-up {
  0% { opacity: 0; transform: translateY(0.5em); }
  100% { opacity: 1; transform: translateY(0); }
}

/* 柔和呼吸 */
@keyframes breathe {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
```

---

## 6. Spacing（间距系统）

4px 基准网格，适配移动端触控（最小 44px 点击区域）。

| Token | Value | Usage |
|---|---|---|
| `--space-1` | `4px` | 极小间距 |
| `--space-2` | `8px` | icon-文字间距 |
| `--space-3` | `12px` | 紧凑内边距 |
| `--space-4` | `16px` | 默认内边距 |
| `--space-5` | `20px` | 卡片内边距 |
| `--space-6` | `24px` | Section 内边距 |
| `--space-8` | `32px` | 大区块间距 |
| `--space-10` | `40px` | 页面级分隔 |
| `--space-12` | `48px` | Hero 上下间距 |
| `--space-touch` | `44px` | 最小触控目标 |

---

## 7. Component Token Reference

### 7.1 Card

```css
.card-diary {
  background: #fff;
  border: var(--border-subtle);
  border-radius: var(--radius-md);
  padding: var(--space-5);
  box-shadow: var(--shadow-sm);
  transition: all var(--duration-normal) var(--ease-out);
}
.card-diary:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
.card-diary.completed {
  background: var(--color-sunshine-100);
  border-color: var(--color-sunshine-300);
}
```

### 7.2 Button

```css
.btn-primary {
  background: var(--color-sunshine-400);
  color: var(--color-warm-800);
  border: none;
  border-radius: var(--radius-full);
  padding: var(--space-3) var(--space-6);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 600;
  box-shadow: var(--shadow-sm);
  transition: all var(--duration-fast) var(--ease-soft-bounce);
  min-height: var(--space-touch);
}
.btn-primary:hover {
  background: var(--color-sunshine-500);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}
.btn-primary:active {
  transform: scale(0.97);
}
```

### 7.3 Input

```css
.input-diary {
  background: var(--color-sunshine-50);
  border: var(--border-subtle);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-warm-800);
  outline: none;
  transition: all var(--duration-fast) var(--ease-out);
}
.input-diary:focus {
  border-color: var(--color-sunshine-400);
  box-shadow: 0 0 0 3px rgb(255 217 61 / 0.15);
  background: #fff;
}
```

### 7.4 Badge

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  background: var(--color-sunshine-200);
  border-radius: var(--radius-full);
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-warm-700);
}
```

---

## 8. PWA & Mobile First

```css
--app-max-width: 480px;
--app-safe-bottom: env(safe-area-inset-bottom, 16px);

.app-container {
  max-width: var(--app-max-width);
  margin: 0 auto;
  min-height: 100dvh;
  background: var(--color-sunshine-50);
  padding-bottom: var(--app-safe-bottom);
}
```

---

## 9. Enforcement（强制规范）

> **所有 UI 开发必须严格遵循本设计系统。**

### 禁止行为

- 禁止使用硬编码颜色值，必须通过 Tailwind 主题 token 引用。
- 禁止使用非 4 的倍数的 px 值作为间距。
- 禁止引入未经规范定义的第三方 UI 库默认样式覆盖设计 token。
- 禁止自定义 font-size 超出 Type Scale 定义的范围。
- 所有动画/过渡必须使用 `--duration-*` 和 `--ease-*` token。

### Code Review 设计 Checklist

- [ ] 所有颜色来自 Tailwind `sunshine.*` / `warm.*` / `rose.*` token
- [ ] 间距值为 4 的倍数
- [ ] 阴影来自 `--shadow-*` token
- [ ] 圆角使用 `--radius-*` token
- [ ] 动画使用 `--duration-*` + `--ease-*` token
- [ ] 字体使用 `font-display` / `font-body` / `font-hand` family
- [ ] font-size 在 Type Scale 范围内
- [ ] 移动端触控目标 ≥ 44px
- [ ] 按钮/卡片有 `:active` 按压反馈
- [ ] 空状态/加载态/错误态均有处理

---

*本设计系统为 Love Diary 项目的视觉唯一真理。所有 UI 代码 Review 以此文档为基准。*
