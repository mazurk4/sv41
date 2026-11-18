// 喫茶こもれびの決まりを確かめる自動テスト
// 実行のしかた: node --test
const test = require('node:test');
const assert = require('node:assert/strict');
const { getStatus, checkReservation } = require('../rules.js');

// 曜日の番号(日曜日が 0)
const MON = 1;
const WED = 3;

test('月曜日の 10時台は「営業中」', () => {
  assert.equal(getStatus(MON, 10).open, true);
});

test('月曜日の 7時台は「準備中」', () => {
  assert.equal(getStatus(MON, 7).open, false);
});

test('月曜日の 18時台は「本日の営業は終わりました」', () => {
  const status = getStatus(MON, 18);
  assert.equal(status.open, false);
  assert.equal(status.message, '本日の営業は終わりました');
});

test('水曜日は「本日は定休日です」', () => {
  assert.equal(getStatus(WED, 10).message, '本日は定休日です');
});

test('2名・13:00 は予約できる', () => {
  assert.equal(checkReservation({ nickname: 'こもれび', time: '13:00', people: '2' }).ok, true);
});

test('6名までは予約できる', () => {
  assert.equal(checkReservation({ nickname: 'こもれび', time: '13:00', people: '6' }).ok, true);
});

test('7名は予約できない', () => {
  assert.equal(checkReservation({ nickname: 'こもれび', time: '13:00', people: '7' }).ok, false);
});

test('選択肢にない 19:00 は予約できない', () => {
  assert.equal(checkReservation({ nickname: 'こもれび', time: '19:00', people: '2' }).ok, false);
});

test('ニックネームが空だと予約できない', () => {
  assert.equal(checkReservation({ nickname: '', time: '13:00', people: '2' }).ok, false);
});
