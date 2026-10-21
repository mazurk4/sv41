# DVWA(SV41 第5回で使います)

DVWA(Damn Vulnerable Web Application)は、**わざと脆弱性(セキュリティの穴)を残して作られた** 攻撃の練習用Webアプリです。
第5回「セキュリティ入門①」で、このアプリを実際に攻撃してみます。第4回では **起動とログインの確認** までやっておきます。

> **注意**
> - DVWA は自分のPCの中だけで動かしてください。インターネットや学校のネットワークに公開してはいけません
> - DVWA で練習する攻撃を、**自分が管理していないサイトに試すのは犯罪** です(不正アクセス禁止法など)

## 動かし方

`dvwa` フォルダの中で実行します。

```sh
docker compose up -d
```

ブラウザで http://localhost:8082 を開きます。初回はMySQLの準備に30秒ほどかかります。

## はじめの設定

1. ログイン画面でユーザー名 `admin` / パスワード `password` を入れて「Login」
2. 「Database Setup」の画面が出るので、一番下の **「Create / Reset Database」** を押す
3. 「Setup successful」と表示されたらログイン画面に戻り(戻らないときは画面の「login」を押す)、もう一度 `admin` / `password` でログイン
4. 「Welcome to Damn Vulnerable Web Application!」と表示されればOK

左のメニューの「DVWA Security」で **Security Level が `low`** になっていることも確認してください。

## 第5回まで

- `docker compose down` で止めておいてOK(`-v` は付けない)
- 第5回の最初に、このフォルダでもう一度 `docker compose up -d` します
- 設定を最初からやり直したいときは、ログイン後の「Setup / Reset DB」→「Create / Reset Database」

## つながらないとき

| 症状 | 対処 |
| --- | --- |
| `port is already allocated` | 8082 番を使っているコンテナがないか `docker ps` で確認する |
| 「Create / Reset Database」でエラーになる | MySQLの準備中。30秒ほど待ってからもう一度押す |
| ログインできない | 2. の「Create / Reset Database」を押し忘れていないか確認する |
