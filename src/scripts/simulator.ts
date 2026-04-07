interface FlowStep {
  t: string;
  s: string;
  done?: boolean;
  act?: boolean;
  wait?: boolean;
}

interface Flow {
  label: string;
  metric: { label: string; val: string; sub: string };
  bar: { label: string; pct: number };
  err: number;
  steps: FlowStep[];
  logs: string[];
}

const FLOWS: Record<number, Flow> = {
  0: {
    label: 'WhatsApp 24/7',
    metric: { label: 'Tiempo ahorrado', val: '3h', sub: 'por día vs atención manual' },
    bar: { label: 'Eficiencia del flujo', pct: 94 },
    err: 97,
    steps: [
      { t: 'Mensaje recibido en WhatsApp', s: 'API Business detecta entrada', done: true },
      { t: 'IA clasifica la intención', s: 'NLP · 98% de precisión', done: true },
      { t: 'Consulta base de datos', s: 'Stock, precios, disponibilidad', act: true },
      { t: 'Genera respuesta personalizada', s: 'Texto + imagen + CTA', wait: true },
      { t: 'Envía al cliente en &lt;5s', s: 'Entrega confirmada', wait: true },
      { t: 'Registra lead en CRM', s: 'Nombre, interés, timestamp', wait: true }
    ],
    logs: ['[00:00.001] WhatsApp API → mensaje recibido', '[00:00.024] NLP → intención: consulta de precio', '[00:00.156] ERP → consultando inventario...', '[00:00.892] Generando respuesta personalizada...', '[00:01.204] → mensaje enviado al cliente', '[00:01.250] CRM → lead registrado · status: caliente']
  },
  1: {
    label: 'Facturación SUNAT',
    metric: { label: 'Facturas por hora', val: '∞', sub: 'vs 4 manuales por hora' },
    bar: { label: 'Velocidad del proceso', pct: 98 },
    err: 99,
    steps: [
      { t: 'Venta registrada en sistema', s: 'Monto, producto, cliente', done: true },
      { t: 'Datos validados automáticamente', s: 'RUC, dirección, moneda', done: true },
      { t: 'Conexión con API SUNAT', s: 'Certificado digital activo', act: true },
      { t: 'Factura electrónica generada', s: 'XML firmado y enviado', wait: true },
      { t: 'Cliente recibe por email/WhatsApp', s: 'PDF + XML adjuntos', wait: true },
      { t: 'Contabilidad actualizada', s: 'Asiento automático en ERP', wait: true }
    ],
    logs: ['[00:00.001] Venta #4521 → iniciando facturación', '[00:00.045] Validando datos del cliente...', '[00:00.312] SUNAT API → conectado', '[00:01.105] Factura E001-4521 → generada', '[00:01.380] Email + WhatsApp → enviados', '[00:01.402] Contabilidad → asiento #8847 creado']
  },
  2: {
    label: 'Reportes automáticos',
    metric: { label: 'Horas ahorradas', val: '5h', sub: 'por semana en reportes' },
    bar: { label: 'Cobertura de datos', pct: 100 },
    err: 100,
    steps: [
      { t: 'Datos capturados en tiempo real', s: 'Ventas, inventario, cobranzas', done: true },
      { t: 'Motor de análisis procesa', s: 'Algoritmos de BI activos', done: true },
      { t: 'Dashboard actualizado', s: 'Gráficos y KPIs en vivo', act: true },
      { t: 'Anomalías detectadas', s: 'Desviaciones > 15% alertadas', wait: true },
      { t: 'Reporte semanal generado', s: 'PDF ejecutivo automático', wait: true },
      { t: 'Enviado al gerente', s: 'Email + WhatsApp + Slack', wait: true }
    ],
    logs: ['[00:00.001] Recolectando datos de 8 fuentes...', '[00:00.234] 1,847 registros procesados', '[00:00.891] Dashboard → actualizado', '[00:01.002] Anomalía detectada: stock bajo en SKU-442', '[00:01.234] Reporte ejecutivo → generado', '[00:01.456] Gerencia → notificada por 3 canales']
  },
  3: {
    label: 'Cobranzas automáticas',
    metric: { label: 'Mejora en cobro', val: '80%', sub: 'más recuperación de deuda' },
    bar: { label: 'Tasa de recuperación', pct: 80 },
    err: 85,
    steps: [
      { t: 'Facturas por vencer detectadas', s: '3 días antes del límite', done: true },
      { t: 'Recordatorio amigable enviado', s: 'WhatsApp + email personalizado', done: true },
      { t: 'Seguimiento el día de vencer', s: 'Segundo recordatorio + link de pago', act: true },
      { t: 'Sin respuesta → escalado', s: 'Alerta al equipo comercial', wait: true },
      { t: 'Gestión de morosidad', s: 'Protocolo automático activo', wait: true },
      { t: 'Reporte de cartera generado', s: 'Estado de cada cuenta', wait: true }
    ],
    logs: ['[00:00.001] Escaneando 247 facturas pendientes...', '[00:00.156] 12 facturas vencen en 3 días', '[00:00.380] Recordatorios enviados por WhatsApp', '[00:01.002] 8 facturas vencen hoy → alerta activa', '[00:01.234] Equipo comercial → notificado', '[00:01.456] Reporte de cartera → enviado al gerente']
  }
};

let curSim = 0;
let simInterval: ReturnType<typeof setInterval> | null = null;
let curStep = 0;

function advanceFlow(idx: number) {
  const f = FLOWS[idx];
  if (curStep >= f.steps.length - 1) { curStep = 0; return; }
  curStep++;
  const nodes = document.querySelectorAll('.fb-node');
  const lines = document.querySelectorAll('.fb-line');
  const badges = document.querySelectorAll('.fb-badge');
  const titles = document.querySelectorAll('.fb-title');
  const contents = document.querySelectorAll('.fb-content');
  nodes.forEach((n, i) => { n.className = 'fb-node'; if (i < curStep) n.classList.add('done'); else if (i === curStep) n.classList.add('act'); });
  lines.forEach((l, i) => { l.className = 'fb-line'; if (i < curStep) l.classList.add('done'); });
  badges.forEach((b, i) => { b.className = 'fb-badge'; if (i < curStep) { b.classList.add('done'); b.textContent = '\u2713 listo'; } else if (i === curStep) { b.classList.add('act'); b.textContent = 'activo'; } else { b.classList.add('wait'); b.textContent = 'espera'; } });
  titles.forEach((t, i) => { t.className = 'fb-title'; if (i <= curStep) t.classList.add('on'); });
  contents.forEach((c, i) => { c.className = 'fb-content'; if (i < curStep) c.classList.add('done'); else if (i === curStep) c.classList.add('act'); });
}

function renderFlow(idx: number) {
  const f = FLOWS[idx];
  const c = document.getElementById('flowContainer');
  if (!c) return;
  let html = '<div class="flow-builder">';
  f.steps.forEach((s, i) => {
    const isLast = i === f.steps.length - 1;
    const cls = s.done ? 'done' : s.act ? 'act' : '';
    html += `<div class="fb-step">
      <div class="fb-left">
        <div class="fb-node ${cls}"></div>
        ${!isLast ? `<div class="fb-line ${s.done ? 'done' : ''}"></div>` : ''}
      </div>
      <div class="fb-content ${cls}">
        <div class="fb-row">
          <div>
            <div class="fb-title ${cls ? 'on' : ''}">${s.t}</div>
            <div class="fb-sub">${s.s}</div>
          </div>
          <div class="fb-badge ${s.done ? 'done' : s.act ? 'act' : 'wait'}">${s.done ? '\u2713 listo' : s.act ? 'activo' : 'espera'}</div>
        </div>
      </div>
    </div>`;
  });
  html += '</div>';
  c.innerHTML = html;

  const metLabel = document.getElementById('metLabel');
  const metVal = document.getElementById('metVal');
  const metSub = document.getElementById('metSub');
  const barLabel = document.getElementById('barLabel');
  const barPct = document.getElementById('barPct');
  const errPct = document.getElementById('errPct');
  const barFill = document.getElementById('barFill') as HTMLElement | null;
  const errFill = document.getElementById('errFill') as HTMLElement | null;
  const simLog = document.getElementById('simLog');

  if (metLabel) metLabel.textContent = f.metric.label;
  if (metVal) metVal.textContent = f.metric.val;
  if (metSub) metSub.textContent = f.metric.sub;
  if (barLabel) barLabel.textContent = f.bar.label;
  if (barPct) barPct.textContent = '0%';
  if (errPct) errPct.textContent = '0%';
  if (barFill) barFill.style.width = '0%';
  if (errFill) errFill.style.width = '0%';
  if (simLog) simLog.innerHTML = '<span class="log-line act">// Iniciando módulo ' + f.label + '...</span>';

  setTimeout(() => {
    if (barFill) barFill.style.width = f.bar.pct + '%';
    if (barPct) barPct.textContent = f.bar.pct + '%';
    if (errFill) errFill.style.width = f.err + '%';
    if (errPct) errPct.textContent = f.err + '%';
  }, 300);

  curStep = 0;
  if (simInterval) clearInterval(simInterval);
  let li = 0;
  simInterval = setInterval(() => {
    if (li < f.logs.length) {
      const log = document.getElementById('simLog');
      const cls = li === f.logs.length - 1 ? 'ok' : li > 2 ? 'act' : 'log-line';
      if (log) log.innerHTML += '<span class="log-line ' + cls + '">' + f.logs[li] + '</span>';
      li++;
    }
    advanceFlow(idx);
  }, 800);
}

const simTabs = document.getElementById('simTabs');
if (simTabs) {
  simTabs.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('.sim-tab') as HTMLElement | null;
    if (!b) return;
    document.querySelectorAll('.sim-tab').forEach(t => t.classList.remove('on'));
    b.classList.add('on');
    curSim = parseInt(b.dataset.s || '0');
    renderFlow(curSim);
  });
}

renderFlow(0);
