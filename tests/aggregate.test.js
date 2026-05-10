import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { aggregate, parseTasks } from '../src/aggregate.js';

const fixtureMd = fs.readFileSync('tests/fixtures/plan-with-tasks.md', 'utf8');

describe('parseTasks', () => {
  it('finds Task headings with steps and files', () => {
    const tasks = parseTasks(fixtureMd, 'doc-0');
    expect(tasks).toHaveLength(3);
    expect(tasks[0].title).toBe('Foo refactor');
    expect(tasks[0].steps).toHaveLength(3);
    expect(tasks[0].steps.filter(s => s.done)).toHaveLength(1);
    expect(tasks[0].filesMentioned.sort()).toEqual(['src/bar.js', 'src/foo.js']);
  });

  it('detects keywords (refactor, e2e)', () => {
    const tasks = parseTasks(fixtureMd, 'doc-0');
    expect(tasks[0].keywords).toContain('refactor');
    expect(tasks[1].keywords).toContain('e2e');
    expect(tasks[2].keywords).toEqual([]);
  });

  it('falls back to flat checkboxes when no Task heading', () => {
    const md = '# Generic\n- [ ] foo\n- [x] bar';
    const tasks = parseTasks(md, 'doc-1');
    expect(tasks).toHaveLength(1);
    expect(tasks[0].steps).toHaveLength(2);
    expect(tasks[0].steps.filter(s => s.done)).toHaveLength(1);
  });

  it('marks task done only when all steps are done', () => {
    const tasks = parseTasks(fixtureMd, 'doc-0');
    expect(tasks[0].done).toBe(false);
    expect(tasks[2].done).toBe(true);
  });
});

describe('aggregate', () => {
  it('produces phase totals and per-doc rollups', async () => {
    const docs = [
      {
        id: 'd0',
        title: 'Plan',
        type: 'plan',
        rawMd: fixtureMd,
        signals: { severities: { CRITICAL: 1, HIGH: 0, MEDIUM: 2, LOW: 0 } },
      },
    ];
    const phase = await aggregate(docs, { gitDir: null });
    expect(phase.totals.tasksTotal).toBe(12);
    expect(phase.totals.tasksDone).toBe(2);
    expect(phase.totals.tasksPending).toBe(10);
    expect(phase.tasksPerDoc).toEqual([{ docId: 'd0', done: 2, total: 12 }]);
    expect(phase.severityTotals).toEqual({ CRITICAL: 1, HIGH: 0, MEDIUM: 2, LOW: 0 });
    expect(phase.severityByDoc).toEqual({
      d0: { CRITICAL: 1, HIGH: 0, MEDIUM: 2, LOW: 0 },
    });
    expect(phase.tasks).toHaveLength(3);
    expect(phase.burndownTimeline).toBe(null);
  });
});
