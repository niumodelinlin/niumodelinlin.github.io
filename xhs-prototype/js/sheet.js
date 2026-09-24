/* ==========================================================================
   同频空间 · 底部浮层 (sheet.js)
   上滑入场/遮罩淡入；表情面板 6 列单选；递表情飞行动效；已递出态；
   模拟对方回表情 → 开启限时小组。
   [P0] 表情仅作 UGC 数据注入；动效时长 var(--motion-*)；无 emoji 图标位。
   ========================================================================== */
(function (global) {
  'use strict';

  // UGC 内容数据（表情，非图标）
  var STICKERS = ['😊', '🌸', '👏', '🥰', '✨', '🙌', '💐', '🤝', '😎', '🫶', '🌟', '💛'];

  var el = {}, selected = null, matchedTimer = null;

  function injectIcons() {
    var close = document.getElementById('sheet-close');
    if (close) close.innerHTML = icon('x', 24);
    var chip = document.querySelector('.chip-ico');
    if (chip) chip.innerHTML = icon('hash', 14);
    var cds = document.querySelectorAll('.sheet-countdown .cd-ico');
    cds.forEach(function (c) { c.innerHTML = icon('clock', 14); });
    var badge = document.querySelector('.sheet-matched .badge-ico');
    if (badge) badge.innerHTML = icon('gift', 16);
  }

  function buildStickers() {
    var grid = document.getElementById('sticker-grid');
    grid.innerHTML = '';
    STICKERS.forEach(function (emoji, i) {
      var cell = document.createElement('button');
      cell.className = 'sticker-cell';
      cell.type = 'button';
      cell.setAttribute('role', 'radio');
      cell.setAttribute('aria-label', '选择表情 ' + (i + 1));
      cell.setAttribute('aria-checked', 'false');
      cell.textContent = emoji;            // UGC 内容
      cell.addEventListener('click', function () { select(cell); });
      grid.appendChild(cell);
    });
  }

  function select(cell) {
    if (selected) { selected.classList.remove('is-selected'); selected.setAttribute('aria-checked', 'false'); }
    selected = cell;
    cell.classList.add('is-selected');
    cell.setAttribute('aria-checked', 'true');
    document.getElementById('sheet-send').disabled = false;
  }

  function flyToPartner(emoji, fromRect) {
    var screen = document.getElementById('screen');
    var avatar = document.querySelector('.partner-row .avatar');
    var to = avatar.getBoundingClientRect();
    var fly = document.createElement('span');
    fly.className = 'sticker-fly';
    fly.textContent = emoji;
    var sr = screen.getBoundingClientRect();
    var x0 = fromRect.left + fromRect.width / 2 - sr.left;
    var y0 = fromRect.top + fromRect.height / 2 - sr.top;
    fly.style.left = x0 + 'px';
    fly.style.top = y0 + 'px';
    fly.style.transform = 'translate(-50%, -50%)';
    screen.appendChild(fly);
    var dx = (to.left + to.width / 2 - sr.left) - x0;
    var dy = (to.top + to.height / 2 - sr.top) - y0;
    var dur = global.reduceMotion ? 0 : 200;
    var anim = fly.animate(
      [{ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
       { transform: 'translate(' + (dx - 13) + 'px,' + (dy - 13) + 'px) scale(0.4)', opacity: 0.9 }],
      { duration: dur, easing: 'cubic-bezier(0.65,0,0.35,1)', fill: 'forwards' }
    );
    anim.onfinish = function () {
      fly.remove();
      avatar.classList.remove('avatar-bounce');
      void avatar.offsetWidth;
      avatar.classList.add('avatar-bounce');
    };
  }

  function send() {
    if (document.getElementById('sheet-send').disabled || !selected) return;
    var cell = selected;
    flyToPartner(cell.textContent, cell.getBoundingClientRect());
    document.getElementById('sheet-send').disabled = true;
    global.Toast.show('表情已送达');
    // 已递出态
    document.getElementById('sticker-block').hidden = true;
    document.getElementById('sheet-send').hidden = true;
    document.getElementById('sheet-sent').hidden = false;
    // 模拟对方 1.2s 后回表情
    clearTimeout(matchedTimer);
    matchedTimer = setTimeout(function () {
      document.getElementById('sheet-sent').hidden = true;
      document.getElementById('sheet-matched').hidden = false;
    }, 1200);
  }

  function reset() {
    selected = null;
    document.getElementById('sticker-block').hidden = false;
    document.getElementById('sheet-send').hidden = false;
    document.getElementById('sheet-send').disabled = true;
    document.getElementById('sheet-sent').hidden = true;
    document.getElementById('sheet-matched').hidden = true;
  }

  function open() {
    reset();
    var sheet = document.getElementById('sheet');
    sheet.classList.add('is-open');
    sheet.setAttribute('aria-hidden', 'false');
    var mask = document.getElementById('sheet-mask');
    var panel = document.getElementById('sheet-panel');
    mask.classList.add('fade-in');
    panel.classList.remove('slide-down');
    panel.classList.add('slide-up');
    var title = document.querySelector('.sheet-title');
    if (title) title.setAttribute('tabindex', '-1'), title.focus();
  }

  function close() {
    var sheet = document.getElementById('sheet');
    var mask = document.getElementById('sheet-mask');
    var panel = document.getElementById('sheet-panel');
    panel.classList.remove('slide-up');
    panel.classList.add('slide-down');
    mask.classList.remove('fade-in');
    setTimeout(function () {
      sheet.classList.remove('is-open');
      sheet.setAttribute('aria-hidden', 'true');
    }, 220);
  }

  function init() {
    injectIcons();
    buildStickers();
    document.getElementById('sheet-send').addEventListener('click', send);
    document.getElementById('sheet-mask').addEventListener('click', close);
    document.getElementById('sheet-close').addEventListener('click', close);
    document.getElementById('sheet-leave').addEventListener('click', function () {
      global.Toast.show('已退出同频空间'); close();
    });
    document.getElementById('sheet-enter-group').addEventListener('click', function () {
      close();
      if (global.App) global.App.openGroup();
    });
    // 下滑手势收起（拖动 >30% 高度）
    var panel = document.getElementById('sheet-panel');
    var startY = null;
    panel.addEventListener('pointerdown', function (e) { startY = e.clientY; });
    panel.addEventListener('pointerup', function (e) {
      if (startY !== null && e.clientY - startY > panel.offsetHeight * 0.3) close();
      startY = null;
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.getElementById('sheet').classList.contains('is-open')) close();
    });
  }

  global.SheetModule = { init: init, open: open, close: close };
})(window);
