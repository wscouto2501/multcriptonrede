#!/usr/bin/env bash
# Não habilite set -x em operações que envolvam carteiras ou credenciais.
umask 077
secure_dir(){ mkdir -p -- "$1"; chmod 700 -- "$1"; }
secure_file(){ chmod 600 -- "$1"; }
