'use strict';
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {
  Connection, Keypair, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL
} = require('@solana/web3.js');
const {
  TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, MINT_SIZE, ACCOUNT_SIZE, createMint,
  getOrCreateAssociatedTokenAccount, getAccount, getMint, mintTo, setAuthority, AuthorityType
} = require('@solana/spl-token');
const { validateAddress, parseAmount, validateTokenName, validateSymbol } = require('./validate');

function loadKeypair(file) {
  const resolved = path.resolve(file.replace(/^~/, os.homedir()));
  const stat = fs.statSync(resolved);
  if (!stat.isFile()) throw new Error('Arquivo de keypair não é um arquivo regular.');
  if (process.platform !== 'win32' && (stat.mode & 0o077) !== 0) {
    throw new Error('Permissões inseguras no keypair. Execute: chmod 600 ' + resolved);
  }
  const secret = JSON.parse(fs.readFileSync(resolved, 'utf8'));
  if (!Array.isArray(secret) || secret.length !== 64 || secret.some(x => !Number.isInteger(x) || x < 0 || x > 255)) {
    throw new Error('Keypair inválido. Use o arquivo JSON criado pelo Solana CLI.');
  }
  return Keypair.fromSecretKey(Uint8Array.from(secret));
}
async function main() {
  const configPath = process.argv[2];
  if (!configPath) throw new Error('Uso: node create-token.js config.json');
  const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  if (cfg.environment !== 'devnet') throw new Error('Este módulo só permite implantação em Devnet. Mainnet está bloqueada.');
  const name = validateTokenName(cfg.name);
  const symbol = validateSymbol(cfg.symbol);
  const decimals = Number(cfg.decimals);
  const amount = parseAmount(cfg.initialSupply, decimals);
  const recipient = new PublicKey(validateAddress(cfg.recipient, 'Carteira destinatária'));
  const payer = loadKeypair(cfg.keypairPath || path.join(os.homedir(), '.config/solana/id.json'));
  const rpc = cfg.rpc || clusterApiUrl('devnet');
  if (!/^https:\/\//i.test(rpc)) throw new Error('RPC deve usar HTTPS.');
  const connection = new Connection(rpc, 'confirmed');
  const genesis = await connection.getGenesisHash();
  const DEVNET_GENESIS = 'GH7ome3EiwEr7tu9JuTh2dpYWBJK3z69Xm1ZE3MEE6JC';
  if (genesis !== DEVNET_GENESIS) throw new Error(`RPC não é Solana Devnet. Genesis hash recebido: ${genesis}`);
  const balance = await connection.getBalance(payer.publicKey, 'confirmed');
  if (balance <= 0) throw new Error('Carteira pagadora sem SOL Devnet. Solicite SOL no faucet oficial.');
  const mintRent = await connection.getMinimumBalanceForRentExemption(MINT_SIZE);
  const tokenAccountRent = await connection.getMinimumBalanceForRentExemption(ACCOUNT_SIZE);
  const estimatedMinimum = mintRent + tokenAccountRent + 100000;
  console.log(`Estimativa mínima aproximada (rent + margem de taxas): ${(estimatedMinimum / LAMPORTS_PER_SOL).toFixed(6)} SOL`);
  if (balance < estimatedMinimum) throw new Error('Saldo Devnet insuficiente para rent-exemption e margem de taxas estimadas.');

  if (!['spl-token', 'token-2022'].includes(cfg.standard)) throw new Error('Padrão de token inválido.');
  const programId = cfg.standard === 'token-2022' ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID;
  const mintAuthority = payer.publicKey;
  const freezeAuthority = cfg.freezeEnabled ? payer.publicKey : null;
  console.log(`Rede confirmada: Solana Devnet (${genesis})`);
  console.log(`Pagador/autoridade inicial: ${payer.publicKey.toBase58()}`);
  console.log(`Destinatário: ${recipient.toBase58()}`);
  console.log(`Padrão: ${cfg.standard === 'token-2022' ? 'Token-2022' : 'SPL Token clássico'}`);
  console.log(`Saldo pagador: ${(balance / LAMPORTS_PER_SOL).toFixed(6)} SOL`);

  const mint = await createMint(connection, payer, mintAuthority, freezeAuthority, decimals, Keypair.generate(), { commitment: 'confirmed' }, programId);
  const ata = await getOrCreateAssociatedTokenAccount(connection, payer, mint, recipient, false, 'confirmed', undefined, programId);
  const mintSignature = await mintTo(connection, payer, mint, ata.address, payer, amount, [], { commitment: 'confirmed' }, programId);
  const mintStatus = await connection.confirmTransaction(mintSignature, 'confirmed');
  if (mintStatus.value.err) throw new Error('Falha ao confirmar emissão inicial.');

  let mintAuthorityRemaining = payer.publicKey.toBase58();
  let revokeSignature = null;
  if (cfg.revokeMintAuthority === true) {
    revokeSignature = await setAuthority(connection, payer, mint, payer.publicKey, AuthorityType.MintTokens, null, [], { commitment: 'confirmed' }, programId);
    const status = await connection.confirmTransaction(revokeSignature, 'confirmed');
    if (status.value.err) throw new Error('Falha ao revogar mint authority.');
    mintAuthorityRemaining = null;
  }
  const [mintInfo, tokenAccountInfo] = await Promise.all([
    getMint(connection, mint, 'confirmed', programId),
    getAccount(connection, ata.address, 'confirmed', programId)
  ]);
  const actualSupply = mintInfo.supply.toString();
  const expectedMintAuthority = cfg.revokeMintAuthority ? null : payer.publicKey;
  const expectedFreezeAuthority = cfg.freezeEnabled ? payer.publicKey : null;
  if (mintInfo.decimals !== decimals || actualSupply !== amount.toString() || tokenAccountInfo.amount !== amount) throw new Error('Validação on-chain falhou: supply, saldo ou decimais divergentes.');
  if ((mintInfo.mintAuthority && !expectedMintAuthority) || (!mintInfo.mintAuthority && expectedMintAuthority) || (mintInfo.mintAuthority && !mintInfo.mintAuthority.equals(expectedMintAuthority))) throw new Error('Validação on-chain falhou: mint authority divergente.');
  if ((mintInfo.freezeAuthority && !expectedFreezeAuthority) || (!mintInfo.freezeAuthority && expectedFreezeAuthority) || (mintInfo.freezeAuthority && !mintInfo.freezeAuthority.equals(expectedFreezeAuthority))) throw new Error('Validação on-chain falhou: freeze authority divergente.');
  const explorer = `https://explorer.solana.com/address/${mint.toBase58()}?cluster=devnet`;
  const [mintSignatures, accountSignatures] = await Promise.all([
    connection.getSignaturesForAddress(mint, { limit: 10 }),
    connection.getSignaturesForAddress(ata.address, { limit: 10 })
  ]);
  const signatures = [...new Set([...mintSignatures, ...accountSignatures].map(x => x.signature))];
  const result = {
    createdAt: new Date().toISOString(), module: 'solana', network: 'Solana Devnet', environment: 'devnet',
    standard: cfg.standard, name, symbol, decimals, initialSupply: cfg.initialSupply,
    mintAddress: mint.toBase58(), tokenAccount: ata.address.toBase58(), recipient: recipient.toBase58(),
    payer: payer.publicKey.toBase58(), mintAuthority: mintAuthorityRemaining,
    freezeAuthority: freezeAuthority ? freezeAuthority.toBase58() : null,
    transactionSignature: mintSignature, transactionSignatures: signatures, authorityRevocationSignature: revokeSignature,
    explorer, validation: { confirmed: true, supplyRaw: actualSupply, recipientBalanceRaw: tokenAccountInfo.amount.toString(), decimals: mintInfo.decimals, mintAuthorityVerified: true, freezeAuthorityVerified: true }
  };
  fs.writeFileSync(cfg.output, JSON.stringify(result, null, 2) + '\n', { mode: 0o600, flag: 'wx' });
  console.log('\nTOKEN CRIADO E VALIDADO NA DEVNET');
  console.log(JSON.stringify(result, null, 2));
}
main().catch(err => { console.error('ERRO:', err.message); process.exitCode = 1; });
