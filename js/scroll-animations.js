/**
 * 轻量滚动入场动画（IntersectionObserver）
 * - 给 .reveal 元素添加淡入上移效果
 * - 同批进入视口的元素自动产生 80ms 依次错开
 * - 尊重 prefers-reduced-motion：如开启减少动效，直接显示，不播放动画
 * - 渐进增强：任何异常都直接显示全部内容，绝不让图片因脚本错误而不可见
 */
(function () {
  'use strict';

  // 标记动画系统已就绪；HTML 头部的兜底脚本会在 2.5s 后检查此标记，
  // 若脚本始终未运行（加载失败/报错），则移除 .js 让内容照常显示。
  window.__revealOk = true;

  try {
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var revealEls = document.querySelectorAll('.reveal');

    if (!revealEls.length) return;

    // 减少动效偏好：直接显示，不挂 observer
    if (prefersReduced) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    // 不支持 IntersectionObserver 时兜底：全部显示
    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry, index) {
        if (entry.isIntersecting) {
          // 同批进入的元素按索引依次延迟 80ms
          entry.target.style.transitionDelay = (index * 80) + 'ms';
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      // threshold 设为 0：只要元素与视口相交（哪怕只有 1px）就触发。
      // 之前用 0.1 会导致超长作品图（如 25638px 高）永远达不到 10% 可见而一直 opacity:0。
      threshold: 0,
      rootMargin: '0px 0px 50px 0px'
    });

    revealEls.forEach(function (el) { observer.observe(el); });
  } catch (err) {
    // 任何异常都直接显示全部内容，绝不让图片因脚本错误而不可见
    var all = document.querySelectorAll('.reveal');
    for (var i = 0; i < all.length; i++) all[i].classList.add('is-visible');
  }
})();
