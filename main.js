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
