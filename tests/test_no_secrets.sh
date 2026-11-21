#!/usr/bin/env bash
set -Eeuo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
if find "$ROOT" -type f \( -name '.env' -o -name 'id.json' -o -name '*.keystore' -o -name '*.pem' \) | grep -q .; then
  echo 'Arquivo potencialmente secreto encontrado.' >&2; exit 1
fi
if grep -R -nE 'PRIVATE_KEY=[0-9a-fA-F]{64}|secretKey[[:space:]]*:[[:space:]]*\[[0-9, ]{30,}\]' "$ROOT" --exclude='test_no_secrets.sh'; then
  echo 'Possível segredo embutido no pacote.' >&2; exit 1
fi
grep -q '^\.env$' "$ROOT/.gitignore"
echo 'Varredura básica de segredos: OK'
