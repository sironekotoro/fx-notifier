/**
 * fx-notifier
 * Developed and maintained via GitHub:
 * https://github.com/sironekotoro/fx-notifier
 *
 * This file is synced using clasp.
 */


/**
 * メイン関数：為替レートを取得し、記録して、Chatworkに投稿する
 * GASのトリガーはこの関数に設定する
 */
function main() {
  const rate = fetchUsdJpyRate();
  if (rate === null) {
    logFailure();  // レート取得失敗時の記録
    return;
  }

  const roundedRate = roundToTwoDecimals(rate); // 小数第2位に丸める
  logRate(roundedRate);                          // スプレッドシートに記録
  postToChatwork(roundedRate);                   // Chatworkに投稿
}

/**
 * 為替レート（USD/JPY）をGoogleFinance関数を用いて取得する
 * 値が取得できるまで最大5秒間リトライ
 * @returns {number|null} レート（数値）またはnull（取得失敗時）
 */
function fetchUsdJpyRate() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("為替レート");
  const formulaCell = sheet.getRange("D1"); // 作業用セル

  // GOOGLEFINANCE関数を一時的に挿入
  formulaCell.setFormula('=GOOGLEFINANCE("CURRENCY:USDJPY")');
  SpreadsheetApp.flush();

  // 値が出るまで待機（最大5秒）
  for (let i = 0; i < 10; i++) {
    Utilities.sleep(500);
    const val = formulaCell.getValue();
    if (typeof val === "number" && !isNaN(val)) {
      formulaCell.clearContent();
      return val;
    }
  }

  formulaCell.clearContent(); // 後始末
  return null;
}

/**
 * 数値を小数第2位に丸める
 * @param {number} num - 丸める対象の数値
 * @returns {number} 小数点第2位までの数値
 */
function roundToTwoDecimals(num) {
  return Math.round(num * 100) / 100;
}

/**
 * 正常に取得した為替レートをスプレッドシートに記録する
 * @param {number} rate - 丸めた為替レート
 */
function logRate(rate) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("為替レート");
  const now = new Date();
  sheet.appendRow([now, rate.toFixed(2)]); // 表示用に文字列として記録
}

/**
 * レート取得に失敗したことをスプレッドシートに記録する
 */
function logFailure() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("為替レート");
  const now = new Date();
  sheet.appendRow([now, "取得失敗"]);
}

/**
 * Chatworkにレート通知を投稿する
 * @param {number} rate - 小数第2位に丸めた為替レート
 */
function postToChatwork(rate) {
  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty("CHATWORK_TOKEN");
  const roomId = props.getProperty("CHATWORK_ROOM_ID");

  const timestamp = Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyy-MM-dd HH:mm");

  // ChatworkのBBコードを使用して整形
  const message = `[info][title]【為替Bot】USD/JPYレート通知[/title]
${timestamp} 時点
為替レート: ${rate.toFixed(2)} 円
[/info]`;

  const options = {
    method: "post",
    headers: {
      "X-ChatWorkToken": token,
    },
    payload: {
      body: message,
    },
  };

  const url = `https://api.chatwork.com/v2/rooms/${roomId}/messages`;

  try {
    UrlFetchApp.fetch(url, options);
  } catch (e) {
    Logger.log("Chatwork投稿失敗: " + e.message);
  }
}
