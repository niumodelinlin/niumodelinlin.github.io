/* ==========================================================================
   同频原型 · 图标系统 (icons.js)
   Lucide 描边集合 · viewBox 0 0 24 24 · fill none · stroke currentColor
   锁定 stroke-width 1.75 · linecap/linejoin round
   [P0] 零 emoji 出现在功能图标位；emoji 仅作 UGC 内容数据注入。
   ========================================================================== */
(function (global) {
  'use strict';

  // 每个图标 = 一个或多个 path 的 d 字符串数组（flower 中心圆已转 path）
  var ICONS = {
    heart: ['M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'],
    star: ['M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'],
    'message-circle': ['M7.9 20A9 9 0 1 0 4 16.1L2 22Z'],
    share: ['M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8', 'M16 6l-4-4-4 4', 'M12 2v13'],
    'arrow-left': ['M19 12H5', 'M12 19l-7-7 7-7'],
    x: ['M18 6 6 18', 'M6 6l12 12'],
    clock: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z', 'M12 6v6l4 2'],
    users: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z', 'M22 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75'],
    send: ['M14.536 21.866a1 1 0 0 0 1.395.02l8.13-7.5a1 1 0 0 0 .022-1.46l-8.13-7.5a1 1 0 0 0-1.417 1.404L19.05 12H4a1 1 0 0 0 0 2h15.05l-5.485 5.054a1 1 0 0 0-.028 1.812Z'],
    smile: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z', 'M8 14s1.5 2 4 2 4-2 4-2', 'M9 9h.01', 'M15 9h.01'],
    image: ['M3 3h18v18H3z', 'M3 16l5-5 4 4 3-3 6 6', 'M8.5 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z'],
    'at-sign': ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z', 'M16 8a4 4 0 0 0-8 0v6a4 4 0 0 0 8 0V8Z', 'M16 16v1a3 3 0 0 0 3 3h1'],
    mic: ['M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z', 'M19 10v2a7 7 0 0 1-14 0v-2', 'M12 19v4', 'M8 23h8'],
    plus: ['M12 5v14', 'M5 12h14'],
    'chevron-down': ['M6 9l6 6 6-6'],
    hash: ['M4 9h16', 'M4 15h16', 'M10 3 8 21', 'M16 3l-2 18'],
    camera: ['M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z', 'M12 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'],
    'more-horizontal': ['M5 12h.01', 'M12 12h.01', 'M19 12h.01'],
    flower: [
      'M15 12a3 3 0 1 1 -6 0a3 3 0 1 1 6 0',
      'M12 16.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 1 1 4.5 4.5 4.5 4.5 0 1 1-4.5 4.5',
      'M12 7.5V9', 'M7.5 12H9', 'M16.5 12H15', 'M12 16.5V15',
      'm8 8 1.88 1.88', 'M14.12 9.88 16 8', 'm8 16 1.88-1.88', 'M14.12 14.12 16 16'
    ],
    hand: [
      'M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2',
      'M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2',
      'M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8',
      'M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15'
    ],
    gift: ['M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7', 'M3 9h18v4H3z', 'M12 9v12', 'M8 9V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4'],
    // TabBar 所需（标准 Lucide 路径，非自创语义）
    home: ['M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V12h6v10'],
    play: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M10 8l6 4-6 4V8z'],
    user: ['M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2', 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z']
  };

  /**
   * 渲染一个内联 SVG 图标。
   * @param {string} name  图标名（见 ICONS）
   * @param {number} size  像素尺寸（默认 24）
   * @param {object} opts  { filled, strokeWidth, className }
   * @returns {string} SVG 字符串
   */
  function icon(name, size, opts) {
    opts = opts || {};
    var paths = ICONS[name] || [];
    var sz = size || 24;
    var sw = opts.strokeWidth || 1.75;
    var fill = opts.filled ? 'currentColor' : 'none';
    var cls = opts.className ? ' class="' + opts.className + '"' : '';
    var inner = '';
    for (var i = 0; i < paths.length; i++) {
      inner += '<path d="' + paths[i] + '"/>';
    }
    return '<svg' + cls + ' xmlns="http://www.w3.org/2000/svg" width="' + sz +
      '" height="' + sz + '" viewBox="0 0 24 24" fill="' + fill +
      '" stroke="currentColor" stroke-width="' + sw +
      '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      inner + '</svg>';
  }

  global.ICONS = ICONS;
  global.icon = icon;
})(window);
