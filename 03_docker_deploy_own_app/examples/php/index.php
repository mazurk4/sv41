<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>PHPサイトのサンプル</title>
</head>
<body>
    <h1>Hello from PHP!</h1>
    <p>PHP <?= htmlspecialchars(PHP_VERSION, ENT_QUOTES, 'UTF-8') ?> で動いています。</p>
    <p>現在時刻(コンテナの中の時計): <?= date('Y-m-d H:i:s') ?></p>
</body>
</html>
