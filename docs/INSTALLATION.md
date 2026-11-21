# Instalação

## Requisitos gerais

Bash 4+, Node.js 20+ e npm. Execute `sudo bash ./unic_cripton` a partir de qualquer diretório.

## EVM

O módulo `modules/evm/installer.sh` é o instalador original. Ele cria projeto Hardhat e mantém o fluxo de `.env`, `RPC_URL`, `PRIVATE_KEY`, compilação e testes. Configure somente a chave em arquivo local protegido; nunca a compartilhe.

## Solana Devnet

1. Instale Solana CLI seguindo https://docs.anza.xyz/cli/install.
2. Crie uma carteira de teste local: `solana-keygen new --outfile ~/.config/solana/id.json`.
3. Proteja o arquivo: `chmod 600 ~/.config/solana/id.json`.
4. Configure Devnet: `solana config set --url https://api.devnet.solana.com`.
5. Obtenha SOL de teste: `solana airdrop 2`.
6. Instale o módulo: `bash modules/solana/install.sh`.
7. Execute `sudo bash ./unic_cripton` e escolha Solana Devnet.

Se usar `sudo`, confira o caminho da carteira. O padrão do módulo é o HOME do usuário efetivo (root); configure `SOLANA_KEYPAIR=/home/usuario/.config/solana/id.json` para apontar explicitamente para a carteira de teste. O arquivo deve continuar com permissões restritas.

## Outros módulos

TRON, Sui, Aptos e TON não possuem deploy habilitado. Seus adaptadores retornam código de indisponibilidade e não transmitem transações.
