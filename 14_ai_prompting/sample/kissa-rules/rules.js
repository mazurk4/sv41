// 喫茶こもれびの決まり
// 第10.5回の src/index.js から、「営業中か」と「予約の内容が正しいか」を判断するところだけを取り出したもの
// このファイルには、わざとバグが入っています(第14回の練習用)

const CLOSED_DAY = 3; // 定休日: 水曜日(日曜日が 0)
const OPEN_HOUR = 8; // 8:00 に開店
const CLOSE_HOUR = 18; // 18:00 に閉店
const TIMES = ['10:00', '13:00', '16:00']; // 予約できる時間
const MAX_PEOPLE = 6; // 1回の予約で6名さままで

// 今、営業中かを返す
// day: 曜日(日曜日が 0)、hour: 時(0〜23)
function getStatus(day, hour) {
  if (day === CLOSED_DAY) {
    return { open: false, message: '本日は定休日です' };
  }
  if (hour < OPEN_HOUR) {
    return { open: false, message: `準備中です(${OPEN_HOUR}:00 から)` };
  }
  if (hour > CLOSE_HOUR) {
    return { open: false, message: '本日の営業は終わりました' };
  }
  return { open: true, message: `営業中です(${CLOSE_HOUR}:00 まで)` };
}

// 予約の内容が正しいかを返す
// data: フォームから送られてきた内容 { nickname, time, people }
function checkReservation(data) {
  const nickname = String(data.nickname ?? '');
  const time = data.time;
  const people = Number(data.people);

  if (nickname === '' || nickname.length > 20) {
    return { ok: false, message: 'ニックネームは1〜20文字で入れてください' };
  }
  if (!TIMES.includes(time)) {
    return { ok: false, message: 'その時間は予約できません' };
  }
  if (!Number.isInteger(people) || people < 1 || people >= MAX_PEOPLE) {
    return { ok: false, message: `人数は1〜${MAX_PEOPLE}名で選んでください` };
  }
  return { ok: true, message: `${time}、${people}名さま。この内容で予約できます` };
}

module.exports = { getStatus, checkReservation };
