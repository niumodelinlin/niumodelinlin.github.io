/**
 * 轻量滚动入场动画（IntersectionObserver）
 * - 给 .reveal 元素添加淡入上移效果
 * - 同批进入视口的元素自动产生 80ms 依次错开
 * - 尊重 prefers-reduced-motion：如开启减少动效，直接显示，不播放动画
 */
(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');

  if (!revealEls.length) return;

  // 减少动效偏好：直接显示，不挂 observer
  if (prefersReduced) {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  // 不支持 IntersectionObserver 时兜底：全部显示
  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry, index) {
      if (entry.isIntersecting) {
        // 同批进入的元素按索引依次延迟 80ms
        entry.target.style.transitionDelay = (index * 80) + 'ms';
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -24px 0px'
  });

  revealEls.forEach(function (el) {
    observer.observe(el);
  });
})();
