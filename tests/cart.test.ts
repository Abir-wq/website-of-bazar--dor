import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fallbackProducts } from '../src/lib/catalog';
import { addCartItem, removeCartItem, readCart, toCartItem, cartTotal } from '../src/lib/cart';
test('adding from multiple sections cannot duplicate the same product', () => {
  const a = addCartItem([], fallbackProducts[0]);
  assert.equal(addCartItem(a, fallbackProducts[0]).length, 1);
  assert.equal(a.length, 1);
});
test('removing an item preserves others and recalculates the total', () => {
  const a = addCartItem(addCartItem([], fallbackProducts[0]), fallbackProducts[1]);
  const b = removeCartItem(a, fallbackProducts[0].id);
  assert.equal(b.length, 1);
  assert.equal(b[0].id, fallbackProducts[1].id);
  assert.equal(cartTotal(b), fallbackProducts[1].today);
  assert.equal(a.length, 2);
  assert.equal(cartTotal(removeCartItem(b, b[0].id)), 0);
});
test('cart survives a storage round trip and only stores required product fields', () => {
  const a = addCartItem([], fallbackProducts[0]);
  assert.deepEqual(readCart(JSON.stringify(a)), a);
  assert(!('markets' in a[0]));
});
test('invalid or corrupt storage never breaks the cart', () => {
  for (const saved of [null, 'not-json', 'null', '{}', '[null,{},false]'])
    assert.deepEqual(readCart(saved), []);
  const p = toCartItem(fallbackProducts[0]);
  const saved = JSON.stringify([p, p, { ...p, id: 2, today: -1 }, { ...p, id: 3, today: '148' }]);
  assert.deepEqual(readCart(saved), [p]);
});
