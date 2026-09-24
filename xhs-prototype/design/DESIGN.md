# 同频 · DESIGN.md

> 生成日期：2026-09-22 ｜ 设计师：颜好看 ｜ 基于：小红书轻互动设计方案（击掌/送花/递表情）+ 原版截图
> 三轴刻度：Variance=2 ／ Motion=6 ／ Density=5
> 设计寄存器：**Product**（设计服务产品，标杆是「赢得熟悉感」——忠实还原小红书原生视觉）
> Token 源文件：`design-tokens.json`（机器可读）／`design-tokens.css`（前端 import）／`page-spec.md`（4 页逐页规格）

---

## 1. Visual Theme & Atmosphere
- 视觉主题关键词：**原生、轻盈、克制、熟人感**。
- 氛围描述：一眼是小红书——白底、卡片、`#FF2442` 红、PingFang SC。新交互只在既有「赞」按钮上做延长，不新增浮夸入口；动效短促、传达状态变化而非炫技。
- 对标品牌：**小红书（原生）**、QQ（轻互动手势机制）、微信（拍一拍回礼）。

## 2. Color Palette & Roles
- A1-identity：`--color-bg`(#FFFFFF) / `--color-surface`(#FFFFFF) / `--color-fg`(#1A1A1A) / `--color-fg-muted`(#666666) / `--color-primary`(#FF2442 小红书红) / `--color-border`(#EEEEEE)
- A2-semantic：`--color-success`(#07C160) / `--color-warn`(#FF8C00) / `--color-danger`(#FF2442) / `--color-topic`(#2F6BD8 话题蓝)
- B-slot 别名：`--color-fg-body`(#333) / `--color-surface-2`(#F0F0F0 输入框·对方气泡) / `--color-fg-meta`(#999) / `--color-primary-soft`(#FFF1F3) / `--color-primary-text`(#E11D37 小号红字)
- C-extension：`--color-like`(点赞红=主色) / `--countdown-chip-*`(24h 倒计时 chip) / `--gift-btn-*`(回礼按钮) / `--bubble-self`(自己气泡=主色)
- 每屏强调色使用 ≤2 处（如：态②③红心 + 一个主 CTA）；其余靠中性色承载。
- 来源：基于小红书原版取色 + `references/design-systems/color-palettes.md` 消费级暖色体系微调。

## 3. Typography
- 标题 + 正文同源：**PingFang SC**（`--font-family-base`）→ 回退 `-apple-system / Helvetica Neue / Hiragino Sans GB / Microsoft YaHei`。移动端原生字体，无需 web font 加载。
- 数字：`--font-family-number`(SF Pro Text) + `font-variant-numeric: tabular-nums`（倒计时/计数防跳动）。
- 字号阶梯：10 / 11 / 12 / 13 / 14 / 15 / 16 / 17 / 20 px（`--font-size-2xs` → `--font-size-3xl`）。
- 字重 3 级：400 正文 / 500 昵称·按钮 / 600 标题·CTA。
- 行高：正文 1.6（笔记区）/ 通用 1.4 / 标题 1.25。
- 字距：正文 0；≥20px 标题 `-0.02em`；字母标签 `0.02em`。
- 不属于品牌展示型场景，故不使用展示字体（Product 寄存器禁止 Serif 进入工具 UI）。

## 4. Components
- **三态赞按钮（核心）**：`idle(heart 描边) → liked(heart 实心红) → gestured(hand/flower 红)`，点击循环，长按调起手势二选一。图标统一 Lucide 描边 SVG，stroke 1.75，24px。状态含 default/hover/active/liked/gestured/loading(乐观)/error(回滚)/edge(10万+)。
- 按钮：Primary（红底白字 pill）/ Secondary（soft 底 + `--color-primary-text`）/ Ghost（文字）/ Disabled（`--color-primary-disabled` 而非降透明度）。
- 输入框：`--input-bg` 灰底 pill；focus → 1px 主色描边 + `--focus-ring` 外环；error → `--color-danger` 描边。
- 卡片：消息通知卡片（头像44 + 文本 + 右槽按钮/缩略图）；圆角 `--radius-lg`，1px `--color-border`，无默认阴影。
- 导航：顶部导航 44px 白底无分割线；底部 TabBar 49px + 安全区。
- 模态 / Toast / Badge / Avatar：Toast 底部居中，Avatar 32/44/48 三档圆。
- 图标库：**Lucide 描边集合，全项目唯一，stroke 1.75，尺寸 16/20/24**（清单见 page-spec.md §0.1）。

## 5. Layout & Spacing
- 间距基准：4px 网格（4/8/12/16/20/24/32/40/48）。
- 圆角阶梯：2 / 4 / 8 / 12 / 16 / pill。
- 内容骨架：375×812，状态栏 44 + 导航 44 + 内容 flex + 操作栏 52 + 安全区 34。
- 横向边距：`--gutter` 12px（导航/列表/操作栏）、`--gutter-content` 16px（笔记正文）。
- 触摸目标：全部 ≥44×44。

## 6. Depth & Elevation
- 阴影：`--shadow-sm/md/lg` + `--shadow-sheet`(浮层顶部) + `--shadow-bar`(操作栏上边线)。
- 层级 z-index：base 0 / sticky 100 / actionbar 200 / mask 900 / sheet 1000 / toast 1100。
- 毛玻璃：仅浮层遮罩用 `--color-overlay-mask` 半透明，**不做装饰性模糊**。

## 7. Do's & Don'ts
- Do：未改动部分严格对齐小红书原版；「微弹」用 scale 关键帧+ease-out；主色每屏 ≤2 处；颜色全走 token；计数 `tabular-nums`；空/错/加载/边界四态全覆盖。
- Don't：emoji 当功能图标；紫→粉渐变/发光边框/装饰毛玻璃；弹性缓动(overshoot bezier)、>400ms 动画；硬编码颜色；空洞占位文案；卡片彩色左边框；为「同频」新增独立大入口。

## 8. Responsive & Accessibility
- 响应式：主体锁定 375（原型）；<360 隐藏消息卡缩略图；浮层 `min(60vh, 487px)`；外壳随窗口自适应。
- 无障碍：正文对比度 12.6:1 达标；小号红字用 `--color-primary-text`(4.7:1)；`:focus-visible` 双环；赞按钮 `aria-pressed` + 动态 `aria-label`；浮层 `role="dialog"` 焦点锁定；消息流 `role="log"`；`prefers-reduced-motion` 全量降级。
- 5 态：Loading / Empty / Error / Populated / Edge 逐页覆盖（page-spec.md 各页「状态矩阵」）。

## 9. Agent Implementation Guide
- 接入：`import './design/design-tokens.css'` + `import tokens from './design/design-tokens.json'`。
- 图标：封装 `<Icon name strokeWidth={1.75} size={24}/>`，Lucide path，`fill="none" stroke="currentColor"`；heart 实心态 `fill="currentColor"`。无 emoji 兜底。
- 三态赞状态机：`state: idle|liked|gestured` + `gesture: hand|flower|null`；`idle→liked→gestured→idle`；动画用 CSS `animation` + `key` 重挂载触发 `like-pop`/`icon-morph-in`。
- emoji 边界：仅 `StickerGrid`/`ChatBubble` 的**内容**允许 emoji，且由数据注入，绝不占图标位。
- 已知坑：`env(safe-area-inset-*)` 在包壳原型里可能为 0，用 `--safe-bottom:34px` 兜底；移动端 `100vh` 键盘弹出抖动，用固定 812 内容高或 `dvh`。

---
### 变更记录
| 日期 | 变更 | 原因 | 影响范围 |
|---|---|---|---|
| 2026-09-22 | 初版：四层 Token + 4 页规格 + Lucide 图标锁定 | 「同频」原型设计启动 | 全部页面 |
