/* ==========================================================================
   笔记详情 · 三态赞按钮状态机 (like.js)
   态：idle → liked → gestured → idle
   手势：hand(击掌) / flower(送花)；长按 liked 打开手势选择浮层。
   [P0] 禁用弹性 bezier；动效时长一律 var(--motion-*)；>400ms 禁用。
   ========================================================================== */
(function (global) {
  'use strict';

  var LIKE = {
    state: 'idle',        // idle | liked | gestured
    gesture: null,        // 'hand' | 'flower'
    alwaysAsk: false,     // 每次手动选
    base: 12000,
    btn: null, ico: null, count: null
  };

  function fmt(n) {
    if (n >= 10000) return (n / 10000).toFixed(1).replace(/\.0$/, '') + '万';
    return String(n);
  }

  function render(anim) {
    var name, filled = false;
    if (LIKE.state === 'idle') { name = 'heart'; }
    else if (LIKE.state === 'liked') { name = 'heart'; filled = true; }
    else { name = (LIKE.gesture === 'flower') ? 'flower' : 'hand'; }

    LIKE.ico.innerHTML = icon(name, 24, { filled: filled });
    LIKE.btn.classList.toggle('is-liked', LIKE.state !== 'idle');
    LIKE.btn.classList.toggle('is-gestured', LIKE.state === 'gestured');
    LIKE.count.textContent = fmt(LIKE.base + (LIKE.state === 'idle' ? 0 : 1));

    LIKE.btn.setAttribute('aria-pressed', LIKE.state !== 'idle' ? 'true' : 'false');
    var label = (LIKE.state === 'idle') ? '点赞'
      : (LIKE.state === 'liked') ? '已点赞，再次点击送出击掌'
      : '已' + (LIKE.gesture === 'flower' ? '送花' : '击掌') + '，点击取消互动';
    LIKE.btn.setAttribute('aria-label', label);

    if (anim) {
      LIKE.ico.classList.remove('like-pop', 'icon-morph-in');
      void LIKE.ico.offsetWidth;                 // 强制 reflow 重启动画
      LIKE.ico.classList.add(anim);
    }
  }

  function gestureToast() {
    return (LIKE.gesture === 'flower') ? '已送出一朵花，等 TA 回礼' : '已送出击掌，等 TA 回礼';
  }

  function toggle() {
    if (LIKE.state === 'idle') {
      LIKE.state = 'liked'; render('like-pop');
    } else if (LIKE.state === 'liked') {
      if (LIKE.gesture && !LIKE.alwaysAsk) {
        LIKE.state = 'gestured'; render('icon-morph-in'); global.Toast.show(gestureToast());
      } else {
        openGestureSheet();
      }
    } else {
      LIKE.state = 'idle'; render('like-pop');
    }
  }

  /* ---------- 手势选择浮层（首次切到态③） ---------- */
  function openGestureSheet() {
    var screen = document.getElementById('screen');
    var sheet = document.createElement('div');
    sheet.className = 'sheet gesture-sheet is-open';
    sheet.innerHTML =
      '<div class="sheet-mask" data-close></div>' +
      '<div class="sheet-panel slide-up" role="dialog" aria-modal="true" aria-label="选择手势">' +
        '<div class="sheet-handle"></div>' +
        '<div class="sheet-head"><span class="sheet-title">以后默认用哪个手势？</span></div>' +
        '<button class="gesture-opt" data-g="hand"><span class="g-opt-ico">' + icon('hand', 24) + '</span>击掌</button>' +
        '<button class="gesture-opt" data-g="flower"><span class="g-opt-ico">' + icon('flower', 24) + '</span>送花</button>' +
        '<button class="ghost-btn gesture-ask" data-ask="1">每次手动选</button>' +
      '</div>';
    screen.appendChild(sheet);
    requestAnimationFrame(function () { sheet.querySelector('.sheet-mask').classList.add('fade-in'); });

    function close() {
      sheet.querySelector('.sheet-panel').classList.add('slide-down');
      sheet.querySelector('.sheet-mask').style.opacity = '0';
      setTimeout(function () { sheet.remove(); }, 240);
    }
    sheet.querySelector('[data-close]').addEventListener('click', close);
    sheet.querySelectorAll('.gesture-opt').forEach(function (b) {
      b.addEventListener('click', function () {
        LIKE.gesture = b.getAttribute('data-g');
        LIKE.alwaysAsk = false;
        close();
        setTimeout(function () {
          LIKE.state = 'gestured'; render('icon-morph-in'); global.Toast.show(gestureToast());
        }, 200);
      });
    });
    sheet.querySelector('.gesture-ask').addEventListener('click', function () {
      LIKE.alwaysAsk = true; LIKE.gesture = 'hand';
      close();
      setTimeout(function () {
        LIKE.state = 'gestured'; render('icon-morph-in'); global.Toast.show(gestureToast());
      }, 200);
    });
  }

  function init() {
    LIKE.btn = document.getElementById('like-btn');
    LIKE.ico = document.getElementById('like-ico');
    LIKE.count = document.getElementById('like-count');
    if (!LIKE.btn) return;

    var pressTimer = null, longFired = false;
    LIKE.btn.addEventListener('pointerdown', function () {
      longFired = false;
      pressTimer = setTimeout(function () {
        longFired = true;
        if (LIKE.state === 'liked') openGestureSheet();
      }, 500);
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) {
      LIKE.btn.addEventListener(ev, function () { clearTimeout(pressTimer); });
    });
    LIKE.btn.addEventListener('click', function () {
      if (longFired) { longFired = false; return; }
      toggle();
    });

    render(null);
  }

  global.LikeModule = { init: init };
})(window);
