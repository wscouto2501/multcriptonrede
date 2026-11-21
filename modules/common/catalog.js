#!/usr/bin/env node
const fs = require('node:fs');
function load(file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!data || !Array.isArray(data.networks)) throw new Error('Catálogo precisa conter networks[].');
  const keys = new Set();
  for (const n of data.networks) {
    for (const field of ['key','name','family','module']) if (typeof n[field] !== 'string' || !n[field]) throw new Error(`Campo ${field} ausente em uma rede.`);
    if (keys.has(n.key)) throw new Error(`Chave de rede duplicada: ${n.key}`);
    keys.add(n.key);
    if (typeof n.enabled !== 'boolean' || typeof n.deploySupported !== 'boolean') throw new Error(`Flags inválidas em ${n.key}.`);
    if (n.deploySupported && !['evm','solana'].includes(n.module)) throw new Error(`Módulo sem implementação habilitada em ${n.key}.`);
  }
  return data;
}
const [action, file] = process.argv.slice(2);
try {
  const catalog = load(file);
  if (action === 'validate') console.log(`Catálogo válido: ${catalog.networks.length} redes.`);
  else if (action === 'list') for (const n of catalog.networks.filter(x => x.enabled)) {
    const clean = v => (v === undefined || v === null || v === '' ? '-' : String(v)).replace(/[\t\r\n]/g, ' ');
    console.log([n.key,n.name,n.family,n.module,n.environment || '',n.deploySupported,n.tokenStandards?.join(',') || '',n.reason || ''].map(clean).join('\t'));
  }
  else throw new Error('Uso: catalog.js validate|list arquivo-parametro');
} catch (e) { console.error(`Catálogo: ${e.message}`); process.exit(1); }
