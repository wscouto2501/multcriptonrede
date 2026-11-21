#!/usr/bin/env bash
set -Eeuo pipefail
HERE="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
command -v node >/dev/null 2>&1 || { echo 'Node.js 20+ é obrigatório.' >&2; exit 1; }
node -e 'process.exit(Number(process.versions.node.split(".")[0]) >= 20 ? 0 : 1)' || { echo 'Atualize o Node.js para 20+.' >&2; exit 1; }
cd "$HERE"
npm ci --no-audit --no-fund 2>/dev/null || npm install --no-audit --no-fund
