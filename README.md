# fx-notifier

Google スプレッドシートと Chatwork を連携し、USD/JPY の為替レートを自動的に取得・記録・通知する Google Apps Script プロジェクトです。
日次通知などの自動実行は、GAS の時間トリガーを用いて設定できます。

---

## 📌 概要

- データ取得：`GOOGLEFINANCE("CURRENCY:USDJPY")`
- 記録先：Google スプレッドシート（`為替レート` シート）
- 通知先：Chatwork（API使用）
- 実行方法：GAS の時間主導型トリガーを用いた自動化が可能（例：平日午前10時）

---

## 💡 GitHub を使わずに GAS だけで使いたい方へ

GitHub や clasp を使わずに、「GoogleスプレッドシートとApps Scriptエディタだけ」でこのスクリプトを使うことも可能です。

### ✅ 手順概要

1. Google スプレッドシートを作成（任意の名前）
2. メニュー「拡張機能 → Apps Script」でエディタを開く
3. このリポジトリの `fxNotifier.js` の内容をコピー＆貼り付け
4. スクリプトプロパティを手動で登録
5. トリガーを設定（平日10時など）

### 📝 スクリプトプロパティの登録手順

1. エディタメニュー「ファイル → プロジェクトのプロパティ」
2. 「スクリプトのプロパティ」タブで以下を登録：

| キー名             | 値 |
|--------------------|----|
| `CHATWORK_TOKEN`   | Chatwork APIトークン |
| `CHATWORK_ROOM_ID` | 通知先のルームID（数字） |

### 🕒 トリガーの設定

- 関数：`main`
- イベント：時間主導型
- 週ベース → 月〜金 → 午前9時〜10時

---

## ⚙️ GitHub + clasp でのセットアップ手順

### 1. Node.js + clasp をインストール

```bash
npm install -g @google/clasp
clasp login
```

### 2. このプロジェクトをクローン

```bash
git clone https://github.com/sironekotoro/fx-notifier.git
cd fx-notifier
clasp pull
```

### 3. スクリプトプロパティを設定

Google Apps Script のスクリプトプロパティに以下のキーを登録：

| キー名             | 値 |
|--------------------|----|
| `CHATWORK_TOKEN`   | Chatwork APIトークン |
| `CHATWORK_ROOM_ID` | ChatworkのルームID（数字） |

設定例（GASエディタで）：

```javascript
function setSecrets() {
  const props = PropertiesService.getScriptProperties();
  props.setProperty("CHATWORK_TOKEN", "your_token_here");
  props.setProperty("CHATWORK_ROOM_ID", "12345678");
}
```

### 4. トリガーを設定

- 関数：`main`
- 種別：時間主導型
- 時間：平日（月〜金）午前10時（9時〜10時の範囲で設定）

### 5. 変更内容を GAS に反映

```bash
clasp push
```

これでローカルのコードが Google Apps Script 側に反映されます。

---

## 📤 Chatwork に投稿される内容（例）

```
[info][title]【為替Bot】USD/JPYレート通知[/title]
2025-05-17 10:00 時点
為替レート: 145.27 円
[/info]
```

---

## 👤 作者・メンテナンス

- 作成者：[@sironekotoro](https://github.com/sironekotoro)
- 引き継ぎ時は会社用 Google アカウントにシートとスクリプトをコピーし、スクリプトプロパティとトリガーを再設定してください。
- GitHubでの履歴管理と clasp による同期を併用することで、安全かつ透明な運用が可能です。

---

## 🧠 本スクリプトについて

このスクリプトは、作者によって設計・管理されており、一部の実装や整理にあたっては OpenAI ChatGPT を活用しています。
最終的な判断・設計・保守は人間が責任を持って行っています。

---

## 🛠 今後の拡張予定（例）

- Slack や Discord への通知追加
- 為替レートの前日比変動やチャートの自動添付
- 複数通貨ペア対応（USDJPY, EURJPYなど）

---

## 📄 ライセンス

MIT License
