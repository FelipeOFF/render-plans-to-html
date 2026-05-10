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

## Quickstart — zero instalação

Roda o renderer direto via `npx`, sem precisar instalar nada:

```bash
npx --yes render-plans-to-html docs/ --out plans.html
```

É exatamente assim que a skill se invoca quando o agente decide renderizar. A primeira chamada baixa o pacote (~800 KB) no cache do npm; as próximas são instantâneas.

## Instalar como skill (Claude Code e/ou Codex)

Para que os agentes descubram a skill pela descrição (e o usuário possa simplesmente dizer "renderiza esse plano em HTML"), registre uma vez no diretório de skills do agente:

```bash
npx render-plans-to-html-install              # auto-detecta ~/.claude e/ou ~/.agents
npx render-plans-to-html-install --claude     # apenas Claude Code
npx render-plans-to-html-install --codex      # apenas Codex
npx render-plans-to-html-install --all        # instala em ambos
npx render-plans-to-html-install --uninstall  # desinstala
```

Ou direto do GitHub:

```bash
npx --package=github:FelipeOFF/render-plans-to-html -- render-plans-to-html-install --all
```

O instalador copia o SKILL.md e o CLI para o diretório de skills do agente, roda `npm install --omit=dev` e cria um symlink de `render-plans` em `~/.local/bin`.

| Agente | Diretório de skills |
|--------|---------------------|
| Claude Code | `~/.claude/skills/render-plans-to-html` |
| Codex | `~/.agents/skills/render-plans-to-html` |

Ambos podem ser sobrescritos via `CLAUDE_SKILLS_DIR` e `CODEX_SKILLS_DIR`.

## Desenvolvimento local

```bash
git clone https://github.com/FelipeOFF/render-plans-to-html.git
cd render-plans-to-html
npm install
node bin/render-plans.js docs/ --out plans.html
```

## Uso

```bash
npx --yes render-plans-to-html <caminho>[,caminho2,...] [--out saida.html] [--title "Phase v1.9"] [--theme dark]
```

`<caminho>` aceita:

- um único arquivo `.md`,
- uma pasta (descoberta recursiva de `*.md`),
- uma lista separada por vírgulas.

### Exemplos

```bash
# Plano único
npx --yes render-plans-to-html docs/plan.md --out plan.html

# Pasta inteira de uma phase
npx --yes render-plans-to-html .planning/phase-3 --out phase-3.html --title "Phase 3"

# Lista mista
npx --yes render-plans-to-html PLAN.md,REVIEW.md,RESEARCH.md --out review.html
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
bin/
  render-plans.js  # entrypoint do renderer (npx render-plans-to-html)
  install.js       # instalador opcional (npx render-plans-to-html-install)
skill/
  SKILL.md         # manifesto da skill (Claude Code / Codex)
tests/             # suites vitest
```

## Desenvolvimento

```bash
npm test            # roda toda a suite vitest
npm run test:watch  # modo watch
```

## Licença

MIT
