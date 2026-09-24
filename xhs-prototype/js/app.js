/* ==========================================================================
   入口 · 视图路由 + 倒计时 + 共享 Toast (app.js)
   脚本顺序末位；负责装配 like/messages/sheet/group 模块与导航联动。
   [P0] 动效时长 var(--motion-*)；reduced-motion 降级；无 emoji 图标位。
   ========================================================================== */
(function (global) {
  'use strict';

  global.reduceMotion = global.matchMedia &&
    global.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 共享 Toast ---------- */
  var toastEl = null, toastTimer = null;
  global.Toast = {
    show: function (msg) {
      if (!toastEl) toastEl = document.getElementById('toast');
      toastEl.innerHTML = '<span>' + msg + '</span>';
      toastEl.classList.remove('show');
      void toastEl.offsetWidth;
      toastEl.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () {
        toastEl.classList.remove('show');
        setTimeout(function () { toastEl.innerHTML = ''; }, 200);
      }, 1700);
    }
  };

  /* ---------- 视图路由 ---------- */
  var App = {
    showView: function (name) {
      var ids = { note: 'view-note', messages: 'view-messages', tongpin: 'view-messages', group: 'view-group' };
      var activeId = ids[name];
      Object.keys(ids).forEach(function (k) {
        var v = document.getElementById(ids[k]);
        if (!v) return;
        var on = (ids[k] === activeId);   // 按目标元素判定，避免同元素多 key 互相覆盖
        v.classList.toggle('is-active', on);
        if (k === 'group') v.toggleAttribute('hidden', !on);
      });
      document.querySelectorAll('.proto-nav__btn').forEach(function (b) {
        b.classList.toggle('is-active', b.getAttribute('data-nav') === name);
      });
      if (name !== 'tongpin' && global.SheetModule &&
        document.getElementById('sheet').classList.contains('is-open')) {
        global.SheetModule.close();
      }
    },
    openSheet: function () {
      this.showView('tongpin');
      if (global.SheetModule) global.SheetModule.open();
    },
    openGroup: function () {
      this.showView('group');
      var bar = document.querySelector('.countdown-bar');
      if (bar) bar.scrollIntoView && bar.scrollIntoView();
    }
  };
  global.App = App;

  /* ---------- 笔记页静态图标 + 收藏/评论/分享微弹 ---------- */
  function setupNote() {
    var map = {
      'note-back': ['arrow-left', 24], 'note-share': ['share', 24],
      'collect-ico': ['star', 24], 'comment-ico': ['message-circle', 24],
      'share-ico': ['share', 24]
    };
    Object.keys(map).forEach(function (id) {
      var elx = document.getElementById(id);
      if (elx) elx.innerHTML = icon(map[id][0], map[id][1]);
    });

    var collect = document.getElementById('collect-btn');
    var collected = false;
    collect.addEventListener('click', function () {
      collected = !collected;
      collect.classList.toggle('is-collected', collected);
      document.getElementById('collect-ico').innerHTML = icon('star', 24, { filled: collected });
      pop(collect); global.Toast.show(collected ? '已收藏到默认专辑' : '已取消收藏');
    });

    ['comment-btn', 'share-btn'].forEach(function (id) {
      var b = document.getElementById(id);
      var msg = (id === 'comment-btn') ? '评论区仅作示意' : '已唤起分享面板（示例）';
      b.addEventListener('click', function () { pop(b); global.Toast.show(msg); });
    });

    document.getElementById('note-follow').addEventListener('click', function () {
      var f = this; var on = f.classList.toggle('is-followed');
      f.textContent = on ? '已关注' : '关注';
    });
    document.getElementById('note-back').addEventListener('click', function () { App.showView('messages'); });
  }

  function pop(elx) {
    var ico = elx.querySelector('.action-ico');
    if (!ico) return;
    ico.classList.remove('like-pop'); void ico.offsetWidth; ico.classList.add('like-pop');
  }

  /* ---------- 倒计时（同频空间 + 限时小组共享） ---------- */
  function startCountdown() {
    var total = 23 * 3600 + 41 * 60 + 7;
    function fmt(s) {
      var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
      var p = function (n) { return (n < 10 ? '0' : '') + n; };
      return p(h) + ':' + p(m) + ':' + p(sec);
    }
    function tick() {
      var t = fmt(total);
      var sc = document.getElementById('sheet-countdown');
      var gc = document.getElementById('group-countdown');
      if (sc) sc.textContent = '剩余 ' + t;
      if (gc) gc.textContent = '剩余 ' + t + ' 后自动关闭';
      var breathe = total < 3600;
      document.querySelectorAll('.cd-chip').forEach(function (c) { c.classList.toggle('is-breathe', breathe); });
      if (total > 0) total -= 1;
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- 导航按钮 ---------- */
  function setupNav() {
    document.querySelectorAll('.proto-nav__btn').forEach(function (b) {
      b.addEventListener('click', function () {
        var nav = b.getAttribute('data-nav');
        if (nav === 'tongpin') App.openSheet();
        else if (nav === 'group') App.openGroup();
        else App.showView(nav);
      });
    });
    document.getElementById('group-back').addEventListener('click', function () { App.showView('messages'); });
  }

  /* ---------- 深链接 hash 路由（可分享/直跳视图） ---------- */
  function routeFromHash() {
    var h = (location.hash || '').replace('#', '');
    if (h === 'note' || h === 'messages' || h === 'group') App.showView(h);
    else if (h === 'tongpin') App.openSheet();
  }

  /* ---------- 装配 ---------- */
  function boot() {
    if (global.LikeModule) global.LikeModule.init();
    if (global.MessagesModule) global.MessagesModule.init();
    if (global.SheetModule) global.SheetModule.init();
    if (global.GroupModule) global.GroupModule.init();
    setupNote();
    setupNav();
    startCountdown();
    routeFromHash();
    global.addEventListener('hashchange', routeFromHash);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(window);
