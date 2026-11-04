# 第8回: Git/GitHub実務フロー② コードレビュー演習

ペアで、おたがいの PR をレビューします。第7回で作った **自分の `cafe-site` リポジトリ** を使います。

## フォルダ構成

```
08_git_code_review/
├── review_checklist.md    ← レビューで確かめること
└── sample/
    ├── pr_a/              ← A の人が使う題材(秋のキャンペーンページ)
    └── pr_b/              ← B の人が使う題材(席の予約ページ)
```

> `pr_a` と `pr_b` には、**わざと問題が入っています**。本物のサイトには使わないでください。

## 授業の前に

- 第7回のハンズオン④まで終わらせておく
- 配布資料を最新にする(`git pull`)

## ハンズオン① 招待して、main を守る

### 相手を招待する

1. 自分の `cafe-site` のページで **Settings** → 左の **Collaborators** → **Add people**
2. 相手のユーザー名を入れて選び、追加のボタンを押す
3. 招待された人は、GitHub に登録したメールの招待メールから承諾する

### main を守る

1. **Settings → Rules → Rulesets → New ruleset → New branch ruleset**
2. 次のように設定して「Create」
   - Ruleset Name: `protect-main`
   - Enforcement status: **Active**
   - Target branches: 「Add target」→ **Include default branch**
   - Rules: **Require a pull request before merging** にチェックし、**Required approvals** を **1** にする

### わざと main に push する

```sh
git switch main
# public/index.html の誤字「アイスコーシー」を「アイスコーヒー」に直して保存
git commit -am "アイスコーヒーの誤字を直す"
git push
```

`push declined due to repository rule violations` のように **断られれば成功** です。そのコミットごとブランチに移して、PR を作ります。

```sh
git switch -c fix/typo
git push -u origin fix/typo
```

### Approve の練習

1. 作った人が、GitHub で `fix/typo` の PR を作る
2. レビューする人が、**Files changed** → **Review changes** → **Approve** → **Submit review**
3. 作った人がマージして、手元を合わせる

   ```sh
   git switch main
   git pull
   git branch -d fix/typo
   ```

## ハンズオン② レビュー演習

### 1. 自分の PR を作る

A の人は `feature/campaign` と `pr_a`、B の人は `feature/reserve` と `pr_b` を使います。

```sh
# cafe-site のフォルダで
git switch -c feature/campaign

# 配布資料(sv41)のフォルダで
cp 08_git_code_review/sample/pr_a/* ~/cafe-site/public/

# cafe-site のフォルダで
git add public
git commit -m "秋のキャンペーンページを追加"
git push -u origin feature/campaign
```

GitHub で PR を作ります。

### 2. 相手のページを動かす

```sh
# cafe-site のフォルダで、自分のサイトを止める(8087番を空ける)
docker compose down

# ホームフォルダに、相手のリポジトリを持ってくる
cd ~
git clone https://github.com/相手のユーザー名/cafe-site.git cafe-site-pair
cd cafe-site-pair
git switch 相手のブランチ
docker compose up -d
```

- A の人が見るページ: http://localhost:8087/reserve.html
- B の人が見るページ: http://localhost:8087/campaign.html

### 3. レビューする

[review_checklist.md](review_checklist.md) を見ながら、相手の PR の **Files changed** と、動かしたページの両方を確かめます。

1. 問題を見つけたら、行にカーソルを当てて青い **+** を押し、コメントを書く
2. **3つ以上** 書く。**1つは Suggestion**(提案)で直し方を書く
3. 最後に **Review changes** → **Request changes** → **Submit review**

**Submit review を押すまで、コメントは相手に見えません。**

### 4. もらった指摘を直す

1. Suggestion は **Commit suggestion** で取り込む
2. ほかの指摘は、手元で直す。**先に `git pull` する**

   ```sh
   cd ~/cafe-site
   git switch feature/campaign
   git pull
   # 直して保存
   git commit -am "レビューの指摘を直す"
   git push
   ```

3. コメントに返事を書く

### 5. Approve して、マージする

1. レビューする人が、もう一度確かめて **Approve**(手元は `cafe-site-pair` のフォルダで `git pull`)
2. 作った人が **Merge pull request** → Delete branch → 手元を合わせる

   ```sh
   git switch main
   git pull
   git branch -d feature/campaign
   ```

## ハンズオン③ 2人でコンフリクト

**A のリポジトリ** で作業します。A は `cafe-site`、B は `cafe-site-pair` のフォルダを使います。
A の人は、`cafe-site-pair` のフォルダで `docker compose down` してから、`cafe-site` のフォルダで `docker compose up -d` します。

1. 2人とも、main を最新にする

   ```sh
   git switch main
   git pull
   ```

2. それぞれブランチを切って、`public/index.html` の **お知らせの一番上** に1行足す

   A の人(ブランチは `news/christmas`):

   ```html
   <li><span class="date">11/10</span> クリスマスケーキの予約を始めました</li>
   ```

   B の人(ブランチは `news/holiday`):

   ```html
   <li><span class="date">11/12</span> 12月の定休日をお知らせします</li>
   ```

3. コミットして push し、2人とも PR を作る
4. B が A の PR を Approve して、A がマージする。B の PR に **「This branch has conflicts」** が出る
5. B が手元で取り込む

   ```sh
   git switch main
   git pull
   git switch news/holiday
   git merge main
   ```

6. **相手に聞いてから** 直す。2行とも残し、新しい順に並べて、印の行(`<<<<<<<` `=======` `>>>>>>>`)を全部消す(VS Code なら **Accept Both Changes**)

   ```sh
   git add public/index.html
   git commit -m "お知らせのコンフリクトを解消して両方残す"
   git push
   ```

7. A が B の PR を Approve して、B がマージする。2人とも手元を合わせる

   ```sh
   git switch main
   git pull
   ```

## つながらないとき

| 症状 | 対処 |
| --- | --- |
| 招待メールが届かない | GitHub の右上の通知を見るか、`https://github.com/相手のユーザー名/cafe-site/invitations` を開く |
| Approve したのに、マージのボタンが押せない | 相手が招待を承諾していない。または、Request changes を出した人がまだ Approve していない |
| コメントが相手に見えない | **Review changes** → **Submit review** を押していない |
| `port is already allocated` | 自分の `cafe-site` が動いている。そのフォルダで `docker compose down` |
| push が `rejected` になる(`fetch first`) | GitHub の上で Commit suggestion をしたあと、手元を合わせていない。`git pull --no-rebase` のあと、もう一度 `git push` |
| `git pull` が `divergent branches` で止まる | 同じく `git pull --no-rebase` |
| `git commit` で見慣れない画面(エディタ)が開いて戻れない | Vim が開いている。`:wq` と打って Enter。次からは `-m` を付ける |

## 片付け

```sh
# cafe-site と cafe-site-pair の、それぞれのフォルダで
docker compose down
```

GitHub のリポジトリは消さないでください(課題③で PR の URL を提出します)。
