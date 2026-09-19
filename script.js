const card = document.getElementById('tiltCard');
const btn = document.getElementById('pulseBtn');
const hero = document.querySelector('.hero');
const stars = document.getElementById('stars');

for (let i = 0; i < 52; i++) {
  const s = document.createElement('span');
  s.className = 'star';
  s.style.left = Math.random() * 100 + '%';
  s.style.animationDuration = (6 + Math.random() * 10) + 's';
  s.style.animationDelay = (-Math.random() * 12) + 's';
  s.style.opacity = (0.25 + Math.random() * 0.65).toFixed(2);
  s.style.transform = `scale(${0.5 + Math.random() * 1.4})`;
  stars.appendChild(s);
}

window.addEventListener('mousemove', (e) => {
  const x = e.clientX / window.innerWidth - 0.5;
  const y = e.clientY / window.innerHeight - 0.5;

  hero.style.transform = `rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;

  const rect = card.getBoundingClientRect();
  const cx = (e.clientX - rect.left) / rect.width - 0.5;
  const cy = (e.clientY - rect.top) / rect.height - 0.5;

  if (
    e.clientX >= rect.left && e.clientX <= rect.right &&
    e.clientY >= rect.top && e.clientY <= rect.bottom
  ) {
    card.style.transform = `rotateX(${-cy * 14}deg) rotateY(${cx * 18}deg) translateZ(18px)`;
  }
});

card.addEventListener('mouseleave', () => {
  card.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';
});

btn.addEventListener('click', () => {
  document.body.classList.remove('pulse');
  void document.body.offsetWidth;
  document.body.classList.add('pulse');
});
