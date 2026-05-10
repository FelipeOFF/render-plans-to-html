---
name: render-plans-to-html
description: Use when the user wants to render, visualize, or share Markdown planning artifacts (PLAN.md, REVIEW.md, REQUIREMENTS.md, tasks.md, RESEARCH.md, design.md, or generic .md) as a single self-contained HTML dashboard with sidebar nav, status pills, severity tags, mermaid diagrams, syntax highlighting and dark/light themes. Triggers: "render plan to HTML", "gerar HTML do plano", "transformar MD em HTML", "share this spec in browser", phase artifact handoff to non-engineers.
version: 0.1.0
---

# render-plans-to-html

Convert any Markdown planning artifact into one self-contained, offline-capable HTML dashboard. Works with output from GSD, Superpowers, Ralph Specum, HopLoop, or any plain `.md`.

## When to Use

- User asks to render or visualize plans, specs, reviews, or a folder of MD files in HTML.
- A planning artifact needs to be shared with someone who can't run the source tool.
- Multi-document phase output should be agglomerated into one navigable surface.

## When NOT to Use

- Designing product UI — use `frontend-design` or `huashu-design` instead.
- Editing source-of-truth Markdown — this skill never modifies inputs.
- One-off Markdown preview a regular viewer can already do.

## Workflow

1. **Resolve input.** Accept a single `.md` file, a folder (recursive `*.md` discovery), or a comma-separated list of paths. Ask only if not provided.
2. **Resolve output.** Default: `<cwd>/plans.html`. Override with `--out`.
3. **Run the CLI:**

```bash
render-plans <path>[,path2,...] [--out output.html] [--title "Phase v1.9"] [--theme dark]
```

4. **Report.** Print the absolute output path and offer to open it (`open <path>` on macOS, `xdg-open <path>` on Linux).

## Behavior

- Detects doc type by filename and content: plan / review / requirements / tasks / research / design / verification / generic.
- Each type gets a color-coded badge in the sidebar.
- Checkboxes (`- [ ] / - [x]`) become status pills with a `done/total` metric.
- Severity keywords (`**CRITICAL**`, `**HIGH**`, `**MEDIUM**`, `**LOW**`) become colored tags with counters.
- Mermaid blocks render as live diagrams (vendored mermaid).
- Code blocks get syntax highlight (vendored highlight.js).
- External links collected per doc into a "References" footer.
- Sidebar search filters nav.
- Dark/light theme toggle, persisted in `localStorage`.
- "Copy as prompt" button copies the active doc back as text for re-prompting.
- Output is a single `.html` with all CSS and JS inlined — works offline.

## Quick Reference

| Input | Behavior |
|-------|----------|
| `file.md` | Renders one doc |
| `folder/` | Recursive `*.md` discovery |
| `a.md,b.md` | Renders the listed files in order |

| Flag | Default | Purpose |
|------|---------|---------|
| `--out` | `./plans.html` | Output file path |
| `--title` | `Plans (N)` | Document title shown in sidebar header |
| `--theme` | `auto` | Initial theme: `light`, `dark`, or `auto` |

## Installation Path

The CLI is installed at the agent-specific skill directory:
- **Claude Code:** `~/.claude/skills/render-plans-to-html/bin/render-plans.js`
- **Codex:** `~/.agents/skills/render-plans-to-html/bin/render-plans.js`

A symlink is placed at `~/.local/bin/render-plans` so the CLI is callable as `render-plans` from anywhere on `$PATH`.
