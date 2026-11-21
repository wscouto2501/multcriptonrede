# UNIC_CRIPTON — instalador multiblockchain

O `unic_cripton` é o ponto de entrada e roteia cada rede pelo campo `module` do catálogo `parametro`. O fluxo EVM existente foi preservado em `modules/evm/installer.sh`; o novo roteador limita a lista à rede escolhida e delega a execução ao instalador legado.

## Estado de suporte

| Rede/ambiente | Módulo | Padrão | Deploy |
|---|---|---|---|
| Polygon, Ethereum, BNB, Arbitrum, Optimism, Base, Avalanche (mainnet) | `evm` | ERC-20 | Mantido como no instalador recebido |
| Solana Devnet | `solana` | SPL Token / Token-2022 base | Implementação Devnet presente; primeiro teste on-chain ainda pendente |
| Solana Mainnet | `solana` | SPL Token / Token-2022 | Bloqueado |
| TRON, Sui, Aptos, TON | adaptadores | TRC-20, Move/Fungible Asset, Jettons | Desativado |

## Execução

```bash
sudo bash ./unic_cripton
```

Execute a partir de qualquer diretório; o roteador resolve seu próprio caminho. O módulo EVM ainda cria um projeto independente em `/root/<slug>` como o instalador original. Solana cria `/root/<slug>-solana-devnet`.

## Dependências

- Roteador: Bash e Node.js 20+.
- EVM: mantém Hardhat, ethers, OpenZeppelin e o fluxo original; `npm install` ocorre no projeto gerado.
- Solana: Node.js 20+, Solana CLI, keypair local com permissões seguras, dependências fixadas e SOL Devnet.

Consulte `docs/` e os READMEs de cada módulo antes de operar.
