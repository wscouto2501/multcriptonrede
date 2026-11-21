# Migração para a versão multiblockchain

1. Faça backup da pasta atual `serverlocal/cript/multrede/`.
2. Extraia o ZIP preservando a pasta `multrede/`.
3. Copie o conteúdo de `multrede/` para `serverlocal/cript/multrede/`, substituindo `unic_cripton` e `parametro` e adicionando `modules/`, `tests/`, `docs/` e os arquivos Markdown.
4. Confira permissões: `chmod +x unic_cripton modules/evm/installer.sh modules/solana/*.sh modules/{tron,sui,aptos,ton}/module.sh tests/*.sh`.
5. Valide: `bash tests/run_all.sh`.
6. Execute `sudo bash ./unic_cripton` e selecione primeiro Polygon (EVM, com fluxo original) ou Solana Devnet.

Não sobrescreva seus projetos de token já criados em `/root/`. O ZIP não contém carteiras, `.env`, dependências instaladas ou dados de implantação.

A reversão consiste em restaurar o backup anterior de `unic_cripton` e `parametro`.
