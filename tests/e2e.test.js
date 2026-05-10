import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { run } from '../src/cli.js';

describe('e2e', () => {
  let outFile;
  beforeAll(async () => {
    outFile = path.join(os.tmpdir(), `rph-${Date.now()}.html`);
    await run({
      paths: ['tests/fixtures/plan-sample.md', 'tests/fixtures/review-sample.md'],
      out: outFile,
      title: 'E2E Test',
      theme: 'auto',
    });
  });

  it('writes the output HTML file', async () => {
    const stat = await fs.stat(outFile);
    expect(stat.size).toBeGreaterThan(1000);
  });

  it('contains both documents in nav', async () => {
    const html = await fs.readFile(outFile, 'utf8');
    expect(html).toMatch(/plan-sample/);
    expect(html).toMatch(/review-sample/);
    expect(html).toMatch(/CRITICAL/);
    expect(html).toMatch(/Tasks <strong>1\/2/);
  });
});
