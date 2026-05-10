import { Command } from 'commander';
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { discoverPaths } from './discover.js';
import { classifyDoc } from './classify.js';
import { extractSignals } from './extract.js';
import { renderMarkdown } from './render.js';
import { assembleHtml } from './assemble.js';

export function parseArgs(argv) {
  const program = new Command();
  program
    .argument('<paths>', 'comma-separated MD files or folder')
    .option('--out <file>', 'output HTML file')
    .option('--title <title>', 'document title')
    .option('--theme <theme>', 'default theme: light|dark', 'auto')
    .allowExcessArguments(false)
    .exitOverride();

  const parsed = program.parse(['node', 'render-plans', ...argv]);
  const opts = parsed.opts();
  const rawPaths = parsed.args[0];
  const paths = rawPaths.split(',').map(p => p.trim()).filter(Boolean);
  const out = opts.out || path.join(process.cwd(), 'plans.html');
  return { paths, out, title: opts.title, theme: opts.theme };
}

export async function run(opts) {
  const files = await discoverPaths(opts.paths);
  if (files.length === 0) throw new Error('No markdown files found.');

  const docs = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const raw = await fs.readFile(file, 'utf8');
    const { content, data } = matter(raw);
    const type = classifyDoc(file, content);
    const signals = extractSignals(content);
    const bodyHtml = renderMarkdown(content);
    const baseName = path.basename(file, '.md');
    const title = data.title || signals.toc[0]?.text || baseName;
    docs.push({
      id: `doc-${i}-${baseName.replace(/[^a-z0-9]/gi, '-')}`,
      title,
      type,
      bodyHtml,
      signals,
    });
  }

  const html = assembleHtml(docs, { title: opts.title || `Plans (${docs.length})` });
  await fs.writeFile(opts.out, html, 'utf8');
  console.log(`Rendered ${docs.length} document(s) → ${opts.out}`);
}
