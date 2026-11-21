# Changelog

## 2.0.0 — arquitetura multiblockchain

- Criado roteador central dirigido por `module` no catálogo.
- Preservado o instalador EVM recebido em `modules/evm/installer.sh`, com adaptação de caminho e seleção de rede pelo roteador.
- Ampliado catálogo com ambientes explícitos e redes Solana Devnet/Mainnet e TON.
- Implementado módulo Solana para mint SPL clássico e Token-2022 base em Devnet, com validação on-chain de supply/decimais, registro e confirmação reforçada.
- Criados adaptadores desativados para TRON, Sui, Aptos e TON.
- Adicionados testes locais, documentação, política de segurança, migração e relatório de testes.
