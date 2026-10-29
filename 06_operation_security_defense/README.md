# 第6回: セキュリティ入門② 守りを固める(パッチ・ポート・WAF / 2コマ連続)

## フォルダ構成

```
06_operation_security_defense/
├── exercise/
│   └── worksheet.md       ← 課題②「PHP 緊急脆弱性の夜、あなたならどうする?」の回答のひな形
└── sample/
    └── board/             ← 講師デモで使った「危ないまま」の一言掲示板(家で試したい人向け・任意)
        ├── compose.yaml
        ├── Dockerfile     ← わざと古いPHPになっている
        ├── db/init.sql
        └── src/index.php
```

## 課題②

**Teams の課題** から提出してください(翌週の授業まで・提出のみ)。
回答のひな形は Teams の課題に添付してあります。[exercise/worksheet.md](exercise/worksheet.md) も同じものです。

## 掲示板を家で試したいとき(任意)

授業のスライドに載せた画面は、この掲示板で撮ったものです。授業で手を動かす必要はありません。
同じことを試してみたい人は [sample/board](sample/board/) の README を見てください。

> **注意**
> - 掲示板は自分のPCの中だけで動かしてください。インターネットや学校のネットワークに公開してはいけません
> - 授業で見た操作を、**自分が管理していないサイトに試すのは犯罪** です(不正アクセス禁止法など)

## 片付け

第4回の DVWA は、もう使いません。いらなければ削除してかまいません。

```sh
# 第4回の DVWA のフォルダで
docker compose down -v
docker rmi ghcr.io/digininja/dvwa:latest
```
