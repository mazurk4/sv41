# PHPのサイト用
#
# 使い方(このフォルダの中で実行):
#   docker build -t my-php .
#   docker run -d -p 8080:80 --name my-php my-php
#   → http://localhost:8080

# PHPとWebサーバー(Apache)が入った公式イメージをベースにする
FROM php:8.3-apache

# MySQLにつなぐ作品の場合は、次の行の先頭の # を外す(第4回で使う)
# RUN docker-php-ext-install mysqli pdo_mysql

# このフォルダの中身を、Apacheの公開フォルダにコピーする
COPY . /var/www/html/
