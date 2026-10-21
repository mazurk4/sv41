# WordPress(SV41 第4回 サンプル)

ブログやWebサイトを作れるCMS「WordPress」を、Docker Compose で動かします。
**3つのコンテナ**(WordPress / MySQL / phpMyAdmin)を、`compose.yaml` 1つでまとめて起動します。
自分でコードを書く必要はありません。

## 動かし方

`wordpress` フォルダの中で実行します。

```sh
docker compose up -d
```

| URL | 中身 |
| --- | --- |
| http://localhost:8080 | WordPress |
| http://localhost:8081 | phpMyAdmin(ユーザー名 `sv41` / パスワード `sv41pass`) |

初回はMySQLの準備に30秒ほどかかります。「データベース接続確立エラー」(Error establishing a database connection)と出たら、少し待って再読み込みしてください。

## はじめの設定(インストール画面)

1. 言語で「日本語」を選ぶ
2. サイトのタイトル・ユーザー名・パスワード・メールアドレスを入れる
   - 自分のPCの中だけで動いているので、メールアドレスは `test@example.com` のような架空のものでOK
   - パスワードは忘れないようにメモしておく
3. 「WordPress をインストール」→ ログイン

## やってみよう

- **記事を投稿する**: 管理画面の「投稿」→「新規投稿」
- **テーマを変える**: 「外観」→「テーマ」
- **phpMyAdmin で中身を見る**: `wordpress` → `wp_posts` テーブルに、投稿した記事が入っている
  - phpMyAdmin から記事のタイトル(`post_title`)を書き換えると、サイトにも反映される

## よく使うコマンド

| やりたいこと | コマンド |
| --- | --- |
| まとめて起動 | `docker compose up -d` |
| 動いているコンテナの一覧 | `docker compose ps` |
| ログを見る | `docker compose logs`(1つだけなら `docker compose logs db`) |
| コンテナの中に入る | `docker compose exec wordpress bash` |
| まとめて止めて消す(データは残る) | `docker compose down` |
| データもまとめて消す | `docker compose down -v` |

## データはどこに保存されている?

`compose.yaml` の `volumes:` に書いた **2つのボリューム** に保存されています。

| ボリューム | 中身 |
| --- | --- |
| `db-data` | 記事・ユーザー・設定(MySQLのデータ) |
| `wp-data` | WordPressのファイル(テーマ・プラグイン・アップロードした画像) |

- `docker compose down` → `docker compose up -d` しても、サイトは **残る**
- `docker compose down -v` すると、ボリュームごと消えて **インストール画面に戻る**
