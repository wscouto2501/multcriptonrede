# Arquitetura

## Orquestrador

`unic_cripton` resolve `ROOT_DIR` a partir de `BASH_SOURCE`, valida `parametro` via Node.js e lista redes `enabled`. Para cada seleção lê `module`, `environment`, `deploySupported`, `tokenStandards` e `reason`. A seleção não é condicionada a `family == evm`.

Antes de delegar, exige `deploySupported: true`. Módulo ausente/desconhecido interrompe antes de qualquer assinatura. Não há `eval` nem execução de comandos construídos a partir de valores do catálogo.

## Contrato dos módulos

Cada módulo deve expor diagnóstico de requisitos, padrões, configuração, validação, estimativa de custo, deploy, verificação e apresentação do resultado. A interface de shell comum em `modules/common/module-interface.sh` fornece o comportamento seguro de indisponibilidade. O módulo Solana implementa seu fluxo de criação/verificação em Node.js; EVM preserva o instalador legado.

## Compatibilidade EVM

O script original recebido foi copiado integralmente para `modules/evm/installer.sh`, com alterações limitadas ao caminho do catálogo, filtro da rede selecionada e seleção automática da rede escolhida pelo roteador. Contrato, perguntas, scripts Hardhat, defaults mint/burn e geração do projeto foram mantidos.
