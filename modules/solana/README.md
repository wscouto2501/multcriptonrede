# Módulo Solana

**Estado:** criação de mint e emissão inicial implementadas para Devnet; o deploy Mainnet não é permitido.

## Padrões

- **SPL Token clássico:** usa o Token Program original.
- **Token-2022:** usa o Token Extension Program, mas esta versão cria somente o mint base. Nenhuma extensão adicional (metadata, transfer fee, permanent delegate, pause etc.) é ativada.

O código usa `@solana/web3.js` 1.x com `@solana/spl-token`, combinação demonstrada na documentação de criação de mint da Solana. A documentação atual classifica web3.js 1.x como legado/manutenção e recomenda a migração para Kit/web3.js v3 em novos projetos; `@solana/spl-token` atual não funciona com web3.js v3. As versões estão fixadas para manter compatibilidade reproduzível.

## Pré-requisitos

- Node.js 20+
- Solana CLI instalado (comando `solana`)
- Carteira JSON criada localmente pelo Solana CLI; padrão `~/.config/solana/id.json`
- SOL de Devnet para taxas e rent-exemption

Nunca cole seed phrase ou chave privada no terminal/chat. O módulo lê o arquivo keypair local, exige permissões sem acesso de grupo/outros (no Linux/macOS) e nunca copia seu conteúdo para o projeto ou logs.

## Instalação e uso

```bash
bash modules/solana/install.sh
solana config set --url https://api.devnet.solana.com
solana airdrop 2
sudo bash ./unic_cripton
```

Ou configure `SOLANA_KEYPAIR` e `SOLANA_RPC_URL` antes de executar. O módulo verifica o genesis hash de Devnet e rejeita endpoints de outra rede. O RPC público é limitado e não deve ser usado em produção.

O fluxo solicita padrão, nome, símbolo, supply, decimais, destinatário, freeze authority e mint authority. A autoridade de mint/freeze suportada nesta versão é a carteira pagadora local; autoridade externa/customizada e assinatura por hardware wallet ainda não estão implementadas.

Revogar mint authority é irreversível e requer confirmação textual própria. Freeze authority pode ser mantida ou criada como nula. A capacidade de burn não é um controle administrativo global: titulares podem queimar tokens de suas próprias contas conforme o programa/token account permitir.

## Metadados e extensões

Metadados on-chain não estão implementados nesta versão. Token-2022 é criado sem extensões extras. Não informe o token como contendo metadata, taxas, pausa ou outras extensões.

## Testes

```bash
npm test
```

Os testes locais cobrem validação de nome/símbolo/supply/endereço. A criação on-chain real exige carteira e SOL de Devnet e deve ser executada separadamente; nenhum teste on-chain foi executado durante a preparação deste pacote.
