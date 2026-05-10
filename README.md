# render-plans-to-html

Renders Markdown plans, specs and reviews (from GSD, Superpowers, Ralph Specum, HopLoop or any tool) as a single self-contained interactive HTML dashboard.

## Install
```bash
npm install
./skill/install.sh
```

## Usage
```bash
render-plans <path> [--out output.html] [--title "Phase v1.9"]
```

`<path>` can be a single `.md` file, a folder (recursive `*.md` discovery), or a comma-separated list.
