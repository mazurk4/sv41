# 指名ルーレット(SV41 第3回 サンプル)

自分の作品を用意できなかった人向けの、PHPで作った簡単なWebアプリです。
`src/members.txt` に書いた名前(1行に1人)の中から、ランダムに1人を選びます。

## フォルダ構成

```
roulette/
├── Dockerfile        ← イメージの作り方(レシピ)
└── src/
    ├── index.php     ← アプリ本体
    ├── style.css     ← 見た目
    └── members.txt   ← 候補者の一覧
```

## 動かし方

`roulette` フォルダの中で実行します。

```sh
# イメージを作る(最後の . を忘れずに)
docker build -t roulette .

# コンテナを起動する
docker run -d -p 8080:80 --name roulette roulette
```

ブラウザで http://localhost:8080 を開きます。

## 中身を変えたら(方法1: 作り直す)

`members.txt` などを編集したら、**イメージを作り直して、コンテナも作り直す** 必要があります。

```sh
docker build -t roulette .
docker rm -f roulette
docker run -d -p 8080:80 --name roulette roulette
```

## 中身を変えたら(方法2: フォルダをマウントする)

`-v` を付けると、**自分のPCの `src` フォルダを、コンテナの中から直接見せる** ことができます。
ファイルを保存してブラウザを再読み込みするだけで、すぐに反映されます(build し直す必要はありません)。

```sh
docker run -d -p 8081:80 -v "${PWD}/src:/var/www/html" --name roulette-dev roulette
```

`${PWD}` は「今いるフォルダ」という意味です(Mac でも Windows の PowerShell でも同じ書き方で動きます)。

ブラウザで http://localhost:8081 を開き、`src/members.txt` を編集 → 再読み込みしてみよう。

| | 方法1: 作り直す(build) | 方法2: マウント(`-v`) |
| --- | --- | --- |
| 反映 | build とコンテナの作り直しが必要 | 保存して再読み込みするだけ |
| ファイルの場所 | イメージの中にコピーされている | 自分のPCにある |
| 向いている場面 | 人に配る・本番で動かす | 開発中・作業中 |

## カスタマイズのアイデア

- `members.txt` をクラスメイトの名前や、今日のお昼ごはんの候補に変える
- `index.php` の `$title` を変える
- `style.css` で色やフォントを変える
