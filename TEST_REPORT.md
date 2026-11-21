# Relatório de testes

Data: 2026-11-21

## Executados nesta preparação

| Teste | Resultado |
|---|---|
| JSON do catálogo, chaves únicas e campos mínimos | PASSOU |
| Preservação das 7 entradas EVM habilitadas | PASSOU |
| Solana Devnet cadastrada; módulos TRON/Sui/Aptos/TON desabilitados | PASSOU |
| Roteador reconhece módulos EVM e Solana; cancelamento 0 | PASSOU |
| Sintaxe Bash dos scripts | PASSOU |
| Execução do parser a partir de diretório diferente e caminho com espaços | PASSOU |
| Varredura básica de arquivos e padrões de segredos | PASSOU |
| Testes Node de supply, decimais, nome, símbolo e endereço base58 | 4 PASSARAM |
| `node --check` nos arquivos JavaScript | PASSOU |

## Não executados / pendentes

- `npm install` do módulo Solana: tentativa expirou por indisponibilidade/latência de acesso ao registry neste ambiente. O `package.json` fixa `@solana/web3.js` 1.98.4 e `@solana/spl-token` 0.4.14; a instalação deve ser executada no servidor.
- Teste on-chain Devnet com carteira e SOL: não executado; nenhum keypair do usuário foi fornecido ou utilizado.
- Deploy EVM de regressão e Hardhat tests: não executados porque exigem dependências de rede e ambiente Hardhat; o script EVM recebido foi preservado e sua sintaxe shell validada.
- Testes de TRON, Sui, Aptos e TON: não aplicáveis a deploy; módulos permanecem desativados.

**Conclusão:** testes locais de catálogo, roteador, caminhos, segurança básica e validações Solana passaram. Não foi realizado deploy real em nenhuma rede. Antes de usar Solana, instale as dependências, faça o primeiro teste em Devnet com carteira de teste e confira as transações no Explorer.
