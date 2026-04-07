const robo = document.getElementById('robo');
const bubble = document.getElementById('robo-bubble');

if (robo && bubble) {
  const msgs = [
    '\u00a1Hola! Soy Ker, tu asistente de automatizaci\u00f3n \ud83e\udd16',
    '\u00bfListo para automatizar tu empresa?',
    'Kervex puede ahorrarle 3h diarias a tu equipo',
    'Tenemos un diagn\u00f3stico GRATIS para ti \ud83c\udf81',
    '\u00bfVes el simulador? Pru\u00e9balo ahora \u2192',
    'Lima tiene miles de empresas sin automatizar...',
    'Tu competencia ya est\u00e1 automatizando \u26a1'
  ];

  let ri = 0;
  let rshow = false;

  setInterval(() => {
    bubble.textContent = msgs[ri % msgs.length];
    ri++;
    robo.classList.add('show-bubble');
    rshow = true;
    setTimeout(() => {
      robo.classList.remove('show-bubble');
      rshow = false;
    }, 3500);
  }, 7000);

  robo.addEventListener('click', () => {
    if (!rshow) {
      bubble.textContent = msgs[ri % msgs.length];
      ri++;
      robo.classList.add('show-bubble');
      setTimeout(() => robo.classList.remove('show-bubble'), 3000);
    }
  });
}
