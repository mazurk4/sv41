# 一言掲示板(第6回の題材)

名前とひとことを書き込める、シンプルな掲示板です。
ただし **コードに穴があり、PHPも古いまま** になっています。
授業のスライドに載せた画面(パッチ・WAF・ポート規制の前後)は、この掲示板で撮ったものです。

> **授業では手を動かす必要はありません。** 家で同じことを試してみたい人向けの手順です(任意・提出なし)。
> 課題②は Teams の課題から提出します(回答のひな形: [exercise/worksheet.md](../../exercise/worksheet.md))。

## 動かし方

`board` フォルダの中で実行します。

```sh
docker compose up -d --build
```

ブラウザで http://localhost:8083 を開きます。初回は「DBの準備中です」と出ることがあるので、30秒ほど待ってから再読み込みしてください。

画面の一番下に、**PHP と Apache のバージョン** が表示されています(授業用。本番では出さないこと)。

## 0. まず、穴があることを確かめる

検索欄に `' OR 1=1 -- -` と入れて「検索」します。**非公開のはずの投稿** まで表示されてしまいます(SQLインジェクション)。

## ステップ1: パッチを当てる(PHPのイメージを更新する)

1. 画面の一番下の **PHP のバージョン** を確認する(`8.4.1`。2024年12月のもの)
2. `Dockerfile` の `FROM` を書き換える

   ```dockerfile
   FROM php:8.4.1-apache     ← 変更前(古いバージョンに固定)
   FROM php:8.4-apache       ← 変更後(8.4 の最新のパッチ版)
   ```

3. イメージを作り直して、コンテナを入れ替える

   ```sh
   docker compose build --pull
   docker compose up -d
   ```

4. 画面を再読み込みして、**PHP と Apache のバージョンが上がった** ことを確かめる
5. 投稿が **消えていない** ことも確かめる(データはボリュームに入っているので、コンテナを入れ替えても残る)

## ステップ2: WAF を置く

1. `compose.yaml` の一番下にある `waf:` のブロックの、先頭の `# ` を外す
   - VS Code なら、行を選んで `Ctrl + /`(Mac は `Cmd + /`)でまとめて外せる
   - 外したあと、`waf:` が `web:` や `db:` と同じ位置(左から2文字目)にそろっていればOK
2. 起動する

   ```sh
   docker compose up -d
   ```

3. 2つの入口で、同じ攻撃を試して比べる

   | URL | 入口 | 検索欄に `' OR 1=1 -- -` |
   | --- | --- | --- |
   | http://localhost:8083 | 掲示板に直接 | 非公開の投稿まで出る |
   | http://localhost:8085 | **WAF を通る** | **403 Forbidden**(止められる) |

4. WAF のログで、止めた理由を見る

   ```sh
   # Mac
   docker compose logs waf | grep "Attack Detected"

   # Windows(PowerShell)
   docker compose logs waf | Select-String -Pattern "Attack Detected"
   ```

   1行がとても長いので、その中の `SQL Injection Attack Detected` のような部分を探してください。

## ステップ3: 裏口をふさぐ(ポート規制)

WAF を置いても、8083 から **WAF を通らずに直接** 入れるままでは意味がありません。

1. `compose.yaml` の `web:` にある `ports:` の2行(`ports:` と `- "127.0.0.1:8083:80"`)を消す
2. もう一度起動する

   ```sh
   docker compose up -d
   ```

3. http://localhost:8083 は **つながらない**、http://localhost:8085 は **つながる** ことを確かめる
4. `docker compose ps` で、`PORTS` の列がどう変わったかを見る

## 発展: コードの穴も直す

WAF は「応急処置」です。根本は **コードを直す** こと。`src/index.php` の `❌ 穴①` `❌ 穴②` を直してみましょう(第5回で見た直し方です)。

- 穴①: SQL文に入力を連結せず、**プレースホルダ**(`prepare` と `execute`)を使う。`LIKE` の `%` は `execute` に渡す値のほうに付ける
- 穴②: HTMLに出力するときに **`htmlspecialchars()`** を通す。実はもう1か所、同じ種類の穴がある

直せたら、8083 の入口(WAF なし)で攻撃しても効かなくなります。確かめるときはステップ3で消した `ports:` を一時的に戻してください。

## 最初からやり直したいとき

```sh
docker compose down -v
docker compose up -d --build
```

`Dockerfile` や `compose.yaml` を元に戻したいときは、配布資料をもう一度ダウンロードしてください。

## つながらないとき

| 症状 | 対処 |
| --- | --- |
| 「DBの準備中です」 | MySQLの起動待ち。30秒ほど待ってから再読み込みする |
| `port is already allocated` | 8083 / 8085 番を使っているコンテナがないか `docker ps` で確認する |
| バージョンが変わらない | `docker compose build --pull` のあとに `docker compose up -d` をしたか確認する |
| `yaml: line ...` のエラー | `# ` を外したときに、行の先頭のスペースまで消していないか確認する(`waf:` は2文字、その下は4文字) |
| 8085 で 502 Bad Gateway | 掲示板(web)が起動していない。`docker compose ps` で確認する |
| 普通の書き込みが 403 になる | WAF の **誤検知**。授業で扱いました(書き込む文章を変えれば通る) |

## (参考)イメージの脆弱性を数える

授業で紹介した件数は、脆弱性スキャナー Trivy で数えたものです。試すなら、**バージョンを固定** して使ってください(2026年3月に、Trivy の一部のバージョンが乗っ取られて悪意のあるものに差し替えられる事件がありました。0.69.3 はその前の版です)。

```sh
# イメージをファイルに書き出してから、そのファイルを調べる
docker save php:8.4.1-apache -o old.tar
docker run --rm -v "${PWD}:/work" aquasec/trivy:0.69.3 image --input /work/old.tar --severity CRITICAL,HIGH
```

- 初回は脆弱性のデータベースをダウンロードするので、数分かかります
- 終わったら `old.tar` は削除してかまいません
