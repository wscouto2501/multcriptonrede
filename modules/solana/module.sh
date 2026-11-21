#!/usr/bin/env bash
set -Eeuo pipefail
HERE="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT="${UNIC_CRIPTON_ROOT:-$(cd "$HERE/../.." && pwd)}"
source "$ROOT/modules/common/logging.sh"
source "$ROOT/modules/common/security.sh"

[[ "${EUID:-$(id -u)}" -eq 0 ]] || { log_error 'Execute como root.'; exit 1; }
command -v node >/dev/null 2>&1 || { log_error 'Node.js 20+ obrigatório.'; exit 1; }
node -e 'process.exit(Number(process.versions.node.split(".")[0]) >= 20 ? 0 : 1)' || { log_error 'Atualize Node.js para 20+.'; exit 1; }
if ! command -v solana >/dev/null 2>&1; then
  log_warn 'Solana CLI não encontrado. Instale seguindo https://docs.anza.xyz/cli/install antes de continuar.'
  exit 2
fi
solana --version

if [[ ! -d "$HERE/node_modules/@solana/spl-token" ]]; then
  echo 'Dependências Solana ainda não instaladas.'
  read -r -p 'Deseja instalar as dependências fixadas do módulo? (s/N): ' install_answer
  [[ "$install_answer" =~ ^[sS]$ ]] || exit 2
  bash "$HERE/install.sh"
fi

RPC_URL="${SOLANA_RPC_URL:-https://api.devnet.solana.com}"
KEYPAIR_PATH="${SOLANA_KEYPAIR:-$HOME/.config/solana/id.json}"
[[ -f "$KEYPAIR_PATH" ]] || { log_error "Keypair não encontrado: $KEYPAIR_PATH. Crie uma carteira de teste com solana-keygen e configure SOLANA_KEYPAIR."; exit 2; }

printf '\n=== CRIAÇÃO DE TOKEN SOLANA (SOMENTE DEVNET) ===\n'
printf 'RPC: %s\nKeypair local: %s\n' "$RPC_URL" "$KEYPAIR_PATH"
read -r -p 'Padrão [1=SPL Token clássico, 2=Token-2022]: ' standard_choice
case "$standard_choice" in 1|'') standard='spl-token'; standard_label='SPL Token clássico';; 2) standard='token-2022'; standard_label='Token-2022';; *) log_error 'Padrão inválido.'; exit 1;; esac
read -r -p 'Nome do token (máx. 32 caracteres): ' token_name
read -r -p 'Símbolo (1 a 10 letras/números): ' token_symbol
read -r -p 'Supply inicial: ' initial_supply
read -r -p 'Decimais (0 a 9) [9]: ' decimals
decimals="${decimals:-9}"
read -r -p 'Carteira destinatária (base58): ' recipient
read -r -p 'Manter freeze authority na carteira pagadora? (s/N): ' freeze_answer
freeze_enabled=false
[[ "$freeze_answer" =~ ^[sS]$ ]] && freeze_enabled=true
read -r -p 'Manter mint authority para futuras emissões? (s/N): ' mint_answer
revoke_mint=false
if [[ ! "$mint_answer" =~ ^[sS]$ ]]; then
  echo 'ATENÇÃO: revogar mint authority é irreversível. O token não poderá receber novas emissões.'
  read -r -p 'Confirma a revogação após a emissão inicial? (digite REVOGAR): ' revoke_answer
  [[ "$revoke_answer" == 'REVOGAR' ]] || { echo 'Cancelado.'; exit 0; }
  revoke_mint=true
fi

# Valida parâmetros localmente antes de qualquer transação.
node - "$HERE" "$token_name" "$token_symbol" "$initial_supply" "$decimals" "$recipient" <<'NODE'
const path=require('node:path'); const v=require(path.join(process.argv[2],'validate.js'));
v.validateTokenName(process.argv[3]); v.validateSymbol(process.argv[4]);
v.parseAmount(process.argv[5],Number(process.argv[6])); v.validateAddress(process.argv[7],'Carteira destinatária');
NODE

slug="$(printf '%s' "$token_name" | iconv -f UTF-8 -t ASCII//TRANSLIT | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g;s/-\+/-/g;s/^-//;s/-$//')"
[[ -n "$slug" ]] || { log_error 'Nome inválido para diretório.'; exit 1; }
PROJECT_DIR="/root/${slug}-solana-devnet"
[[ ! -e "$PROJECT_DIR" ]] || { log_error "Diretório já existe: $PROJECT_DIR"; exit 1; }
secure_dir "$PROJECT_DIR"
CONFIG_FILE="$PROJECT_DIR/.solana-config.json"
OUTPUT_FILE="$PROJECT_DIR/deployment.json"
TOKEN_NAME="$token_name" TOKEN_SYMBOL="$token_symbol" INITIAL_SUPPLY="$initial_supply" DECIMALS="$decimals" RECIPIENT="$recipient" STANDARD="$standard" RPC_URL="$RPC_URL" KEYPAIR_PATH="$KEYPAIR_PATH" FREEZE_ENABLED="$freeze_enabled" REVOKE_MINT="$revoke_mint" OUTPUT_FILE="$OUTPUT_FILE" node - "$CONFIG_FILE" <<'NODE'
const fs=require('node:fs'); const p=process.argv[2];
const c={environment:'devnet',name:process.env.TOKEN_NAME,symbol:process.env.TOKEN_SYMBOL,initialSupply:process.env.INITIAL_SUPPLY,decimals:Number(process.env.DECIMALS),recipient:process.env.RECIPIENT,standard:process.env.STANDARD,rpc:process.env.RPC_URL,keypairPath:process.env.KEYPAIR_PATH,freezeEnabled:process.env.FREEZE_ENABLED==='true',revokeMintAuthority:process.env.REVOKE_MINT==='true',output:process.env.OUTPUT_FILE};
fs.writeFileSync(p,JSON.stringify(c,null,2)+'\n',{mode:0o600,flag:'wx'});
NODE
chmod 600 "$CONFIG_FILE"

printf '\nRESUMO ANTES DA TRANSAÇÃO\n'
printf 'Rede: Solana Devnet\nPadrão: %s\nNome/símbolo: %s (%s)\nSupply: %s\nDecimais: %s\nDestinatário: %s\nFreeze authority: %s\nMint authority após emissão: %s\n' "$standard_label" "$token_name" "$token_symbol" "$initial_supply" "$decimals" "$recipient" "$([[ "$freeze_enabled" == true ]] && echo mantida || echo nenhuma)" "$([[ "$revoke_mint" == true ]] && echo revogada || echo mantida)"
echo 'O processo transmitirá transações à Solana Devnet e pagará taxas em SOL Devnet.'
read -r -p 'Para autorizar, digite CRIAR-NA-DEVNET: ' final_confirm
[[ "$final_confirm" == 'CRIAR-NA-DEVNET' ]] || { rm -f "$CONFIG_FILE"; echo 'Operação cancelada.'; exit 0; }

set +x
node "$HERE/create-token.js" "$CONFIG_FILE"
rm -f "$CONFIG_FILE"
printf '\nRegistro sem segredos: %s\n' "$OUTPUT_FILE"
