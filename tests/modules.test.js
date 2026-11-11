const test = require('node:test');
const assert = require('node:assert');
const { statusOf } = require('../src/controllers/feeController');
const { validate } = require('../src/controllers/leaveController');

test('TC-FEE-02: payment status derived from amounts', () => {
  assert.strictEqual(statusOf(1000, 1000), 'Paid');
  assert.strictEqual(statusOf(1000, 400), 'Partially Paid');
  assert.strictEqual(statusOf(1000, 0), 'Pending');
});

test('TC-LEAVE-01: valid leave request passes validation', () => {
  assert.deepStrictEqual(validate({ from_date: '2026-11-01', to_date: '2026-11-03', reason: 'Family function' }), []);
});

test('TC-LEAVE-01: bad dates / missing reason are rejected', () => {
  assert.ok(validate({ from_date: '2026-11-05', to_date: '2026-11-03', reason: 'x' }).length >= 2);
  assert.ok(validate({ from_date: 'abc', to_date: '', reason: 'Trip' }).length >= 2);
});
