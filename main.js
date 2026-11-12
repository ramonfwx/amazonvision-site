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

// Tabela de letras: as linhas desfocadas entram em foco ao passar o cursor, tocar ou focar
// pelo teclado, e continuam nítidas. Ao abrir o site de novo, começam desfocadas outra vez.
document.querySelectorAll('.chart-line.blur').forEach((line) => {
  line.tabIndex = 0;
  const focus = () => line.classList.add('focused');
  line.addEventListener('pointerenter', focus);
  line.addEventListener('pointerup', focus);
  line.addEventListener('focus', focus);
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
const eyeScale = Number(mark?.dataset.eyeScale || 1);
if (iris && mark && !reduceMotion) {
  window.addEventListener('pointermove', (e) => {
    const r = mark.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width * 0.56);
    const dy = e.clientY - (r.top + r.height * 0.54);
    const dist = Math.hypot(dx, dy) || 1;
    const k = Math.min(dist / 300, 1);
    iris.style.setProperty('--ex', `${(dx / dist) * 7 * k * eyeScale}px`);
    iris.style.setProperty('--ey', `${(dy / dist) * 3.5 * k * eyeScale}px`);
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

// Celular (sem mouse): depois da abertura, as linhas desfocadas entram em foco sozinhas,
// devagar, uma de cada vez, e ficam nítidas.
// Computador: uma demonstração rápida mostra que dá para focar passando o mouse.
{
  const blurred = [...document.querySelectorAll('.chart-line.blur')];
  const isTouch = window.matchMedia('(hover: none)').matches;
  if (isTouch) {
    blurred.forEach((line, i) => {
      if (reduceMotion) { line.classList.add('focused'); return; }
      line.classList.add('slow');
      setTimeout(() => line.classList.add('focused'), 2000 + i * 900);
    });
  } else if (!reduceMotion) {
    setTimeout(() => {
      blurred.forEach((line, i) => {
        setTimeout(() => line.classList.add('demo'), i * 260);
        setTimeout(() => line.classList.remove('demo'), 1100 + i * 260);
      });
    }, 2300);
  }
}

// No celular não há cursor: o olho do logo olha para onde a página está rolando.
if (iris && !reduceMotion && window.matchMedia('(hover: none)').matches) {
  let lastY = window.scrollY;
  let idle;
  window.addEventListener('scroll', () => {
    const dy = window.scrollY - lastY;
    lastY = window.scrollY;
    if (!dy) return;
    iris.style.setProperty('--ey', `${(dy > 0 ? 3.5 : -3.5) * eyeScale}px`);
    iris.style.setProperty('--ex', `${(dy > 0 ? 1.5 : -1.5) * eyeScale}px`);
    clearTimeout(idle);
    idle = setTimeout(() => {
      iris.style.setProperty('--ey', '0px');
      iris.style.setProperty('--ex', '0px');
    }, 350);
  }, { passive: true });
}

// O botão flutuante do WhatsApp sai de cena enquanto a seção de contato está na tela.
const waFloat = document.querySelector('.wa-float');
const visit = document.querySelector('#visite');
if (waFloat && visit && 'IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => {
    waFloat.classList.toggle('is-hidden', entry.isIntersecting);
  }, { threshold: 0.2 }).observe(visit);
}

// Ano atual no aviso de direitos reservados.
document.querySelectorAll('.js-year').forEach((el) => { el.textContent = new Date().getFullYear(); });

// "Melhor o 1 ou o 2?": a cada ciclo, as lentes mostram um novo par de letras da tabela de exame.
{
  const letters = [...document.querySelectorAll('.ph-l')];
  const firstLens = document.querySelector('.ph-1 b');
  if (letters.length && firstLens && !reduceMotion) {
    const pool = 'CDEFHKLNOPRTUVZ'.split('');
    let last = 'E F';
    const nextPair = () => {
      let pair;
      do {
        const a = pool[Math.floor(Math.random() * pool.length)];
        let b;
        do { b = pool[Math.floor(Math.random() * pool.length)]; } while (b === a);
        pair = `${a} ${b}`;
      } while (pair === last);
      last = pair;
      return pair;
    };
    firstLens.addEventListener('animationiteration', () => {
      const pair = nextPair();
      letters.forEach((el) => el.classList.add('is-swapping'));
      setTimeout(() => {
        letters.forEach((el) => { el.textContent = pair; el.classList.remove('is-swapping'); });
      }, 250);
    });
  }
}
