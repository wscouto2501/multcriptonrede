const test = require('node:test');
const assert = require('node:assert/strict');
const { parseAmount, validateTokenName, validateSymbol } = require('../validate');
test('converte supply decimal para unidades inteiras sem float', () => {
  assert.equal(parseAmount('12.345', 3), 12345n);
  assert.equal(parseAmount('1', 0), 1n);
});
test('rejeita supply inválido ou precisão excedente', () => {
  assert.throws(() => parseAmount('0', 9));
  assert.throws(() => parseAmount('1.001', 2));
  assert.throws(() => parseAmount('1e6', 9));
  assert.throws(() => parseAmount('18446744073709551616', 0));
});
test('valida nome e símbolo', () => {
  assert.equal(validateTokenName('Minha Moeda'), 'Minha Moeda');
  assert.equal(validateSymbol('MMOEDA'), 'MMOEDA');
  assert.throws(() => validateTokenName(''));
  assert.throws(() => validateSymbol('Símbolo!'));
});
test('valida endereço base58 de 32 bytes', () => {
  const { validateAddress } = require('../validate');
  assert.equal(validateAddress('11111111111111111111111111111111'), '11111111111111111111111111111111');
  assert.throws(() => validateAddress('nao-e-um-endereco'));
});
