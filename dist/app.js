'use strict';

(() => {
try {
if (typeof projectConfig === 'undefined') throw new Error('dist/config.js could not be loaded.');
const forceKeys = ['rivalidad', 'entrantes', 'proveedores', 'clientes', 'sustitutos'];
const loopKeys = ['r1', 'b1', 'b2'];
const escapeText = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]));
// Escape client text once before using it in HTML/SVG templates. Keep the original
// config untouched for textContent, URLs and branding validation.
function escaped(value) {
  if (typeof value === 'string') return escapeText(value);
  if (Array.isArray(value)) return value.map(escaped);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, escaped(item)]));
  return value;
}
for (const key of forceKeys) {
  const force = projectConfig.forces?.[key];
  if (!force || !force.title || !force.level || !Array.isArray(force.drivers) || !loopKeys.includes(force.loop)) throw new Error(`Check forces.${key} in config.js.`);
}
for (const key of loopKeys) {
  const loop = projectConfig.dynamics?.loops?.[key];
  if (!loop || ![4, 5].includes(loop.nodes?.length) || loop.nodes.some(node => !Array.isArray(node) || node.length !== 2) || loop.signs?.length !== loop.nodes.length || !loop.signs.every(sign => ['+', '−'].includes(sign)) || !Array.isArray(loop.steps) || !Array.isArray(loop.delays) || loop.delays.some(i => !Number.isInteger(i) || i < 0 || i >= loop.nodes.length)) throw new Error(`Check dynamics.loops.${key} in config.js.`);
  const negative = loop.signs.filter(sign => sign === '−').length;
  if (negative % 2 !== (key === 'r1' ? 0 : 1)) throw new Error(`Loop polarity is inconsistent in ${key}.`);
}
if (!projectConfig.company?.name || !projectConfig.executiveSummary || !projectConfig.methodology || !Array.isArray(projectConfig.recommendations) || projectConfig.recommendations.length < 3 || projectConfig.recommendations.length > 5) throw new Error('Check company, executiveSummary, methodology and 3–5 recommendations in config.js.');
const config = escaped(projectConfig);
const forces = config.forces;
const loops = config.dynamics.loops;
for (const key of loopKeys) {
  loops[key].color = key === 'r1' ? 'var(--green)' : 'var(--accent-dark)';
  loops[key].soft = key === 'r1' ? 'var(--green-soft)' : 'var(--accent-soft)';
}

function safeURL(value, image = false) {
  if (!value) return '';
  try {
    const url = new URL(value, location.href);
    return (image ? ['file:', 'http:', 'https:'] : ['http:', 'https:']).includes(url.protocol) ? url.href : '';
  } catch { return ''; }
}

function initialize() {
  const company = projectConfig.company;
  document.title = `${company.name} | Porter Five Forces Analysis`;
  document.querySelector('meta[name="description"]').content = company.description;
  document.querySelectorAll('[data-company]').forEach(el => { el.textContent = company.name; });
  document.getElementById('company-meta').textContent = [company.industry, company.country, company.date].filter(Boolean).join(' · ');
  document.getElementById('company-description').textContent = company.description;
  const logo = document.getElementById('company-logo');
  const mark = document.getElementById('brand-mark');
  mark.textContent = company.name.split(/\s+/).map(word => word[0]).slice(0, 2).join('');
  const logoURL = safeURL(company.logo, true);
  if (logoURL) {
    logo.onload = () => { logo.hidden = false; mark.hidden = true; };
    logo.onerror = () => { logo.hidden = true; mark.hidden = false; };
    logo.src = logoURL;
  }
  const tokens = {primaryColor: '--primary', secondaryColor: '--secondary', backgroundColor: '--background', surfaceColor: '--surface', textColor: '--text', mutedColor: '--muted'};
  for (const [key, token] of Object.entries(tokens)) {
    const color = projectConfig.branding?.[key];
    if (color && /^#[0-9a-f]{6}$/i.test(color)) document.documentElement.style.setProperty(token, color);
  }
  // Pick readable ink for solid brand fills, including light client palettes.
  const primary = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
  const rgb = primary.match(/[0-9a-f]{2}/gi).map(hex => parseInt(hex, 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  const luminance = .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2];
  document.documentElement.style.setProperty('--on-primary', luminance > .179 ? '#181b1f' : '#ffffff');
  document.querySelector('meta[name="theme-color"]').content = primary;
  const summary = config.executiveSummary;
  document.getElementById('summary-grid').innerHTML = [['Overall Competitive Pressure', summary.overallPressure], ['Strongest Force', summary.strongestForce], ['Main Risk', summary.mainRisk], ['Main Opportunity', summary.mainOpportunity]].map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('');
  document.getElementById('strategic-priority').innerHTML = `<strong>Strategic Priority</strong><span>${summary.strategicPriority}</span>`;
  document.getElementById('recommendation-list').innerHTML = config.recommendations.map((item, i) => `<li><span class="recommendation-number">0${i + 1}</span><div><h3>${item.title}</h3><p>${item.description}</p></div></li>`).join('');
  document.getElementById('force-map').innerHTML = `<svg class="force-connections" viewBox="0 0 900 570" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="map-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 1 L8 5 L0 9" fill="none" stroke="currentColor" stroke-width="1.5"/></marker></defs><path d="M450 177 V197"/><path d="M270 285 H315"/><path d="M630 285 H585"/><path d="M450 402 V386"/></svg>` + forceKeys.map(key => {
    const force = forces[key];
    return `<button class="force-card force-${key}" data-force="${key}" type="button" aria-pressed="false" aria-controls="force-detail"><span class="card-top"><span class="node-number">${force.number}</span><span class="level">${force.level}</span></span><span class="node-title">${force.title}</span><span class="node-subtitle">${force.subtitle}</span><span class="node-example">${force.example}</span></button>`;
  }).join('');
  document.getElementById('loop-selector').innerHTML = loopKeys.map(key => `<button type="button" class="loop-button" data-loop="${key}" aria-pressed="false" aria-controls="causal-diagram loop-detail"><span class="loop-badge ${key === 'r1' ? 'reinforce' : 'balance'}">${loops[key].code}</span>${loops[key].short}</button>`).join('');
  for (const field of ['title', 'description', 'intervention']) document.getElementById(`dynamics-${field}`).textContent = projectConfig.dynamics[field];
  document.getElementById('connections-body').innerHTML = forceKeys.map(key => `<tr><th scope="row">${forces[key].title}</th><td>${forces[key].mechanism}</td><td>${forces[key].relationship}</td></tr>`).join('');
  document.getElementById('method-scope').textContent = projectConfig.methodology.scope;
  document.getElementById('method-note').textContent = projectConfig.methodology.note;
  document.getElementById('sources').innerHTML = (projectConfig.methodology.sources || []).map((source, i) => {
    const url = safeURL(source.url);
    const content = `<span>0${i + 1} · REFERENCE<strong>${escapeText(source.title)}</strong><small>${escapeText(source.description)}</small></span>`;
    return url ? `<a class="source-link" href="${escapeText(url)}" target="_blank" rel="noopener noreferrer">${content}<span aria-hidden="true">↗</span></a>` : `<div class="source-link">${content}</div>`;
  }).join('');
  // Build a complete print document once; printing never changes the active view.
  const report = document.getElementById('print-analysis');
  report.innerHTML = '<h2>Five Forces · Complete Analysis</h2>';
  for (const key of forceKeys) {
    renderForce(key);
    const article = document.createElement('article');
    article.className = 'print-force';
    article.innerHTML = document.getElementById('force-detail').innerHTML;
    article.querySelector('button').remove();
    report.append(article);
  }
  report.insertAdjacentHTML('beforeend', '<h2>System Dynamics · All Feedback Loops</h2>');
  for (const key of loopKeys) {
    report.insertAdjacentHTML('beforeend', `<article class="print-loop"><div class="causal-diagram" id="print-diagram-${key}"></div><div class="loop-detail" id="print-detail-${key}"></div></article>`);
    renderLoop(key, `print-diagram-${key}`, `print-detail-${key}`, false);
  }
  const context = document.createElement('section');
  context.className = 'print-context';
  for (const selector of ['.system-heading', '.system-key', '.connections-section', '.synthesis-grid']) {
    const clone = document.querySelector(selector).cloneNode(true);
    clone.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
    clone.querySelectorAll('[tabindex]').forEach(element => element.removeAttribute('tabindex'));
    context.append(clone);
  }
  report.append(context);
  document.getElementById('print-report').addEventListener('click', () => window.print());
}

const viewNames = ['fuerzas', 'sistema', 'sintesis'];
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
    <div class="detail-kicker">EXPLORE FORCE <span class="detail-index">${force.number} / 05</span></div>
    <h2>${force.title}</h2>
    <div class="detail-level"><span>Assessed intensity</span><strong>${force.level}</strong></div>
    <p class="detail-description">${force.description}</p>
    <div class="detail-section"><h3>Key Drivers</h3><ul>${force.drivers.map(item => `<li>${item}</li>`).join('')}</ul></div>
    <div class="impact-block"><h3>STRATEGIC IMPACT</h3><p>${force.impact}</p></div>
    <button type="button" class="detail-system-link" data-related-loop="${force.loop}">${force.connection}<span aria-hidden="true">↗</span></button>`;
}

function rectangleEdge(center, towards, halfWidth = 103, halfHeight = 36) {
  const dx = towards.x - center.x;
  const dy = towards.y - center.y;
  const ratio = Math.min(halfWidth / Math.abs(dx || 0.0001), halfHeight / Math.abs(dy || 0.0001));
  return {x: center.x + dx * ratio, y: center.y + dy * ratio};
}

function renderLoop(key, diagramId = 'causal-diagram', detailId = 'loop-detail', interactive = true) {
  const loop = loops[key];
  if (!loop) return;
  if (interactive) currentLoop = key;
  if (interactive) document.querySelectorAll('[data-loop]').forEach(button => {
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
    return `<path d="M${start.x},${start.y} Q${control.x},${control.y} ${end.x},${end.y}" fill="none" stroke="${loop.color}" stroke-width="2" marker-end="url(#${diagramId}-arrow)"/>
      <circle cx="${signX}" cy="${signY}" r="12" fill="var(--canvas)"/>
      <text x="${signX}" y="${signY + 6}" text-anchor="middle" style="fill:${loop.color}" font-size="23" font-weight="700">${loop.signs[index]}</text>
      ${loop.delays.includes(index) ? `<circle cx="${middle.x}" cy="${middle.y}" r="16" fill="var(--canvas)"/><text x="${middle.x}" y="${middle.y + 7}" text-anchor="middle" font-size="25" style="fill:${loop.color}">∥</text>` : ''}`;
  }).join('');
  const nodes = points.map((point, index) => `<g><rect x="${point.x - 103}" y="${point.y - 36}" width="206" height="72" rx="10" fill="${index === 0 ? loop.soft : 'var(--paper)'}" stroke="${index === 0 ? loop.color : 'var(--line)'}" stroke-width="${index === 0 ? 1.8 : 1}"/>
    <text text-anchor="middle" font-size="17" font-weight="600"><tspan x="${point.x}" y="${point.y - 4}">${point.label[0]}</tspan><tspan x="${point.x}" y="${point.y + 19}">${point.label[1]}</tspan></text></g>`).join('');
  document.getElementById(diagramId).innerHTML = `<svg viewBox="0 0 920 540" role="img" aria-labelledby="${diagramId}-title ${diagramId}-desc"><title id="${diagramId}-title">${loop.code}: ${loop.name}</title><desc id="${diagramId}-desc">Loop: ${loop.type}. ${loop.steps.join(' ')} Read arrows clockwise. All cycles share service adoption.</desc><defs><marker id="${diagramId}-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="${loop.color}"/></marker></defs>${edges}${nodes}<circle cx="460" cy="247" r="34" fill="${loop.soft}" stroke="${loop.color}" stroke-opacity=".2"/><text x="460" y="257" font-size="28" text-anchor="middle" font-weight="700" style="fill:${loop.color}">${loop.code}</text><text x="460" y="310" text-anchor="middle" font-size="18" font-weight="650">${loop.short}</text><text x="460" y="335" text-anchor="middle" font-size="14" style="fill:var(--muted)">Loop: ${loop.type}</text></svg>`;
  document.getElementById(detailId).innerHTML = `<div class="loop-kind"><span class="loop-badge ${key === 'r1' ? 'reinforce' : 'balance'}">${loop.code}</span>LOOP: ${loop.type.toUpperCase()}</div><h3>${loop.name}</h3><p>${loop.description}</p><ol class="loop-trace">${loop.steps.map(step => `<li>${step}</li>`).join('')}</ol><div class="hypothesis"><strong>Model assumption</strong><p>${loop.hypothesis}</p></div>`;
}

function setView(name, writeHash = true, focusHeading = false) {
  if (!viewNames.includes(name)) return;
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
  if (target.dataset.go) { setView(target.dataset.go, true, true); document.getElementById(`view-${target.dataset.go}`).scrollIntoView({block: 'start'}); }
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

initialize();
renderForce('rivalidad');
renderLoop(currentLoop);
setView(viewNames.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'fuerzas', false);

} catch (error) {
  const message = document.getElementById('config-error');
  message.textContent = `The dashboard configuration could not be loaded. ${error.message}`;
  message.hidden = false;
  console.error(error);
}
})();
