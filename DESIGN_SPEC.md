# 个人主页 · 设计规范文档

---

## 〇、全局 CSS 变量

### 主题 A（默认 · 马卡龙粉紫）

```css
:root {
  /* 主题色 */
  --pink: #FFB6C1;        --mint: #B5EAD7;        --lavender: #D4B5E2;
  --peach: #FFDAB9;       --sky-blue: #B5D8EB;    --cream: #FFF8E1;
  --light-pink: #FFE4E9;  --light-mint: #E8F8F0;  --light-lavender: #F3EBF8;
  --rose: #E8A0B5;

  /* 文字色 */
  --text-dark: #5D4E6D;   --text-mid: #7B6B8A;    --text-light: #9B8BAA;

  /* 玻璃拟态 */
  --glass-bg: rgba(255, 255, 255, 0.18);
  --glass-border: rgba(255, 255, 255, 0.35);
  --glass-shadow: rgba(180, 160, 200, 0.20);

  /* 发光色 (6级) */
  --glow-color-1: rgba(212, 181, 226, 0.40);
  --glow-color-2: rgba(255, 182, 193, 0.30);
  --glow-color-3: rgba(212, 181, 226, 0.22);
  --glow-color-4: rgba(212, 181, 226, 0.55);
  --glow-color-5: rgba(255, 182, 193, 0.45);
  --glow-color-6: rgba(212, 181, 226, 0.35);

  /* 全局尺寸 */
  --radius: 20px;
  --transition: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  /* 背景网格 */
  --grid-size: 42px;
  --grid-line: rgba(65, 138, 69, 0.08);
  --grid-glow: rgba(255, 255, 255, 0.08);
  --grid-focus-glow: rgba(238, 248, 235, 0.24);
  --grid-focus-line: rgba(216, 239, 214, 0.20);
  --grid-focus-size: 360px;
  --grid-focus-strength: 1;
  --grid-focus-x: 50%;
  --grid-focus-y: 32%;
  --grid-focus-opacity: 0;

  /* Z-Index 层级 */
  --z-grid: 0;          --z-particles: 1;       --z-base: 2;
  --z-avatar: 3;        --z-interactive: 10;    --z-fixed: 100;
  --z-overlay: 1000;    --z-toast: 2000;        --z-loader: 9999;
}
```

### 主题 B（春禾 · 森林绿）

```css
[data-music-theme="theme-b"] {
  --pink: #418A45;        --mint: #6B9B3E;        --lavender: #8FBC8F;
  --peach: #D4A574;       --sky-blue: #A8C686;    --cream: #F0F5EB;
  --light-pink: #E8F5E2;  --light-mint: #EDF3E8;  --light-lavender: #F5FAF2;
  --rose: #357239;

  --glass-bg: rgba(65, 138, 69, 0.10);
  --glass-border: rgba(65, 138, 69, 0.25);
  --glass-shadow: rgba(65, 138, 69, 0.15);

  --glow-color-1: rgba(65, 138, 69, 0.30);   --glow-color-4: rgba(65, 138, 69, 0.45);
  --glow-color-2: rgba(65, 138, 69, 0.20);   --glow-color-5: rgba(65, 138, 69, 0.35);
  --glow-color-3: rgba(107, 155, 62, 0.15);  --glow-color-6: rgba(107, 155, 62, 0.25);

  --grid-focus-size: 440px;
  --grid-focus-strength: 1.28;
  --grid-focus-glow: rgba(168, 221, 146, 0.44);
  --grid-focus-line: rgba(186, 230, 163, 0.36);

  body背景: linear-gradient(135deg, #F0F5EB 0%, #EDF3E8 30%, #E8F5E2 60%, #F5FAF2 100%);
}
```

### 主题 C（暗夜 · 星空紫）

```css
[data-music-theme="theme-c"] {
  --pink: #5122E0;        --mint: #441CBD;        --lavender: #7C3AED;
  --peach: #A78BFA;       --sky-blue: #8B5CF6;    --cream: #241A42;
  --light-pink: #27106B;  --light-mint: #2D1B54;  --light-lavender: #361694;
  --rose: #441CBD;

  --text-dark: #E8E8E8;   --text-mid: #B8B8B8;    --text-light: #888888;

  --glass-bg: rgba(36, 26, 66, 0.55);
  --glass-border: rgba(81, 34, 224, 0.25);
  --glass-shadow: rgba(0, 0, 0, 0.45);

  --glow-color-1: rgba(81, 34, 224, 0.35);   --glow-color-4: rgba(81, 34, 224, 0.50);
  --glow-color-2: rgba(81, 34, 224, 0.25);   --glow-color-5: rgba(81, 34, 224, 0.40);
  --glow-color-3: rgba(124, 58, 237, 0.15);  --glow-color-6: rgba(124, 58, 237, 0.30);

  --grid-focus-size: 440px;
  --grid-focus-strength: 0.7;
  --grid-line: rgba(167, 139, 250, 0.11);
  --grid-glow: rgba(167, 139, 250, 0.09);
  --grid-focus-glow: rgba(167, 139, 250, 0.16);
  --grid-focus-line: rgba(196, 181, 253, 0.11);

  body背景: linear-gradient(135deg, #14101F 0%, #180E2B 30%, #201438 60%, #14101F 100%);
}
```

---

## 一、页面背景

| 属性 | 值 |
|---|---|
| body 背景 | `linear-gradient(135deg, #FFF5F7 0%, #F0F8FF 30%, #F5F0FF 60%, #FFF0F5 100%)` |
| body 颜色过渡 | `transition: color 0.4s ease, background 0.6s ease` |
| 背景网格 opacity | `0.9` |
| 网格线大小 | `42px × 42px` |
| 网格顶部发光 | `radial-gradient(circle at 50% 0%, rgba(255,255,255,0.08) 0%, transparent 62%)` |
| 网格遮罩 | `linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.35) 78%, transparent 100%)` |

---

## 二、排版系统

### 2.1 字体族

| 元素 | 字体 | 字重 |
|---|---|---|
| 正文 body | `'Noto Sans SC', 'Quicksand', sans-serif` | 400 |
| 导航品牌 `.nav-brand` | `'Inter', sans-serif` | 700 |
| Hero 标题 `h1` | `'Poppins', sans-serif` | 700 |
| 区块标题 `.section-title` | `'Quicksand', sans-serif` | 700 |
| 区块副标题 `.section-subtitle` | （继承 Quicksand）| 800 |
| 卡片内标题 `h3` | `'Quicksand', sans-serif` | — |
| 曲库/模态标题 | `'Quicksand', sans-serif` | — |
| 加载器名称 | `'Quicksand', sans-serif` | — |

### 2.2 字号（全部精确值）

| 元素 | 字号 |
|---|---|
| 加载器名称 `.loader-name` | `5.4rem` |
| Hero 标题 `h1` | 桌面 `3rem` / 大屏 `5.5rem` / 移动 `2rem` |
| Hero 问候 `.hero-greeting` | `1rem` |
| Hero 副标题 `p` | 桌面 `1.1rem` / 大屏 `1.6rem` |
| Hero 引用 `.hero-quote` | 桌面 `0.95rem` / 大屏 `1.2rem` |
| 引用作者 `#quoteAuthor` | `0.8rem`（opacity `0.7`）|
| 滚动文字 `.scroll-text` | `0.75rem` |
| 区块标题 `.section-title` | `1.9rem` |
| 区块副标题 `.section-subtitle` | 桌面 `3rem` / 移动 `2.5rem` |
| 关于卡片 h3 | `1.2rem` |
| 关于卡片 p / li | `0.95rem` |
| 技能名称 `.skill-name` | `1rem` |
| 技能图标 `.skill-icon` | `2rem` |
| 博客标题 h3 | `1.1rem` |
| 博客正文 p | `0.9rem` |
| 博客日期 `.blog-date` | `0.8rem` |
| 博客标签 `.blog-tag` | `0.75rem` |
| 音乐歌名 `.hero-music-name` | 桌面 `0.8rem` / 大屏 `0.95rem` |
| 音乐歌手 `.hero-music-artist` | 桌面 `0.7rem` / 大屏 `0.85rem` |
| 音乐按钮 `.hero-music-btn` | `0.65rem` |
| 播放按钮 `.hero-music-play` | `0.8rem` |
| 导航品牌 | 桌面 `1.9rem` / 移动 `1.15rem` |
| 导航链接 | 桌面 `1rem` / 移动 `0.8rem` |
| 联系表单输入 | `0.9rem` |
| 联系表单按钮 | `1rem` |
| 工具标签 `.tools-tab` | 桌面 `0.9rem` / 移动 `0.82rem` |
| 工具磁贴名称 | `0.82rem` |
| 页脚品牌 | `1.45rem` |
| 页脚链接 | `0.92rem` |
| 页脚元数据 | `0.85rem` |
| 模态标题 h2 | `1.4rem` |
| 模态正文 p | `0.95rem` |
| 曲库标题 h3 | `1.2rem` |
| 曲库项名称 | `0.82rem` |
| 曲库项歌手 | `0.75rem` |
| Toast | `0.9rem` |

### 2.3 行高

| 元素 | line-height |
|---|---|
| Hero 副标题 p | `1.8` |
| Hero 引用 `.hero-quote` | `1.6` |
| 关于卡片 p / li | `1.8` |
| 博客卡片 p | `1.6` |
| 滚动文字 | `1.2` |

---

## 三、间距系统（全部精确值）

### 3.1 页面级

| 元素 | 值 |
|---|---|
| 区块 section | `padding: 100px 20px`（移动 `60px 12px`）|
| 区块 max-width | `1100px` |
| Hero | `padding: 130px 20px 80px` |
| Hero `min-height` | `100vh` |
| Hero 内部 gap | 桌面 `60px` / 大屏 `160px` / 移动 `30px` |
| Hero 内部 max-width | `1200px` |
| Hero 副标题 max-width | `500px`（大屏 `700px`）|
| Hero 左侧 p max-width | `540px` |
| Hero 引用 max-width | `400px`（大屏 `500px`）|

### 3.2 导航栏

| 元素 | 值 |
|---|---|
| 高度 | 桌面 `74px` / 移动 `68px` |
| 左右 padding | 桌面 `0 44px` / 移动 `0 20px` |
| 网格列 | `1fr auto 1fr` |
| 链接间距 gap | 桌面 `44px` / 移动 `14px` |
| 链接下 padding | `6px` |
| 下划线高度 | `3px`，`bottom: -4px`，圆角 `2px` |
| 导航图标 SVG | `22px × 22px`（移动 `18px × 18px`）|

### 3.3 Hero 问候标签

| 元素 | 值 |
|---|---|
| padding | `6px 18px` |
| margin-bottom | `12px` |
| margin-top | `20px` |
| letter-spacing | `0.08em` |

### 3.4 音乐播放器

| 元素 | 值 |
|---|---|
| 卡片宽度 | 桌面 `280px` / 大屏 `380px` |
| 卡片 padding（收起）| `0 0 0 10px` |
| 卡片 padding（展开）| `10px 14px 10px 10px` |
| 卡片 margin-bottom | `20px` |
| 卡片内部 gap | `10px` |
| 唱片尺寸 | 桌面 `40px × 40px` / 大屏 `60px × 60px` |
| 唱片左边距 | `3px` |
| 唱片字号 | 桌面 `1.2rem` / 大屏 `1.6rem` |
| 按钮尺寸 | `28px × 28px`（大屏 `32px × 32px`）|
| 播放按钮 | `32px × 32px`（大屏 `38px × 38px`）|
| 按钮间距 gap | `6px` |
| 按钮组偏移 | `translateX(-3px)` |
| 歌名 max-width | `100px` |
| 展开面板 gap | `8px` |
| 音波条宽度 | `4px` |
| 音波条间距 | `3px` |
| 音波条区域高度 | `24px` |
| 音波条区域 padding | `0 4px` |

### 3.5 关于卡片

| 元素 | 值 |
|---|---|
| padding | `30px` |
| 网格 gap | `30px` |
| margin-top | `30px` |
| 列表项 padding | `4px 0` |
| h3 margin-bottom | `14px` |
| 悬停光晕 | `400px × 400px`，中心偏移 `translate(-50%, -50%)` |

### 3.6 技能卡片

| 元素 | 值 |
|---|---|
| padding | `20px` |
| 网格 gap | `20px`（移动 `24px`）|
| 网格 minmax | `minmax(200px, 1fr)` |
| 内部网格 | 列 `auto 1fr`，行 `auto auto`，gap `12px 16px` |
| 技能条高度 | `6px`，圆角 `3px` |
| 悬停光晕 | `400px × 400px` |

### 3.7 博客卡片

| 元素 | 值 |
|---|---|
| padding | `28px` |
| 网格 gap | `24px` |
| 网格 minmax | `minmax(300px, 1fr)` |
| "显示更多"按钮 | `padding: 10px 32px`，`margin: 24px auto 0` |

### 3.8 联系区块

| 元素 | 值 |
|---|---|
| 表单 padding | `30px` |
| 网格 gap | `30px` |
| 表单内部 gap | `16px` |
| 输入框 padding | `14px 18px` |
| 输入框圆角 | `12px` |

### 3.9 工具区块

| 元素 | 值 |
|---|---|
| 卡片 padding | `32px 36px 42px` |
| 标签栏 gap | 桌面 `10px` / 移动 `8px` |
| 标签 padding | 桌面 `10px 22px` / 移动 `8px 16px` |
| 网格 gap | `24px`（移动 `16px`）|
| 网格 minmax | `minmax(130px, 1fr)`（移动 `100px`）|
| 磁贴 padding | `16px 12px` |

### 3.10 页脚

| 元素 | 值 |
|---|---|
| padding | `34px 20px 56px` |
| 网格列 | `1.3fr 1fr auto` |
| 内 gap | `34px` |
| 链接 gap | `14px 22px` |
| 分隔线宽度 | `min(1120px, calc(100% - 40px))` |
| 分隔线高度 | `1px` |

### 3.11 滚动指示器

| 元素 | 值 |
|---|---|
| 指示器 bottom | `60px` |
| 指示器 left | `50%` |
| 指示器 X 偏移 | `calc(-50% + 9px)` |
| 指示器框 | `20px × 30px`，边框 `2px`，圆角 `10px` |
| 指示器圆点 | `4px × 8px`，top `6px`，圆角 `2px` |
| 滚动文字 bottom | `37px`，left `50%` |

### 3.12 Toast & 返回顶部

| 元素 | 值 |
|---|---|
| Toast bottom | `90px`，right `24px` |
| Toast padding | `14px 24px` |
| Toast border-radius | `12px` |
| 返回顶部 bottom | `32px`，right `32px` |
| 返回顶部尺寸 | `44px × 44px` |

### 3.13 模态框 & 曲库

| 元素 | 值 |
|---|---|
| 模态 content max-width | `500px` |
| 模态 content padding | `35px` |
| 模态 content border-radius | `12px` |
| 模态关闭按钮 | `32px × 32px` |
| 曲库 card max-width | `420px` |
| 曲库 card padding | `24px` |
| 曲库 card max-height | `70vh` |
| 曲库列表项 padding | `7px 10px` |
| 曲库列表项 gap | `10px` |
| 曲库列表项 border-radius | `12px` |
| 曲库列表 gap | `6px` |
| 曲库封面尺寸 | `28px × 28px` |
| 曲库关闭按钮 | `32px × 32px` |
| 曲库空状态 padding | `30px 10px` |

---

## 四、圆角体系

| 圆角值 | 应用范围 |
|---|---|
| `50%` | 头像、唱片封面、音乐按钮、轨道环、轨道圆点 |
| `999px` | Hero 问候标签、博客"显示更多"按钮 |
| `40px` | 音乐播放器卡片（收起/展开通用）|
| `20px` (`--radius`) | 所有玻璃卡片 |
| `16px` | 工具磁贴 |
| `14px` | 工具标签 |
| `12px` | 表单输入框/textarea/按钮、模态内容、曲库列表项、Toast |
| `10px` | 滚动指示器外框 |
| `8px` | 技能图标容器 |
| `4px` | 滚动条滑块 |
| `3px` | 技能条、技能填充 |
| `2px` | 导航链接下划线、滚动指示器圆点 |
| `1px` | 音波条 |

---

## 五、透明度/模糊度（全部精确值）

### 5.1 玻璃相关

| 元素 | 背景 opacity | backdrop-filter blur | 边框 opacity |
|---|---|---|---|
| `.glass` 卡片 | `rgba(255,255,255,0.18)` | `blur(16px)` | `rgba(255,255,255,0.35)` |
| 滚动导航栏 | `rgba(255,255,255,0.6)` | `blur(20px)` | `rgba(255,255,255,0.35)` |
| 博客"更多"按钮 | — | `blur(12px)` | — |
| 模态叠加层 | `rgba(0,0,0,0.25)` | `blur(6px)` | — |
| 曲库叠加层 | `rgba(0,0,0,0.25)` | `blur(8px)` | — |
| Toast | — | `blur(12px)` | — |
| 工具标签 | — | `blur(12px)` | — |
| 工具磁贴图片框 | — | `blur(16px)` | — |
| 回到顶部 | — | `blur(8px)` | — |

### 5.2 入场动画初始状态

| 元素 | 初始 opacity | 初始 blur | 初始 transform |
|---|---|---|---|
| 通用 `.enter` | `0` | — | — |
| Hero 问候 | `0` | `blur(8px)` | `translateY(-24px)` |
| 导航栏 | `0` | — | `translateY(-100%)` |
| 导航子元素 | `0` | — | `translateY(-10px)` |
| Hero h1 | `0` | `blur(4px)` | `translate(-20px, 25px) scale(0.6)` |
| 头像轨道 | `0` | `blur(10px)` | `scale(0.3)` |
| 头像本身 | `0` | — | — |
| 副标题字符 `.char` | `0` | `blur(20px)` | `scale(0.85)` |
| 音乐卡片 | `0` | `blur(8px)` | `scale(0.85)` |
| Hero 引用 | `0` | `blur(6px)` | `translateY(8px)` |
| 滚动指示器+文字 | `0` | `blur(8px)` | — |

### 5.3 区块副标题

| 属性 | 值 |
|---|---|
| opacity（显示后）| `0.25` |
| mask-image | `linear-gradient(to bottom, black 20%, transparent 100%)` |

### 5.4 其他透明度

| 元素 | opacity |
|---|---|
| 粒子 | `0.35`（每颗粒子可独立变化 `0.18~0.40`）|
| 引用作者 | `0.7` |
| 区块副标题 | `0.25`（visible 状态）|
| 背景网格 | `0.9` |
| 滚动指示器（滚动时）| scrollY 0→700 线性从 `1` 衰减到 `0` |
| 博客日期 | `0.7` |
| 卡片光晕（悬停前）| `0`（悬停 `1`）|

---

## 六、发光 / 阴影系统（精确值）

### 6.1 头像光晕

**静态：**
```css
box-shadow:
  0 0 0 4px color-mix(in srgb, var(--lavender) 15%, transparent),
  0 16px 60px var(--glow-color-4),
  0 0 60px var(--glow-color-1),
  0 0 120px var(--glow-color-3);
```

**脉冲动画** `avatarPulse`，周期 `4s ease-in-out infinite`：
- 0%, 100%：同上
- 50%：扩散半径 + 颜色切换
  ```css
  box-shadow:
    0 0 0 4px color-mix(in srgb, var(--lavender) 20%, transparent),
    0 16px 80px var(--glow-color-4),
    0 0 80px var(--glow-color-5),
    0 0 140px var(--glow-color-6);
  ```

### 6.2 唱片光晕

**静态：**
```css
box-shadow:
  0 2px 18px var(--glow-color-1),
  0 0 30px var(--glow-color-2),
  0 0 55px var(--glow-color-3);
```

**悬停：** `scale(1.08)` + 阴影扩大
```css
box-shadow:
  0 4px 28px var(--glow-color-4),
  0 0 45px var(--glow-color-5),
  0 0 80px var(--glow-color-6);
```

**呼吸动画** `vinylGlow`，周期 `3s ease-in-out infinite`：
- 0%, 100%：`2px 18px` / `30px` / `55px`
- 50%：`2px 22px` / `40px` / `75px`

### 6.3 轨道圆点光晕

```css
box-shadow: 0 0 30px var(--glow-color-1), 0 0 60px var(--glow-color-3);
```

### 6.4 玻璃卡片阴影

| 状态 | box-shadow |
|---|---|
| 默认 `.glass` | `0 8px 48px var(--glass-shadow)` |
| 技能项悬停 | `0 16px 60px var(--glass-shadow)` |
| 博客卡片悬停 | `0 12px 40px var(--glass-shadow)` |
| 提交按钮悬停 | `0 8px 24px rgba(212,181,226,0.4)` |
| Toast | `0 8px 24px var(--glass-shadow)` |
| 工具磁贴图片框 | `0 6px 20px var(--glass-shadow)`（悬停 `0 8px 28px`）|
| 博客"更多"按钮悬停 | `0 4px 16px var(--glass-shadow)` |
| 表单输入 focus | `0 0 0 3px rgba(212,181,226,0.15)` |
| 工具标签（active）| `0 4px 16px rgba(65,138,69,0.3)` |

### 6.5 区块标题发光

```css
text-shadow: 0 0 50px color-mix(in srgb, var(--lavender) 30%, transparent);
```

### 6.6 卡片悬停光晕（鼠标跟随）

```css
/* 关于卡片 & 技能项 ::before 伪元素 */
width: 400px; height: 400px;
background: radial-gradient(circle,
  rgba(255,255,255,0.25) 0%,
  rgba(255,255,255,0) 75%);
opacity: 0 → 1（hover 时 0.4s ease）
```

---

## 七、入场动画序列（精确时间线）

> 加载器 DOMContentLoaded → 字体加载 → window.load → 入场序列启动

### 7.1 加载器阶段

| 时间点 | 动作 |
|---|---|
| 页面加载中 | 加载器字母逐个显现：`translateY(24px) scale(0.8)` → `translateY(0) scale(1)`，每字 `0.35s ease-out` |
| window.load + 300ms | 加载器开始淡出（`opacity: 0; visibility: hidden; pointer-events: none`）|
| window.load + 1100ms | 加载器从 DOM 移除 |
| 加载器移除 + 200ms | 调用 `startEntrance()`，入场序列开始 |

### 7.2 入场序列时间线（`startEntrance()` 内）

| 序号 | 延迟 | 目标元素 | 动画 | 初始状态 → 结束状态 | 时长 | 缓动 |
|---|---|---|---|---|---|---|
| 1 | 250ms | 问候 "你好，我是" | `slideUpFade` | opacity:0 + translateY(16px) + blur(6px) → opacity:1 + translateY(0) + blur(0) | 0.7s | ease-out |
| 2 | 350ms | Hero h1 + 头像轨道 | `scaleUpFade` | h1: opacity:0 + translate(-20,25) scale(0.6) + blur(4px) → 还原; 轨道: opacity:0 + scale(0.3) + blur(10px) → 还原 | 0.8s / 1s | cubic-bezier(0.34, 1.56, 0.64, 1) |
| 3 | 500ms | 导航栏 | 滑入 | translateY(-100%) opacity:0 → translateY(0) opacity:1 | 0.7s | cubic-bezier(0.22, 1, 0.36, 1) |
| — | 500ms | 导航品牌 | 淡入 | opacity:0 translateY(-10px) → 还原 | 0.45s | ease |
| — | +100ms | 导航链接 | 淡入(延迟) | 同上 | 0.45s | ease |
| — | +200ms | 导航图标 | 淡入(延迟) | 同上 | 0.45s | ease |
| 4 | 650ms+ | 副标题逐字显现 | char 逐个 | blur(20px) opacity:0 scale(0.85) → blur(0) opacity:1 scale(1)，每字间隔 `50ms` | 0.65s/字 | ease-out |
| 5 | 1150ms | 音乐卡片 | `scaleUpFade` | opacity:0 scale(0.85) blur(8px) → 还原 | 1s | ease-out |
| 6 | 1200ms | 导航移除 `.enter` | — | 解除入场类，允许滚动过渡生效 | — | — |
| 7 | 1600ms | 引用文字 | `slideUpFade` | opacity:0 translateY(8px) blur(6px) → 还原 | 0.8s | ease-out |
| 8 | 2000ms | 滚动指示器 + 滚动文字 | `scrollEntrance` | opacity:0 blur(8px) → opacity:1 blur(0) | 1.5s | ease-out |

### 7.3 Reveal 滚动入场（非首屏区块）

| 元素 | 初始 → 结束 | 时长 |
|---|---|---|
| `.reveal`（关于/技能/博客/工具/联系）| `opacity: 0; transform: translateY(40px)` → `opacity: 1; transform: translateY(0)` | 0.7s ease |

---

## 八、动画关键帧清单

| 关键帧名 | 周期 | 缓动 | 作用对象 | 效果描述 |
|---|---|---|---|---|
| `orbitSpin` | 8s / 14s | linear | 轨道环 | 360° 旋转（内环 8s，外环 14s 反向）|
| `avatarPulse` | 4s | ease-in-out | 头像 | 光晕扩散呼吸 |
| `heroTitleShimmer` | 3s | ease-in-out alternate | Hero h1 | 渐变背景 0%→100% 位移 |
| `fadeInBlur` | — | — | 通用 | opacity 0→1 + blur 10px→0 |
| `scaleUpFade` | — | — | Hero 元素入场 | opacity 0→1 + scale 0.8→1 + blur 8px→0 |
| `slideUpFade` | — | — | 引用/问候入场 | opacity 0→1 + translateY(16px→0) + blur 6px→0 |
| `scrollEntrance` | 单次 | ease-out | 滚动指示器 | opacity 0→1 + blur 8px→0，1.5s |
| `vinylSpin` | 6s | linear | 唱片封面 | 360° 旋转（播放时 running，暂停时 paused）|
| `vinylGlow` | 3s | ease-in-out | 唱片封面 | 光晕呼吸 |
| `barIdle` | 1.2s 基准 | ease-in-out | 音波条 | 高度 4px↔14px 跳动（各子元素变体：1s/1.4s/0.9s/1.3s）|
| `bounceDown` | 2s | ease-in-out | 滚动指示器框 | translateY(0→6px) 弹跳 |
| `scrollDot` | 2s | ease-in-out | 滚动指示器圆点 | translateY(0→8px) + opacity(1→0.3) |
| `playlistIn` | 0.35s | ease | 曲库弹窗 | scale(0.9) translateY(20px) → scale(1) translateY(0) |
| `modalIn` | 0.35s | ease | 模态框 | scale(0.9) translateY(20px) → scale(1) translateY(0) |
| `loaderShrink` | 0.8s | cubic-bezier(0.65,0,0.35,1) | 加载器退出 | scale 缩小 |
| `floatSway` | 24s~90s | linear | 主题B粒子 | 浮动上升 + 摇摆 + 旋转 |
| `twinkleUp` | 24s~90s | linear | 主题C粒子 | 浮动上升 + 闪烁 |

---

## 九、过渡规范（按使用频次排列）

| 时长 | 缓动函数 | 属性 | 应用 |
|---|---|---|---|
| `0.1s ease-out` | 标准 | transform | 3D倾斜卡片鼠标跟随 |
| `0.15s ease` | 标准 | height | 音波条 |
| `0.2s ease` | 标准 | transform, background | 音乐按钮 hover、曲库列表项、工具卡片高度 |
| `0.3s ease` | 标准 | color, transform, box-shadow | 导航图标 hover、唱片 hover、音乐按钮、博客按钮 |
| `0.35s ease` | 标准 | opacity | 网格伪元素、模态框、曲库弹窗 |
| `0.4s ease` | 标准 | background, border, box-shadow, color | `.glass` 卡片、音乐播放器、卡片光晕、文字颜色、主题切换 |
| `0.4s cubic-bezier(0.25,0.46,0.45,0.94)` | `--transition` | 通用 | 卡片阴影、技能填充、导航过渡 |
| `0.45s ease` | 标准 | opacity, transform | 导航子元素入场 |
| `0.6s ease` | 标准 | opacity, transform, background | 通用 `.enter`、头像、主题切换 |
| `0.7s ease` / `ease-out` | 标准/弹性 | opacity, transform | reveal 可见、Hero 问候入场 |
| `0.8s ease` / `ease-out` / `cubic-bezier(0.34,1.56,0.64,1)` | 弹性 | opacity, transform, filter | Hero h1、引用入场、加载器退出 |
| `1s ease-out` | 标准 | opacity, transform, filter | 音乐卡片入场 |
| `1.2s cubic-bezier(0.25,0.46,0.45,0.94)` | 弹性 | width | 技能条填充 |
| `1.5s ease-out` | 标准 | opacity, filter | 滚动指示器入场 |

---

## 十、交互规范

### 10.1 悬停效果

| 元素 | 效果 | 数值 |
|---|---|---|
| 导航链接 | 渐变下划线从 0→100% 展开 | height `3px`，bottom `-4px`，`--transition` |
| 导航链接 | 颜色变化 | `var(--text-light)` → `var(--text-dark)` |
| 导航图标 | 放大 | `scale(1.1)`，`0.3s ease` |
| 唱片封面 | 放大 + 光晕增强 | `scale(1.08)` + 阴影扩散增大40%~60%，paused 状态暂停旋转 |
| 音乐按钮 | 放大 + 背景 | `scale(1.1)` + `rgba(255,182,193,0.35)`，`0.2s` transform |
| 博客卡片 | 上浮 + 阴影 | `translateY(-6px)` + `0 12px 40px` 阴影 |
| 博客"更多"按钮 | 上浮 + 箭头 | `translateY(-2px)` + 箭头 `translateX(4px)` |
| 工具标签 | 上浮 | `translateY(-2px)` |
| 工具磁贴 | 上浮 | `translateY(-6px)` |
| 曲库列表项 | 右移 | `translateX(3px)`，`0.2s ease` |
| 提交按钮 | 上浮 + 阴影 | `translateY(-2px)` + `0 8px 24px` 阴影 |
| 页脚链接 | 下划线 | `scaleX(0→1)`，`0.4s ease` |

### 10.2 点击 / 激活

| 元素 | 效果 |
|---|---|
| 唱片封面 → 点击 | 弹出曲库弹窗 |
| 播放按钮 → 点击 | 播放/暂停切换 |
| 上一首/下一首 → 点击 | 切歌 + 切换主题 |
| 歌名 → 点击 | （已移除）|
| 工具标签 → 点击 | 筛选工具分类，切换 active 样式（渐变背景 + 白色文字）|
| 博客卡片 → 点击 | 打开文章模态框 |
| 博客"更多" → 点击 | 展开更多文章卡片 |
| 表单提交按钮 → 点击 | 发送表单（60s 冷却）|
| 回到顶部 → 点击 | `window.scrollTo({ top: 0, behavior: 'smooth' })` |

### 10.3 表单 Focus

| 元素 | 效果 |
|---|---|
| 输入框/textarea | 边框 `var(--lavender)` + 背景 `rgba(255,255,255,0.5)` + 外发光 `0 0 0 3px rgba(212,181,226,0.15)` |

### 10.4 滚动触发

| 触发条件 | 效果 |
|---|---|
| scrollY > 60 | 导航栏添加毛玻璃效果（`rgba(255,255,255,0.6)` + `blur(20px)` + 底边框）|
| scrollY 0→700 | 滚动指示器 opacity `1→0` 线性衰减 |
| scrollY > 400 | 回到顶部按钮 `opacity: 1; translateY(0)`，否则 `opacity: 0; translateY(20px)` |
| scrollY 接近底部 | 导航"联系"链接高亮 |
| 区块进入视口 | `.reveal` 元素从下方 40px 淡入滑上 |

---

## 十一、3D 卡片倾斜（精确参数）

| 参数 | 值 |
|---|---|
| 目标元素 | `.skill-item`, `.about-card` |
| 透视 | `perspective(800px)` |
| 最大倾角 | ±6° |
| Z 轴前移 | `translateZ(12px)` |
| 缩放 | `scale(1.02)` |
| 入场过渡 | `transform 0.1s ease-out` |
| 复位过渡 | `transform 0.5s ease-out` |
| 悬停 z-index | `10` |
| 光晕位置 | CSS 变量 `--mx`, `--my`（鼠标在卡片内的百分比坐标）|

---

## 十二、粒子系统（精确参数）

| 参数 | 值 |
|---|---|
| 数量 | `20` |
| 大小范围 | `25px ~ 70px` |
| 动画时长范围 | `24s ~ 90s` |
| 延迟范围 | `0 ~ 30s` |
| 起始 Y | `100vh ~ 160vh` |
| 水平摇摆 | `-60px ~ 60px` |
| 透明度范围 | `0.18 ~ 0.40` |
| 旋转范围 | `360deg ~ 1080deg` |
| 鼠标排斥半径 | `100px` |
| 排斥力 | `5` |
| 摩擦力 | `0.98` |

**主题B形状(14种)：** 露珠、SVG叶、绿叶、植物、云、草、太阳、Twitter、爱心、音符、蜜蜂、灌木、四叶草、花朵

**主题C形状(17种)：** GitHub、C++、代码1、代码2、AE、ChatGPT、Linux、Claude、Python、终端、VS Code、Java、Grok、BTC、美元、Telegram、Chrome

---

## 十三、Z-Index 层级

| z-index 值 | CSS 变量 | 归属元素 |
|---|---|---|
| 0 | `--z-grid` | 背景网格 |
| 1 | `--z-particles` | 浮动粒子、卡片悬停光晕 |
| 2 | `--z-base` | 区块内容、轨道环 |
| 3 | `--z-avatar` | Hero 头像（轨道环之上）|
| 10 | `--z-interactive` | 音乐控制按钮、3D倾斜卡片(临时) |
| 100 | `--z-fixed` | 导航栏、返回顶部按钮 |
| 1000 | `--z-overlay` | 模态框叠加层、曲库弹窗叠加层 |
| 2000 | `--z-toast` | Toast 通知 |
| 9999 | `--z-loader` | 加载画面 |

---

## 十四、响应式断点

### ≥769px（大屏）

```css
@media (min-width: 769px) {
  .hero h1 { font-size: 5.5rem; }
  .hero p { font-size: 1.6rem; }
  .hero-inner { gap: 160px; }
  .hero-left p { max-width: 700px; }
  .hero-right .hero-avatar { width: 250px; height: 250px; }
  .hero-right { transform: translateX(-60px); }
  .hero-music { width: 380px; }
  .hero-music-cover { width: 60px; height: 60px; font-size: 1.6rem; }
  .hero-music-name { font-size: 0.95rem; }
  .hero-music-artist { font-size: 0.85rem; }
  .hero-music .hero-music-btn { width: 32px; height: 32px; }
  .hero-music .hero-music-play { width: 38px; height: 38px; }
  .hero-quote { font-size: 1.2rem; max-width: 500px; }
}
```

### ≤768px（移动端）

```css
@media (max-width: 768px) {
  nav { padding: 0 20px; height: 68px; }
  .nav-brand { font-size: 1.15rem; }
  .nav-links { gap: 14px; }
  .nav-links a { font-size: 0.8rem; }
  .nav-icon svg { width: 18px; height: 18px; }
  .hero { padding: 110px 14px 60px; }
  .hero h1 { font-size: 2rem; }
  .hero-inner { flex-direction: column; gap: 30px; text-align: center; }
  .hero-left { text-align: center; }
  .hero-left h1 { text-align: center; }
  .hero-left .hero-music { margin-left: auto; margin-right: auto; }
  .hero-left .hero-quote { text-align: center; }
  .hero-right .hero-avatar { width: 130px; height: 130px; }
  .hero-left p { max-width: 100%; }
  .section-subtitle { font-size: 2.5rem; }
  .about-grid, .contact-wrap { grid-template-columns: 1fr; }
  section { padding: 60px 12px; }
  .about-grid, .skills-grid { gap: 24px; }
  .tools-tab-bar { gap: 8px; }
  .tools-tab { padding: 8px 16px; font-size: 0.82rem; }
  .tools-grid { grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 16px; }
  .bg-grid { --grid-size: 34px; }
  .orbit-ring { display: none; }
}
```

### 触控设备

```css
@media (hover: none) and (pointer: coarse) {
  .bg-grid::before, .bg-grid::after { opacity: 0; }
}
```

---

## 十五、音乐播放器状态机

| 状态 | 卡片 class | 表现 |
|---|---|---|
| 默认展开 | `hero-music open enter` | 唱片 + 歌名/歌手 + 控制按钮全部可见 |
| 播放中 | `hero-music open playing` | 唱片旋转 + 音波条跟随频谱跳动 |
| 暂停 | `hero-music open` | 唱片停止旋转 + 音波条 idle 动画 |

**音波条 idle 动画变体（20条）：**
- 奇数位子元素：`1s`
- 3n 位置：`1.4s`
- 5n 位置：`0.9s`
- 7n 位置：`1.3s`
- 默认：`1.2s`
- 高度范围：`4px ↔ 14px`

**播放时**：动画取消（`animation: none`），由 JS 实时驱动高度（3px~28px）

---

## 十六、音轨信息

| 索引 | 歌名 | 歌手 | 触发主题 |
|---|---|---|---|
| 0 | 春禾 | Youzee Music | theme-b（森林绿）|
| 1 | shelter | hakaisu / Alys | theme-c（夜空紫）|

---

## 十七、技术实现要点

| 特性 | 实现方式 |
|---|---|
| 主题切换 | `body.setAttribute('data-music-theme', theme)` |
| 玻璃拟态 | `backdrop-filter: blur()` + `rgba` 半透明背景 |
| 3D 倾斜 | JS `mousemove` → `element.style.transform` 设置 `perspective` + `rotateX/Y` + `translateZ` |
| 粒子系统 | JS 生成 DOM 元素 → CSS `animation` 驱动浮动 → JS 鼠标排斥偏移 |
| 音频可视化 | `AudioContext` → `AnalyserNode.getByteFrequencyData()` → 更新音波条高度 |
| 入场编排 | `setTimeout` 级联队列 |
| Reveal 滚动 | `IntersectionObserver` → 添加 `.visible` 类 |
| 表单 | Formspree 提交，60s 冷却 |
| 背景网格 | CSS `background-image` 三层叠加 + `mask-image` 渐变 |
