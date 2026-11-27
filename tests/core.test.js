const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const context = {
  console, Math, Date, isFinite, Number, String, parseFloat,
  todayStr: () => '2026-11-27',
  t: (key) => key,
  round1: (value) => Math.round(value * 10) / 10,
  money: (value) => '$' + Number(value || 0).toFixed(2),
  signedMoney: (value) => '$' + Number(value || 0).toFixed(2),
  pct: (value) => Number(value || 0).toFixed(1) + '%',
  nf: (value) => String(value),
  monthsFmt: (value) => String(value),
  esc: (value) => String(value)
};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/js/config.js'), 'utf8'), context);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/js/calc.js'), 'utf8'), context);

function validProject() {
  const p = context.createBlankProject('Test Location');
  p.machine = { type: 'snack', age: 5, condition: 'good', monitoring: 'yes', payments: ['card', 'mobile'] };
  p.diag = { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, q6: 0 };
  p.baseline.monthlySales = 3000;
  p.baseline.monthlyOrders = 900;
  p.baseline.profitMode = 'actual';
  p.baseline.actualProfit = 600;
  return p;
}

test('new projects assume zero growth until percentages are entered', () => {
  const p = validProject();
  const m = context.compute(p);
  assert.equal(m.growth.totalRevenueGrowthPct, 0);
  assert.equal(m.haha.sales, m.old.sales);
  assert.deepEqual(
    ['variety', 'basket', 'stock', 'payment'].map(k => p.uplift[k].pct),
    [0, 0, 0, 0]
  );
});

test('daily-order model thresholds and boundaries are exact', () => {
  const cases = [
    [9.99, 'mini360'], [10, 'plus440'], [17.99, 'plus440'],
    [18, 'pro542'], [34.99, 'pro542'], [35, 'max660'],
    [55, 'max660'], [55.01, 'ultra1200']
  ];
  for (const [orders, expected] of cases) {
    assert.equal(context.recommendedModel(orders, 'snack', 'office'), expected);
  }
  assert.equal(context.recommendedModel(35, 'snack', 'hotel'), 'max620s');
  assert.equal(context.recommendedModel(60, 'frozen', 'hotel'), 'freezer550');
});

test('growth forecast does not silently upgrade the current-demand recommendation', () => {
  const p = validProject();
  p.uplift.variety.pct = 12;
  p.uplift.basket.pct = 10;
  p.uplift.stock.pct = 8;
  p.uplift.payment.pct = 5;
  const m = context.compute(p);
  assert.equal(m.invest.recDailyOrders, 30);
  assert.equal(m.invest.recModelId, 'pro542');
  assert.equal(m.invest.forecastModelId, 'max660');
  assert.ok(m.warnings.some(w => w.code === 'forecastCapacity'));
});

test('manual selected model is distinct from automatic recommendation', () => {
  const p = validProject();
  p.invest.modelManual = true;
  p.invest.modelId = 'mini360';
  const m = context.compute(p);
  assert.equal(m.invest.model.id, 'mini360');
  assert.equal(m.invest.recModel.id, 'pro542');
});

test('100% stress case matches projected P&L and stress delta compares with current profit', () => {
  const p = validProject();
  p.uplift.variety.pct = 10;
  const m = context.compute(p);
  assert.ok(Math.abs(m.stress[0].profit - m.haha.profit) < 1e-8);
  assert.ok(Math.abs(m.stress[0].delta - m.invest.delta) < 1e-8);
  assert.equal(m.stress[2].delta, m.stress[2].profit - m.old.profit);
});

test('old-machine profit above sales produces a warning instead of silent correction', () => {
  const p = validProject();
  p.baseline.actualProfit = 3500;
  const m = context.compute(p);
  assert.equal(m.old.profit, 3500);
  assert.ok(m.warnings.some(w => w.code === 'profitExceedsSales'));
});

test('negative machine age cannot complete Step 01', () => {
  const p = validProject();
  p.machine.age = -1;
  assert.equal(context.compute(p).step1Complete, false);
});

test('resetting growth assumptions returns all drivers to zero and not agreed', () => {
  const p = validProject();
  for (const key of ['variety', 'basket', 'stock', 'payment']) {
    p.uplift[key].pct = 12;
    p.uplift[key].accept = 'yes';
    p.uplift[key].custom = true;
  }
  context.syncUpliftBase(p, true);
  for (const key of ['variety', 'basket', 'stock', 'payment']) {
    assert.equal(p.uplift[key].pct, 0);
    assert.equal(p.uplift[key].accept, 'no');
    assert.equal(p.uplift[key].custom, false);
  }
});
