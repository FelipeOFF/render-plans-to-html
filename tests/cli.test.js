import { describe, it, expect } from 'vitest';
import { parseArgs } from '../src/cli.js';

describe('parseArgs', () => {
  it('parses single path argument', () => {
    const result = parseArgs(['/tmp/plan.md']);
    expect(result.paths).toEqual(['/tmp/plan.md']);
    expect(result.out).toMatch(/\.html$/);
  });

  it('accepts --out flag', () => {
    const result = parseArgs(['/tmp/plan.md', '--out', '/tmp/x.html']);
    expect(result.out).toBe('/tmp/x.html');
  });

  it('accepts --title flag', () => {
    const result = parseArgs(['/tmp/plan.md', '--title', 'Phase v1.9']);
    expect(result.title).toBe('Phase v1.9');
  });

  it('accepts comma-separated paths', () => {
    const result = parseArgs(['a.md,b.md,c.md']);
    expect(result.paths).toEqual(['a.md', 'b.md', 'c.md']);
  });
});
