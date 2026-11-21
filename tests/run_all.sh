#!/usr/bin/env bash
set -Eeuo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
for t in test_catalog.sh test_router.sh test_paths.sh test_no_secrets.sh; do bash "$ROOT/tests/$t"; done
node --check "$ROOT/modules/common/catalog.js"
node --check "$ROOT/modules/solana/validate.js"
node --check "$ROOT/modules/solana/create-token.js"
node --test "$ROOT/modules/solana/test/"*.test.js
if [[ -d "$ROOT/modules/solana/node_modules" ]]; then echo 'Dependências Solana encontradas.'; else echo 'AVISO: npm install ainda necessário para execução on-chain do módulo Solana.'; fi
