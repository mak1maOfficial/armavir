/* ============================================================
   AG — Armavir Rules
   Логика: навигация, скролл, звук GTA5RP-тулево только по кнопкам,
   Discord в новой вкладке, тосты, hover-glow курсора, параллакс.
   ============================================================ */

/* ---------- 1. НАВИГАЦИЯ ---------- */
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');

function switchPage(pageName, pushHash = true) {
  const target = document.getElementById('page-' + pageName);
  if (!target) return;

  pages.forEach(p => p.classList.remove('is-active'));
  navLinks.forEach(l => l.classList.remove('is-active'));
  target.classList.add('is-active');

  const activeLink = document.querySelector(`.nav-link[data-page="${pageName}"]`);
  if (activeLink) activeLink.classList.add('is-active');

  if (pushHash && location.hash !== '#' + pageName) {
    history.replaceState(null, '', '#' + pageName);
  }

  target.style.animation = 'none';
  void target.offsetWidth;
  target.style.animation = '';

  playSound('switch');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* Клик по навигации в шапке */
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const pageName = link.dataset.page;
    if (pageName) switchPage(pageName);
  });
});

/* Клик по любым кнопкам с data-page (кроме nav-link) */
document.querySelectorAll('[data-page]').forEach(el => {
  if (el.classList.contains('nav-link')) return;
  el.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    switchPage(el.dataset.page);
  });
});

/* Загрузка и кнопка "назад" */
window.addEventListener('load', () => {
  const hash = location.hash.replace('#', '');
  if (hash && document.getElementById('page-' + hash)) switchPage(hash, false);
});
window.addEventListener('hashchange', () => {
  const hash = location.hash.replace('#', '');
  if (hash && document.getElementById('page-' + hash)) switchPage(hash, false);
});

/* ---------- 2. СКРОЛЛ К ПРАВИЛАМ ---------- */
document.querySelectorAll('[data-scroll]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const target = document.getElementById(btn.dataset.scroll);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      playSound('click');
    }
  });
});

/* ---------- 3. DISCORD — открывается в новой вкладке ---------- */
const discordBtn = document.getElementById('discordBtn');
if (discordBtn) {
  discordBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playSound('click');
    /* обычное поведение <a target="_blank"> оставляем — браузер сам откроет новую вкладку */
  });
}

/* ---------- 4. TOAST ---------- */
const toast = document.getElementById('toast');
let toastTimer = null;
function showToast(message, duration = 2600) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), duration);
}

/* ---------- 5. КОПИРОВАТЬ ФРАЗУ ---------- */
const copyPhraseBtn = document.getElementById('copyPhraseBtn');
if (copyPhraseBtn) {
  copyPhraseBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    const phrase = 'Здравствуйте! У меня вопрос по правилам AG (Armavir). Ситуация: ';
    try {
      await navigator.clipboard.writeText(phrase);
      showToast('Фраза скопирована в буфер обмена');
      playSound('success');
    } catch (err) {
      const ta = document.createElement('textarea');
      ta.value = phrase;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('Фраза скопирована');
      playSound('success');
    }
  });
}

/* ---------- 6. ОТПРАВИТЬ ЗАЯВКУ ---------- */
const applyBtn = document.getElementById('applyBtn');
if (applyBtn) {
  applyBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showToast('Заявка отправлена! Ожидай ответа в Discord.');
    playSound('success');
  });
}

/* ---------- 7. НАВЕРХ ---------- */
const toTopBtn = document.getElementById('toTopBtn');
if (toTopBtn) {
  toTopBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    playSound('click');
  });
}

/* ---------- 8. ЛИПКИЙ HEADER ---------- */
const topbar = document.getElementById('topbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) topbar.classList.add('is-scrolled');
  else topbar.classList.remove('is-scrolled');
}, { passive: true });

/* ---------- 9. ФОНОВЫЕ СЛОВА "AG" ---------- */
const bgWords = document.getElementById('bgWords');
if (bgWords) {
  for (let i = 0; i < 30; i++) {
    const span = document.createElement('span');
    span.textContent = 'AG';
    span.style.left = Math.random() * 100 + '%';
    span.style.top = Math.random() * 100 + '%';
    span.style.fontSize = (20 + Math.random() * 70) + 'px';
    span.style.opacity = (0.03 + Math.random() * 0.06).toFixed(3);
    span.style.transform = `rotate(${(Math.random() * 40 - 20).toFixed(1)}deg)`;
    bgWords.appendChild(span);
  }
}

/* ---------- 10. ЗВУК — GTA 5 RP "тулево" / лопание ---------- */
let audioCtx = null;
let soundEnabled = true;

function initAudio() {
  if (audioCtx) return;
  try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
  catch (e) { audioCtx = null; }
}

/* Приятный "поп" — лёгкий низкий удар + мягкий щелчок */
function playPop() {
  if (!soundEnabled || !audioCtx) return;
  const now = audioCtx.currentTime;

  // Низкий "бум"
  const boom = audioCtx.createOscillator();
  const boomGain = audioCtx.createGain();
  boom.type = 'sine';
  boom.frequency.setValueAtTime(180, now);
  boom.frequency.exponentialRampToValueAtTime(60, now + 0.12);
  boomGain.gain.setValueAtTime(0.0001, now);
  boomGain.gain.exponentialRampToValueAtTime(0.18, now + 0.008);
  boomGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
  boom.connect(boomGain).connect(audioCtx.destination);
  boom.start(now);
  boom.stop(now + 0.18);

  // Мягкий щелчок сверху
  const click = audioCtx.createOscillator();
  const clickGain = audioCtx.createGain();
  click.type = 'triangle';
  click.frequency.setValueAtTime(1200, now);
  click.frequency.exponentialRampToValueAtTime(500, now + 0.05);
  clickGain.gain.setValueAtTime(0.0001, now);
  clickGain.gain.exponentialRampToValueAtTime(0.06, now + 0.005);
  clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
  click.connect(clickGain).connect(audioCtx.destination);
  click.start(now);
  click.stop(now + 0.08);
}

/* Тёплый "переход" — для смены страницы */
function playSwitch() {
  if (!soundEnabled || !audioCtx) return;
  const now = audioCtx.currentTime;

  const o1 = audioCtx.createOscillator();
  const g1 = audioCtx.createGain();
  o1.type = 'sine';
  o1.frequency.setValueAtTime(320, now);
  o1.frequency.exponentialRampToValueAtTime(720, now + 0.18);
  g1.gain.setValueAtTime(0.0001, now);
  g1.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
  g1.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);
  o1.connect(g1).connect(audioCtx.destination);
  o1.start(now);
  o1.stop(now + 0.28);

  const o2 = audioCtx.createOscillator();
  const g2 = audioCtx.createGain();
  o2.type = 'sine';
  o2.frequency.setValueAtTime(160, now);
  o2.frequency.exponentialRampToValueAtTime(360, now + 0.22);
  g2.gain.setValueAtTime(0.0001, now);
  g2.gain.exponentialRampToValueAtTime(0.06, now + 0.02);
  g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
  o2.connect(g2).connect(audioCtx.destination);
  o2.start(now);
  o2.stop(now + 0.32);
}

/* Приятный "успех" — два тона */
function playSuccess() {
  if (!soundEnabled || !audioCtx) return;
  const now = audioCtx.currentTime;

  const notes = [660, 990];
  notes.forEach((freq, i) => {
    const t = now + i * 0.09;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.07, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    o.connect(g).connect(audioCtx.destination);
    o.start(t);
    o.stop(t + 0.24);
  });
}

/* Универсальная функция — вызывается только из обработчиков кнопок */
function playSound(type) {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  if (type === 'click')      playPop();
  else if (type === 'switch') playSwitch();
  else if (type === 'success') playSuccess();
}

/* Кнопка SOUND ON / OFF */
const soundBtn = document.getElementById('soundBtn');
if (soundBtn) {
  soundBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    soundEnabled = !soundEnabled;
    soundBtn.classList.toggle('is-off', !soundEnabled);
    soundBtn.querySelector('.sound-text').textContent = soundEnabled ? 'SOUND ON' : 'SOUND OFF';
    if (soundEnabled) playSound('click');
    showToast(soundEnabled ? 'Звук включён' : 'Звук выключен');
  });
}

/* Разблокировка аудио — только при первом клике */
function unlockAudioOnFirstGesture() {
  initAudio();
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  document.removeEventListener('pointerdown', unlockAudioOnFirstGesture);
}
document.addEventListener('pointerdown', unlockAudioOnFirstGesture, { passive: true });

/* ---------- 11. HOVER-GLOW ПОД КУРСОРОМ ---------- */
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let glowX = mouseX;
let glowY = mouseY;

if (cursorGlow) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    document.body.classList.add('has-cursor');
  });
  document.addEventListener('mouseleave', () => {
    document.body.classList.remove('has-cursor');
  });
  function animateGlow() {
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
}

/* ---------- 12. ПАРАЛЛАКС КУБА ---------- */
const cubeScene = document.querySelector('.cube-scene');
const cube = document.querySelector('.cube');
if (cubeScene && cube) {
  cubeScene.addEventListener('mousemove', (e) => {
    const rect = cubeScene.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cube.style.animation = 'none';
    cube.style.transform = `rotateX(${-18 + y * 22}deg) rotateY(${x * 45}deg)`;
  });
  cubeScene.addEventListener('mouseleave', () => {
    cube.style.transform = '';
    cube.style.animation = '';
  });
}

/* ---------- 13. ПОЯВЛЕНИЕ КАРТОЧЕК ПРИ СКРОЛЛЕ ---------- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.rule, .punish-card, .admin-card').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(26px)';
  el.style.transition =
    `opacity .55s ease ${i * 0.04}s, transform .55s ease ${i * 0.04}s, border-color .3s ease, box-shadow .3s ease, background .3s ease`;
  observer.observe(el);
});

/* ---------- 14. БЛОКИРУЕМ КЛИКИ ПО ФОНУ ---------- */
/* Клик по пустому месту — тишина, страница не перезагружается,
   hash не меняется, звук не играет. */
document.addEventListener('click', (e) => {
  const interactive = e.target.closest(
    '.btn, .nav-link, a, button, [data-page], [data-scroll], .rule, .punish-card, .admin-card, .server-card, .float-tag'
  );
  if (!interactive) {
    e.preventDefault();
    e.stopPropagation();
    /* ничего не делаем — просто игнорируем */
  }
}, true);

/* ---------- 15. КОНСОЛЬ ---------- */
console.log('%cAG COMMUNITY', 'color:#2ecc71;font-size:22px;font-weight:900;font-family:Oswald,sans-serif;');
console.log('%cArmavir Rules v1.1 — звук GTA5RP, Discord в новой вкладке, клик по фону игнорируется.', 'color:#8affb0;font-size:12px;');