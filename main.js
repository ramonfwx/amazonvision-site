// Link oficial de mensagem do WhatsApp da clínica (gerado pelo WhatsApp Business).
const WHATSAPP_URL = 'https://api.whatsapp.com/message/W34DGMCIVCPEF1?autoload=1&app_absent=0';

const waLinks = document.querySelectorAll('.js-whatsapp');
if (WHATSAPP_URL) {
  const url = WHATSAPP_URL;
  waLinks.forEach((a) => {
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
  });
  document.querySelectorAll('.js-whatsapp-missing').forEach((el) => el.remove());
}

// Tabela de letras: as linhas desfocadas entram em foco ao passar o cursor, tocar ou focar.
document.querySelectorAll('.chart-line.blur').forEach((line) => {
  line.tabIndex = 0;
  const focus = () => line.classList.add('focused');
  const unfocus = () => line.classList.remove('focused');
  line.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') focus(); });
  line.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') unfocus(); });
  line.addEventListener('pointerup', (e) => { if (e.pointerType !== 'mouse') line.classList.toggle('focused'); });
  line.addEventListener('focus', focus);
  line.addEventListener('blur', unfocus);
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Ícones de serviços: normaliza o comprimento dos traços para a animação de desenho.
document.querySelectorAll('.service svg *').forEach((el) => el.setAttribute('pathLength', '1'));

// Fotos, títulos e ícones entram em foco quando aparecem na tela.
const focusTargets = document.querySelectorAll('[data-focus]');
if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25, rootMargin: '0px 0px -8% 0px' });
  focusTargets.forEach((el) => io.observe(el));
} else {
  focusTargets.forEach((el) => el.classList.add('in-view'));
}

// Olho do logo: a íris acompanha o cursor e pisca de vez em quando.
const iris = document.querySelector('.brand-mark .eye-iris');
const mark = document.querySelector('.brand-mark');
if (iris && mark && !reduceMotion) {
  window.addEventListener('pointermove', (e) => {
    const r = mark.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width * 0.56);
    const dy = e.clientY - (r.top + r.height * 0.54);
    const dist = Math.hypot(dx, dy) || 1;
    const k = Math.min(dist / 300, 1);
    iris.style.setProperty('--ex', `${(dx / dist) * 7 * k}px`);
    iris.style.setProperty('--ey', `${(dy / dist) * 3.5 * k}px`);
  }, { passive: true });

  const blink = () => {
    iris.style.setProperty('--lid', '0.08');
    setTimeout(() => iris.style.setProperty('--lid', '1'), 140);
    setTimeout(blink, 3500 + Math.random() * 4000);
  };
  setTimeout(blink, 2200);
}

// Disco graduado (escala de eixo da armação de provas) em volta da foto.
const dial = document.querySelector('.lens-dial');
if (dial) {
  const NS = 'http://www.w3.org/2000/svg';
  const add = (tag, attrs) => {
    const el = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    dial.appendChild(el);
    return el;
  };
  add('circle', { class: 'rim', cx: 100, cy: 100, r: 98 });
  add('circle', { class: 'rim', cx: 100, cy: 100, r: 82 });
  for (let a = 0; a < 360; a += 5) {
    const rad = (a * Math.PI) / 180;
    const major = a % 15 === 0;
    const r1 = 98, r2 = major ? 91 : 94.5;
    add('line', {
      class: major ? 'tick tick-major' : 'tick',
      x1: 100 + r1 * Math.cos(rad), y1: 100 - r1 * Math.sin(rad),
      x2: 100 + r2 * Math.cos(rad), y2: 100 - r2 * Math.sin(rad),
    });
    if (a % 30 === 0) {
      const t = add('text', { class: 'deg', x: 100 + 86.5 * Math.cos(rad), y: 100 - 86.5 * Math.sin(rad) });
      t.textContent = `${a % 180 === 0 && a ? 180 : a % 180}°`;
    }
  }
}

// Demonstração automática: depois da abertura, as linhas desfocadas entram em foco uma vez
// e voltam a desfocar, para mostrar (principalmente no celular) que dá para focá-las.
if (!reduceMotion) {
  const blurred = [...document.querySelectorAll('.chart-line.blur')];
  setTimeout(() => {
    blurred.forEach((line, i) => {
      setTimeout(() => line.classList.add('demo'), i * 260);
      setTimeout(() => line.classList.remove('demo'), 1100 + i * 260);
    });
  }, 2300);
}

// No celular não há cursor: o olho do logo olha para onde a página está rolando.
if (iris && !reduceMotion && window.matchMedia('(hover: none)').matches) {
  let lastY = window.scrollY;
  let idle;
  window.addEventListener('scroll', () => {
    const dy = window.scrollY - lastY;
    lastY = window.scrollY;
    if (!dy) return;
    iris.style.setProperty('--ey', `${dy > 0 ? 3.5 : -3.5}px`);
    iris.style.setProperty('--ex', `${dy > 0 ? 1.5 : -1.5}px`);
    clearTimeout(idle);
    idle = setTimeout(() => {
      iris.style.setProperty('--ey', '0px');
      iris.style.setProperty('--ex', '0px');
    }, 350);
  }, { passive: true });
}
