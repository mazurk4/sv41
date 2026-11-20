# 第15回: AIエージェントを使いこなす

**Claude Code** と **Codex** が `cafe-site` を直すところを、講師の画面で見ます。今日は見るのが中心で、手を動かす課題はありません。

> Claude Code と Codex は、**有料のプラン** で使うのが基本です。授業の課題には入れません。
> 使ってみたい人は、料金・上限・学習に使うかの設定(入れた文章やコードを、会社が次の AI の学習に使うか。第14回)を、**公式のページで確かめてから** 自分で決めてください。

## フォルダ構成

```
15_ai_agents/
├── template/        ← AI と作るリポジトリのテンプレート(自分の作品に使う)
└── sample/          ← 今日の実演で使った cafe-site 用の例(テンプレートを書きこんだもの)
```

- **自分の作品で使う** ときは `template/` から始めます(下の「テンプレートの使い方」)
- `sample/` は、テンプレートを cafe-site 用に書きこんだ例です。書き方に迷ったら見くらべてください

## テンプレート: AI と作るリポジトリの形

```
template/
├── AGENTS.md                         ← 説明書(Codex など、多くのエージェントが読む)
├── CLAUDE.md                         ← Claude Code 用の説明書。1行目の @AGENTS.md で AGENTS.md を読み込む
├── .mcp.json                         ← MCP(Claude Code): Playwright を Docker の中で動かす
├── .claude/                          ← Claude Code だけが読む
│   ├── settings.json                 ←   権限: .env と、危ないブラウザの道具を止める
│   ├── skills/pr-description/SKILL.md ←  スキル: PR の説明を書く手順
│   └── agents/reviewer.md            ←   サブエージェント: 読むだけのレビュー役
├── .agents/                          ← Codex が読む(スキルの共通の置き場所)
│   └── skills/pr-description/SKILL.md ←  スキル(.claude の中と同じ中身)
└── .codex/                           ← Codex だけが読む(「信頼する」にしたときだけ)
    ├── config.toml                   ←   MCP(.mcp.json と同じ中身)
    └── agents/reviewer.toml          ←   サブエージェント(reviewer.md と同じ役目)
```

`.` で始まるフォルダとファイルは、Finder やエクスプローラーでは **隠れて見えない** ことがあります(`ls -a` で見えます)。

| 部品 | 共通 | Claude Code | Codex |
| --- | --- | --- | --- |
| 説明書 | `AGENTS.md` | `CLAUDE.md`(`@AGENTS.md`) | (`AGENTS.md` をそのまま読む) |
| スキル | `SKILL.md` の書き方 | `.claude/skills/` | `.agents/skills/` |
| サブエージェント | — | `.claude/agents/*.md` | `.codex/agents/*.toml` |
| MCP | MCP の決まり | `.mcp.json` | `.codex/config.toml` |
| 権限 | — | `.claude/settings.json` | ふだんは自分の PC の `~/.codex/config.toml` で決める |

## テンプレートの使い方

1. `template/` の中身を **全部**(`.` で始まるものも)、自分のリポジトリのいちばん上にコピーする

   ```sh
   # sv41 のフォルダから。my-work は自分のリポジトリのフォルダ
   cp -R 15_ai_agents/template/. ../my-work/
   ```

   Windows の PowerShell では `Copy-Item -Recurse -Force 15_ai_agents/template/* ../my-work/` のあと、`Get-ChildItem -Force ../my-work` で `.` で始まるもの(`.claude` など)も写ったか確かめる
2. `AGENTS.md` の `<…>` を、**自分の作品に合わせて** 書き換える(構成・コマンドがいちばん大事)
3. **使わないものは消す**(Codex を使わないなら `.agents/` と `.codex/`、ブラウザで確かめないなら `.mcp.json` と `.codex/config.toml` の MCP の所)
4. `.mcp.json` と `.codex/config.toml` の `8080` を、自分の作品のポート番号に書き換える
5. `.gitignore` に次を足す

   ```
   screenshots/
   .claude/settings.local.json
   CLAUDE.local.md
   ```

6. コミットする(説明書と設定をコミットすると、チームのみんなと AI に同じ決まりがかかる)

- いちばん大事なのは **`AGENTS.md`** です。最初は説明書だけでも十分です。ほかの部品は、必要になったら足します
- 説明書は **お願い** です。守られないこともあります。止めたいことは、**権限の設定** で止めます
- スキルを直したら、`.claude/skills/` と `.agents/skills/` の **両方** を直します
- 人が作ったスキル・サブエージェント・MCP を足すときは、**中身を読んでから** 入れます(第14回の「あやしい部品」)
- 置き場所や読み込み方は、ツールの更新で変わることがあります。公式のドキュメントで確かめてください

## Playwright MCP を安全につなぐ(実演③)

AI がブラウザでページを開いて、スクリーンショットを撮れるようにします。ブラウザは **自分の PC ではなく、Docker のコンテナの中** で動きます。

| `.mcp.json` に書いたこと | 意味 |
| --- | --- |
| `docker run … --rm` | ブラウザをコンテナの中で動かす。PC のファイルは見えない。終わったら消える |
| `-v ./screenshots:/out` | コンテナに見せるのは `screenshots/` フォルダだけ。撮った画像はここに入る |
| `:v0.0.85` | 版を固定する(`latest` にしない) |
| `--isolated` | ログインの情報(Cookie など)を残さない |
| `--allowed-origins` | 開いてよいのは自分のサイト(`docker compose up -d` で動かした cafe-site)だけ |
| `host.docker.internal:8087` | コンテナから見た「自分の PC」の 8087番 |

使い方:

1. `docker compose up -d` で cafe-site を動かす(http://localhost:8087)。`sample/.mcp.json` は 8087番、`template/.mcp.json` は 8080番になっている
2. `cafe-site/.gitignore` に `screenshots/` を足す(撮った画像はコミットしない)
3. `claude` を起動すると、`.mcp.json` の MCP サーバーを使ってよいか聞かれる → 中身を読んでから許可する
4. 「http://host.docker.internal:8087 を開いて、スクリーンショットを撮って」と頼む

- `--allowed-origins` は「安全の壁ではない」と公式に書いてあります(リダイレクトは止めない)。コンテナに閉じこめる・権限の設定で危ない道具を止める、と **重ねて** 守ります
- `.claude/settings.json` の `deny` で、ページの中で好きなプログラムを動かす道具(`browser_run_code_unsafe`・`browser_evaluate`)と、ファイルを送る道具(`browser_file_upload`)を止めています
- Codex でつなぐときは、`.codex/config.toml`(テンプレートに入っている)か `~/.codex/config.toml` の `[mcp_servers.playwright]` に、同じ `command` と `args` を書きます
- 新しい版を使うときは、出てすぐの版は避け、[公式のリポジトリ](https://github.com/microsoft/playwright-mcp) で変更点を確かめてから、版の番号を書き換えます

## 今日の実演の頼みごと

```
【やりたいこと】喫茶こもれびの営業時間を変えたい
【今の状態】毎日 8:00〜18:00(水曜日は定休日)
【期待】土曜日と日曜日だけ 9:00〜17:00 にする。トップページの表示と、営業中かの判断(src/index.js)の両方
【条件】AGENTS.md の決まりを守る。テストを足す。まず計画を見せて
```
