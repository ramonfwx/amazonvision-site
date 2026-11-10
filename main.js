// Número de WhatsApp da clínica, só dígitos com DDI e DDD. Ex.: '5593999999999'
const WHATSAPP = '559391808800';
const WHATSAPP_MSG = 'Olá! Vim pelo site e gostaria de agendar uma consulta na Amazon Vision.';

const waLinks = document.querySelectorAll('.js-whatsapp');
if (WHATSAPP) {
  const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(WHATSAPP_MSG)}`;
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
