'use strict';
const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
function base58Decode(value) {
  let number = 0n;
  for (const char of value) {
    const digit = ALPHABET.indexOf(char);
    if (digit < 0) throw new Error('caractere base58 inválido');
    number = number * 58n + BigInt(digit);
  }
  let hex = number.toString(16);
  if (hex.length % 2) hex = '0' + hex;
  const body = number === 0n ? Buffer.alloc(0) : Buffer.from(hex, 'hex');
  let leading = 0;
  while (leading < value.length && value[leading] === '1') leading++;
  return Buffer.concat([Buffer.alloc(leading), body]);
}
function validateAddress(value, label = 'endereço') {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} obrigatório.`);
  try {
    const address = value.trim();
    if (address.length < 32 || address.length > 44 || base58Decode(address).length !== 32) throw new Error();
    return address;
  } catch { throw new Error(`${label} Solana inválido.`); }
}
function parseAmount(value, decimals) {
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 9) throw new Error('Decimais devem estar entre 0 e 9.');
  const s = String(value);
  if (!/^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(s)) throw new Error('Supply deve ser número positivo, sem separador de milhar ou notação científica.');
  const [whole, fraction = ''] = s.split('.');
  if (fraction.length > decimals) throw new Error(`Supply possui mais de ${decimals} casas decimais.`);
  const units = BigInt(whole) * (10n ** BigInt(decimals)) + BigInt((fraction + '0'.repeat(decimals)).slice(0, decimals) || '0');
  if (units <= 0n) throw new Error('Supply deve ser maior que zero.');
  if (units > 18446744073709551615n) throw new Error('Supply excede o limite u64 do token program.');
  return units;
}
function validateTokenName(name) {
  if (typeof name !== 'string' || !name.trim() || name.trim().length > 32) throw new Error('Nome obrigatório (máximo 32 caracteres).');
  return name.trim();
}
function validateSymbol(symbol) {
  if (typeof symbol !== 'string' || !/^[A-Za-z0-9]{1,10}$/.test(symbol)) throw new Error('Símbolo deve conter de 1 a 10 letras/números.');
  return symbol;
}
module.exports = { validateAddress, parseAmount, validateTokenName, validateSymbol };
