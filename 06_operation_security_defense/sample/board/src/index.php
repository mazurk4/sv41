<?php
// 一言掲示板
// ※ わざとセキュリティの穴を残してある(発展で直してみよう)

try {
    $pdo = new PDO('mysql:host=db;dbname=board;charset=utf8mb4', 'board', 'boardpass');
} catch (PDOException $e) {
    exit('DBの準備中です。30秒ほど待ってから再読み込みしてください。');
}

// 書き込み
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] !== '' ? $_POST['name'] : '名無し';
    $stmt = $pdo->prepare('INSERT INTO posts (name, message) VALUES (?, ?)');
    $stmt->execute([$name, $_POST['message']]);
    header('Location: ./');
    exit;
}

// 検索(公開の投稿だけを表示する)
$q = $_GET['q'] ?? '';

// ❌ 穴①: 入力 $q をそのまま SQL 文に連結している
$sql = "SELECT name, message, created_at FROM posts
        WHERE is_public = 1 AND message LIKE '%$q%'
        ORDER BY id DESC";
$posts = $pdo->query($sql)->fetchAll();
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>一言掲示板</title>
  <style>
    body { font-family: sans-serif; max-width: 640px; margin: 2rem auto; padding: 0 1rem; color: #333; }
    h1 { color: #d35400; }
    form { margin-bottom: 1.5rem; }
    input, textarea, button { font-size: 1rem; padding: .4rem; }
    textarea { width: 100%; box-sizing: border-box; }
    ul { list-style: none; padding: 0; }
    li { border-bottom: 1px solid #eee; padding: .6rem 0; }
    .date { color: #999; font-size: .8rem; }
  </style>
</head>
<body>
  <h1>一言掲示板</h1>

  <form method="post">
    <input name="name" placeholder="名前" maxlength="50">
    <textarea name="message" rows="2" placeholder="ひとこと" maxlength="500" required></textarea>
    <button>書き込む</button>
  </form>

  <form method="get">
    <input name="q" placeholder="キーワードで検索">
    <button>検索</button>
  </form>

  <?php if ($q !== ''): ?>
    <p>「<?= $q ?>」の検索結果: <?= count($posts) ?> 件</p>
  <?php endif; ?>

  <ul>
    <?php foreach ($posts as $post): ?>
      <li>
        <!-- ❌ 穴②: DBから取り出した文字を、そのままHTMLに埋め込んでいる -->
        <strong><?= $post['name'] ?></strong>
        <span class="date"><?= $post['created_at'] ?></span><br>
        <?= $post['message'] ?>
      </li>
    <?php endforeach; ?>
  </ul>

  <!-- 授業用にバージョンを表示している。本番では出さないこと(攻撃者に「古い」とバレる) -->
  <footer class="date">PHP <?= PHP_VERSION ?> / <?= $_SERVER['SERVER_SOFTWARE'] ?></footer>
</body>
</html>
