# 第7回: Git/GitHub実務フロー① ブランチ運用・PR

## フォルダ構成

```
07_git_branch_pr/
└── sample/
    └── cafe-site/                          ← 架空のカフェのホームページ(静的サイト)
        ├── compose.yaml                    ← http://localhost:8087 で表示する
        ├── public/                         ← index.html と style.css(ここを変更する)
        └── .github/pull_request_template.md ← PR の説明欄のひな形
```

このフォルダは **配布資料の外にコピーして**、自分の GitHub リポジトリとして使います。
手順は [sample/cafe-site](sample/cafe-site/) の README を見てください。

## 授業の前に

- GitHub のアカウントを作っておく(ログインできるか確かめておく)
- ターミナル(Windows は PowerShell)で `git --version` が動くか確かめておく
  - Windows で動かないときは、Git for Windows を入れる

## 片付け

```sh
# cafe-site のフォルダで
docker compose down
```

`cafe-site` フォルダと GitHub のリポジトリは、**第8回でも使う** ので残しておいてください。
