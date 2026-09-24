# 小红书「同频」轻互动原型 · 交付总览

> 2026-09-22 · MVP开发专家团（大湾区靓仔统筹）交付

## 做了什么

基于用户的《小红书轻互动设计方案_击掌送花递表情.md》+ 桌面 11 张小红书原版截图，构建**移动端可交互高保真原型**（375×812 手机外壳、自适应缩放、含动效）。除「同频」新设计外，其余严格还原小红书移动端。

## 交付物

`xhs-prototype/`（纯静态，浏览器直接打开 index.html 即可，file:// 可用）

| 文件 | 内容 |
|---|---|
| index.html | 手机外壳（灵动岛/状态栏）+ 4 视图 + 同频空间浮层 + Toast |
| css/style.css | 组件样式（全 var(--*) 引用设计令牌） |
| js/icons.js | Lucide 描边 SVG 图标集（stroke 1.75，零 emoji 图标） |
| js/like.js | 三态赞状态机（idle→liked→gestured→idle + 长按手势浮层） |
| js/messages.js | 消息卡片 3 变体 + 回礼 morph |
| js/sheet.js | 同频空间浮层（上滑/表情面板/递表情飞行/24h 倒计时） |
| js/group.js | 限时同好小组（气泡/发送/20 条上限） |
| js/app.js | 路由（含 #hash 深链接）+ 倒计时 + Toast |
| design/ | 设计师交付：design-tokens.json/css、page-spec.md、DESIGN.md |
| _shots/ | 4 视图无头浏览器验收截图 |

## 核心交互（新设计部分）

1. 笔记详情「赞」三态：空心心→红心（like-pop 150ms）→手掌/花朵（icon-morph），长按 500ms 呼出「击掌/送花/每次手动选」浮层，送出后 Toast「已送出击掌，等 TA 回礼」。
2. 消息卡「回礼」→ 200ms morph 为「同频成功」卡 → 进入同频空间。
3. 同频空间：半屏上滑浮层，共同兴趣 chip + 24h 倒计时走秒 + 6 列表情单选 → 递表情飞向对方头像 → 模拟回应 → 开启限时小组。
4. 限时小组：双人对话、表情直出、20 条/天上限、24h 自动关闭。

## 验收中发现并修复的 2 个 bug（总监验收时发现，前端自检漏掉）

1. **消息视图白屏**：`app.js showView` 的 ids 映射中 `messages` 与 `tongpin` 同指 `view-messages`，遍历时后一个 key 把 `is-active` 移除。修复：按目标元素 id 判定 active。
2. **表情面板常显**：`.emoji-palette` 的 `display:flex` 覆盖了 `hidden` 属性的 UA 样式，笑脸开关失效。修复：补 `.emoji-palette[hidden]{display:none}`。

## 质量门禁（全过）

- P0：emoji 功能图标 0（21 处命中全为 UGC 表情数据）、紫粉渐变 0、弹性 bezier 0、组件裸 hex 0、单文件 ≤300 行、无 AI 模板文案。
- 无头 Chrome 逐视图截图目检 4/4 通过；node --check 全过。
- reduced-motion 全量降级；a11y（aria-pressed/role=log/dialog/focus-ring）按规格落地。

## 遗留说明

- 回礼/同频成功徽标统一用 gift 图标（稳定可靠）；如需 heart-handshake 可在 icons.js 替换。
- 递表情后「对方回表情」为 1.2s 模拟，限时小组 24h 到期自动清空仅展示倒计时逻辑（原型不真等 24h）。
