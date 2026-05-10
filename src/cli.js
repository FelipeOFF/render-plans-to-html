import { Command } from 'commander';
import path from 'node:path';

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
  console.log('render-plans:', opts);
}
