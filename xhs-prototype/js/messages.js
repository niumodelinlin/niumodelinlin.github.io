/* ==========================================================================
   消息页 · 三种卡片变体 + 回礼 morph (messages.js)
   变体A 回礼 → morph 为变体B(同频成功) + Toast；变体B/C → 打开同频空间浮层。
   [P0] 动效时长 var(--motion-*)；无 emoji 图标位。
   ========================================================================== */
(function (global) {
  'use strict';

  function doGift(card) {
    var name = card.getAttribute('data-name') || '李知遥';
    card.style.opacity = '0';
    setTimeout(function () {
      var main = card.querySelector('.msg-main');
      var btn = card.querySelector('.gift-btn');
      main.innerHTML =
        '<p class="msg-line1"><span class="badge-ico">' + icon('gift', 16) + '</span>你和 <b>' + name + '</b> 同频成功</p>' +
        '<p class="msg-line2">你们都赞过《上海实习周记》</p>';
      btn.setAttribute('data-act', 'enter');
      btn.textContent = '进入同频空间';
      card.setAttribute('data-variant', 'b');
      card.classList.remove('msg-card--c');
      card.style.opacity = '1';
    }, 200);
    global.Toast.show('同频成功，去同频空间递个表情吧');
  }

  function openSheet() {
    if (global.SheetModule) global.SheetModule.open();
  }

  function init() {
    var scroll = document.querySelector('.msg-scroll');
    if (!scroll) return;

    // 注入静态图标
    var more = document.getElementById('msg-more');
    if (more) more.innerHTML = icon('more-horizontal', 24);
    document.querySelectorAll('.gift-ico').forEach(function (el) { el.innerHTML = icon('gift', 16); });
    document.querySelectorAll('.badge-ico').forEach(function (el) { el.innerHTML = icon('gift', 16); });

    var tabMap = { home: 'home', video: 'play', publish: 'plus', msg: 'message-circle', me: 'user' };
    document.querySelectorAll('.tab').forEach(function (t) {
      var k = t.getAttribute('data-tab');
      if (!tabMap[k]) return;
      if (k === 'publish') t.innerHTML = icon('plus', 22);
      else t.querySelector('.tab-ico').innerHTML = icon(tabMap[k], 24);
    });

    // 事件委托：回礼 / 进入同频空间 / 整行点开
    scroll.addEventListener('click', function (e) {
      var card = e.target.closest('.msg-card');
      if (!card) return;
      if (card.classList.contains('msg-card--c')) { openSheet(); return; }
      var actBtn = e.target.closest('[data-act]');
      if (!actBtn) return;
      var act = actBtn.getAttribute('data-act');
      if (act === 'gift') doGift(card);
      else if (act === 'enter') openSheet();
    });

    scroll.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var card = e.target.closest('.msg-card--c');
      if (card) { e.preventDefault(); openSheet(); }
    });
  }

  global.MessagesModule = { init: init };
})(window);
