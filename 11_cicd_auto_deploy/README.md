# 第11回: CI/CD で自動デプロイ化

`cafe-site` を **GitHub Pages** に、自分のワークフロー(GitHub Actions)で公開します。テストに合格したときだけ公開され、部品の更新や書き方の穴は GitHub が自動で見張ります。

授業の前半は講師の画面で流れを見て、最後の15分から **課題⑤** として各自で進めます。

> 料金はかかりません。使うのは **公開リポジトリで無料** のものだけです。設定の画面の **Start free for 30 days**(有料プランのお試し)、**AI Scan**・**Agentic autofix**(AI クレジットを使う)は押さないでください。

## フォルダ構成

```
11_cicd_auto_deploy/
└── sample/
    ├── cafe-site/              ← 課題⑤
    │   ├── deploy.yml          ← テストして、GitHub Pages に公開する(.github/workflows/ に置く)
    │   └── dependabot.yml      ← 部品の更新の PR を作ってもらう。7日待つ(.github/ に置く)
    └── own-work/               ← 発展・第14回(自分の作品)
        ├── deploy_static.yml   ← HTML / CSS / JS だけの作品
        ├── deploy_vite.yml     ← Vite でビルドする作品
        └── tests/
            └── site.test.cjs   ← どんな作品にも使えるテスト
```

## 授業の前に

- 配布資料を最新にする(`git pull`)
- 自分の `cafe-site` の main で、`check` が緑になっていることを確かめる
- `cafe-site` が **Public** であることを確かめる(無料のプランの GitHub Pages は、公開リポジトリだけ)
- **Settings → Rules → Rulesets → `protect-main`** の **Required approvals** が **0** であることを確かめる(1 だと、自分の PR を1人でマージできない)

## 課題⑤ `cafe-site` を GitHub Pages に公開して、見張りをオンにする

下のコマンドの `~/cafe-site` と `~/sv41` は、自分が置いた場所に合わせて書き換えてください(`~` はホームフォルダ)。

### 手順1 Pages の設定を変える(先にやる)

`cafe-site` の **Settings → Pages** で、**Source** を **GitHub Actions** にする(保存のボタンはない。選んだら変わる)。

下に出る「GitHub Pages Jekyll」「Static HTML」の **Configure**、「browse all workflows」「create your own」は押さない。

先に変えておかないと、公開のジョブが失敗します。

### 手順2 `deploy.yml` を入れて、PR → マージ

```sh
cd ~/cafe-site
git switch main
git pull
git switch -c ci/github-pages

cd ~/sv41
cp 11_cicd_auto_deploy/sample/cafe-site/deploy.yml ~/cafe-site/.github/workflows/

cd ~/cafe-site
git add .github
git commit -m "GitHub Pages に届けるワークフローを追加"
git push -u origin ci/github-pages
```

GitHub で PR を作り、`check` が緑になったらマージする。PR のあいだは `deploy` は動きません(main に入ったときだけ動く)。

### 手順3 Actions と URL を確かめる

1. **Actions** タブ → `deploy` を開く。**build → deploy** の順に緑になる
   - 黄色の「Node.js 20 is deprecated」は失敗ではない(手順6で直る)
2. **Settings → Pages** の上に「Your site is live at …」と URL が出る
3. **Visit site** で開く。スマホでも開く
4. 予約のページで送ると「予約のしくみにつながりませんでした」になる。GitHub Pages はファイルを配るだけで、`src/index.js` は動かないため(正常)

変更が出るまで数分かかることがあります。Shift を押しながら再読み込みしてください。

### 手順4 見張りをオンにする

**Settings → Advanced Security** で:

1. **Dependency graph** → On
2. **Dependabot alerts** → On
3. **Dependabot security updates** → On(「alerts も On にします」と出たら Enable)
4. 少し下の **CodeQL analysis** → **Set up** → **Default** → **Enable CodeQL**(Languages に GitHub Actions と JavaScript / TypeScript が出る)
5. さらに下の **Secret Protection** で、**Push protection** が On になっていることを見る(公開リポジトリは最初から On)

**Malware alerts** などの項目は Off のままでよい。**Edit dependabot.yml** のボタンは押さない(手順5でファイルを入れる)。**AI Scan**・**Agentic autofix** はオンにしない。**Copilot Autofix** は最初から On のままでよい(Copilot の契約は要らない)。

### 手順5 `dependabot.yml` を入れて、PR → マージ

```sh
cd ~/cafe-site
git switch main
git pull
git switch -c ci/dependabot

cd ~/sv41
cp 11_cicd_auto_deploy/sample/cafe-site/dependabot.yml ~/cafe-site/.github/

cd ~/cafe-site
git add .github
git commit -m "部品の更新を Dependabot に任せる"
git push -u origin ci/dependabot
```

置き場所は **`.github/`** の直下(`workflows/` の中ではない)。第9回の `dependabot.yml` があれば上書きしてよい。

PR → `check` が緑 → マージ。1〜2分待って、**Pull requests** を見る。

### 手順6 Dependabot の PR を読んで、マージ

1. **dependabot[bot]** の PR(`actions/configure-pages` 5.0.0 → 6.0.0)を開く
2. **Files changed** で、変わった行を読む(1行だけのはず)
3. **Release notes** を開いて、何が変わったか見る(英語。node 24、breaking(大きな変更)、security などの言葉を探す)
4. `check` が緑ならマージする。`deploy` が動いて、本番も自動で更新される
5. Actions の `deploy` で、黄色の警告が消えたことを確かめる

### 提出するもの(Teams)

1. 公開した URL
2. Dependabot が作った PR の URL(マージ済み)
3. その PR をマージする前に、何を見て、マージしてよいと判断したか
4. 2026年の事件から1つ選び、それが自分の `cafe-site` で起きたら、どの守りが役に立つかと、その理由(`cafe-site` は npm のパッケージを使っていないので、Trivy・@subql/common・GhostAction を選ぶと書きやすい)

## うまく動かないとき

| 症状 | 原因と対処 |
| --- | --- |
| `deploy` のジョブが失敗する | Settings → Pages の Source が **GitHub Actions** になっているか。直したら Actions の画面で **Re-run all jobs** |
| Pages の設定に Source が出ず、Upgrade と出る | リポジトリが **Private**。パスワードなどが入っていないことを確かめてから、Settings → General の一番下で Public にする |
| `deploy` が動かない | PR のあいだは動かない。main にマージしたら動く |
| マージのボタンが押せない | `protect-main` の **Required approvals** を **0** にする(Settings → Rules → Rulesets) |
| 変更が出ない | 数分待って、Shift を押しながら再読み込み |
| Dependabot の PR が来ない | `dependabot.yml` が **`.github/`** の直下にあるか。**Insights → Dependency graph → Dependabot** で状態を見る |
| `cp` で「ファイルがない」 | `cd` で配布資料のフォルダにいるか。`ls` で `11_cicd_auto_deploy` が見えるか |

## 発展(任意): 自分の作品を GitHub Pages に公開する(第14回で使う)

課題ではありません。第14回の総合演習で、自分の作品を「push だけで届く」状態にするときに使います。

### 1. 公開リポジトリを用意する

- 作品のリポジトリが **Public** なら、そのまま使ってよい
- **Private** にしている人や、パスワード・`.env` が入っている人は、**公開してよいファイルだけ** を入れた **新しい Public のリポジトリ** を作る(第10回の公開用のフォルダと同じ考え方)
- PHP や Node.js のサーバーの作品は、第10回の紹介ページ(`10_cloudflare_deploy/sample/portfolio`)で出してよい

> 一度 push したものは、消しても履歴に残ります。push の前に `git status` で確かめてください。

### 2. ワークフローとテストを入れる

| 作品 | 使うファイル | 変えるところ |
| --- | --- | --- |
| HTML / CSS / JS だけ | `deploy_static.yml` | `SITE_DIR` を、公開するフォルダの名前にする(一番上なら `.`) |
| Vite でビルドする | `deploy_vite.yml` | なし(`dist` を公開する。`--base=./` でリンクを相対パスにしている) |

```sh
cd ~/作品のフォルダ
git switch -c ci/github-pages
mkdir -p .github/workflows tests

cd ~/sv41
# 静的な作品の例。Vite なら deploy_vite.yml
cp 11_cicd_auto_deploy/sample/own-work/deploy_static.yml ~/作品のフォルダ/.github/workflows/deploy.yml
cp 11_cicd_auto_deploy/sample/own-work/tests/site.test.cjs ~/作品のフォルダ/tests/
```

手元でテストを動かす(公開するフォルダが `public` の例)。

```sh
cd ~/作品のフォルダ
docker run --rm -v "${PWD}:/app" -w /app -e SITE_DIR=public node:24-alpine node --test --test-reporter=spec
```

Vite の作品は、先にビルドしてから `SITE_DIR=dist` で動かす。

```sh
docker run --rm -v "${PWD}:/app" -w /app node:24-alpine sh -c "npm ci --ignore-scripts && npm run build -- --base=./ && SITE_DIR=dist node --test --test-reporter=spec"
```

### 3. Pages の設定をして、PR → マージ

1. **Settings → Pages → Source** を **GitHub Actions** にする
2. push して PR を作る。PR のあいだは **テストだけ** 動く(公開はしない)
3. テストが緑になったらマージ。`https://ユーザー名.github.io/リポジトリ名/` に公開される

### テストが見ていること

| テスト | 見ていること |
| --- | --- |
| トップページがある | `index.html` があるか |
| 画像に alt がある | `<img>` に `alt` があるか |
| リンクが `/` で始まっていない | GitHub Pages ではリポジトリ名の分ずれるため |
| リンクの先にファイルがある | リンク切れ・画像の置き忘れ |
| コンフリクトの印がない | `<<<<<<<` などの消し忘れ |
| 公開しないファイルがない | `.env`、`.php`、データベース、鍵、`_old` など |

## 片付け(任意)

残しておいても無料です。止めるときは、**Settings → Pages** の **Unpublish site** を使います。
