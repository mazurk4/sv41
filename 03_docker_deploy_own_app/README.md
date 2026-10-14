# 第3回: 自分の作品をDockerで動かす

## フォルダ構成

```
03_docker_deploy_own_app/
├── sample/
│   └── roulette/          ← ハンズオンで使う「指名ルーレット」(PHP)
└── examples/              ← 作品の種類ごとのDockerfileのサンプル
    ├── html/              ← HTML / CSS / JavaScript だけのサイト
    ├── php/               ← PHPのサイト
    ├── typescript-vite/   ← TypeScript / Vite(React, Vue なども同じ)
    └── node/              ← Node.jsのサーバーアプリ(Express など)
```

## 課題①: 自分の作品をDockerで動かす

1. 下の表から、自分の作品に近いサンプルを選ぶ
2. そのサンプルの `Dockerfile` を、自分の作品のフォルダ(`index.html` / `index.php` / `package.json` がある場所)にコピーする
3. 作品のフォルダで build して run する

| 作品の種類 | サンプル | build と run |
| --- | --- | --- |
| HTML / CSS / JS | [examples/html](examples/html/) | `docker build -t my-app .`<br>`docker run -d -p 8080:80 --name my-app my-app` |
| PHP | [examples/php](examples/php/) | `docker build -t my-app .`<br>`docker run -d -p 8080:80 --name my-app my-app` |
| TypeScript / Vite | [examples/typescript-vite](examples/typescript-vite/) | `docker build -t my-app .`<br>`docker run -d -p 8080:80 --name my-app my-app` |
| Node.js サーバー | [examples/node](examples/node/) | `docker build -t my-app .`<br>`docker run -d -p 8080:3000 --name my-app my-app` |
| 作品を用意できなかった | [sample/roulette](sample/roulette/) | ルーレットをカスタマイズして提出 |

ブラウザで http://localhost:8080 を開いて、作品が表示されればOK。

各 `Dockerfile` の中に、1行ずつ説明のコメントを書いてあります。

### 提出物

1. 作品のフォルダに置いた `Dockerfile`
2. ブラウザで http://localhost:8080 に作品が表示されているスクリーンショット
3. `docker ps` の実行結果のスクリーンショット

## 補足

- **TypeScript / Vite**: `package-lock.json` がないと `npm ci` が失敗します。手元で一度 `npm install` してから build してください。
- **PHP + MySQL**: 今回はDBを使わないページが動けばOKです。DBとつなぐのは第4回(Docker Compose)で扱います。
- **ファイルの変更が反映されない**: build し直して、コンテナも作り直してください(手順は [sample/roulette/README.md](sample/roulette/README.md) を参照)。
