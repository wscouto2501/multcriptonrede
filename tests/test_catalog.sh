#!/usr/bin/env bash
set -Eeuo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
node "$ROOT/modules/common/catalog.js" validate "$ROOT/parametro"
node - "$ROOT/parametro" <<'NODE'
const fs=require('node:fs'); const c=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const evm=c.networks.filter(n=>n.family==='evm'&&n.enabled&&n.deploySupported);
if(evm.length!==7) throw new Error(`Esperadas 7 redes EVM ativas; recebidas ${evm.length}`);
const s=c.networks.find(n=>n.key==='solana');
if(!s||s.module!=='solana'||s.environment!=='devnet'||!s.deploySupported) throw new Error('Solana Devnet deveria estar cadastrada como deploy disponível.');
for(const n of c.networks.filter(n=>['tron','sui','aptos','ton'].includes(n.module))) if(n.deploySupported) throw new Error(`Deploy indevido em ${n.key}`);
console.log('Catálogo e preservação EVM: OK');
NODE
