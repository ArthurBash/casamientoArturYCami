// Fecha y hora de la ceremonia (hora de Argentina, UTC-3)
const FECHA_BODA = new Date('2026-11-14T12:00:00-03:00').getTime();

// ---------- Cuenta regresiva ----------
const countdown = document.getElementById('countdown');
const countdownDone = document.getElementById('countdown-done');
const units = {};
countdown.querySelectorAll('[data-unit]').forEach((el) => {
  units[el.dataset.unit] = { num: el, label: el.nextElementSibling };
});

const pad = (n) => String(n).padStart(2, '0');

function setUnit(name, value, padded) {
  const { num, label } = units[name];
  num.textContent = padded ? pad(value) : value;
  label.textContent = value === 1 ? label.dataset.one : label.dataset.many;
}

let timer = null;

function tick() {
  const diff = FECHA_BODA - Date.now();
  if (diff <= 0) {
    countdown.hidden = true;
    countdownDone.hidden = false;
    clearInterval(timer);
    return false;
  }
  const s = Math.floor(diff / 1000);
  setUnit('days', Math.floor(s / 86400), false);
  setUnit('hours', Math.floor((s % 86400) / 3600), true);
  setUnit('minutes', Math.floor((s % 3600) / 60), true);
  setUnit('seconds', s % 60, true);
  return true;
}

if (tick()) timer = setInterval(tick, 1000);

// ---------- Aparición suave al hacer scroll ----------
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach((el) => observer.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('is-visible'));
}

// ---------- Copiar alias ----------
function copyFallback(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  ta.remove();
}

document.querySelectorAll('[data-copy]').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const text = btn.dataset.copy;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      copyFallback(text);
    }
    btn.classList.add('is-copied');
    clearTimeout(btn.copyTimer);
    btn.copyTimer = setTimeout(() => btn.classList.remove('is-copied'), 1800);
  });
});
