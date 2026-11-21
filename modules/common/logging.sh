#!/usr/bin/env bash
log_info(){ printf '[INFO] %s\n' "$*"; }
log_warn(){ printf '[AVISO] %s\n' "$*" >&2; }
log_error(){ printf '[ERRO] %s\n' "$*" >&2; }
