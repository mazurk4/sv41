-- MySQLのコンテナを「初めて」起動したときだけ実行される
-- ここに、自分の作品のテーブルを作るSQLを書く
-- (XAMPPの phpMyAdmin で「エクスポート」したSQLを貼り付けてもよい)
--
-- 書き換えたあとにもう一度実行させたいときは、データごと消してから起動し直す
--   docker compose down -v
--   docker compose up -d

SET NAMES utf8mb4;

-- 例:
-- CREATE TABLE users (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(50) NOT NULL
-- );
