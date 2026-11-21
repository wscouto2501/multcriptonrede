#!/usr/bin/env bash
# Contrato documentado: cada módulo implementa diagnóstico, padrões, validação,
# estimativa, deploy e verificação. Módulos não prontos devem retornar código 2.
module_not_implemented(){ printf 'Módulo %s: deploy ainda não implementado.\n' "$1" >&2; return 2; }
