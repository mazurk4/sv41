# Node.jsのサーバーアプリ用(Express などを使う場合も同じ形)
#
# 使い方(このフォルダの中で実行):
#   docker build -t my-node .
#   docker run -d -p 8080:3000 --name my-node my-node
#   → http://localhost:8080
#   ※ アプリはコンテナの中で3000番を使うので、-p 8080:3000 になる

# Node.jsの公式イメージをベースにする
FROM node:24-alpine

# コンテナの中の作業フォルダを決める(なければ作られる)
WORKDIR /app

# package.json があれば、先にライブラリをインストールする
# (このサンプルはライブラリを使っていないので不要)
# COPY package.json package-lock.json ./
# RUN npm ci

# アプリのファイルをコピーする
COPY . .

# アプリが使うポート(メモ)
EXPOSE 3000

# コンテナ起動時に実行するコマンド
CMD ["node", "server.js"]
