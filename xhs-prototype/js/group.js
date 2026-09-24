/* ==========================================================================
   限时同好小组 · 全屏对话页 (group.js)
   倒计时(由 app.js 统一驱)；气泡(对方左/自己右/表情直出)；输入发送；
   20 条上限禁用；消息流 role=log。
   [P0] 表情仅 UGC；动效时长 var(--motion-*)；无 emoji 图标位。
   ========================================================================== */
(function (global) {
  'use strict';

  var EMOJIS = ['😊', '👏', '🌸', '🥰', '🙌', '💐', '🤝', '✨'];
  var MAX = 20;
  var sent = 0;
  var el = {}, palette = null, replyTimer = null;

  function injectIcons() {
    var back = document.getElementById('group-back'); if (back) back.innerHTML = icon('arrow-left', 24);
    var mem = document.getElementById('group-members'); if (mem) mem.innerHTML = icon('users', 20);
    var smile = document.getElementById('group-smile'); if (smile) smile.innerHTML = icon('smile', 24);
    var cam = document.getElementById('group-camera'); if (cam) cam.innerHTML = icon('camera', 24);
    var cd = document.querySelector('.countdown-bar .cd-ico'); if (cd) cd.innerHTML = icon('clock', 14);
  }

  function scrollBottom() {
    el.log.scrollTop = el.log.scrollHeight;
  }

  function addBubble(side, content, isEmoji) {
    var row = document.createElement('div');
    row.className = 'bubble-row bubble-row--' + (side === 'self' ? 'self' : 'other') + ' bubble-in';
    if (side === 'other') {
      row.innerHTML = '<span class="avatar avatar--sm" data-initial="李"></span>';
    }
    var body = document.createElement('div');
    body.className = isEmoji ? 'bubble-emoji' + (side === 'self' ? ' bubble-emoji--self' : '') : 'bubble';
    body.textContent = content;          // UGC 内容
    row.appendChild(body);
    el.log.appendChild(row);
    scrollBottom();
  }

  function addSystem(text) {
    var s = document.createElement('div');
    s.className = 'sys-center';
    s.textContent = text;
    el.log.appendChild(s);
    scrollBottom();
  }

  function updateQuota() {
    document.getElementById('group-quota').textContent = '每人每天最多 20 条 · 已发送 ' + sent + '/' + MAX;
  }

  function checkLimit() {
    if (sent >= MAX) {
      el.input.disabled = true;
      el.input.placeholder = '今天的 20 条已用完，明天见';
      document.querySelector('.input-bar').classList.add('is-full');
      addSystem('今天的 20 条已用完，明天见');
      return true;
    }
    return false;
  }

  function send(text, isEmoji) {
    var val = (text != null) ? text : el.input.value.trim();
    if (!val || checkLimit()) return;
    addBubble('self', val, isEmoji);
    sent += 1; updateQuota();
    if (!isEmoji) el.input.value = '';
    toggleSend();
    // 模拟对方回一句
    clearTimeout(replyTimer);
    replyTimer = setTimeout(function () {
      addBubble('other', '这家我也去过，下次一起呀？', false);
    }, 900);
  }

  function toggleSend() {
    var empty = el.input.value.trim() === '' || el.input.disabled;
    el.send.disabled = empty;
    el.send.setAttribute('aria-disabled', empty ? 'true' : 'false');
  }

  function buildPalette() {
    palette = document.createElement('div');
    palette.className = 'emoji-palette';
    palette.hidden = true;
    EMOJIS.forEach(function (e) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'emoji-pick'; b.textContent = e;
      b.addEventListener('click', function () { palette.hidden = true; send(e, true); });
      palette.appendChild(b);
    });
    document.querySelector('.input-bar').appendChild(palette);
  }

  function init() {
    injectIcons();
    el.log = document.getElementById('group-log');
    el.input = document.getElementById('group-input');
    el.send = document.getElementById('group-send');

    el.input.addEventListener('input', toggleSend);
    el.input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); send(); }
    });
    el.send.addEventListener('click', function () { send(); });
    document.getElementById('group-smile').addEventListener('click', function () {
      palette.hidden = !palette.hidden;
    });
    buildPalette();
    toggleSend();
    updateQuota();
  }

  // 进入小组（由 app.js 调用）
  function enter() {
    if (global.App) global.App.openGroup();
  }

  global.GroupModule = { init: init, enter: enter };
})(window);
