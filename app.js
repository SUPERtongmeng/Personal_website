// 载入动画 — 跟随资源加载进度
(function initLoader() {
  const loader = document.getElementById('loader');
  const loaderName = document.getElementById('loaderName');
  if (!loaderName || !loader) return;

  // 构建字母
  const text = 'Xiao Bei';
  loaderName.innerHTML = '';
  const chars = [];
  const colors = ['#A8D5A2','#8BC98A','#70BC73','#56AE5B','transparent','#3D9548','#2D8035','#1E6825'];
  for (const ch of text) {
    const span = document.createElement('span');
    span.textContent = ch === ' ' ? ' ' : ch;
    loaderName.appendChild(span);
    chars.push(span);
  }
  chars.forEach((el, i) => { if (colors[i]) el.style.color = colors[i]; });

  // 跟踪页面资源（图片、样式表等）
  const resources = document.querySelectorAll('img');
  let loaded = 0;
  const total = resources.length + 1; // +1 代表文档本身

  resources.forEach(img => {
    if (img.complete) loaded++;
    else img.addEventListener('load', () => loaded++);
  });

  function updateProgress() {
    const ready = document.readyState;
    // loading ~ 0-20%, interactive ~ 20-90%, complete = 100%
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

const navbar = document.getElementById('navbar');
const scrollIndicator = document.querySelector('.scroll-indicator');
const scrollText = document.querySelector('.scroll-text');
const navSections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  const fadeOut = Math.max(0, 1 - window.scrollY / 700);
  if (scrollIndicator) scrollIndicator.style.opacity = fadeOut;
  if (scrollText) scrollText.style.opacity = fadeOut;
  let current = '';
  const maxY = document.documentElement.scrollHeight - window.innerHeight;
  if (window.scrollY >= maxY - 50) {
    const last = navSections[navSections.length - 1];
    if (last) current = last.getAttribute('id');
  }
  if (!current) {
    for (let i = navSections.length - 1; i >= 0; i--) {
      const section = navSections[i];
      if (window.scrollY >= section.offsetTop - 130) {
        current = section.getAttribute('id');
        break;
      }
    }
  }
  navLinks.forEach(link => {
    link.classList.toggle('nav-active', link.getAttribute('href') === `#${current}`);
  });
});

// 导航栏点击平滑滚动（可调偏移量）
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      const offset = 130// ← 改这个值调整滚动位置
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

// 联系表单 — 使用 Formspree 发送邮件
// ⚠️ 请将下方 URL 替换为你自己的 Formspree 表单地址
// 前往 https://formspree.io 注册免费账号 → 创建表单 → 获取表单 ID
const FORM_SUBMIT_URL = 'https://formspree.io/f/mwvyvydg';

document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const btn = this.querySelector('button');
  const txt = btn.textContent;
  btn.textContent = '发送中…';
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
      showToast('✨ 消息已发送！感谢你的联系 💖');
      this.reset();
    } else {
      showToast('❌ 发送失败，请稍后再试');
    }
  } catch {
    showToast('❌ 网络错误，请稍后再试');
  }
  btn.textContent = txt;
  btn.disabled = false;
});

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

document.querySelectorAll('.blog-card').forEach(card => {
  card.addEventListener('click', () => {
    const idx = parseInt(card.dataset.article);
    const article = blogData[idx];
    document.getElementById('modalTitle').textContent = article.title;
    document.getElementById('modalBody').textContent = article.body;
    document.getElementById('modal').classList.add('active');
  });
});

// "显示更多" 按钮
document.getElementById('blogMoreBtn')?.addEventListener('click', () => {
  const toast = document.getElementById('toast');
  toast.textContent = '更多文章正在路上…';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
});

document.getElementById('modalClose').addEventListener('click', () => {
  document.getElementById('modal').classList.remove('active');
});
document.getElementById('modal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) document.getElementById('modal').classList.remove('active');
});

const quotes = [
  { text: '代码如诗，简洁为美。', author: '— 编程箴言' },
  { text: '设计不只是它的外观和感觉，更是它的工作方式。', author: '— Steve Jobs' },
  { text: '保持简单，保持愚蠢。', author: '— Keep It Simple' },
  { text: '在混沌中寻找简单。', author: '— Albert Einstein' },
  { text: '最好的代码是最少的代码。', author: '— 编程格言' },
  { text: '做正确的事，而不是容易的事。', author: '— 人生哲理' },
  { text: '想象力比知识更重要。', author: '— Albert Einstein' },
  { text: '每一次细微的改变，都在塑造更好的自己。', author: '— 成长语录' },
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
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let audioElement = null;
let sourceNode = null;
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

const playlist = [
  {
    name: '春禾',
    artist: 'Youzee Music',
    cover: 'https://p1.music.126.net/Nbq2akzthvXIJP6xSr_9yA==/109951170758787069.jpg?param=200y200',
    src: './music/chunhe.mp3',
    theme: 'theme-b'
  },
  {
    name: 'Head In The Clouds',
    artist: 'Hayd',
    cover: 'https://p1.music.126.net/NQ6pIqUwA0NdRh6szqyQsQ==/109951166421319018.jpg?param=200y200',
    src: './music/head-in-the-clouds.mp3',
    theme: 'theme-a'
  },
  {
    name: 'shelter',
    artist: 'hakaisu / Alys',
    cover: 'https://p2.music.126.net/sdbcH2bH-t-6wU9J-DK82w==/109951163020032493.jpg?param=200y200',
    src: './music/shelter.mp3',
    theme: 'theme-c'
  },
];

let currentTrack = 0;
let isPlaying = false;

const heroMusic = document.getElementById('heroMusic');
const heroMusicName = document.getElementById('heroMusicName');
const heroMusicArtist = document.getElementById('heroMusicArtist');
const heroMusicCover = document.getElementById('heroMusicCover');
const heroMusicPlay = document.getElementById('heroMusicPlay');
const heroMusicPrev = document.getElementById('heroMusicPrev');
const heroMusicNext = document.getElementById('heroMusicNext');
const pauseIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M4 7a3 3 0 0 1 3-3h1a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3zm12-3a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h1a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3z" clip-rule="evenodd"/></svg>';
const playIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M19.5 14.598c2-1.155 2-4.041 0-5.196l-9-5.196C8.5 3.05 6 4.494 6 6.804v10.392c0 2.31 2.5 3.753 4.5 2.598z" clip-rule="evenodd"/></svg>';

// ========== 音频可视化 ==========
const barElements = document.querySelectorAll('#heroMusicBars span');
let visualizationId = null;

function updateBars() {
  visualizationId = requestAnimationFrame(updateBars);
  analyser.getByteFrequencyData(dataArray);

  const step = Math.max(1, Math.floor(bufferLength / barElements.length));
  barElements.forEach((bar, i) => {
    let sum = 0;
    let count = 0;
    for (let j = 0; j < step && (i * step + j) < bufferLength; j++) {
      sum += dataArray[i * step + j];
      count++;
    }
    const avg = count > 0 ? sum / count : 0;
    const height = Math.max(3, (avg / 255) * 28 + 2);
    bar.style.height = height.toFixed(1) + 'px';
  });
}

function startVisualization() {
  if (!visualizationId) {
    updateBars();
  }
}

function stopVisualization() {
  if (visualizationId) {
    cancelAnimationFrame(visualizationId);
    visualizationId = null;
  }
  barElements.forEach(bar => { bar.style.height = '4px'; });
}

// 初始化 Audio 元素并连接 Analyser
let audioInitialized = false;

function initAudioElement() {
  if (audioElement) {
    audioElement.pause();
    audioElement.src = '';
  }
  audioElement = new Audio();
  audioElement.volume = 0.8;

  if (!audioInitialized) {
    try {
      sourceNode = audioCtx.createMediaElementSource(audioElement);
      sourceNode.connect(analyser);
      analyser.connect(audioCtx.destination);
      audioInitialized = true;
    } catch (e) {
      console.warn('Web Audio 初始化失败，可视化已禁用:', e);
    }
  } else {
    // 后续切歌：重新连接新的 Audio 元素
    try {
      sourceNode.disconnect();
      sourceNode = audioCtx.createMediaElementSource(audioElement);
      sourceNode.connect(analyser);
    } catch (e) {
      console.warn('Web Audio 重连失败:', e);
      // 降级：不经过 analyser，直接播放
      try {
        audioElement = new Audio();
        audioElement.volume = 0.8;
      } catch (e2) {
        console.warn('降级播放也失败:', e2);
      }
    }
  }

  audioElement.addEventListener('ended', () => {
    stopPlayback();
    isPlaying = false;
    heroMusicPlay.innerHTML = playIcon;
    heroMusicCover.classList.remove('spinning');
    heroMusic.classList.remove('playing');
    nextTrack();
  });
}

// 开始播放
function startPlayback() {
  const p = audioCtx.state === 'suspended' ? audioCtx.resume() : Promise.resolve();
  p.then(() => {
    startVisualization();
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
  stopVisualization();
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
  }
}

const ORBIT_DOT_SHAPES = {
  'theme-a': [
    { cls: 'p-a-bubble', color: '#FFB6C1', size: 24 },
    { cls: 'p-a-gummy',  color: '#B5EAD7', size: 24 },
  ],
  'theme-b': [
    { cls: 'p-b-svgleaf', color: '#418A45', size: 36 },
    { cls: 'p-b-flower',  color: '#6B9B3E', size: 36 },
  ],
  'theme-c': [
    { cls: 'p-c-Claude', color: '#f4edfe5f', size: 36 },
    { cls: 'p-c-ChatGPT',  color: '#9287ae73', size: 36 },
  ],
};

function refreshOrbitDots() {
  const theme = document.body.getAttribute('data-music-theme') || 'theme-a';
  const shapes = ORBIT_DOT_SHAPES[theme] || ORBIT_DOT_SHAPES['theme-a'];
  const dots = document.querySelectorAll('.orbit-dot');

  dots.forEach((dot, i) => {
    const cfg = shapes[i % shapes.length];
    dot.className = 'orbit-dot';
    dot.classList.add(cfg.cls);
    dot.style.width = cfg.size + 'px';
    dot.style.height = cfg.size + 'px';

    dot.style.opacity = '1';
    dot.style.boxShadow = '0 0 20px var(--glow-color-1), 0 0 40px var(--glow-color-3)';

    if (theme === 'theme-a') {
      dot.style.background = cfg.color;
      dot.style.color = '';
    } else {
      dot.style.background = '';
      dot.style.color = cfg.color;
    }
  });
}

function switchMusicTheme(targetTheme) {
  const body = document.body;
  const currentTheme = body.getAttribute('data-music-theme');
  if (currentTheme === targetTheme) return;

  body.setAttribute('data-music-theme', targetTheme);
  if (window.particleController) window.particleController.refresh();
  refreshOrbitDots();
}

function loadTrack(idx) {
  const t = playlist[idx];
  heroMusicName.textContent = t.name;
  heroMusicArtist.textContent = t.artist;

  if (t.cover.startsWith('http')) {
    heroMusicCover.innerHTML = `<img src="${t.cover}" alt="${t.name}">`;
  } else {
    heroMusicCover.textContent = t.cover;
  }

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

  if (t.theme) switchMusicTheme(t.theme);
}

// click disc -> expand/collapse
heroMusicCover.addEventListener('click', (e) => {
  e.stopPropagation();
  if (heroMusic.classList.contains('open')) {
    collapseMusicCard();
  } else {
    expandMusicCard();
  }
});

// click blank area -> collapse
heroMusic.addEventListener('click', (e) => {
  if (e.target === heroMusicCover || heroMusicCover.contains(e.target)) return;
  if (heroMusic.classList.contains('open')) {
    collapseMusicCard();
  }
});

function expandMusicCard() {
  heroMusic.classList.add('open');
}

function collapseMusicCard() {
  heroMusic.classList.remove('open');
}

function togglePlay() {
  isPlaying = !isPlaying;
  heroMusicPlay.innerHTML = isPlaying ? pauseIcon : playIcon;
  heroMusic.classList.toggle('playing', isPlaying);

  if (isPlaying) {
    heroMusicCover.style.animationPlayState = 'running';
    startPlayback();
  } else {
    heroMusicCover.style.animationPlayState = 'paused';
    if (audioElement) audioElement.pause();
    stopVisualization();
  }
}

function nextTrack() {
  stopPlayback();
  isPlaying = false;
  heroMusicPlay.innerHTML = playIcon;
  heroMusic.classList.remove('playing');
  currentTrack = (currentTrack + 1) % playlist.length;
  loadTrack(currentTrack);
  isPlaying = true;
  heroMusicPlay.innerHTML = pauseIcon;
  heroMusicCover.style.animationPlayState = 'running';
  heroMusic.classList.add('playing');
  startPlayback();
}

function prevTrack() {
  stopPlayback();
  isPlaying = false;
  heroMusicPlay.innerHTML = playIcon;
  heroMusic.classList.remove('playing');
  currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
  loadTrack(currentTrack);
  isPlaying = true;
  heroMusicPlay.innerHTML = pauseIcon;
  heroMusicCover.style.animationPlayState = 'running';
  heroMusic.classList.add('playing');
  startPlayback();
}

loadTrack(0);
expandMusicCard();

// control buttons
heroMusicPlay.addEventListener('click', (e) => {
  e.stopPropagation();
  togglePlay();
});
heroMusicNext.addEventListener('click', (e) => {
  e.stopPropagation();
  nextTrack();
});
heroMusicPrev.addEventListener('click', (e) => {
  e.stopPropagation();
  prevTrack();
});

// ========== 曲库弹窗 ==========
const playlistOverlay = document.getElementById('playlistOverlay');
const playlistClose = document.getElementById('playlistClose');
const playlistList = document.getElementById('playlistList');

function openPlaylist() {
  playlistOverlay.classList.add('active');
  renderPlaylist(playlist);
}

function closePlaylist() {
  playlistOverlay.classList.remove('active');
}

function renderPlaylist(data) {
  playlistList.innerHTML = '';
  if (data.length === 0) {
    playlistList.innerHTML = '<div class="playlist-empty">未找到匹配的歌曲 😢</div>';
    return;
  }
  data.forEach((track) => {
    const realIdx = playlist.indexOf(track);
    const item = document.createElement('div');
    item.className = 'playlist-item' + (realIdx === currentTrack ? ' active' : '');
    item.dataset.theme = track.theme || 'theme-a';
    const coverHtml = track.cover.startsWith('http')
      ? `<img src="${track.cover}" alt="${track.name}">`
      : track.cover;
    item.innerHTML = `
      <div class="playlist-item-cover">${coverHtml}</div>
      <div class="playlist-item-info">
        <span class="playlist-item-name">${track.name}</span>
        <span class="playlist-item-artist">${track.artist}</span>
      </div>
    `;
    item.addEventListener('click', () => selectSong(realIdx));
    playlistList.appendChild(item);
  });
}

function selectSong(idx) {
  if (idx === currentTrack) {
    closePlaylist();
    return;
  }
  stopPlayback();
  isPlaying = false;
  heroMusicPlay.innerHTML = playIcon;
  heroMusic.classList.remove('playing');
  currentTrack = idx;
  loadTrack(currentTrack);
  isPlaying = true;
  heroMusicPlay.innerHTML = pauseIcon;
  heroMusicCover.style.animationPlayState = 'running';
  heroMusic.classList.add('playing');
  startPlayback();
  closePlaylist();
}

heroMusicName.addEventListener('click', (e) => {
  e.stopPropagation();
  if (heroMusic.classList.contains('open')) {
    openPlaylist();
  }
});

playlistClose.addEventListener('click', closePlaylist);
playlistOverlay.addEventListener('click', (e) => {
  if (e.target === playlistOverlay) closePlaylist();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && playlistOverlay.classList.contains('active')) {
    closePlaylist();
  }
});

// 3D 倾斜卡片效果
const tiltCards = document.querySelectorAll('.skill-item, .about-card');
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
  opacity: { min: 0.18, max: 0.40 },
  rotation: { min: 360, max: 1080 },
};

const THEME_SHAPES = {
  'theme-a': ['p-a-bubble', 'p-a-gummy', 'p-a-cloud'],
  'theme-b': ['p-b-svgleaf', 'p-b-greenleaf', 'p-b-plant', 'p-b-flower', 'p-b-dew', 'p-b-cloud', 'p-b-grass', 'p-b-sun', 'p-b-twitter', 'p-b-love', 'p-b-music', 'p-b-bee', 'p-b-bush', 'p-b-clover'],
  'theme-c': ['p-c-Github', 'p-c-cplusplus', 'p-c-code1', 'p-c-code2', 'p-c-AE', 'p-c-ChatGPT', 'p-c-Linux', 'p-c-Claude', 'p-c-Python', 'p-c-Cli', 'p-c-VScode', 'p-c-Java', 'p-c-Grok', 'p-c-BTC', 'p-c-Dollar', 'p-c-Telegram', 'p-c-chrome'],
};

const THEME_COLORS = {
  'theme-a': ['#FFB6C1', '#B5EAD7', '#D4B5E2', '#FFDAB9', '#B5D8EB', '#FFF8E1', '#FFE4E9', '#E8A0B5', '#FFE4B5', '#B0E0E6', '#E8F8F0', '#F3EBF8'],
  'theme-b': ['#418A45', '#6B9B3E', '#8FBC8F', '#D4A574', '#A8C686', '#F0F5EB', '#E8F5E2', '#357239', '#4CAF50', '#EDF3E8', '#F5FAF2'],
  'theme-c': ['#f4edfe5f', '#9287ae73'],
};

function rand(min, max) { return Math.random() * (max - min) + min; }
function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function darkenHex(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max((num >> 16) - amt, 0);
  const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
  const B = Math.max((num & 0x0000FF) - amt, 0);
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

class Particle {
  constructor(el) {
    this.el = el;
    this.baseSwayX = 0;
    this.currentSwayX = 0;
    this.targetSwayX = 0;
    this.baseOpacity = 0.35;
  }

  setStyle(cfg, theme) {
    const size = randInt(cfg.size.min, cfg.size.max);
    const rawColor = pick(THEME_COLORS[theme]);
    const color = (theme === 'theme-c') ? rawColor : darkenHex(rawColor, 25);
    const left = rand(2, 95);
    const duration = rand(cfg.duration.min, cfg.duration.max);
    const delay = -rand(cfg.delay.min, cfg.delay.max);
    const startY = rand(cfg.startY.min, cfg.startY.max);
    const swayX = rand(cfg.swayX.min, cfg.swayX.max);
    const opacity = rand(cfg.opacity.min, cfg.opacity.max);
    const rotation = rand(cfg.rotation.min, cfg.rotation.max);
    const shape = pick(THEME_SHAPES[theme]);

    this.el.style.width = `${size}px`;
    this.el.style.height = `${size}px`;
    this.el.style.left = `${left}%`;
    this.el.style.animationDuration = `${duration}s`;
    this.el.style.animationDelay = `${delay}s`;
    this.el.style.opacity = opacity;
    this.el.style.setProperty('--start-y', `${startY}vh`);
    this.el.style.setProperty('--sway-x', `${swayX}px`);
    this.el.style.setProperty('--rotation', `${rotation}deg`);
    this.el.style.setProperty('--mid-opacity', `${opacity}`);

    if (theme === 'theme-a') {
      this.el.style.background = color;
      this.el.style.color = '';
    } else {
      this.el.style.background = '';
      this.el.style.color = color;
    }

    this.el.className = `particle ${shape}`;

    this.baseSwayX = swayX;
    this.currentSwayX = swayX;
    this.targetSwayX = swayX;
    this.baseOpacity = opacity;
  }

  update() {
    // 鼠标交互已移除
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
    return document.body.getAttribute('data-music-theme') || 'theme-a';
  }

  init() {
    this.container.innerHTML = '';
    this.particles = [];
    const theme = this.getTheme();

    for (let i = 0; i < PARTICLE_CONFIG.count; i++) {
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

function renderToolsTabBar() {
  const bar = document.getElementById('toolsTabBar');
  if (!bar) return;
  bar.innerHTML = '';
  toolsData.forEach((cat, idx) => {
    const btn = document.createElement('button');
    btn.className = 'tools-tab' + (idx === currentToolsCategory ? ' active' : '');
    btn.textContent = cat.category;
    btn.addEventListener('mouseenter', () => switchToolsCategory(idx));
    bar.appendChild(btn);
  });
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
    `;
    grid.appendChild(a);
  });
}

function switchToolsCategory(idx) {
  if (idx === currentToolsCategory) return;
  currentToolsCategory = idx;
  document.querySelectorAll('.tools-tab').forEach((btn, i) => {
    btn.classList.toggle('active', i === idx);
  });

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
});

// 初始化工具页面
if (document.getElementById('toolsTabBar')) {
  renderToolsTabBar();
  renderToolsGrid();
}

// ===== hero 入场序列 =====
const heroSubtitle = document.getElementById('heroSubtitle');
const subtitleLines = ['全栈开发者 · 热爱设计、音乐与创造', '用代码编织美好的数字体验'];
let entranceTimers = [];

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
  // clear pending
  entranceTimers.forEach(t => clearTimeout(t));
  entranceTimers = [];

  // reset all
  document.querySelectorAll('.enter, .char, .avatar-orbit, .scroll-indicator, .scroll-text').forEach(el => {
    el.classList.remove('visible');
  });

  const addTimer = (fn, delay) => {
    entranceTimers.push(setTimeout(fn, delay));
  };

  // 1. nav slide down + greeting slide down
  const nav = document.querySelector('#navbar');
  if (nav) addTimer(() => nav.classList.add('visible'), 500);
  const greeting = document.querySelector('.hero-greeting');
  if (greeting) addTimer(() => greeting.classList.add('visible'), 300);

  // 2. title bottom-left pop + avatar orbit (sync with loader expand)
  const title = document.querySelector('.hero h1');
  if (title) addTimer(() => title.classList.add('visible'), 400);
  const orbit = document.querySelector('.avatar-orbit');
  if (orbit) addTimer(() => orbit.classList.add('visible'), 400);

  // 3. subtitle blur reveal
  if (heroSubtitle) {
    const chars = heroSubtitle.querySelectorAll('.char');
    chars.forEach((el, i) => {
      addTimer(() => el.classList.add('visible'), 600 + i * 60);
    });
  }

  // 4. music card fade in
  const music = document.querySelector('.hero-music');
  if (music) addTimer(() => music.classList.add('visible'), 1200);

  // 5. quote fade in
  const quote = document.querySelector('.hero-quote');
  if (quote) addTimer(() => quote.classList.add('visible'), 1700);

  // 6. scroll elements (mouse icon first, then text)
  const scrollInd = document.querySelector('.scroll-indicator');
  const scrollTxt = document.querySelector('.scroll-text');
  if (scrollInd) addTimer(() => scrollInd.classList.add('visible'), 2600);
  if (scrollTxt) addTimer(() => scrollTxt.classList.add('visible'), 2600);

  // 7. remove .enter from nav so scroll transition isn't blocked
  addTimer(() => {
    document.querySelector('#navbar')?.classList.remove('enter');
  }, 1200);
}

// 立即构建字幕 DOM 占位
buildHeroChars();

