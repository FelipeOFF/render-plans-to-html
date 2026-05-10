# render-plans-to-html

> Renderizador tool-agnostic que transforma planos, specs e reviews em Markdown num único dashboard HTML interativo e self-contained.
>
> 🇺🇸 [English version](./README.md)

Funciona com saídas de [GSD](https://github.com/), [Superpowers](https://github.com/), Ralph Specum, HopLoop, ou qualquer `.md` puro. Gera um único arquivo HTML offline-capable com navegação lateral, status pills, tags de severidade, diagramas mermaid, syntax highlight, busca e temas dark/light.

## Funcionalidades

- **Dashboard multi-doc** — aponte para uma pasta e tenha uma superfície navegável única.
- **Classificador automático** — detecta PLAN / REVIEW / REQUIREMENTS / tasks / RESEARCH / design / verification / generic por heurística de nome e conteúdo.
- **Status pills** — checkboxes `- [ ]` / `- [x]` viram pills com métrica `feitos/total` por documento.
- **Tags de severidade** — `**CRITICAL**`, `**HIGH**`, `**MEDIUM**`, `**LOW**` renderizados como contadores coloridos.
- **Diagramas mermaid** — blocos ` ```mermaid ` renderizam ao vivo (mermaid vendored).
- **Syntax highlight** — highlight.js vendored com tema estável.
- **Tema dark / light** — toggle persistido em `localStorage`.
- **Copy as prompt** — copia o doc ativo como texto puro para re-prompt em um LLM.
- **Saída self-contained** — único `.html` com CSS e JS inline. Sem rede em runtime.
- **Disponível como skill** para [Claude Code](https://claude.com/claude-code) e Codex.

## Instalação

### Como CLI

```bash
git clone https://github.com/<sua-org>/render-plans-to-html.git
cd render-plans-to-html
npm install
```

### Como skill (Claude Code e/ou Codex)

```bash
./skill/install.sh              # auto-detecta ~/.claude e/ou ~/.agents
./skill/install.sh --claude     # apenas Claude Code
./skill/install.sh --codex      # apenas Codex
./skill/install.sh --all        # instala em ambos
./skill/install.sh --uninstall  # desinstala
```

O instalador copia o projeto para o diretório de skills do agente e cria um symlink do CLI em `~/.local/bin/render-plans`.

| Agente | Diretório de skills |
|--------|---------------------|
| Claude Code | `~/.claude/skills/render-plans-to-html` |
| Codex | `~/.agents/skills/render-plans-to-html` |

Ambos podem ser sobrescritos via `CLAUDE_SKILLS_DIR` e `CODEX_SKILLS_DIR`.

## Uso

```bash
render-plans <caminho>[,caminho2,...] [--out saida.html] [--title "Phase v1.9"] [--theme dark]
```

`<caminho>` aceita:

- um único arquivo `.md`,
- uma pasta (descoberta recursiva de `*.md`),
- uma lista separada por vírgulas.

### Exemplos

```bash
# Plano único
render-plans docs/plan.md --out plan.html

# Pasta inteira de uma phase
render-plans .planning/phase-3 --out phase-3.html --title "Phase 3"

# Lista mista
render-plans PLAN.md,REVIEW.md,RESEARCH.md --out review.html
```

## Requisitos

- Node.js ≥ 20
- npm

## Estrutura do projeto

```
src/
  cli.js        # parsing de args + orquestração
  discover.js   # resolução de caminhos
  classify.js   # heurística de tipo
  extract.js    # sinais (checkboxes, severity, toc, refs, mermaid)
  render.js     # marked → HTML body
  template.js   # shell HTML com assets inline
  assemble.js   # composição multi-doc
  assets/       # estilos, JS cliente, hljs e mermaid vendored
skill/
  SKILL.md      # manifesto da skill (Claude Code / Codex)
  install.sh    # instalador dual-target
tests/          # suites vitest
```

## Desenvolvimento

```bash
npm test            # roda toda a suite vitest
npm run test:watch  # modo watch
```

## Licença

MIT
