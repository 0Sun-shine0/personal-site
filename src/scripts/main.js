/* ==========================================================================
   个人网站  交互脚本（原生 JS，无依赖）
   1 主题切换  2 导航  3 入场动画  4 卡片跟随光  5 复制邮箱  6 阅读进度
   ========================================================================== */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1  主题切换  */
  var STORE = 'theme';
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem(STORE, t); } catch (e) {}
  }
  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem(STORE); } catch (e) {}
    var prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    applyTheme(saved || (prefersLight ? 'light' : 'dark'));
  }
  initTheme(); // <head> 里的内联脚本已提前执行过一次，这里兜底

  document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  });

  /* 2  导航：滚动状态 / 移动端菜单 / 当前页高亮  */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    var burger = nav.querySelector('[data-burger]');
    if (burger) {
      burger.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', String(open));
      });
    }
    nav.querySelectorAll('.nav__drawer a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('is-open'); });
    });

    // 根据当前路径高亮导航（HTML 里已写 aria-current 的会被保留）
    var here = location.pathname.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
    nav.querySelectorAll('[data-nav]').forEach(function (a) {
      var to = new URL(a.href, location.origin).pathname.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
      var hit = to === '/' ? here === '/' : here.indexOf(to) === 0;
      if (hit) {
        nav.querySelectorAll('[data-nav="' + a.dataset.nav + '"]').forEach(function (x) {
          x.setAttribute('aria-current', 'page');
        });
      }
    });
  }

  /* 3  滚动入场动画（带错落延迟）  */
  var reveals = document.querySelectorAll('[data-reveal]');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var total = reveals.length;
    reveals.forEach(function (el, i) { el.style.setProperty('--d', (i % 6) * 80 + 'ms'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
    void total;
  }

  /* 4  卡片跟随鼠标的柔光  */
  if (!reduce && window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('.card').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
      });
    });
  }

  /* 5  复制邮箱 + 轻提示  */
  var toastEl = document.createElement('div');
  toastEl.className = 'toast';
  toastEl.setAttribute('role', 'status');
  toastEl.setAttribute('aria-live', 'polite');
  toastEl.textContent = '已复制到剪贴板 ';
  document.body.appendChild(toastEl);
  var toastTimer;
  function toast(msg) {
    toastEl.textContent = msg || '已复制到剪贴板 ';
    toastEl.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-show'); }, 1900);
  }
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var text = btn.getAttribute('data-copy');
      var done = function () { toast('邮箱 ' + text + ' 已复制 '); };
      if (navigator.clipboard && location.protocol !== 'file:') {
        navigator.clipboard.writeText(text).then(done).catch(function () { window.location.href = 'mailto:' + text; });
      } else {
        var ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (err) { window.location.href = 'mailto:' + text; }
        document.body.removeChild(ta);
      }
    });
  });

  /* 6  文章阅读进度条  */
  if (document.body.hasAttribute('data-progress')) {
    var bar = document.createElement('div');
    bar.className = 'progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    var tick = function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0) + '%';
    };
    tick();
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick);
  }

  /* 页脚年份 */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
