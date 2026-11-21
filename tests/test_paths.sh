#!/usr/bin/env bash
set -Eeuo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
while IFS= read -r -d '' f; do bash -n "$f"; done < <(find "$ROOT" -type f -name '*.sh' -print0)
TMP="$(mktemp -d '/tmp/unic cript on.XXXXXX')"
trap 'rm -rf "$TMP"' EXIT
cp -a "$ROOT" "$TMP/multrede"
(cd / && node "$TMP/multrede/modules/common/catalog.js" validate "$TMP/multrede/parametro")
echo 'Sintaxe Bash e caminhos com espaços: OK'
