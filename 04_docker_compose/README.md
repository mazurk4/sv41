# 第4回: Docker Compose

## フォルダ構成

```
04_docker_compose/
├── sample/
│   ├── wordpress/         ← ハンズオンで使う WordPress(WordPress + MySQL + phpMyAdmin)
│   └── dvwa/              ← 第5回で使う攻撃の練習用アプリ(今日は起動とログインまで)
└── examples/              ← (発展)自分の作品を Compose で動かすときのサンプル
    ├── single/            ← コンテナ1つだけの作品(HTML / PHP / Vite / Node.js)
    └── php-mysql/         ← PHP + MySQL の作品
```

## 授業の最初に: イメージを先にダウンロードする

イメージが大きい(合計で数GB)ので、説明を聞いている間にダウンロードしておきます。

```sh
cd 04_docker_compose/sample/wordpress
docker compose pull
cd ../dvwa
docker compose pull
```

## ハンズオン

| 順番 | フォルダ | やること |
| --- | --- | --- |
| 1 | [sample/wordpress](sample/wordpress/) | WordPress を起動して、記事の投稿・テーマの変更・phpMyAdmin で中身を見る |
| 2 | [sample/dvwa](sample/dvwa/) | 第5回の準備。起動して、ログインできるところまで確認する |

## 発展: 自分の作品を Compose で動かす

授業では扱いません。時間がある人や、家でやってみたい人向けです。第3回で作った `Dockerfile` を使います。

| 作品の種類 | サンプル | やること |
| --- | --- | --- |
| DBを使わない作品 | [examples/single](examples/single/) | `compose.yaml` を `Dockerfile` と同じフォルダにコピーして `docker compose up -d --build` |
| PHP + MySQL | [examples/php-mysql](examples/php-mysql/) | `compose.yaml` の先頭のコメントの手順どおりに進める |

ブラウザで http://localhost:8080 を開いて、作品が表示されればOK。

## 補足

- **DBにつながらない**: 接続先のホスト名が `localhost` のままになっていないか確認してください。コンテナの中の `localhost` は「そのコンテナ自身」なので、MySQLのコンテナは `db`(`compose.yaml` のサービス名)で呼びます。
- **`db/init.sql` を書き換えたのに反映されない**(examples/php-mysql): `init.sql` は「データが空のとき」しか実行されません。`docker compose down -v` でデータを消してから `docker compose up -d` してください。
- **XAMPP からエクスポートしたSQLでエラーになる**: XAMPP は MySQL ではなく MariaDB を使っています。`compose.yaml` の `image: mysql:8.4` を `image: mariadb:10.11`(XAMPP と同じ MariaDB)に変えると動くことがあります。
- **`port is already allocated`**: 第3回のコンテナや、別のフォルダで起動したコンテナが残っていないか `docker ps` で確認してください。Compose で起動したものは、そのフォルダで `docker compose down`、それ以外は `docker rm -f コンテナ名` で消します。
