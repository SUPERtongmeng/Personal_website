// 载入动画 — 跟随资源加载进度
(function initLoader() {
  const loader = document.getElementById('loader');
  const loaderName = document.getElementById('loaderName');
  if (!loaderName || !loader) return;

  // 构建字母
  const text = 'Xiao Xi';
  loaderName.innerHTML = '';
  const chars = [];
  const colors = ['#F0C8D0','#E4AAB3','#DDA0AC','#D490A0','transparent','#C28090','#B87082','#A86075'];
  for (const ch of text) {
    const span = document.createElement('span');
    span.textContent = ch === ' ' ? ' ' : ch;
    loaderName.appendChild(span);
    chars.push(span);
  }
  chars.forEach((el, i) => { if (colors[i]) el.style.color = colors[i]; });

  function countLoadedResources() {
    const entries = performance.getEntriesByType('resource');
    let loaded = 1; // 当前文档
    let total = 1;
    if (entries.length > 0) {
      // responseEnd > 0 means the resource finished loading
      total += entries.length;
      loaded += entries.filter(e => e.responseEnd > 0).length;
    }
    return { loaded, total };
  }

  function updateProgress() {
    const ready = document.readyState;
    const { loaded, total } = countLoadedResources();
    let progress = loaded / Math.max(total, 1);
    if (ready === 'loading') progress = Math.min(progress, 0.25);
    else if (ready === 'interactive') progress = Math.max(progress, 0.35);
    else if (ready === 'complete') progress = 1;

    const showCount = Math.floor(progress * chars.length);
    chars.forEach((el, i) => el.classList.toggle('visible', i < showCount));

    if (ready !== 'complete') requestAnimationFrame(updateProgress);
  }
  requestAnimationFrame(updateProgress);
})();

// 全部加载完成后：退出加载动画 + 启动入场序列
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const loaderName = document.getElementById('loaderName');
  if (loaderName) {
    // 确保所有字母可见
    loaderName.querySelectorAll('span').forEach(el => el.classList.add('visible'));
  }
  if (loader) {
    setTimeout(() => loader.classList.add('loaded'), 300);
    setTimeout(() => { loader.remove(); }, 1100);
  }
  // 入场序列
  if (typeof startEntrance === 'function') {
    setTimeout(startEntrance, 200);
  }
});

const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => observer.observe(el));

const skillFills = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.setProperty('--percent', entry.target.dataset.percent);
      entry.target.classList.add('fill-anim');
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
skillFills.forEach(el => skillObserver.observe(el));

// ===== 暗色/亮色模式切换 =====
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  const setAriaLabel = () => {
    const theme = document.body.getAttribute('data-music-theme') || 'light';
    btn.setAttribute('aria-label', theme === 'dark' ? '切换为亮色模式' : '切换为暗色模式');
  };

  if (localStorage.getItem('theme-scheme') === 'dark') {
    switchMusicTheme('dark');
  }
  setAriaLabel();

  btn.addEventListener('click', () => {
    const current = document.body.getAttribute('data-music-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme-scheme', next);
    switchMusicTheme(next);
    setAriaLabel();
  });

  // ===== 汉堡菜单（移动端） =====
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navLinksEl = document.querySelector('.nav-links');

  if (hamburgerBtn && navLinksEl) {
    let menuOpen = false;

    function openMenu() {
      menuOpen = true;
      hamburgerBtn.classList.add('active');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      navLinksEl.classList.add('nav-open');
      document.body.classList.add('nav-menu-open');
    }

    function closeMenu() {
      menuOpen = false;
      hamburgerBtn.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      navLinksEl.classList.remove('nav-open');
      document.body.classList.remove('nav-menu-open');
    }

    hamburgerBtn.addEventListener('click', () => {
      menuOpen ? closeMenu() : openMenu();
    });

    navLinksEl.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => closeMenu());
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuOpen) closeMenu();
    });

    document.addEventListener('click', (e) => {
      if (menuOpen && !navLinksEl.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        closeMenu();
      }
    });
  }
});

const navbar = document.getElementById('navbar');
const scrollIndicator = document.querySelector('.scroll-indicator');
const scrollText = document.querySelector('.scroll-text');
let scrollIndicatorReady = false;
const navSections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  const fadeOut = Math.max(0, 1 - window.scrollY / 700);
  if (scrollIndicatorReady) {
    if (scrollIndicator) scrollIndicator.style.opacity = fadeOut;
    if (scrollText) scrollText.style.opacity = fadeOut;
  }

  const navHeight = 130;
  const scrollY = window.scrollY;
  const dirDown = scrollY >= lastScrollY;
  lastScrollY = scrollY;

  navSections.forEach((section) => {
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (!link) return; // 跳过没有导航链接的 section（如 #hero）

    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    let progress = 0;
    let phase = 'hidden';

    const activeTop = top - navHeight;
    const activeBottom = bottom - navHeight;

    // 过渡区：两个 section 之间的间隙
    const allSections = Array.from(navSections).filter(s => {
      const sid = s.getAttribute('id');
      return document.querySelector(`.nav-links a[href="#${sid}"]`);
    });
    const idx = allSections.indexOf(section);
    const prevSection = allSections[idx - 1];
    const nextSection = allSections[idx + 1];
    const enterStart = prevSection ? prevSection.offsetTop + prevSection.offsetHeight - navHeight : activeTop;
    const exitEnd = nextSection ? nextSection.offsetTop - navHeight : activeBottom;

    if (scrollY >= enterStart && scrollY < activeTop) {
      progress = (scrollY - enterStart) / (activeTop - enterStart);
      phase = 'enter';
    } else if (scrollY >= activeTop && scrollY < activeBottom) {
      progress = 1;
      phase = 'active';
    } else if (scrollY >= activeBottom && scrollY < exitEnd) {
      progress = 1 - (scrollY - activeBottom) / (exitEnd - activeBottom);
      phase = 'exit';
    }

    const pct = ((1 - progress) * 100).toFixed(1);
    let clip = `inset(0 ${pct}% 0 0)`;
    if (phase === 'exit') {
      clip = dirDown ? `inset(0 0 0 ${pct}%)` : `inset(0 ${pct}% 0 0)`;
    } else if (phase === 'enter') {
      clip = dirDown ? `inset(0 ${pct}% 0 0)` : `inset(0 0 0 ${pct}%)`;
    }
    link.style.setProperty('--nav-clip', clip);
    link.classList.toggle('nav-active', phase !== 'hidden');
  });
});

// 导航栏点击平滑滚动（可调偏移量）
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      const offset = 130;// ← 改这个值调整滚动位置
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      // 滚动后将焦点移到目标区域
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      target.addEventListener('blur', () => {
        target.removeAttribute('tabindex');
      }, { once: true });
    }
  });
});

// ========== 底层网格轻微视差 ==========
const bgGrid = document.querySelector('.bg-grid');
const gridHoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)');
let gridBgRaf = null;
let gridFocusActive = false;
let gridFocusX = window.innerWidth * 0.5;
let gridFocusY = window.innerHeight * 0.32;

function getGridRelativePoint(clientX, clientY) {
  if (!bgGrid) return { x: clientX, y: clientY };
  const rect = bgGrid.getBoundingClientRect();
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
}

function updateGridBackground() {
  if (!bgGrid) return;
  const offsetY = Math.max(-24, Math.min(24, window.scrollY * -0.08));
  bgGrid.style.transform = `translate3d(0, ${offsetY.toFixed(2)}px, 0)`;
  bgGrid.style.setProperty('--grid-focus-x', `${gridFocusX.toFixed(2)}px`);
  bgGrid.style.setProperty('--grid-focus-y', `${gridFocusY.toFixed(2)}px`);
  bgGrid.style.setProperty('--grid-focus-opacity', (gridFocusActive && gridHoverCapable.matches) ? '1' : '0');
}

function queueGridBackgroundUpdate() {
  if (gridBgRaf) return;
  gridBgRaf = requestAnimationFrame(() => {
    gridBgRaf = null;
    updateGridBackground();
  });
}

updateGridBackground();
window.addEventListener('scroll', queueGridBackgroundUpdate, { passive: true });
window.addEventListener('resize', () => {
  const point = getGridRelativePoint(window.innerWidth * 0.5, window.innerHeight * 0.32);
  gridFocusX = point.x;
  gridFocusY = point.y;
  queueGridBackgroundUpdate();
});
window.addEventListener('pointermove', (e) => {
  if (!gridHoverCapable.matches) return;
  gridFocusActive = true;
  const point = getGridRelativePoint(e.clientX, e.clientY);
  gridFocusX = point.x;
  gridFocusY = point.y;
  queueGridBackgroundUpdate();
}, { passive: true });
window.addEventListener('pointerleave', () => {
  gridFocusActive = false;
  queueGridBackgroundUpdate();
});
gridHoverCapable.addEventListener('change', () => {
  if (!gridHoverCapable.matches) gridFocusActive = false;
  queueGridBackgroundUpdate();
});

// 联系表单 — 使用 Formspree 发送邮件
// ⚠️ 请将下方 URL 替换为你自己的 Formspree 表单地址
// 前往 https://formspree.io 注册免费账号 → 创建表单 → 获取表单 ID
const FORM_SUBMIT_URL = 'https://formspree.io/f/mwvyvydg';
let lastFormSubmit = 0;
const FORM_COOLDOWN = 60_000; // 60 秒冷却

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
  e.preventDefault();

  const now = Date.now();
  const elapsed = now - lastFormSubmit;
  if (lastFormSubmit > 0 && elapsed < FORM_COOLDOWN) {
    const remain = Math.ceil((FORM_COOLDOWN - elapsed) / 1000);
    showToast(`⏳ 请 ${remain} 秒后再试`);
    return;
  }

  const btn = this.querySelector('.send-btn');
  btn.disabled = true;

  try {
    const res = await fetch(FORM_SUBMIT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: this.name.value,
        email: this.email.value,
        message: this.message.value
      })
    });
    if (res.ok) {
      btn.classList.add('sent');
      showToast('消息已发送，感谢你的联系！');
      lastFormSubmit = Date.now();
      this.reset();
      setTimeout(() => btn.classList.remove('sent'), 2500);
    } else {
      showToast('❌ 发送失败，请稍后再试');
    }
  } catch {
    showToast('❌ 网络错误，请稍后再试');
  }
  btn.disabled = false;
});
} // end if contactForm

// 说点什么 textarea 自适应高度
const contactTextarea = document.querySelector('.contact-form textarea');
if (contactTextarea) {
  contactTextarea.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
  });
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3000);
}

const blogData = [
  { title: '使用 CSS 实现毛玻璃效果的完整指南', body: 'Glassmorphism（毛玻璃效果）是近年来最受欢迎的 UI 设计趋势之一。它通过 backdrop-filter 属性创建出类似磨砂玻璃的视觉效果，让界面层次感更加丰富。\n\n本文深入解析了 backdrop-filter: blur() 的原理，并结合实际案例展示了如何在项目中灵活运用这一技术。从基础语法到高级技巧，带你全面掌握毛玻璃设计。' },
  { title: 'React 18 并发模式：彻底理解 Suspense', body: 'React 18 引入了全新的并发模式，其中 Suspense 的变化最为显著。在并发模式下，Suspense 不再仅仅是代码分割的工具，它成为了处理异步操作的核心机制。\n\n本文将带你深入理解 Suspense 在并发模式下的工作原理，包括 Streaming SSR、Selective Hydration 等新特性，以及如何在实际项目中运用这些能力来优化用户体验。' },
  { title: '马卡龙配色在 UI 设计中的运用', body: '马卡龙配色以其柔和、甜美的特点深受设计师喜爱。然而，如何在保持甜美特质的同时确保界面的可用性和可读性，是一个值得探讨的话题。\n\n本文分享了马卡龙配色在 UI 设计中的实践心得，包括色彩搭配原则、对比度控制、以及如何与毛玻璃效果完美结合，创造出既美观又实用的界面设计。' },
];

const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
if (modal && modalClose) {
  let lastFocusedElement = null;

  document.querySelectorAll('.blog-card').forEach(card => {
    card.addEventListener('click', () => {
      lastFocusedElement = document.activeElement;
      const idx = parseInt(card.dataset.article);
      const article = blogData[idx];
      document.getElementById('modalTitle').textContent = article.title;
      document.getElementById('modalBody').textContent = article.body;
      modal.classList.add('active');
      setTimeout(() => modalClose.focus(), 50);
    });

    // Keyboard: Enter / Space to activate
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    if (lastFocusedElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  }

  modalClose.addEventListener('click', () => {
    closeModal();
  });
  modal.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });

  // Escape key + focus trap
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      return;
    }
    if (e.key !== 'Tab') return;

    const focusable = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}

// "显示更多" 按钮
document.getElementById('blogMoreBtn')?.addEventListener('click', () => {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = '更多文章正在路上…';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
});

const quotes = [
  { text: '代码如诗，简洁为美', author: '— 编程箴言' },
  { text: '设计不只是它的外观和感觉，更是它的工作方式', author: '— Steve Jobs' },
  { text: '保持简单，保持愚蠢', author: '— Keep It Simple' },
  { text: '在混沌中寻找简单', author: '— Albert Einstein' },
  { text: '最好的代码是最少的代码', author: '— 编程格言' },
  { text: '做正确的事，而不是容易的事', author: '— 人生哲理' },
  { text: '想象力比知识更重要', author: '— Albert Einstein' },
  { text: '每一次细微的改变，都在塑造更好的自己', author: '— 成长语录' },
  
];

const quoteText = document.getElementById('quoteText');
const quoteAuthor = document.getElementById('quoteAuthor');

function showRandomQuote() {
  const idx = Math.floor(Math.random() * quotes.length);
  const q = quotes[idx];
  quoteText.style.opacity = '0';
  setTimeout(() => {
    quoteText.textContent = `"${q.text}"`;
    quoteAuthor.textContent = q.author;
    quoteText.style.opacity = '1';
  }, 300);
}

showRandomQuote();

// ========== 音乐播放器 (HTML5 Audio 真实音频) ==========
let audioCtx = null;
let audioElement = null;
let sourceNode = null;

function ensureAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

const playlist = [
  {
    name: 'magnolia',
    artist: 'keshi',
    cover: 'images/cover-b.jpg?v=2',
    src: './music/magnolia.mp3',
  },
];

let isPlaying = false;
let isTransitioning = false;

const heroMusic = document.getElementById('heroMusic');
const heroMusicName = document.getElementById('heroMusicName');
const heroMusicArtist = document.getElementById('heroMusicArtist');
const heroMusicCover = document.getElementById('heroMusicCover');
const heroMusicPlay = document.getElementById('heroMusicPlay');
const heroMusicPrev = document.getElementById('heroMusicPrev');
const heroMusicNext = document.getElementById('heroMusicNext');
const pauseIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M4 7a3 3 0 0 1 3-3h1a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3zm12-3a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h1a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3z" clip-rule="evenodd"/></svg>';
const playIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M19.5 14.598c2-1.155 2-4.041 0-5.196l-9-5.196C8.5 3.05 6 4.494 6 6.804v10.392c0 2.31 2.5 3.753 4.5 2.598z" clip-rule="evenodd"/></svg>';

// 初始化 Audio 元素
let audioInitialized = false;

function initAudioElement() {
  if (audioElement) {
    audioElement.pause();
    audioElement.src = '';
  }
  audioElement = new Audio();
  audioElement.volume = 0.8;

  const ctx = ensureAudioContext();

  if (!audioInitialized) {
    try {
      sourceNode = ctx.createMediaElementSource(audioElement);
      sourceNode.connect(ctx.destination);
      audioInitialized = true;
    } catch (e) {
      console.warn('Web Audio 初始化失败:', e);
    }
  } else {
    try {
      sourceNode.disconnect();
      sourceNode = ctx.createMediaElementSource(audioElement);
      sourceNode.connect(ctx.destination);
    } catch (e) {
      console.warn('Web Audio 重连失败:', e);
      try {
        audioElement = new Audio();
        audioElement.volume = 0.8;
      } catch (e2) {
        console.warn('降级播放也失败:', e2);
      }
    }
  }

  audioElement.addEventListener('ended', () => {
    // 单曲循环
    audioElement.currentTime = 0;
    startPlayback();
  });
}

// 开始播放
function startPlayback() {
  const ctx = ensureAudioContext();
  const p = ctx.state === 'suspended' ? ctx.resume() : Promise.resolve();
  p.then(() => {
    return audioElement.play();
  }).catch(err => {
    console.warn('播放失败:', err);
    stopPlayback();
    isPlaying = false;
    heroMusicPlay.innerHTML = playIcon;
    heroMusicCover.classList.remove('spinning');
    heroMusic.classList.remove('playing');
  });
}

// 停止播放
function stopPlayback() {
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
  }
}

const ORBIT_DOT_SHAPES = {
  'light': [
    { cls: 'p-l-svgleaf', color: '#E4AAB3', size: 36 },
    { cls: 'p-l-flower',  color: '#D4A0B0', size: 36 },
  ],
  'dark': [
    { cls: 'p-d-Claude', color: '#f4edfe5f', size: 36 },
    { cls: 'p-d-ChatGPT',  color: '#9287ae73', size: 36 },
  ],
};

function refreshOrbitDots() {
  const theme = document.body.getAttribute('data-music-theme') || 'light';
  const shapes = ORBIT_DOT_SHAPES[theme] || ORBIT_DOT_SHAPES['light'];
  const dots = document.querySelectorAll('.orbit-dot');

  dots.forEach((dot, i) => {
    const cfg = shapes[i % shapes.length];
    dot.className = 'orbit-dot';
    dot.classList.add(cfg.cls);
    dot.style.width = cfg.size + 'px';
    dot.style.height = cfg.size + 'px';

    dot.style.opacity = '1';
    dot.style.boxShadow = '0 0 30px var(--glow-color-1), 0 0 60px var(--glow-color-3)';
    dot.style.background = '';
    dot.style.color = cfg.color;
  });
}

function switchMusicTheme(targetTheme) {
  const body = document.body;
  const currentTheme = body.getAttribute('data-music-theme');
  if (currentTheme === targetTheme) return;

  // 捕获按钮位置用于聚光灯动画
  const btn = document.getElementById('themeToggle');
  if (btn) {
    const rect = btn.getBoundingClientRect();
    const x = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
    const y = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--spotlight-x', x + '%');
    document.documentElement.style.setProperty('--spotlight-y', y + '%');
  }

  const applyTheme = () => {
    body.setAttribute('data-music-theme', targetTheme);
    if (window.particleController) window.particleController.refresh();
    refreshOrbitDots();
  };

  if (document.startViewTransition) {
    document.startViewTransition(() => applyTheme());
  } else {
    applyTheme();
  }
}

function loadTrack(idx) {
  const t = playlist[idx];
  heroMusicName.textContent = t.name;
  heroMusicArtist.textContent = t.artist;

  heroMusicCover.innerHTML = `<img src="${t.cover}" alt="${t.name}">`;

  // reset spin: clear animation, force reflow, re-apply (start paused)
  heroMusicCover.classList.remove('spinning');
  heroMusicCover.style.animation = 'none';
  void heroMusicCover.offsetWidth;
  heroMusicCover.style.animation = 'vinylSpin 6s linear infinite';
  heroMusicCover.style.animationPlayState = 'paused';
  heroMusicCover.classList.add('spinning');
  heroMusic.classList.remove('playing');

  initAudioElement();
  audioElement.src = t.src;
}

loadTrack(0);

function togglePlay() {
  isPlaying = !isPlaying;
  heroMusicPlay.innerHTML = isPlaying ? pauseIcon : playIcon;
  heroMusicPlay.setAttribute('aria-label', isPlaying ? '暂停' : '播放');
  heroMusic.classList.toggle('playing', isPlaying);

  if (isPlaying) {
    heroMusicCover.style.animationPlayState = 'running';
    startPlayback();
  } else {
    heroMusicCover.style.animationPlayState = 'paused';
    if (audioElement) audioElement.pause();
  }
}

function restartTrack() {
  if (isTransitioning) return;
  isTransitioning = true;
  stopPlayback();
  isPlaying = false;
  heroMusicPlay.innerHTML = playIcon;
  heroMusic.classList.remove('playing');
  loadTrack(0);
  isPlaying = true;
  heroMusicPlay.innerHTML = pauseIcon;
  heroMusicCover.style.animationPlayState = 'running';
  heroMusic.classList.add('playing');
  startPlayback();
  setTimeout(() => { isTransitioning = false; }, 300);
}

// control buttons
if (heroMusicPlay) {
  heroMusicPlay.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePlay();
  });
}
if (heroMusicNext) {
  heroMusicNext.addEventListener('click', (e) => {
    e.stopPropagation();
    restartTrack();
  });
}
if (heroMusicPrev) {
  heroMusicPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    restartTrack();
  });
}

// 点击封面切换播放/暂停
if (heroMusicCover) {
  heroMusicCover.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePlay();
  });
}

// 3D 倾斜卡片效果
const tiltCards = document.querySelectorAll('.skill-item, .about-card, .blog-card');
tiltCards.forEach(item => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
        item.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px) scale(1.02)`;
        item.style.transition = 'transform 0.1s ease-out';
        item.style.setProperty('--mx', `${x}px`);
        item.style.setProperty('--my', `${y}px`);
        item.style.zIndex = '10';
  });
  item.addEventListener('mouseleave', () => {
    item.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0) scale(1)';
    item.style.transition = 'transform 0.5s ease-out';
    item.style.zIndex = '';
  });
});

// ========== 粒子控制器 ==========
const PARTICLE_CONFIG = {
  count: 20,
  size: { min: 25, max: 70 },
  duration: { min: 24, max: 90 },
  delay: { min: 0, max: 30 },
  startY: { min: 100, max: 160 },
  swayX: { min: -60, max: 60 },
  opacity: { min: 0.08, max: 0.22 },
  rotation: { min: 360, max: 1080 },
};

const THEME_SHAPES = {
  'dark': ['p-d-Github', 'p-d-cplusplus', 'p-d-code1', 'p-d-code2', 'p-d-AE', 'p-d-ChatGPT', 'p-d-Linux', 'p-d-Claude', 'p-d-Python', 'p-d-Cli', 'p-d-VScode', 'p-d-Java', 'p-d-Grok', 'p-d-BTC', 'p-d-Dollar', 'p-d-Telegram', 'p-d-chrome'],
};

const THEME_IMAGES = {
  'light': [
    'images/particles/QQ_1779802523257.png',
    'images/particles/QQ_1779802532590.png',
    'images/particles/QQ_1779802548736.png',
    'images/particles/QQ_1779802552860.png',
    'images/particles/QQ_1779802557726.png',
    'images/particles/QQ_1779802563781.png',
    'images/particles/QQ_1779802567899.png',
    'images/particles/QQ_1779802583304.png',
    'images/particles/QQ_1779802589346.png',
    'images/particles/QQ_1779802594843.png',
    'images/particles/QQ_1779802598886.png',
  ],
};

const THEME_COLORS = {
  'dark': ['#f4edfe5f', '#9287ae73'],
};

function rand(min, max) { return Math.random() * (max - min) + min; }
function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
class Particle {
  constructor(el) {
    this.el = el;
    this.baseSwayX = 0;
    this.currentSwayX = 0;
    this.targetSwayX = 0;
    this.baseOpacity = 0.35;
  }

  setStyle(cfg, theme) {
    const maxSize = THEME_IMAGES[theme] ? 45 : cfg.size.max;
    const size = randInt(cfg.size.min, maxSize);
    const left = rand(2, 95);
    const duration = rand(cfg.duration.min, cfg.duration.max);
    const delay = -rand(cfg.delay.min, cfg.delay.max);
    const startY = rand(cfg.startY.min, cfg.startY.max);
    const swayX = rand(cfg.swayX.min, cfg.swayX.max);
    const opacity = rand(cfg.opacity.min, cfg.opacity.max);

    this.el.style.width = `${size}px`;
    this.el.style.height = `${size}px`;
    this.el.style.left = `${left}%`;
    this.el.style.animationDuration = `${duration}s`;
    this.el.style.animationDelay = `${delay}s`;
    this.el.style.animationIterationCount = 'infinite';
    this.el.style.opacity = opacity;
    this.el.style.setProperty('--start-y', `${startY}vh`);
    this.el.style.setProperty('--sway-x', `${swayX}px`);
    this.el.style.setProperty('--rotation', `0deg`);
    this.el.style.setProperty('--mid-opacity', `${opacity}`);

    if (THEME_IMAGES[theme]) {
      const img = pick(THEME_IMAGES[theme]);
      this.el.style.background = `url('${img}') center/contain no-repeat`;
      this.el.style.color = '';
      this.el.className = 'particle p-image';
    } else {
      const color = pick(THEME_COLORS[theme] || ['#f4edfe5f', '#9287ae73']);
      const shape = pick(THEME_SHAPES[theme] || ['p-d-Github']);
      this.el.style.background = '';
      this.el.style.color = color;
      this.el.className = `particle ${shape}`;
    }

    this.baseSwayX = swayX;
    this.currentSwayX = swayX;
    this.targetSwayX = swayX;
    this.baseOpacity = opacity;
  }
}

class ParticleController {
  constructor() {
    this.container = document.querySelector('.particles');
    this.particles = [];
    this.mouseX = -9999;
    this.mouseY = -9999;
    this.rafId = null;
    this.init();
    this.bindEvents();
    this.startLoop();
  }

  getTheme() {
    return document.body.getAttribute('data-music-theme') || 'light';
  }

  _getCount() {
    if (window.innerWidth < 480) return 8;
    if (window.innerWidth < 768) return 13;
    return PARTICLE_CONFIG.count;
  }

  init() {
    this.container.innerHTML = '';
    this.particles = [];
    const theme = this.getTheme();

    for (let i = 0; i < this._getCount(); i++) {
      const el = document.createElement('div');
      this.container.appendChild(el);
      const p = new Particle(el);
      p.setStyle(PARTICLE_CONFIG, theme);
      this.particles.push(p);
    }
  }

  refresh() {
    const theme = this.getTheme();
    this.particles.forEach(p => p.setStyle(PARTICLE_CONFIG, theme));
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      this.mouseX = -9999;
      this.mouseY = -9999;
    });
  }

  startLoop() {
    const REPEL_RADIUS = 100;
    const REPEL_FORCE = 5;
    const FRICTION = 0.98;

    const loop = () => {
      this.rafId = requestAnimationFrame(loop);

      this.particles.forEach(p => {
        const rect = p.el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        let dx = parseFloat(p.el.style.getPropertyValue('--mouse-dx') || '0');
        let dy = parseFloat(p.el.style.getPropertyValue('--mouse-dy') || '0');

        dx *= FRICTION;
        dy *= FRICTION;

        if (this.mouseX > -1000) {
          const mdx = cx - this.mouseX;
          const mdy = cy - this.mouseY;
          const dist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (dist < REPEL_RADIUS && dist > 1) {
            const force = (1 - dist / REPEL_RADIUS) * REPEL_FORCE;
            dx += (mdx / dist) * force;
            dy += (mdy / dist) * force;
          }
        }

        if (Math.abs(dx) < 0.1) dx = 0;
        if (Math.abs(dy) < 0.1) dy = 0;

        p.el.style.setProperty('--mouse-dx', `${dx.toFixed(2)}px`);
        p.el.style.setProperty('--mouse-dy', `${dy.toFixed(2)}px`);
      });
    };

    this.rafId = requestAnimationFrame(loop);
  }
}

window.particleController = new ParticleController();
refreshOrbitDots();

// ========== 工具页面数据与渲染 ==========
const toolsData = [
  {
    category: '常用工具',
    id: 'common',
    items: [
      { name: 'GitHub', url: 'https://github.com', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
      { name: 'Google', url: 'https://www.google.com', icon: 'https://img.icons8.com/color/96/google-logo.png' },
      { name: '哔哩哔哩', url: 'https://www.bilibili.com', icon: 'https://img.icons8.com/color/96/bilibili.png' },
      { name: 'MiniMax', url: 'https://platform.minimaxi.com/user-center/payment/token-plan', icon: './icon/simple-icons--minimax.png' },
      { name: 'YouTube', url: 'https://www.youtube.com', icon: 'https://img.icons8.com/color/96/youtube-play.png' },
    ]
  },
  {
    category: 'AI工具',
    id: 'ai',
    items: [
      { name: 'ChatGPT', url: 'https://chatgpt.com/', icon: 'https://img.icons8.com/color/96/chatgpt.png' },
      { name: 'DeepSeek', url: 'https://chat.deepseek.com/', icon: 'https://img.icons8.com/color/96/deepseek.png' },
      { name: 'Gemini', url: 'https://gemini.google.com/app', icon: 'https://img.icons8.com/?size=100&id=rnK88i9FvAFO&format=png&color=000000' },
      { name: '通义千问', url: 'https://www.qianwen.com/chat', icon: './icon/logos--qwen-icon.png' },
      { name: '豆包', url: 'https://www.doubao.com/chat/', icon: 'https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/samantha/logo-icon-white-bg.png' },
      { name: 'Grok', url: 'https://grok.com/', icon: 'https://img.icons8.com/?size=100&id=SvMVhUPAeXkz&format=png&color=000000' },
      { name: 'ima', url: 'https://ima.qq.com/', icon: './icon/ima.svg' },
    ]
  },
  {
    category: '开发运维',
    id: 'dev',
    items: [
      { name: 'GitHub', url: 'https://github.com', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
      { name: 'V2EX', url: 'https://v2ex.com', icon: './icon/V2EX.svg' },
      { name: 'Cloudflare', url: 'https://dash.cloudflare.com/', icon: 'https://img.icons8.com/color/96/cloudflare.png' },
    ]
  },
  {
    category: '办公学习',
    id: 'study',
    items: [
      { name: '奇迹秀', url: 'https://www.qijishow.com/', icon: './icon/奇迹秀.svg' },
      { name: 'webgradients', url: 'https://webgradients.com/', icon: './icon/webgradients.png' },
      { name: 'Coolors', url: 'https://coolors.co/', icon: './icon/coolors.png' },
      { name: 'PixelFika', url: 'https://pixelfika.com/', icon: './icon/pixelfika.svg' },
      { name: 'Iconify', url: 'https://iconify.design/', icon: './icon/iconify.svg' },
      { name: 'Awwwards', url: 'https://www.awwwards.com/', icon: './icon/simple-icons--awwwards.png' },
    ]
  },
  {
    category: '影音视听',
    id: 'media',
    items: [
      { name: 'YouTube', url: 'https://www.youtube.com', icon: 'https://img.icons8.com/color/96/youtube-play.png' },
      { name: '人人视频', url: 'https://rrsp.com.cn/', icon: './icon/人人视频.png' },
      { name: '哔哩哔哩', url: 'https://www.bilibili.com', icon: 'https://img.icons8.com/color/96/bilibili.png' },
      { name: '网易云音乐', url: 'https://music.163.com', icon: './icon/CloudMusic.svg' },
      { name: 'QQ 音乐', url: 'https://y.qq.com/', icon: './icon/QQMusic.svg' },
      { name: 'Spotify', url: 'https://www.spotify.com', icon: 'https://img.icons8.com/color/96/spotify--v1.png' },
      { name: 'Netflix', url: 'https://www.netflix.com', icon: 'https://img.icons8.com/color/96/netflix.png' },
      { name: '爱奇艺', url: 'https://www.iqiyi.com', icon: 'https://img.icons8.com/color/96/iqiyi.png' },
      { name: '腾讯视频', url: 'https://www.tencentvideo.com', icon: './icon/腾讯视频.svg' },
      { name: '优酷', url: 'https://www.youku.com', icon: './icon/youku.svg' },
    ]
  }
];

let currentToolsCategory = 0;

function updateToolsTabIndicator() {
  const bar = document.getElementById('toolsTabBar');
  const indicator = bar && bar.querySelector('.tools-tab-indicator');
  const active = bar && bar.querySelector('.tools-tab.active');
  if (!indicator || !active) return;
  indicator.style.left = active.offsetLeft + 'px';
  indicator.style.width = active.offsetWidth + 'px';
}

function renderToolsTabBar() {
  const bar = document.getElementById('toolsTabBar');
  if (!bar) return;
  bar.innerHTML = '';
  toolsData.forEach((cat, idx) => {
    const btn = document.createElement('button');
    btn.className = 'tools-tab' + (idx === currentToolsCategory ? ' active' : '');
    btn.textContent = cat.category;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', idx === currentToolsCategory ? 'true' : 'false');
    btn.setAttribute('id', `tools-tab-${cat.id}`);
    btn.setAttribute('aria-controls', 'toolsGrid');

    btn.addEventListener('click', () => switchToolsCategory(idx));
    btn.addEventListener('mouseenter', () => switchToolsCategory(idx));

    // Keyboard: ArrowLeft/ArrowRight navigation within tablist
    btn.addEventListener('keydown', (e) => {
      const tabs = bar.querySelectorAll('[role="tab"]');
      const currentIdx = Array.from(tabs).indexOf(document.activeElement);
      let newIdx = currentIdx;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        newIdx = (currentIdx + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        newIdx = (currentIdx - 1 + tabs.length) % tabs.length;
      }

      if (newIdx !== currentIdx && newIdx >= 0) {
        tabs[newIdx].focus();
        switchToolsCategory(newIdx);
      }
    });

    bar.appendChild(btn);
  });
  // 创建滑动指示器
  const indicator = document.createElement('div');
  indicator.className = 'tools-tab-indicator';
  bar.appendChild(indicator);
  // 首次定位禁用过渡
  indicator.style.transition = 'none';
  updateToolsTabIndicator();
  indicator.offsetHeight;
  indicator.style.transition = '';
}

function renderToolsGrid() {
  const grid = document.getElementById('toolsGrid');
  if (!grid) return;
  const cat = toolsData[currentToolsCategory];
  grid.innerHTML = '';
  cat.items.forEach(item => {
    const a = document.createElement('a');
    a.className = 'tools-tile';
    a.href = item.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.innerHTML = `
      <div class="tools-tile-img-box"><img src="${item.icon}" alt="${item.name}" loading="lazy"></div>
      <span class="tools-tile-name">${item.name}</span>
      <span class="sr-only">（新窗口打开）</span>
    `;
    grid.appendChild(a);
  });
}

function switchToolsCategory(idx) {
  if (idx === currentToolsCategory && document.querySelector('.tools-tab.active')) return;
  currentToolsCategory = idx;
  document.querySelectorAll('.tools-tab').forEach((btn, i) => {
    btn.classList.toggle('active', i === idx);
    btn.setAttribute('aria-selected', i === idx ? 'true' : 'false');
  });
  const grid = document.getElementById('toolsGrid');
  if (grid) {
    const cat = toolsData[idx];
    grid.setAttribute('aria-labelledby', `tools-tab-${cat.id}`);
  }
  requestAnimationFrame(() => updateToolsTabIndicator());

  const card = document.querySelector('.tools-card');
  if (card) {
    const oldHeight = card.offsetHeight;
    // 淡出
    card.style.opacity = '0.25';
    renderToolsGrid();
    // 临时释放高度获取真实内容高度（同步操作，无视觉闪烁）
    card.style.height = 'auto';
    const newHeight = card.scrollHeight;
    card.style.height = oldHeight + 'px';
    // 触发过渡到新高度，同时淡入
    requestAnimationFrame(() => {
      card.style.height = newHeight + 'px';
      card.style.opacity = '1';
    });
  } else {
    renderToolsGrid();
  }
}

// 窗口缩放时重新计算卡片高度
window.addEventListener('resize', () => {
  const card = document.querySelector('.tools-card');
  if (card && card.style.height && card.style.height !== 'auto') {
    const prev = card.style.height;
    card.style.height = 'auto';
    const newH = card.scrollHeight;
    card.style.height = prev;
    if (Math.abs(parseInt(prev) - newH) > 1) {
      card.style.height = newH + 'px';
    }
  }
  updateToolsTabIndicator();
});

// 初始化工具页面
if (document.getElementById('toolsTabBar')) {
  renderToolsTabBar();
  renderToolsGrid();
}

// ===== hero 入场序列 =====
const heroSubtitle = document.getElementById('heroSubtitle');
const subtitleLines = ['AI学习者 · 技术探索者', '从代码到AI提示词，持续折腾中...'];
function buildHeroChars() {
  if (!heroSubtitle) return;
  heroSubtitle.innerHTML = '';
  const frag = document.createDocumentFragment();
  subtitleLines.forEach((line, li) => {
    if (li > 0) frag.appendChild(document.createElement('br'));
    for (const ch of line) {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = ch;
      frag.appendChild(span);
    }
  });
  heroSubtitle.appendChild(frag);
}

function startEntrance() {
  document.querySelectorAll('.enter, .char, .avatar-orbit').forEach(el => {
    el.classList.remove('visible');
  });

  const addTimer = (fn, delay) => {
    setTimeout(fn, delay);
  };

  // 1. nav slide down + greeting slide down
  const nav = document.querySelector('#navbar');
  if (nav) addTimer(() => nav.classList.add('visible'), 500);
  const greeting = document.querySelector('.hero-greeting');
  if (greeting) addTimer(() => greeting.classList.add('visible'), 250);

  // 2. title bottom-left pop + avatar orbit (sync with loader expand)
  const title = document.querySelector('.hero h1');
  if (title) addTimer(() => title.classList.add('visible'), 350);
  const orbit = document.querySelector('.avatar-orbit');
  if (orbit) addTimer(() => orbit.classList.add('visible'), 350);

  // 3. subtitle blur reveal - staggered character animation
  if (heroSubtitle) {
    const chars = heroSubtitle.querySelectorAll('.char');
    chars.forEach((el, i) => {
      addTimer(() => el.classList.add('visible'), 650 + i * 35);
    });
  }

  // 4. music card scale + fade in
  const music = document.querySelector('.hero-music');
  if (music) addTimer(() => music.classList.add('visible'), 500);

  // 5. quote slide up + fade in
  const quote = document.querySelector('.hero-quote');
  if (quote) addTimer(() => quote.classList.add('visible'), 1000);

  // 6. scroll indicator + scroll text blur-in
  addTimer(() => {
    if (scrollIndicator) scrollIndicator.classList.add('visible');
    if (scrollText) scrollText.classList.add('visible');
    scrollIndicatorReady = true;
  }, 2000);

  // 7. remove .enter from nav so scroll transition isn't blocked
  addTimer(() => {
    document.querySelector('#navbar')?.classList.remove('enter');
  }, 1200);
}

// 立即构建字幕 DOM 占位
buildHeroChars();

// ===== 返回顶部按钮 =====
const backToTop = document.createElement('button');
backToTop.id = 'backToTop';
backToTop.innerHTML = '↑';
backToTop.setAttribute('aria-label', '返回顶部');
backToTop.style.cssText = 'position:fixed;bottom:32px;right:32px;width:44px;height:44px;border-radius:50%;border:none;background:rgba(0,0,0,0.4);color:#fff;font-size:20px;cursor:pointer;opacity:0;transition:opacity 0.3s,transform 0.3s;z-index:100;backdrop-filter:blur(8px);';
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
  backToTop.style.opacity = window.scrollY > 400 ? '1' : '0';
  backToTop.style.transform = window.scrollY > 400 ? 'translateY(0)' : 'translateY(20px)';
});
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== 图片懒加载失败降级 =====
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
  img.addEventListener('error', () => {
    img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect fill="%23ddd" width="40" height="40"/><text fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="12">?</text></svg>';
    img.style.opacity = '0.6';
  });
});

// ===== 控制台彩蛋 =====
console.log('%c Xiao Bei ', 'background:#56AE5B;color:#fff;padding:4px 12px;border-radius:4px;font-weight:bold;', '欢迎访问我的个人网站！');
console.log('%c 开源地址: https://github.com/SUPERtongmeng/Personal_website ', 'color:#56AE5B;');

// ===== 键盘快捷键 =====
document.addEventListener('keydown', (e) => {
  // Space: 播放/暂停音乐（不在输入框时）
  if (e.code === 'Space' && !['INPUT','TEXTAREA'].includes(e.target.tagName)) {
    e.preventDefault();
    togglePlay();
  }
  // ← / →: 上一首 / 下一首
  if (e.key === 'ArrowLeft' && e.altKey) {
    e.preventDefault();
    restartTrack();
  }
  if (e.key === 'ArrowRight' && e.altKey) {
    e.preventDefault();
    restartTrack();
  }
});

