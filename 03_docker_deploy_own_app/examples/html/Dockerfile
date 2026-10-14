# HTML / CSS / JavaScript だけのサイト用
#
# 使い方(このフォルダの中で実行):
#   docker build -t my-html .
#   docker run -d -p 8080:80 --name my-html my-html
#   → http://localhost:8080

# Webサーバー(nginx)の公式イメージをベースにする
FROM nginx

# このフォルダの中身を、nginxの公開フォルダにコピーする
COPY . /usr/share/nginx/html/
