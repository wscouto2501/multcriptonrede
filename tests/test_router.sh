#!/usr/bin/env bash
set -Eeuo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
grep -q 'case "$NETWORK_MODULE" in' "$ROOT/unic_cripton"
grep -q 'solana)' "$ROOT/unic_cripton"
grep -q 'evm)' "$ROOT/unic_cripton"
grep -q 'UNIC_CRIPTON_SELECTED_NETWORK_KEY' "$ROOT/modules/evm/installer.sh"
if [[ "${EUID:-$(id -u)}" -eq 0 ]] && command -v node >/dev/null 2>&1; then
  out="$(cd /tmp && printf '0\n' | bash "$ROOT/unic_cripton" 2>&1 || true)"
  grep -q 'cancelada\|cancelado' <<<"$out" || { echo "$out"; exit 1; }
fi
echo 'Roteador: seleção por módulo e cancelamento: OK'
