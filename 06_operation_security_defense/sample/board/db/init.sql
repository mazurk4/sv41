-- 日本語が文字化けしないように、このファイルをUTF-8として読み込ませる
SET NAMES utf8mb4;

CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  message VARCHAR(500) NOT NULL,
  -- 0 = 非公開(管理者だけが見られるはずの投稿)
  is_public TINYINT NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) DEFAULT CHARSET = utf8mb4;

INSERT INTO posts (name, message, is_public) VALUES
  ('管理人', '一言掲示板へようこそ!気軽に書き込んでください。', 1),
  ('たなか', '今日の授業、Docker Compose便利すぎる', 1),
  ('すずき', 'DVWAで初めてSQLインジェクションやってみた。こわい', 1),
  ('管理人', '【非公開メモ】管理画面のパスワード: admin-2026(あとで変える)', 0),
  ('管理人', '【非公開メモ】問い合わせ対応: suzuki@example.com 様に返信済み', 0),
  ('さとう', '来週はセキュリティの守る側の回らしい', 1);
