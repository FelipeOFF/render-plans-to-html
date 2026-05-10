import { buildHtmlShell } from './template.js';

export function assembleHtml(docs, { title = 'Plans' } = {}) {
  const navHtml = docs.map(d =>
    `<a href="#${d.id}" data-target="${d.id}"><span class="doc-type">${d.type}</span>${escapeHtml(d.title)}</a>`
  ).join('\n');

  const docsHtml = docs.map(d => `
<section class="doc" id="${d.id}">
  <header class="doc-header">
    <h1>${escapeHtml(d.title)} <span class="doc-type">${d.type}</span></h1>
    ${renderMetrics(d.signals)}
  </header>
  ${d.bodyHtml}
  ${renderRefs(d.signals.refs)}
</section>
  `).join('\n');

  return buildHtmlShell({ title, navHtml, docsHtml });
}

function renderMetrics(s) {
  const parts = [];
  if (s.checkboxes.total > 0) {
    parts.push(`<span class="metric">Tasks <strong>${s.checkboxes.done}/${s.checkboxes.total}</strong></span>`);
  }
  for (const k of ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']) {
    if (s.severities[k] > 0) {
      parts.push(`<span class="metric"><span class="severity-${k}">${k}</span> <strong>${s.severities[k]}</strong></span>`);
    }
  }
  if (parts.length === 0) return '';
  return `<div class="metrics">${parts.join('')}</div>`;
}

function renderRefs(refs) {
  if (!refs || refs.length === 0) return '';
  const items = refs.map(r => `<li><a href="${r.url}" target="_blank" rel="noopener">${escapeHtml(r.text)}</a> — <code>${escapeHtml(r.url)}</code></li>`).join('');
  return `<aside class="refs"><h3>References</h3><ul>${items}</ul></aside>`;
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
