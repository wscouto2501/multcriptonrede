# Segurança

- Nunca informe seed phrase ou chave privada no chat.
- Não versionar `.env`, keypair, keystore, mnemonic ou backup de carteira.
- A carteira Solana deve permanecer fora da pasta do projeto; permissões POSIX devem ser `600` no arquivo e `700` no diretório.
- O módulo Solana aceita keypair JSON local do Solana CLI, não aceita seed phrase e não registra o segredo.
- O módulo Solana só opera em Devnet e verifica o genesis hash antes de assinar.
- Toda transmissão exige confirmação textual. A revogação de mint authority exige uma segunda confirmação e é irreversível.
- O arquivo de resultado contém somente dados públicos da implantação; configuração temporária é removida após o processo.
- Não habilite `set -x` em trechos que manipulem carteiras.
- O instalador EVM legado permanece praticamente inalterado. Use carteira dedicada, proteja `.env` e revise o script legado antes de operar em mainnet.
