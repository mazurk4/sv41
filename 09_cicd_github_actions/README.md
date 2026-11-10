# 第9回: CI/CD入門(GitHub Actions)

push したら機械が自動でテストして、合格したものが世界に公開されるようにします。第7回から使っている **自分の `cafe-site` リポジトリ** を使います。今日は1人で進めます。

## フォルダ構成

```
09_cicd_github_actions/
└── sample/
    ├── check.yml          ← ワークフロー(.github/workflows/ に入れる)
    ├── dependabot.yml     ← 部品の更新の PR を作ってもらう設定(任意)
    └── tests/
        └── site.test.js   ← サイトを確かめるテスト
```

## 授業の前に

- 配布資料を最新にする(`git pull`)
- `docker pull node:24-alpine`
- Cloudflare のアカウントを作る(無料): https://dash.cloudflare.com/sign-up
- 確認のメールを開いて、承認する

## ハンズオン① 最初のワークフロー

1. 今日は1人なので、人の承認を一度 0 にする
   **Settings → Rules → Rulesets → `protect-main`** で **Required approvals** を **0** にして「Save changes」
2. ブランチを切って、ワークフローを入れる

   ```sh
   # cafe-site のフォルダで
   git switch main
   git pull
   git switch -c ci/add-check

   # 配布資料(sv41)のフォルダで
   mkdir ~/cafe-site/.github/workflows
   cp 09_cicd_github_actions/sample/check.yml ~/cafe-site/.github/workflows/

   # cafe-site のフォルダで
   git add .github
   git commit -m "サイトのチェックのワークフローを追加"
   git push -u origin ci/add-check
   ```

3. GitHub で PR を作る(まだマージしない)
4. リポジトリの **Actions** タブで、実行のログを見る

## ハンズオン② 自動テスト

1. テストを入れて、手元で動かす

   ```sh
   # 配布資料(sv41)のフォルダで
   mkdir ~/cafe-site/tests
   cp 09_cicd_github_actions/sample/tests/* ~/cafe-site/tests/

   # cafe-site のフォルダで
   docker run --rm -v "${PWD}:/app" -w /app node:24-alpine node --test --test-reporter=spec
   ```

2. `.github/workflows/check.yml` の最後の2行(`echo` と `ls public`)を消して、1行足す

   ```yaml
         - run: node --test --test-reporter=spec
   ```

3. push して、PR のチェックを見る

   ```sh
   git add .github tests
   git commit -m "サイトの自動テストを追加"
   git push
   ```

4. 赤くなったら、**Details** からログを読み、`public` の中を直して push する
5. 緑になったらマージして、手元を合わせる

   ```sh
   git switch main
   git pull
   git branch -d ci/add-check
   ```

## ハンズオン③ テスト合格を必須にする

1. **Settings → Rules → Rulesets → `protect-main`**
   **Require status checks to pass** にチェックして、**Add checks** で `check` を選び、「Save changes」
2. わざと壊す

   ```sh
   git switch -c test/break
   ```

   `public/index.html` の `<h2>営業時間</h2>` の下に、1行足す

   ```html
   <img src="photo.jpg">
   ```

   ```sh
   git commit -am "写真を追加"
   git push -u origin test/break
   ```

3. PR を作って、**赤くなってマージできない** ことを確かめる
4. 足した行を消して push し、緑になったらマージして、手元を合わせる

   ```sh
   git commit -am "写真の行を消す"
   git push
   # GitHub でマージしてから
   git switch main
   git pull
   git branch -d test/break
   ```

## ハンズオン④ `cafe-site` を公開する

先に、自分の main の `check` が緑であることを確かめてください。

### GitHub とつなぐ

1. Cloudflare で **Workers & Pages** → **Create application**
2. **Pages** → **Connect to Git** → **GitHub** を選ぶ
3. GitHub の画面で **Only select repositories** を選び、`cafe-site` だけを許可する
4. **Install & Authorize** のあと、`cafe-site` を選んで **Begin setup**

### 設定して公開する

| 項目 | 入れる値 |
| --- | --- |
| Project name | `cafe-ユーザー名`(URL の一部。あとから変えられない) |
| Production branch | `main` |
| Framework preset | `None` |
| Build command | `exit 0` |
| Build output directory | `public` |

**Save and Deploy** のあと、出てきた URL を開く。自分のスマホでも開く。

### push で本番を変える

1. ブランチを切る

   ```sh
   git switch main
   git pull
   git switch -c feature/notice
   ```

2. `public/index.html` のお知らせに1行足す

   ```html
   <li><span class="date">11/01</span> このサイトは授業の練習用です。実在のお店ではありません</li>
   ```

3. push する

   ```sh
   git add public/index.html
   git commit -m "練習用のサイトだと分かるようにする"
   git push -u origin feature/notice
   ```

4. PR を作って、`check` が緑になるのを待つ
5. Cloudflare の **Deployments** を開き、**Preview** の URL で確かめる
   例: `https://feature-notice.cafe-ユーザー名.pages.dev`
6. 本番の URL にはまだ出ていないことを確かめる
7. PR をマージして、1分ほど待つ。本番の URL を開くと変わっている
8. 手元を合わせる

   ```sh
   git switch main
   git pull
   git branch -d feature/notice
   ```

## (任意)自分でテストを書く

1. ブランチを切る

   ```sh
   git switch -c test/date
   ```

2. `tests/site.test.js` の一番下に足す

   ```js
   test('存在しない日付が書かれていない', () => {
     for (const { name, html } of pages) {
       assert.doesNotMatch(
         html,
         /(?<!\d)(2|4|6|9|11)月31日/,
         `${name} に存在しない日付があります`,
       );
     }
   });
   ```

3. 手元でテストを動かして、全部 `✔` になることを確かめる
4. `public/index.html` にわざと `11月31日` と書いて、**`✖` になることを確かめる**。書いたものは消す
5. PR を作って、緑ならマージする

   ```sh
   git add tests
   git commit -m "存在しない日付のテストを追加"
   git push -u origin test/date
   ```

## (任意)Dependabot を入れる

ワークフローの部品が古くなったら、更新の PR を作ってもらいます。

```sh
# cafe-site のフォルダで
git switch main
git pull
git switch -c ci/add-dependabot

# 配布資料(sv41)のフォルダで
cp 09_cicd_github_actions/sample/dependabot.yml ~/cafe-site/.github/

# cafe-site のフォルダで
git add .github
git commit -m "Dependabot の設定を追加"
git push -u origin ci/add-dependabot
```

## つながらないとき

| 症状 | 対処 |
| --- | --- |
| Actions タブに何も出ない | ファイルの場所が `.github/workflows/check.yml` か確かめる |
| Actions タブに YAML のエラーが出る | 字下げがずれている。`uses` の行とそろえる |
| `refusing to allow ... to create or update workflow` | push に使っている認証に権限がない。VS Code のターミナルでログインし直すか、GitHub の画面の **Add file** で `.github/workflows/check.yml` を作る |
| `check` が候補に出ない | ワークフローが一度も動いていない。入力欄に `check` と打って追加する |
| `mkdir` で「すでにある」と言われる | そのまま次へ進んでよい |
| `docker run` で `tests` が見つからない | `cafe-site` のフォルダで実行しているか確かめる |
| Cloudflare の一覧に `cafe-site` が出ない | GitHub の **Settings → Applications** で Cloudflare Pages の **Configure** を開き、`cafe-site` を許可する |
| サイトが開かない | 1分ほど待つ。Build output directory が `public` か確かめる |
| マージしたのに本番が変わらない | Cloudflare の **Deployments** で、main のデプロイが成功しているか見る。ブラウザを再読み込みする |
| 画面の表示が手順と違う | 画面が変わっていることがある。公式の案内を見る: https://developers.cloudflare.com/pages/get-started/git-integration/ |

## 片付け

GitHub のリポジトリと、Cloudflare のプロジェクトは消さないでください。
