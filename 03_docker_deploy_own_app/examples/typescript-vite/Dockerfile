# TypeScript / Vite(React, Vue なども同じ)のサイト用
#
# 使い方(このフォルダの中で実行):
#   docker build -t my-vite .
#   docker run -d -p 8080:80 --name my-vite my-vite
#   → http://localhost:8080
#
# 「マルチステージビルド」という書き方で、2段階に分かれている
#   1段階目: Node.jsのイメージで npm run build して dist/ を作る
#   2段階目: できあがった dist/ だけを nginx のイメージにコピーする
# → 完成したイメージには Node.js も node_modules も入らず、小さく安全になる

# ---- 1段階目: ビルド ----
FROM node:24-alpine AS build

WORKDIR /app

# 先に package.json だけコピーしてインストールする
# (ソースを変えただけなら、ここはキャッシュが使われて速くなる)
COPY package.json package-lock.json ./
RUN npm ci

# ソースをコピーしてビルドする → /app/dist ができる
COPY . .
RUN npm run build

# ---- 2段階目: 配信 ----
FROM nginx

# 1段階目(build)で作った dist/ の中身だけをコピーする
COPY --from=build /app/dist/ /usr/share/nginx/html/
