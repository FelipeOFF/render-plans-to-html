#!/usr/bin/env bash
# Installs render-plans-to-html as a skill for Claude Code and/or Codex.
#
# Usage:
#   ./skill/install.sh                # auto-detect targets, install to all available
#   ./skill/install.sh --claude       # only Claude Code
#   ./skill/install.sh --codex        # only Codex
#   ./skill/install.sh --all          # both, regardless of detection
#   ./skill/install.sh --uninstall    # remove from all known locations
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

CLAUDE_SKILLS_DIR="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}"
CODEX_SKILLS_DIR="${CODEX_SKILLS_DIR:-$HOME/.agents/skills}"
BIN_DIR="${BIN_DIR:-$HOME/.local/bin}"
SKILL_NAME="render-plans-to-html"

MODE="auto"
case "${1:-}" in
  --claude) MODE="claude" ;;
  --codex)  MODE="codex" ;;
  --all)    MODE="all" ;;
  --uninstall) MODE="uninstall" ;;
  "") MODE="auto" ;;
  *) echo "Unknown flag: $1" >&2; exit 2 ;;
esac

install_target() {
  local label="$1"
  local base_dir="$2"
  local dest="$base_dir/$SKILL_NAME"

  echo "==> Installing $label skill into $dest"
  mkdir -p "$dest"

  # Prefer rsync; fall back to cp -R when unavailable.
  if command -v rsync >/dev/null 2>&1; then
    rsync -a --delete \
      --exclude=node_modules \
      --exclude=tests \
      --exclude=docs \
      --exclude=.git \
      --exclude='*.html' \
      "$PROJECT_DIR/" "$dest/"
  else
    rm -rf "$dest"
    mkdir -p "$dest"
    (cd "$PROJECT_DIR" && tar --exclude=node_modules --exclude=tests --exclude=docs --exclude=.git --exclude='*.html' -cf - .) | (cd "$dest" && tar -xf -)
  fi

  (cd "$dest" && npm install --omit=dev --no-audit --no-fund >/dev/null)

  cp "$SCRIPT_DIR/SKILL.md" "$dest/SKILL.md"
  chmod +x "$dest/bin/render-plans.js"
  echo "    ok"
}

uninstall_target() {
  local label="$1"
  local dest="$2/$SKILL_NAME"
  if [ -d "$dest" ]; then
    echo "==> Removing $label skill at $dest"
    rm -rf "$dest"
  fi
}

link_cli() {
  local source_dir="$1"
  mkdir -p "$BIN_DIR"
  ln -sfn "$source_dir/$SKILL_NAME/bin/render-plans.js" "$BIN_DIR/render-plans"
  echo "==> Symlinked CLI to $BIN_DIR/render-plans"
}

case "$MODE" in
  uninstall)
    uninstall_target "Claude Code" "$CLAUDE_SKILLS_DIR"
    uninstall_target "Codex"       "$CODEX_SKILLS_DIR"
    if [ -L "$BIN_DIR/render-plans" ]; then
      rm -f "$BIN_DIR/render-plans"
      echo "==> Removed CLI symlink at $BIN_DIR/render-plans"
    fi
    echo "Done."
    exit 0
    ;;
  claude)
    install_target "Claude Code" "$CLAUDE_SKILLS_DIR"
    link_cli "$CLAUDE_SKILLS_DIR"
    ;;
  codex)
    install_target "Codex" "$CODEX_SKILLS_DIR"
    link_cli "$CODEX_SKILLS_DIR"
    ;;
  all)
    install_target "Claude Code" "$CLAUDE_SKILLS_DIR"
    install_target "Codex"       "$CODEX_SKILLS_DIR"
    link_cli "$CLAUDE_SKILLS_DIR"
    ;;
  auto)
    INSTALLED_ANY=0
    LAST_DIR=""
    if [ -d "$HOME/.claude" ]; then
      install_target "Claude Code" "$CLAUDE_SKILLS_DIR"
      INSTALLED_ANY=1
      LAST_DIR="$CLAUDE_SKILLS_DIR"
    fi
    if [ -d "$HOME/.agents" ] || [ -d "$HOME/.codex" ]; then
      install_target "Codex" "$CODEX_SKILLS_DIR"
      INSTALLED_ANY=1
      LAST_DIR="$CODEX_SKILLS_DIR"
    fi
    if [ "$INSTALLED_ANY" -eq 0 ]; then
      echo "No agent home detected (~/.claude or ~/.agents/~/.codex)." >&2
      echo "Re-run with --claude, --codex, or --all to force a target." >&2
      exit 1
    fi
    link_cli "$LAST_DIR"
    ;;
esac

echo "Done. Try: render-plans --help"
