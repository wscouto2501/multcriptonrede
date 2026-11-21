#!/usr/bin/env bash
# Funções auxiliares seguras compartilhadas pelos módulos.
valid_yes(){ [[ "${1:-}" =~ ^([sS]|[sS][iI][mM])$ ]]; }
require_command(){ command -v "$1" >/dev/null 2>&1 || { echo "Dependência ausente: $1" >&2; return 1; }; }
