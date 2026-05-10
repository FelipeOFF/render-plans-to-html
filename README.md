# render-plans-to-html

> Tool-agnostic renderer that turns Markdown plans, specs and reviews into a single self-contained interactive HTML dashboard.
>
> 🇧🇷 [Versão em Português](./README.pt-BR.md)

Works with output from [GSD](https://github.com/), [Superpowers](https://github.com/), Ralph Specum, HopLoop, or any plain `.md` file. Produces one offline-capable HTML file with sidebar navigation, status pills, severity tags, mermaid diagrams, syntax highlighting, search, and dark/light themes.

## Features

- **Multi-doc dashboard** — feed it a folder and get one navigable surface.
- **Auto-classifier** — detects PLAN / REVIEW / REQUIREMENTS / tasks / RESEARCH / design / verification / generic by filename and content heuristics.
- **Status pills** — `- [ ]` / `- [x]` checkboxes become pills with `done/total` metric per doc.
- **Severity tags** — `**CRITICAL**`, `**HIGH**`, `**MEDIUM**`, `**LOW**` rendered as colored counters.
- **Mermaid diagrams** — fenced ` ```mermaid ` blocks render live (vendored mermaid).
- **Syntax highlight** — vendored highlight.js with stable theme.
- **Dark / light theme** — toggle persisted in `localStorage`.
- **Copy as prompt** — copies the active doc back as plain text for re-prompting an LLM.
- **Self-contained output** — single `.html` with all CSS and JS inlined. No external network at runtime.
- **Available as a skill** for both [Claude Code](https://claude.com/claude-code) and Codex.

## Installation

### As a skill (Claude Code and/or Codex) — recommended

Install via `npx` directly from npm:

```bash
npx render-plans-to-html-install              # auto-detect ~/.claude and/or ~/.agents
npx render-plans-to-html-install --claude     # Claude Code only
npx render-plans-to-html-install --codex      # Codex only
npx render-plans-to-html-install --all        # install to both
npx render-plans-to-html-install --uninstall  # remove
```

Or run it straight from GitHub without publishing:

```bash
npx --package=github:FelipeOFF/render-plans-to-html -- render-plans-to-html-install --all
```

The installer copies the package to the agent's skills directory, runs `npm install --omit=dev`, and symlinks the CLI into `~/.local/bin/render-plans`.

### As a CLI only (no skill)

```bash
npx render-plans-to-html docs/ --out plans.html
```

Or clone and use locally:

```bash
git clone https://github.com/FelipeOFF/render-plans-to-html.git
cd render-plans-to-html
npm install
node bin/render-plans.js docs/ --out plans.html
```

| Agent | Skills directory |
|-------|------------------|
| Claude Code | `~/.claude/skills/render-plans-to-html` |
| Codex | `~/.agents/skills/render-plans-to-html` |

Both can be overridden via `CLAUDE_SKILLS_DIR` and `CODEX_SKILLS_DIR` environment variables.

## Usage

```bash
render-plans <path>[,path2,...] [--out output.html] [--title "Phase v1.9"] [--theme dark]
```

`<path>` accepts:

- a single `.md` file,
- a folder (recursive `*.md` discovery),
- a comma-separated list of paths.

### Examples

```bash
# Single plan
render-plans docs/plan.md --out plan.html

# Whole phase folder
render-plans .planning/phase-3 --out phase-3.html --title "Phase 3"

# Mixed list
render-plans PLAN.md,REVIEW.md,RESEARCH.md --out review.html
```

## Requirements

- Node.js ≥ 20
- npm

## Project layout

```
src/
  cli.js        # arg parsing + orchestration
  discover.js   # path resolution
  classify.js   # doc-type heuristics
  extract.js    # signals (checkboxes, severity, toc, refs, mermaid)
  render.js     # marked → HTML body
  template.js   # HTML shell with inlined assets
  assemble.js   # multi-doc HTML composition
  assets/       # styles, client JS, vendored hljs and mermaid
skill/
  SKILL.md      # skill manifest (Claude Code / Codex)
  install.sh    # dual-target installer
tests/          # vitest suites
```

## Development

```bash
npm test            # run the full vitest suite
npm run test:watch  # watch mode
```

## License

MIT
