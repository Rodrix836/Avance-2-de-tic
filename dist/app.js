'use strict';

// Caso académico. Las intensidades y relaciones causales son hipótesis de análisis.
const forces = {
  rivalidad: {
    number: '01', title: 'Rivalidad competitiva', level: 'Alta',
    description: 'Las plataformas de IA compiten por resolver mejor las mismas tareas, ganar usuarios y convertirse en parte de su trabajo diario.',
    drivers: ['Servicios con funciones similares facilitan la comparación.', 'Mejorar calidad, velocidad e integración exige inversión continua.', 'Competir solo por precio puede reducir el margen para reinvertir.'],
    impact: 'Diferenciarse por utilidad y fiabilidad puede sostener el valor del servicio frente a la presión de precios.',
    loop: 'b2', connection: 'B2 · Presión sobre los márgenes'
  },
  entrantes: {
    number: '02', title: 'Nuevos entrantes', level: 'Media-alta',
    description: 'La amenaza depende de qué se quiera construir: lanzar una aplicación sobre una API requiere menos recursos que entrenar un modelo de frontera.',
    drivers: ['Las APIs y los modelos abiertos facilitan nuevos servicios.', 'El entrenamiento de frontera exige mucho capital y cómputo.', 'La confianza, la distribución y la integración dificultan escalar.'],
    impact: 'La entrada puede intensificar la competencia en aplicaciones, aunque persistan barreras elevadas en la infraestructura y los modelos.',
    loop: 'b2', connection: 'B2 · Atractivo y nueva oferta'
  },
  proveedores: {
    number: '03', title: 'Poder de los proveedores', level: 'Alta',
    description: 'El acceso a cómputo, servicios de nube, modelos, datos autorizados y talento especializado condiciona la prestación del servicio.',
    drivers: ['Depender de pocos proveedores reduce las alternativas.', 'Cambiar de infraestructura o de modelo puede ser costoso.', 'Los costes y la capacidad contratada condicionan el crecimiento.'],
    impact: 'Optimizar el cómputo y contar con alternativas viables puede reducir la dependencia y anticipar restricciones de capacidad.',
    loop: 'b1', connection: 'B1 · Límite de infraestructura'
  },
  clientes: {
    number: '04', title: 'Poder de los clientes', level: 'Media-alta',
    description: 'Los compradores comparan utilidad, precio, privacidad y fiabilidad. Su poder varía según el volumen contratado y la facilidad de cambiar.',
    drivers: ['Los grandes contratos dan más capacidad de negociación.', 'Las opciones similares favorecen la comparación de precios.', 'La integración y la migración de datos pueden dificultar cambiar.'],
    impact: 'Demostrar resultados y ofrecer portabilidad e integración puede fortalecer la relación con clientes sin depender solo del descuento.',
    loop: 'b2', connection: 'B2 · Precio y valor percibido'
  },
  sustitutos: {
    number: '05', title: 'Amenaza de sustitutos', level: 'Media',
    description: 'Una misma necesidad puede resolverse con software de reglas, búsqueda tradicional, automatización convencional o trabajo humano especializado.',
    drivers: ['Las tareas estables pueden resolverse con reglas simples.', 'La supervisión humana puede ser preferible en tareas delicadas.', 'El coste total y la fiabilidad determinan qué alternativa conviene.'],
    impact: 'El servicio de IA debe aportar una mejora verificable frente a otras formas de resolver la tarea. Otra marca de IA suele ser un rival, no un sustituto.',
    loop: 'b2', connection: 'B2 · Alternativas y valor relativo'
  }
};

// Signos por arista: nodes[i] -> nodes[(i + 1) % nodes.length].
// R1 tiene cero relaciones negativas; B1 y B2 tienen una negativa cada uno.
const loops = {
  r1: {
    code: 'R1', type: 'refuerzo', name: 'Innovación que se refuerza', short: 'Crecimiento', color: '#176c59', soft: '#eaf5f0',
    nodes: [['Adopción del', 'servicio'], ['Ingresos', 'disponibles'], ['Reinversión en', 'mejora'], ['Valor percibido', 'del servicio']],
    signs: ['+', '+', '+', '+'], delays: [2],
    description: 'Más adopción puede generar ingresos para mejorar el servicio. Si las mejoras aportan valor, favorecen a su vez la adopción.',
    steps: ['Adopción → ingresos (+).', 'Ingresos → reinversión (+).', 'Reinversión → valor percibido (+, con demora).', 'Valor percibido → adopción (+).'],
    hypothesis: 'Se supone un servicio monetizado, un margen positivo y reinversión efectiva. Más usuarios no generan ingresos ni mejoras automáticamente.'
  },
  b1: {
    code: 'B1', type: 'equilibrio', name: 'El límite de la capacidad', short: 'Capacidad', color: '#b73410', soft: '#fff0e9',
    nodes: [['Adopción del', 'servicio'], ['Carga de', 'infraestructura'], ['Saturación de', 'capacidad'], ['Calidad del', 'servicio']],
    signs: ['+', '+', '−', '+'], delays: [],
    description: 'Si crece el uso sin ampliar capacidad, aumenta la saturación. Un servicio más lento o menos disponible puede frenar la adopción.',
    steps: ['Adopción → carga de infraestructura (+).', 'Carga → saturación (+).', 'Saturación → calidad del servicio (−).', 'Calidad → adopción (+).'],
    hypothesis: 'La capacidad se considera fija a corto plazo. Ampliarla requiere tiempo; el coste y la disponibilidad de proveedores condicionan esa respuesta.'
  },
  b2: {
    code: 'B2', type: 'equilibrio', name: 'La presión de competir', short: 'Competencia', color: '#b73410', soft: '#fff0e9',
    nodes: [['Adopción del', 'servicio'], ['Atractivo del', 'mercado'], ['Presión', 'competitiva'], ['Margen', 'reinvertible'], ['Mejora del', 'valor relativo']],
    signs: ['+', '+', '−', '+', '+'], delays: [1, 3],
    description: 'La expansión puede atraer oferta. La presión competitiva puede reducir el margen disponible para mejorar el servicio y sostener su adopción.',
    steps: ['Adopción → atractivo del mercado (+).', 'Atractivo → presión competitiva (+, con demora).', 'Presión → margen reinvertible (−).', 'Margen → mejora del valor relativo (+, con demora).', 'Valor relativo → adopción (+).'],
    hypothesis: 'La adopción del servicio se usa como señal del crecimiento de su segmento. La presión recoge entrada y rivalidad; clientes y sustitutos pueden intensificarla. Es una simplificación, no una ley universal.'
  }
};

const viewNames = ['fuerzas', 'sistema', 'sintesis'];
let currentView = 'fuerzas';
let currentLoop = 'r1';

function renderForce(key) {
  const force = forces[key];
  if (!force) return;
  document.querySelectorAll('[data-force]').forEach(button => {
    const selected = button.dataset.force === key;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  document.getElementById('force-detail').innerHTML = `
    <div class="detail-kicker">EXPLORAR FUERZA <span class="detail-index">${force.number} / 05</span></div>
    <h2>${force.title}</h2>
    <div class="detail-level"><span>Intensidad propuesta</span><strong>${force.level}</strong></div>
    <p class="detail-description">${force.description}</p>
    <div class="detail-section"><h3>¿Qué la impulsa?</h3><ul>${force.drivers.map(item => `<li>${item}</li>`).join('')}</ul></div>
    <div class="impact-block"><h3>IMPLICACIÓN ESTRATÉGICA</h3><p>${force.impact}</p></div>
    <button type="button" class="detail-system-link" data-related-loop="${force.loop}">${force.connection}<span aria-hidden="true">↗</span></button>`;
}

function rectangleEdge(center, towards, halfWidth = 103, halfHeight = 36) {
  const dx = towards.x - center.x;
  const dy = towards.y - center.y;
  const ratio = Math.min(halfWidth / Math.abs(dx || 0.0001), halfHeight / Math.abs(dy || 0.0001));
  return {x: center.x + dx * ratio, y: center.y + dy * ratio};
}

function renderLoop(key) {
  const loop = loops[key];
  if (!loop) return;
  currentLoop = key;
  document.querySelectorAll('[data-loop]').forEach(button => {
    const selected = button.dataset.loop === key;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  const n = loop.nodes.length;
  const points = loop.nodes.map((label, index) => {
    const angle = -Math.PI / 2 + index * Math.PI * 2 / n;
    return {x: 460 + 302 * Math.cos(angle), y: 270 + 194 * Math.sin(angle), label};
  });
  const edges = points.map((point, index) => {
    const next = points[(index + 1) % n];
    const angle = -Math.PI / 2 + (index + 0.5) * Math.PI * 2 / n;
    const control = {x: 460 + 363 * Math.cos(angle), y: 270 + 237 * Math.sin(angle)};
    const start = rectangleEdge(point, control);
    const end = rectangleEdge(next, control, 108, 41);
    const middle = {x: 0.25 * start.x + 0.5 * control.x + 0.25 * end.x, y: 0.25 * start.y + 0.5 * control.y + 0.25 * end.y};
    const signX = end.x * 0.77 + control.x * 0.23;
    const signY = end.y * 0.77 + control.y * 0.23;
    return `<path d="M${start.x},${start.y} Q${control.x},${control.y} ${end.x},${end.y}" fill="none" stroke="${loop.color}" stroke-width="2" marker-end="url(#causal-arrow)"/>
      <circle cx="${signX}" cy="${signY}" r="12" fill="#f5f7f8"/>
      <text x="${signX}" y="${signY + 6}" text-anchor="middle" style="fill:${loop.color}" font-size="23" font-weight="700">${loop.signs[index]}</text>
      ${loop.delays.includes(index) ? `<circle cx="${middle.x}" cy="${middle.y}" r="16" fill="#f5f7f8"/><text x="${middle.x}" y="${middle.y + 7}" text-anchor="middle" font-size="25" style="fill:${loop.color}">∥</text>` : ''}`;
  }).join('');
  const nodes = points.map((point, index) => `<g><rect x="${point.x - 103}" y="${point.y - 36}" width="206" height="72" rx="10" fill="${index === 0 ? loop.soft : '#fff'}" stroke="${index === 0 ? loop.color : '#d4dade'}" stroke-width="${index === 0 ? 1.8 : 1}"/>
    <text text-anchor="middle" font-size="17" font-weight="600"><tspan x="${point.x}" y="${point.y - 4}">${point.label[0]}</tspan><tspan x="${point.x}" y="${point.y + 19}">${point.label[1]}</tspan></text></g>`).join('');
  document.getElementById('causal-diagram').innerHTML = `<svg viewBox="0 0 920 540" role="img" aria-labelledby="loop-svg-title loop-svg-desc"><title id="loop-svg-title">${loop.code}: ${loop.name}</title><desc id="loop-svg-desc">Ciclo de ${loop.type}. ${loop.steps.join(' ')} Las flechas se leen en sentido horario. Los ciclos comparten la variable adopción del servicio.</desc><defs><marker id="causal-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="${loop.color}"/></marker></defs>${edges}${nodes}<circle cx="460" cy="247" r="34" fill="${loop.soft}" stroke="${loop.color}" stroke-opacity=".2"/><text x="460" y="257" font-size="28" text-anchor="middle" font-weight="700" style="fill:${loop.color}">${loop.code}</text><text x="460" y="310" text-anchor="middle" font-size="18" font-weight="650">${loop.short}</text><text x="460" y="335" text-anchor="middle" font-size="14" style="fill:#6c757c">Ciclo de ${loop.type}</text></svg>`;
  document.getElementById('loop-detail').innerHTML = `<div class="loop-kind"><span class="loop-badge ${key === 'r1' ? 'reinforce' : 'balance'}">${loop.code}</span>CICLO DE ${loop.type.toUpperCase()}</div><h3>${loop.name}</h3><p>${loop.description}</p><ol class="loop-trace">${loop.steps.map(step => `<li>${step}</li>`).join('')}</ol><div class="hypothesis"><strong>Supuesto del modelo</strong><p>${loop.hypothesis}</p></div>`;
}

function setView(name, writeHash = true, focusHeading = false) {
  if (!viewNames.includes(name)) return;
  currentView = name;
  document.querySelectorAll('.view').forEach(view => { view.hidden = view.id !== `view-${name}`; });
  document.querySelectorAll('[data-view]').forEach(button => {
    const active = button.dataset.view === name;
    button.classList.toggle('active', active);
    if (active) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  if (writeHash && location.hash !== `#${name}`) location.hash = name;
  if (focusHeading) {
    const heading = document.querySelector(`#view-${name} h2`);
    if (heading) { heading.tabIndex = -1; heading.focus({preventScroll: true}); }
  }
}

document.addEventListener('click', event => {
  const target = event.target.closest('button');
  if (!target) return;
  if (target.dataset.force) renderForce(target.dataset.force);
  if (target.dataset.view) setView(target.dataset.view);
  if (target.dataset.go) setView(target.dataset.go, true, true);
  if (target.dataset.loop) renderLoop(target.dataset.loop);
  if (target.dataset.relatedLoop) {
    renderLoop(target.dataset.relatedLoop);
    setView('sistema', true, true);
  }
});

window.addEventListener('hashchange', () => {
  const name = location.hash.slice(1);
  setView(viewNames.includes(name) ? name : 'fuerzas', false);
});

renderForce('rivalidad');
renderLoop(currentLoop);
setView(viewNames.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'fuerzas', false);

const repositoryLink = document.getElementById('repo-link');
repositoryLink.href = 'https://github.com/Rodrix836/Avance-2-de-tic';
repositoryLink.hidden = false;
