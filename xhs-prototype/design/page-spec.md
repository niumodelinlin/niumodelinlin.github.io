# 「同频」轻互动原型 · 页面视觉规格 (page-spec.md)

> Project　xhs-light-interaction / 同频
> Designer　颜好看　|　Version 1.0.0　|　Date 2026-09-22
> 平台　mobile-web 375×812（包手机外壳，内容区 375 宽，外壳自适应）
> 设计寄存器　**Product**（忠实还原小红书原生视觉语言，新设计只在既有「赞」点上延伸）
> 三轴刻度　`DESIGN_VARIANCE = 2`（对称、可预测，与小红书原版一致）／`MOTION_INTENSITY = 6`（必须有动效，但全部为功能性动效）／`VISUAL_DENSITY = 5`（小红书式中等信息密度）
> Token 源　`design-tokens.json` / `design-tokens.css`（组件内一律 `var(--*)` 引用，禁止硬编码颜色）

---

## 0. 全局约定

### 0.1 图标系统（锁定，全项目唯一）
- **图标库：Lucide（描边 outline 集合）**，`viewBox="0 0 24 24"`，`fill="none"`，`stroke="currentColor"`。
- **锁定 stroke 宽度：`1.75`**，`stroke-linecap="round"`，`stroke-linejoin="round"`。全项目不得混入第二套图标或改变 stroke。
- 尺寸：`--icon-inline: 16px`（行内）／`--icon-btn: 20px`（按钮内）／`--icon-action: 24px`（底部操作栏、独立图标）。缩放时 stroke 等比缩放（`vector-effect` 保持视觉一致）。
- 颜色一律 `currentColor`，由父级 color 决定（主色 `--color-primary` / 图标色 `--color-fg-icon`）。

**本原型用到的 Lucide 图标清单（大白兔照单实现，勿自创）：**

| 语义 | Lucide 名 | 用途 | 尺寸 |
|---|---|---|---|
| 返回 | `arrow-left`（chevron-left） | 顶部返回 | 24 |
| 分享 | `share` / `send`（箭头） | 顶部分享 / 底部操作栏 | 24 |
| 更多 | `more-horizontal` | 评论排序 / 卡片更多 | 20 |
| 关闭 | `x` | 浮层/评论面板关闭 | 24 |
| 赞·未激活 | `heart` | 三态态①（描边） | 24 |
| 赞·已点赞 | `heart`（same, fill=currentColor） | 三态态②（红色实心） | 24 |
| 击掌 | `hand` | 三态态③（红色） | 24 |
| 送花 | `flower` | 三态态③（红色，二选一） | 24 |
| 收藏 | `star` | 底部操作栏 | 24 |
| 评论 | `message-circle` | 底部操作栏 | 24 |
| 回礼 | `hand-heart`（或 `gift`） | 消息卡「回礼」按钮 | 16 |
| 同频成功 | `heart-handshake` | 同频成功卡片徽标 | 16 |
| 倒计时 | `clock` / `timer` | 24h 倒计时 chip | 14 |
| 同好小组 | `users` | 限时小组标题 | 20 |
| 递表情/发送 | `send` | 浮层 CTA / 输入栏发送 | 20 |
| 表情面板入口 | `smile` | 评论输入栏工具条 | 20 |
| 图片 | `image` | 评论输入栏工具条 | 20 |
| @提及 | `at-sign` | 评论输入栏工具条 | 20 |
| 语音 | `mic` | 评论输入栏工具条 | 20 |
| 加号 | `plus` | 评论输入栏工具条 | 20 |
| 收起 | `chevron-down` | 浮层收起 | 24 |
| 话题 | `hash` | 兴趣标签 chip 前缀 | 14 |
| 相机/相册 | `camera` | 小组输入栏 | 24 |

> 全程 **零 emoji 出现在功能图标位**。唯一允许 emoji 的位置：`同频空间` 表情面板内的表情、`限时同好小组` 聊天中用户发送的表情（属 IM 用户内容，P0 例外）；以及笔记正文/评论中的用户 emoji 内容。

### 0.2 字体
- 全站 `font-family: var(--font-family-base)` = **PingFang SC** → 回退 `-apple-system, Helvetica Neue, Hiragino Sans GB, Microsoft YaHei`。
- 数字型（倒计时、计数）用 `var(--font-family-number)` + `font-variant-numeric: tabular-nums`（等宽数字，避免跳动）。
- 字重三级：Regular 400（正文）／Medium 500（昵称、按钮、小标题）／Semibold 600（标题、CTA）。
- 字距：≥20px 标题 `-0.02em`；正文 `0`；全大写/字母标签 `0.02em`。

### 0.3 通用尺寸骨架（375×812）
```
┌─ 状态栏 44px（原型内显式绘制，非功能焦点）
├─ 导航栏 44px           --navbar-h
├─ 内容区 flex
├─ 操作栏/输入栏 52px + 底部安全区 34px   --actionbar-h / --inputbar-h + --safe-bottom
└─ 底线 812px
```
- 页面横向安全边距：导航/列表/操作栏 `--gutter: 12px`；笔记正文 `--gutter-content: 16px`。
- 所有可点击区域 `≥ 44×44px`（`--hit-min`）；图标可视 24px，靠 padding 撑到命中区。

### 0.4 动效总表（全部功能性，无装饰动画）
| 场景 | 时长 | 缓动 | 说明 |
|---|---|---|---|
| 按下反馈（按钮/卡片） | 100ms | `--ease-out` | `scale(0.97)`，松手回 1 |
| **三态赞切换** | **150ms** | `--ease-out` | `like-pop` 关键帧 scale 1→1.14→1（40% 峰值），**非弹性** |
| 图标形态切换 | 150ms | `--ease-out` | 心→手/花：`icon-morph-out` + `icon-morph-in` 交叠，scale 0.72↔1.08，无旋转超 8° |
| 收藏/评论/分享点击 | 150ms | `--ease-out` | 图标 scale 微弹（收藏选中→黄色填充同源） |
| **浮层上滑入场** | **280ms** | `--ease-out` | `sheet-slide-up`，`translateY(100%)→0` |
| 浮层下滑收起 | 220ms | `--ease-in` | `sheet-slide-down` |
| 遮罩淡入/出 | 200ms | `--ease-out` | `mask-fade-in` / 反向 |
| 通知卡「回礼」成功后 morph | 200ms | `--ease-out` | 卡片文案 crossfade + 高度过渡 |
| 表情网格选中 | 150ms | `--ease-out` | scale 1→1.12→1 + 1.5px 主色描边 |
| 表情递出（飞向对方头像） | 200ms | `--ease-in-out` | 位移 + 缩小，落地头像 100ms 微弹 |
| Toast 提示 | 进 200ms／停留 1600ms／出 150ms | `--ease-out` | 底部居中，上浮 8px |
| 倒计时数字 | 每 1000ms 文本更新，**无位移动画** | — | 仅换字；剩余 <1h 时 chip 呼吸 `countdown-breathe` 2s 循环 |
| 列表/网格入场 | 每项 +40ms `--stagger` | `--ease-out` | 同时动画元素 ≤3 个 |
| `prefers-reduced-motion` | 全部 0ms | — | 仅保留 opacity 0↔1 |

> 禁止弹性/回跳缓动（overshoot bezier，P0 红线，全系统已封禁）；禁止 >400ms 动画；禁止同时 >3 元素动画。

---

## 页面 1 · 笔记详情页（底部操作栏 — 新设计核心）

- **路由**：`/note/:id`
- **改动范围**：仅底部固定操作栏的「赞」按钮升级为**三态切换**；作者栏/内容/收藏/评论/分享**与小红书原版完全一致**。

### 1.1 布局结构（自上而下）
| 区块 | 高度 | 关键尺寸 | 说明 |
|---|---|---|---|
| 状态栏 | 44px | — | 时间/信号/电量（原型装饰） |
| 作者栏 | 44px | `padding 0 12px`；返回 24；头像 28 圆；昵称 15/600；关注按钮 h28；分享 24 | 吸顶，白底，无分割线（原版无） |
| 图片区 | 内容自适应 | 宽 375，圆角 0（原版全宽） | 单图比例 4:3 |
| 正文区 | 自适应 | `padding 16px`；标题 17/600；正文 15/400 lh1.6；话题蓝 | 纵向间距 `--space-3` |
| 底部操作栏 | 52px + 34px safe | 见 1.3 | `position: fixed; bottom: 0`，白底，上边线 `--actionbar-border` |

**作者栏细节（还原原版）**：`arrow-left 24`（`--color-fg`）· 头像 28 圆 · 昵称 15/600 `--color-fg` · 关注按钮：`h 28px`、`padding 0 14px`、`radius --radius-pill`、`border 1px --color-primary`、文字 13/500 `--color-primary`（未关注）／已关注态 `bg --color-surface-2, color --color-fg-muted, border none` · 右侧 `share 24`。

**正文区**：标题 `--font-size-2xl / 600 / lh 1.25 / -0.02em`；正文 `--font-size-lg / 400 / lh 1.6 / --color-fg-body`；话题 `#XXXX` 用 `--color-topic`（附着于正文，点击可跳）；文末日期 `--font-size-sm / --color-fg-meta`。

### 1.2 底部操作栏 · 布局（375 宽）
```
┌────────────────────────────────────────────────────┐  52px
│  ……flex spacer……  [heart 1.2万] [star 3421] [comment 866] [share] │
└────────────────────────────────────────────────────┘
        右对齐，gap 由 item 内 padding 构成（视觉间距 ≈20px）
```
- 容器：`display:flex; justify-content:flex-end; align-items:center; gap:0; padding: 0 12px; background: var(--actionbar-bg); border-top: 1px solid var(--actionbar-border);`
- 每个 item：`display:flex; align-items:center; gap:4px; min-height:44px; padding: 9px 8px;`（命中区 ≥44 高）。
- 图标 24（`--icon-action`）+ 计数文字 `--font-size-md(13px)/400/--color-fg-muted`；**分享 item 仅图标，无计数**。
- 底部补 `padding-bottom: env(safe-area-inset-bottom, 34px)`。

### 1.3 赞按钮三态（核心新交互）
| 态 | 触发 | 图标 | 颜色 | 计数 |
|---|---|---|---|---|
| **① 未点赞** | 初始 / 取消后 | `heart` 描边 | `--like-idle-icon`（#1A1A1A） | 灰 `--color-fg-muted` |
| **② 已点赞** | 态① 点 1 次 | `heart` 实心（`fill=currentColor`） | **`--like-active-icon`（#FF2442）** | **红色 `--like-active-text`，+1** |
| **③ 已击掌/送花** | 态② 再点 1 次 | `hand` 或 `flower`（默认 `hand`） | **`--color-primary`（#FF2442）** | 保持 ①→② 的 ±1，不叠加 |

**交互与动效**
1. 态①→②：点击 → 图标 `like-pop` 150ms `--ease-out`（scale 1→1.14→1）+ 填充色 #1A1A1A→#FF2442 150ms 过渡；计数 +1 并变红。
2. 态②→③：点击 → `heart` 先 `icon-morph-out`（150ms，scale→0.72、rotate 8°、opacity→0），同时 `hand/flower` `icon-morph-in`（150ms，scale 0.72→1.08→1）；颜色保持红。计数不变。
   - **默认手势**：若用户未设置 → 首次切到态③ 时弹出「二选一浮层」（见 1.4）；已设置 → 直接切换为默认手势。
3. 态③→①：点击 → 反向 morph 回 `heart` 描边，颜色红→黑 150ms，计数 −1（回到未点赞）。
4. **长按态②（≥600ms）**：呼出「手势选择浮层」（击掌 / 送花 / 每次手动选），松手后若滑动则取消（上滑手势区，模拟原版长按菜单）。
5. 态③ 完成后，操作栏上方浮出轻提示 Toast：`已送出击掌，等 TA 回礼`（显示 1600ms，`toast-rise`）。文案随手势变化（击掌/送花）。
6. **无障碍**：`aria-pressed` 随态①= false / ②③= true；`aria-label` 动态为「点赞」「已点赞，再次点击送出击掌」「已击掌，点击取消互动」；计数变化写入 `aria-live="polite"`。

**态③ 的图标二选一**
- 击掌 = `hand`；送花 = `flower`。二者**同层级**，皆为 `--color-primary`，24px，`stroke 1.75`。
- 不做两个图标叠放；一次只显示当前手势。

### 1.4 手势二选一浮层（首次切换态③时）
- 底部 sheet，`radius-t 16px`，白底，高度自适应（≈220px + safe）。
- 内容：标题「以后默认用哪个手势？」16/600；两个选项行（各 h56，图标 24 红 + 文案 15/500）：`hand` 击掌 / `flower` 送花；底部 `ghost` 文字按钮「每次手动选」13 `--color-fg-muted`。
- 入场：`sheet-slide-up` 280ms；遮罩 `--color-overlay-mask` 淡入 200ms。

### 1.5 状态矩阵
| 状态 | 表现 |
|---|---|
| Default | 态① 空心心，黑描边 |
| Liked | 态② 红心 + 红计数 |
| Gestured | 态③ 红手/红花朵，另附 Toast 确认 |
| Loading | 点击后至服务端确认前：图标先本地乐观切换 + 图标位置 2px 内轻微 `opacity .6` 一帧（不做 spinner，保持轻） |
| Error | 乐观切换回滚到前态，Toast「网络开小差，再试一次」+ 图标抖动一帧（150ms，非弹性） |
| Edge | 计数 ≥ 10万 → 显示 `10万+`；长按菜单在滚动时自动取消 |

### 1.6 无障碍 / 触摸
- 每个操作项命中区 ≥44×44；图标与计数整体可点。
- `:focus-visible` → `--focus-ring`（2px 白 + 4px 主色半透明双环）。
- 操作栏与正文之间不遮挡最后一行（正文 `padding-bottom: calc(52px + 34px + 16px)`）。

---

## 页面 2 · 消息通知卡片（消息 Tab）

- **路由**：`/messages`
- **改动范围**：复用小红书「XX 赞了你的图文」卡片样式，**右侧新增「回礼」按钮**；点赞+击掌/送花**合并为一条**。

### 2.1 页面骨架
- 顶部导航 44px：左 `arrow-left 24`（或「消息」标题 17/600 居中）+ 右侧 `search`（可选）。
- 列表区：`--color-bg` 白底；卡片行高 `≈76px`，行间 1px `--color-divider`（左缩进 68px 起）。
- 底部 TabBar 49px + safe：5 项（首页 / 视频 / 发布 / 消息 / 我），图标 24 + 标签 10，激活态 `--color-fg`，未激活 `--color-fg-meta`；发布按钮为红色圆角方（`--color-primary`）。

### 2.2 卡片布局（三种变体）
通用行结构：
```
┌───────────────────────────────────────────────────────┐
│ [头像44] 线1: 昵称 + 动作文案                  [右槽]  │
│          线2: 时间                               │     │
└───────────────────────────────────────────────────────┘
  padding 12px 12px；头像 44 圆；头像与文本 gap 12；文本块 flex:1
```

**变体 A · 点赞（含合并击掌/送花）— 右槽 = 回礼按钮**
- 线1：`**李知遥**` 14/600 `--color-fg` + 动作文案 14/400 `--color-fg-body`：
  - 仅点赞 → `赞了你的图文`
  - 点赞+击掌 → `赞了你的图文，并给你击了个掌`
  - 点赞+送花 → `赞了你的图文，并给你送了朵花`
- 线2：`2 分钟前` 12/400 `--color-fg-meta` + 可选 `· 1.2万赞`。
- 右槽 **回礼按钮**：`height 32px; padding 0 14px; radius --radius-pill; background var(--gift-btn-bg)(#FFF1F3); color var(--gift-btn-text)(#E11D37); font 13/500; display:inline-flex; gap:4px; align-items:center;` 前置 `hand-heart` 16 图标（`currentColor`）。
- 右槽也可同时放笔记缩略图 `56×56 radius 6`（原版有缩略图）→ 布局：`[头像][文本 flex][缩略图 56][回礼按钮]`，缩略图与按钮 gap 8；窄屏（<360）时隐藏缩略图优先保留按钮。
- 按下：`scale(0.97)` 100ms + 背景转 `--gift-btn-bg-press`。

**变体 B · 同频成功（双方各收一条）— 右槽 = 进入按钮**
- 线1：`你和 **李知遥** 同频成功` 14，昵称 600；前置 `heart-handshake` 16 徽标（`--color-primary`）。
- 线2：`你们都赞过《上海实习周记》` 12 `--color-fg-meta`。
- 右槽：`进入同频空间` 文本按钮 → 样式同变体 A 回礼按钮（soft 底 + 主色文字），点击 → 上滑「同频空间」浮层（页面 3）。

**变体 C · 递表情 — 整行可点**
- 线1：`**李知遥** 给你递了一个表情` 14。
- 线2：`点开看看是什么` 12 `--color-fg-meta`。
- 右槽：表情内容缩略 `40×40`（用户 emoji，属 UGC）。整行点击 → 打开「同频空间」浮层（页面 3）。

### 2.3 「回礼」交互与动效
1. 点击回礼 → 100ms `scale(0.97)` 反馈。
2. 成功 → 该行 200ms `--ease-out` **morph 为变体 B**（文案 crossfade + 行高保持 76px 过渡），并 Toast「同频成功，去同频空间递个表情吧」。
3. 失败 → 按钮回到默认，Toast「回礼没送到，再试一次」。
4. `aria-label="回礼，给李知遥回送一个击掌"`。

### 2.4 状态矩阵
| 状态 | 表现 |
|---|---|
| Populated | 变体 A/B/C 正常列表 |
| Empty | 居中 `message-circle` 40 描边 `--color-fg-meta` + 「还没有新消息，去逛逛吧」14 `--color-fg-meta` + 次要按钮「去首页」（ghost 主色文字） |
| Loading | 3 条骨架行：头像圆 + 两条灰条（`--color-surface-2`），微光 1.6s 扫过（`prefers-reduced-motion` 下滑为静态灰条） |
| Error | 行内「消息加载失败，点击重试」13 `--color-danger`，点击重拉 |
| Edge | 超长昵称 12 字截断 + `…`；文案超一行时行高自适应（不固定 76）；同一人短时间多次互动 → 折叠为 `李知遥 等 3 人赞了你的图文` |

---

## 页面 3 · 同频空间浮层（底部上滑半屏）

- **类型**：半屏 bottom-sheet（**非新页面**），从页面 2 卡片或页面 1 触发。
- **尺寸**：高度 `min(60vh, 487px)` + `padding-bottom: env(safe-area-inset-bottom, 34px)`；圆角仅顶部 `--radius-lg`（12px）；白底；`--shadow-sheet`。
- **入场**：遮罩 `--color-overlay-mask` `mask-fade-in` 200ms；浮层 `sheet-slide-up` **280ms `--ease-out`**（`translateY 100%→0`）。收起反向 220ms `--ease-in`。
- **手势**：`chevron-down` 或下滑拖动 >30% 高度收起；点击遮罩收起。

### 3.1 布局（自上而下）
| 区块 | 高度/尺寸 | 内容与 token |
|---|---|---|
| 拖拽把手 | 36×4，`radius 2`，`--sheet-handle`，上间距 8 | 居中 |
| 头部 | h48，`padding 0 16px` | 标题「同频空间」16/600 `--color-fg`；右 `x 24` `--color-fg-muted` |
| 共同兴趣标签 | h28，`radius --radius-pill`，`bg --color-chip-bg`、`padding 0 12` | 前置 `hash 14 --color-primary`；文字「都赞过《上海实习周记》」12/400 `--color-fg-muted`；单行省略 |
| 对方身份行 | h56，`padding 0 16px` | 头像 48 圆 + gap 12 + 昵称 15/600 `--color-fg` + 副文案「刚才也赞过这条笔记」12 `--color-fg-meta`；右 `不想聊` ghost 文字 12 `--color-fg-meta` |
| **24h 倒计时** | h28 chip，同行右对齐或独立行 | `clock 14` + `剩余 23:41:07`，`bg --countdown-chip-bg`、`color --countdown-chip-text`、12/500、`tabular-nums` |
| 分割线 | 1px `--color-divider`，全宽 | — |
| 表情面板 | 自适应，`padding 12px 16px` | 区标签「选一个表情递过去」12 `--color-fg-meta`；网格 **6 列**，cell `44×44`，gap 8 |
| 底部 CTA | h44，`margin 12px 16px`，`radius --radius-pill` | 「递表情」15/600，`bg --send-btn-bg`、文字 `--send-btn-text`；禁用态 `bg --send-btn-bg-disabled` |

### 3.2 表情面板（emoji 属 UGC，P0 例外允许）
- 网格 6×N，cell 44×44：`bg --sticker-cell-bg`，`radius --radius-md(8)`；内容为 emoji 内容字符（字号 26，居中）。
- **选中态**：`bg --sticker-cell-bg-sel(#FFF1F3)` + `outline 1.5px --sticker-cell-ring` + `scale 1.06`，150ms `--ease-out`（`like-pop-soft` 关键帧）。
- 仅单选；未选时「递表情」按钮禁用；选中后按钮启用。
- 网格入场逐项 `--stagger 40ms`，同时动画 ≤3 项（超出直接显示，不排队）。
- **无障碍**：cell 为 `button`，`aria-label="选择表情 <n>"`、`aria-pressed`；网格 `role="radiogroup"`。

### 3.3 递表情提交动效
1. 点击「递表情」→ 按钮 100ms `scale(0.97)`。
2. **表情从选中 cell 飞向对方头像**（200ms `--ease-in-out`，位移 + `scale 1→0.4` + `opacity→0.9`），落地时对方头像 100ms 微弹。
3. 浮层内切到「已递出」态：中央显示「已递出，等 TA 回应」+ 对方头像呼吸暗示；CTA 变为禁用「等待回应」。Toast「表情已送达」。
4. 对方回表情 → 浮层内出现「同频成功，限时小组已开启」卡（`heart-handshake` + `开启限时小组` 主按钮）→ 点击进入**页面 4**。

### 3.4 状态矩阵
| 状态 | 表现 |
|---|---|
| Default（未选表情） | 面板可点，CTA 禁用（浅粉底） |
| Selected | 选中 cell 高亮，CTA 启用（红底白字） |
| Sent（已递出） | 「已递出，等 TA 回应」，CTA 禁用 |
| Matched（对方已回） | 顶替为「小组已开启」卡 + 进入按钮 |
| Error | Toast「表情没送出去，再试一次」+ CTA 恢复启用 |
| Edge | 长兴趣标签省略号；昵称超 8 字截断；对方已退出 → 「TA 已离开同频空间」+ CTA 禁用 |

### 3.5 无障碍
- 浮层为 `role="dialog" aria-modal="true"`，打开时焦点移入标题；`Esc` / 点击遮罩 / 下滑关闭。
- 关闭后焦点归还触发元素。
- 遮罩下内容 `aria-hidden="true"`。

---

## 页面 4 · 限时同好小组（两人限时对话页）

- **类型**：全屏页（浮层「开启限时小组」后进入）。
- **路由**：`/group/:id`
- **核心约束**：仅 A、B 两人；每人每天最多 20 条；**24h 后自动关闭并清空记录**。

### 4.1 布局（自上而下）
| 区块 | 高度 | 内容与 token |
|---|---|---|
| 状态栏 | 44px | 装饰 |
| 顶部导航 | 44px，`padding 0 12px` | `arrow-left 24` + 标题「限时同好小组」16/600 `--color-fg` + 右 `users 20`（成员）；白底，无分割线 |
| 倒计时条 | h32，`padding 0 16px` | 居中 chip：`clock 14` + `剩余 23:41:07 后自动关闭`，`bg --countdown-chip-bg`/`color --countdown-chip-text`，12/500，`tabular-nums`；剩余 <1h → `countdown-breathe` 2s 循环 |
| 消息流 | flex:1，`padding 12px 12px`，`overflow-y auto` | 见 4.3 |
| 输入栏 | 52px + 34px safe | 见 4.4 |

### 4.2 首屏系统提示（进入即显示，居中）
- `heart-handshake 16 --color-primary` + 文案「你们因《上海实习周记》同频」12 `--color-fg-meta`。
- 次行「消息将在 24 小时后自动清空，不回访」11 `--color-fg-placeholder`。
- 底部小字「每人每天最多 20 条 · 已发送 0/20」11 `--color-fg-placeholder`（随计数更新）。

### 4.3 气泡样式
| 类型 | 对齐 | 气泡 | 尺寸 |
|---|---|---|---|
| 对方文字 | 左 | `bg --color-bubble-other(#F0F0F0)`，文字 15/400 `--color-fg-body`，`radius 16`（左下角 4） | `max-width 70%`，`padding 10px 14px`，头像 32 圆（左侧，顶部对齐） |
| 自己文字 | 右 | `bg --color-bubble-self(#FF2442)`，文字 15/400 `--color-bubble-self-ink`，`radius 16`（右下角 4） | 同上，右侧 |
| 表情消息（仅表情） | 同侧 | **无气泡**，emoji 内容 40px 直出 | `padding 0` |
| 时间戳 | 居中 | 「今天 14:20」11 `--color-fg-placeholder` | 每 5 分钟或跨段显示一次 |
| 系统消息 | 居中 | 「TA 退出了小组」11 `--color-fg-meta`，`bg --color-surface-2` 胶囊 | `padding 4px 10px` |

- 气泡行间距 `--space-3(12px)`；同人多条连续时头像只显示首条、行距收到 `--space-1(4px)`。

### 4.4 底部输入栏
- 容器：`height 52px`，`padding 0 12px`，`bg --actionbar-bg`，`border-top 1px --actionbar-border` + safe。
- 左：`smile 24` `--color-fg-icon-muted`（打开表情面板，emoji 为 UGC）。
- 中：输入框 `flex:1; height 36px; padding 0 14px; radius --radius-pill; bg --input-bg; font 14; color --input-text;` placeholder「说点什么…」`--color-fg-placeholder`。聚焦时 `border 1px --color-primary` + 外环 `--color-focus-ring`。
- 右 `camera 24` `--color-fg-icon-muted`（相册）+ **发送按钮**：
  - 空输入 → 禁用：`bg --send-btn-bg-disabled`，文字 `--send-btn-text`，`opacity 1`（不用透明度伪装禁用，用色值）。
  - 有输入 → 启用：`bg --send-btn-bg`；`h 32px; padding 0 16px; radius --radius-pill; font 15/600`。
- 达到 20 条上限：输入框禁用（`bg --color-surface-3`，文字 `--color-fg-placeholder`），placeholder 变「今天的 20 条已用完，明天见」；发送按钮隐藏。

### 4.5 动效
- 发送消息：气泡 `icon-morph-in` 变体（scale 0.86→1 + opacity 0→1，150ms `--ease-out`），随后列表滚动到底（`scroll-behavior: smooth`，`reduced-motion` 下瞬时）。
- 收到消息：同上 + 未读期间导航无红点（隐私：不进通讯录）。
- 表情面板开合：从输入栏高度过渡 200ms `--ease-out`。
- 24h 到期：顶部倒计时条 200ms 淡出 → 居中系统消息「这段同频已结束，记录已清空」→ 2s 后自动返回消息 Tab（`dialog` 式确认可不做，规格为自动返回）。

### 4.6 状态矩阵
| 状态 | 表现 |
|---|---|
| Empty | 只有 4.2 系统提示，无气泡 |
| Populated | 正常双人对话 |
| Loading | 历史消息骨架：左右两侧灰气泡占位，微光 1.6s |
| Error | 输入栏上方行内条「发送失败，点击重发」13 `--color-danger`，点击重发该条 |
| Edge | 超长消息自动换行，最多 1000 字；连续 20 条上限；对方退出 → 系统消息 + 输入栏禁用 |
| Expired | 倒计时结束 → 记录清空 → 自动返回 |

### 4.7 无障碍
- 消息流 `role="log" aria-live="polite"`。
- 每条消息 `aria-label` 含发送者与时间。
- 输入栏 label 关联；发送按钮 `aria-disabled` 同步禁用态。
- 触摸目标 ≥44（发送按钮 h32 外扩命中区至 44）。

---

## 5. 设计守则（Do's & Don'ts）

### Do（应该做）
1. 未改动部分（作者栏、正文、评论区、TabBar、分享面板）**严格对齐小红书原版**：白底、12px 边距、PingFang SC、`#FF2442` 红。
2. 三态赞的「微弹」用 **scale 关键帧 + ease-out** 表达，绝不用弹性 bezier。
3. 主色每屏可见使用 ≤2 处（如：态②③红心 + 一个主 CTA），其余用中性色承载。
4. 所有颜色走 `var(--*)`；计数/倒计时用 `tabular-nums` 防跳动。
5. 动效必须传达含义（态切换=状态变化、浮层上滑=层级关系），无纯装饰动画。
6. 空/错/加载/边界四态全覆盖。

### Don't（不应该做）
1. 用 emoji 当功能图标（赞/击掌/花/回礼/倒计时一律 Lucide 描边 SVG）。
2. 紫→粉渐变、发光边框、装饰性毛玻璃。
3. 弹性/回跳缓动（overshoot bezier）、>400ms 动画。
4. 硬编码颜色（`#FF2442` 只能出现在 token 文件里，业务组件写 `var(--color-primary)`）。
5. 空洞占位文案（Welcome to / Lorem ipsum）；一律真实小红书风格中文（「赞了你的图文并给你送了朵花」「你和 TA 同频成功」）。
6. 卡片彩色左边框、单侧/渐变描边强调。
7. 为「同频」新增独立大入口；它只寄生在既有「赞」与消息卡上，不打断主链路。
8. 小号红字直接用 `#FF2442`（对比度 3.74:1 不达 AA）；<18px 红字改用 `--color-primary-text`（#E11D37，4.7:1）。

---

## 6. 无障碍 / 响应式 / 5 态

- **对比度**：正文 `--color-fg-body`(#333) on #fff ≈ 12.6:1 达标；元信息 #999 on #fff ≈ 2.85:1（注意：仅用于非关键辅助信息，字号 ≥12px，不再降级）；红底白字 CTA 3.74:1 → 用于 ≥16px/600 的按钮文字（大字标准）达标；小号红字用 `--color-primary-text`。
- **键盘**：全部交互元素可 Tab 到达；`:focus-visible` 双环（白 2px + 主色半透明 4px）；`Esc` 关闭浮层；浮层打开时焦点锁定、关闭归还。
- **屏幕阅读器**：赞按钮 `aria-pressed` + 动态 `aria-label`；计数 `aria-live="polite"`；浮层 `role="dialog"`；消息流 `role="log"`。
- **触摸**：全部命中区 ≥44×44；按钮间距 ≥8px。
- **响应式**：主体固定 375 宽（原型）；<360px 宽时缩略图优先让位（页面 2）。浮层高度 `min(60vh, 487px)` 自适应。外壳容器自适应窗口（居中 + `--shadow-lg`）。
- **5 态覆盖**：每页均含 Loading / Empty / Error / Populated / Edge（见各页「状态矩阵」）。

---

## 7. 给前端 Agent 的实现提示

1. **Token 接入**：入口 `import './design/design-tokens.css'`；数据侧 `import tokens from './design/design-tokens.json'`。组件样式表禁止出现裸 hex（除 token 文件）。
2. **图标组件**：封装 `<Icon name strokeWidth={1.75} size={24}/>`，内部为 Lucide path，`fill="none" stroke="currentColor"`。三态赞的 `heart` 实心态用 `fill="currentColor"`。**不要**为图标准备 emoji 兜底。
3. **三态赞按钮状态机**：`state: 'idle' | 'liked' | 'gestured'` + `gesture: 'hand' | 'flower' | null`。点击流转 `idle→liked→gestured→idle`；长按 `liked` 打开手势选择。切换动画用 CSS `animation` + `key` 重挂载触发（`like-pop` / `icon-morph-in`）。
4. **浮层**：单一 `<Sheet>` 组件，`translateY` 过渡；遮罩与浮层分别用 `--motion-base/slow`；`prefers-reduced-motion` 自动降级（token 已内置 media query）。
5. **emoji 边界**：仅 `StickerGrid` 与 `ChatBubble` 的**内容**允许 emoji 字符，且从数据注入（不写死在图标位）。
6. **倒计时**：`setInterval 1000` 更新文本，用 `tabular-nums`；不要在每秒做布局动画。
7. **已知坑**：`env(safe-area-inset-*)` 在包壳原型里可能为 0 → 用 token `--safe-bottom: 34px` 兜底；`100vh` 在移动端键盘弹出时会抖动 → 用固定 812 内容高或 `dvh`。
