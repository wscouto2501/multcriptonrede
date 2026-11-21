# Redes e disponibilidade

| Rede | Família/módulo | Ambiente | Padrão | Estado |
|---|---|---|---|---|
| Polygon PoS | EVM / evm | Mainnet | ERC-20 | Herdado do instalador original |
| Ethereum | EVM / evm | Mainnet | ERC-20 | Herdado do instalador original |
| BNB Smart Chain | EVM / evm | Mainnet | ERC-20 | Herdado do instalador original |
| Arbitrum One | EVM / evm | Mainnet | ERC-20 | Herdado do instalador original |
| OP Mainnet | EVM / evm | Mainnet | ERC-20 | Herdado do instalador original |
| Base | EVM / evm | Mainnet | ERC-20 | Herdado do instalador original |
| Avalanche C-Chain | EVM / evm | Mainnet | ERC-20 | Herdado do instalador original |
| Solana | Solana / solana | Devnet | SPL Token, Token-2022 base | Implementação Devnet; sem extensões de metadata |
| Solana | Solana / solana | Mainnet | SPL Token, Token-2022 | Bloqueado |
| TRON | tron | Testnet/Mainnet | TRC-20 | Adaptador não implantável |
| Sui | sui | Testnet/Mainnet | Coin/Move | Adaptador não implantável |
| Aptos | aptos | Testnet/Mainnet | Fungible Asset/Move | Adaptador não implantável |
| TON | ton | Testnet/Mainnet | Jettons | Adaptador não implantável |

As redes EVM preservam suas chaves e chain IDs do catálogo original. Redes não-EVM não usam `chainId` EVM. Os endpoints de redes sem implementação não foram inventados nem preenchidos com URLs não verificadas.

## Referências oficiais consultadas

- Solana clusters/RPC: https://solana.com/docs/references/clusters
- RPC `getGenesisHash`: https://solana.com/docs/rpc/http/getgenesishash
- Criar mint com SPL Token: https://solana.com/docs/tokens/basics/create-mint
- Token-2022 e quickstart: https://solana.com/docs/tokens/quickstart
- JavaScript SDK e estado do web3.js legado: https://solana.com/docs/clients/official/javascript
