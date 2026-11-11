# 第10.5回: Cloudflare Workers で「動くサイト」にする

第9回の `cafe-site` を **Cloudflare Workers** で公開して、「今、営業中か」と「予約の内容が正しいか」を **サーバーで判断** できるようにします。今日は1人で進めます。

> 料金はかかりません。使うのは **Pages と Workers の無料プランだけ** です。**アップグレード・Workers Paid・支払い方法の登録** の画面が出たら、進まずに閉じてください。
> データベースは使わないので、予約は保存しません(練習用のサイトです)。

## フォルダ構成

```
10_5_cloudflare_workers/
└── sample/
    ├── step1/                 ← ハンズオン①
    │   ├── wrangler.jsonc     ← Workers の設定
    │   └── src/index.js       ← Worker のプログラム(/api/hello)
    └── step2/                 ← ハンズオン②
        ├── src/index.js       ← 営業中か(/api/status)と、予約の確認(/api/reserve)を足したもの
        └── public/
            ├── reserve.html   ← 予約のページ
            ├── reserve.css
            ├── reserve.js     ← サーバーに予約の内容を送る
            └── status.js      ← トップページに「営業中か」を出す
```

## 授業の前に

- 配布資料を最新にする(`git pull`)
- Cloudflare にログインする: https://dash.cloudflare.com
- 自分の `cafe-site` の main で、`check` が緑になっていることを確かめる

## ハンズオン① `cafe-site` を Workers で公開する

### ファイルを足す

下のコマンドの `~/cafe-site` と `~/sv41` は、自分が置いた場所に合わせて書き換えてください(`~` はホームフォルダ)。

```sh
cd ~/cafe-site
git switch main
git pull
git switch -c feature/workers

cd ~/sv41
mkdir ~/cafe-site/src
cp 10_5_cloudflare_workers/sample/step1/wrangler.jsonc ~/cafe-site/
cp 10_5_cloudflare_workers/sample/step1/src/index.js ~/cafe-site/src/

cd ~/cafe-site
git add wrangler.jsonc src
git commit -m "Workers で公開する設定を追加"
git push -u origin feature/workers
```

GitHub で PR を作り、`check` が緑になったらマージする。

### URL の名前を確かめる

**Workers & Pages** の画面の右の **アカウントの詳細** で **サブドメイン** を見る。メールアドレスや本名になっていたら、横の鉛筆のアイコンで変える(ウィンドウが狭いと表示されないので、広げる)。

### Cloudflare とつなぐ

1. **Workers & Pages** → **アプリケーションを作成する**
2. **Continue with GitHub** を選び、`cafe-site` を選んで **次へ**(下の「Pages に続行」は押さない)
3. 設定して **デプロイ**

| 項目 | 入れる値 |
| --- | --- |
| プロジェクト名 | `cafe-site`(`wrangler.jsonc` の name と同じにする) |
| ビルドコマンド | 空のまま |
| デプロイコマンド | `npx wrangler deploy`(最初から入っている) |

「プレビュービルドを有効化」はオンのまま、「Cloudflare Access で保護」はオフのままにする。

ビルドのログの最後に `Success! Build completed.` が出たら成功。途中の `WARNING` の2つは気にしなくてよい。

`cafe-site` が一覧に出ないときは、GitHub の **Settings → Applications → Cloudflare Workers and Pages → Configure** で `cafe-site` を足す。

### 確かめる

`https://cafe-site.〇〇.workers.dev` で開く。

- `/` … いつものトップページ
- `/api/hello` … プログラムの返事。開き直すと time が変わる
- `/nothing` … 「ページが見つかりません」

## ハンズオン② 営業中の表示と、予約の確認

### ファイルを入れる

```sh
cd ~/cafe-site
git switch main
git pull
git switch -c feature/reserve

cd ~/sv41
cp 10_5_cloudflare_workers/sample/step2/src/index.js ~/cafe-site/src/
cp 10_5_cloudflare_workers/sample/step2/public/* ~/cafe-site/public/
```

`wrangler.jsonc` は変えなくてよい。

### トップページに足す

`public/index.html` の **営業時間** の下に2行足す。

```html
      <p>8:00〜18:00(定休日: 水曜日)</p>
      <p id="open-status"></p>
      <p><a href="reserve.html">席のご予約はこちら</a></p>
```

`</body>` の前に1行足す。

```html
  <script src="status.js"></script>
</body>
```

```sh
cd ~/cafe-site
git status
git add .
git commit -m "営業中の表示と、予約の確認を追加"
git push -u origin feature/reserve
```

PR を作る。PR のあいだは `https://feature-reserve-cafe-site.〇〇.workers.dev` で先に確かめられる。`check` が緑になったらマージする。Cloudflare のビルドが終わったら:

- トップページに「営業中か」が出ることを確かめる
- `/reserve.html` で、いろいろな日付を試す(次の水曜日、昨日、2か月先など)

## ハンズオン③ ブラウザを通さずに送る

予約ページでデベロッパーツールの **Console** を開き、貼って Enter。

```js
await fetch('/api/reserve', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ nickname: 'test', date: '2026-12-01', time: '19:00', people: 2 }),
}).then((res) => res.json())
```

選択肢にない 19:00 でも送れてしまう。断っているのはサーバー(`src/index.js`)。`people` を 99 にしたり、`date` を昨日にしたりしても試す。

> Chrome で初めて貼るときは、`allow pasting` と打つように言われます。知らない人に言われたコードは貼らないでください。

## うまく動かないとき

| 症状 | 原因と対処 |
| --- | --- |
| ビルドが失敗する | ログを読む。プロジェクト名と `wrangler.jsonc` の name が違う |
| 「予約のしくみにつながりませんでした」 | Pages の URL を開いている。`workers.dev` の URL か確かめる |
| 営業中の表示が出ない | `index.html` に `id="open-status"` と `status.js` の行があるか |
| `check` が赤い | `public` に `status.js` が入っていない |
| PR に Workers Builds の ✘ | `wrangler.jsonc` の `"previews": {}` を消していないか |
| ときどき古い返事が来る | デプロイの直後は数十秒、古い版が答えることがある。待って再読み込み |

## 片付け(任意)

残しておいても無料です。消すときは、Worker の設定の一番下の **削除** を使います。
