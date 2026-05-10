import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSET_DIR = path.join(__dirname, 'assets');

function readAsset(name) {
  return fs.readFileSync(path.join(ASSET_DIR, name), 'utf8');
}

export function buildHtmlShell({ title, navHtml, docsHtml }) {
  const styles = readAsset('styles.css');
  const hljsCss = readAsset('highlight.css');
  const hljsJs = readAsset('highlight.min.js');
  const mermaidJs = readAsset('mermaid.min.js');
  const clientJs = readAsset('client.js');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)}</title>
<style>${styles}\n${hljsCss}</style>
</head>
<body>
<div class="app">
  <aside class="sidebar">
    <h1>${escapeHtml(title)}</h1>
    <input type="search" placeholder="Search documents..." />
    <nav>${navHtml}</nav>
  </aside>
  <main class="main">${docsHtml}</main>
</div>
<button class="theme-toggle">🌓 Theme</button>
<button class="copy-prompt">Copy as prompt</button>
<script>${hljsJs}</script>
<script>hljs.highlightAll();</script>
<script>${mermaidJs}</script>
<script>${clientJs}</script>
</body>
</html>`;
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
