<?php
// 指名ルーレット
// - 候補者は members.txt から読み込む(1行に1人)
// - 一度当たった人は、リセットするまで候補から外れる(セッションに記録)

session_start();

// 画面に文字を出すときは必ずエスケープする(第5回のセキュリティで詳しく扱う)
function h(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}

$title = '指名ルーレット';

$lines = file(__DIR__ . '/members.txt', FILE_IGNORE_NEW_LINES) ?: [];
$members = array_values(array_filter(array_map('trim', $lines), fn($m) => $m !== ''));

$picked = $_SESSION['picked'] ?? [];
$candidates = array_values(array_diff($members, $picked));

// ボタンが押されたときの処理
$action = $_POST['action'] ?? '';
if ($action === 'spin' && count($candidates) > 0) {
    $index = random_int(0, count($candidates) - 1);
    $_SESSION['last_spin'] = ['wheel' => $candidates, 'index' => $index];
    $_SESSION['picked'][] = $candidates[$index];
}
if ($action === 'reset') {
    $_SESSION['picked'] = [];
}
if ($action !== '') {
    // 再読み込みでもう一度回ってしまわないよう、いったん自分自身にリダイレクトする
    header('Location: ' . $_SERVER['SCRIPT_NAME']);
    exit;
}

// 直前に回した結果があれば、そのときのルーレットを表示してアニメーションさせる
$lastSpin = $_SESSION['last_spin'] ?? null;
unset($_SESSION['last_spin']);
$wheel = $lastSpin['wheel'] ?? $candidates;
$winnerIndex = $lastSpin['index'] ?? null;

$count = count($wheel);
$segment = $count > 0 ? 360 / $count : 360;

// 扇形の色を、人数に合わせて色相をずらしながら作る
$stops = [];
foreach ($wheel as $i => $name) {
    $hue = round($i * 360 / max($count, 1));
    $stops[] = "hsl({$hue} 75% 62%) " . ($i * $segment) . 'deg ' . (($i + 1) * $segment) . 'deg';
}
$background = $count > 0 ? 'conic-gradient(' . implode(', ', $stops) . ')' : '#ccc';
$fontSize = max(11, min(22, intdiv(260, max($count, 1))));
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= h($title) ?></title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1><?= h($title) ?></h1>

    <div class="wheel-area">
        <div class="pointer"></div>
        <div class="wheel" id="wheel"
             style="background: <?= $background ?>; --font-size: <?= $fontSize ?>px"
             data-count="<?= $count ?>"
             data-winner="<?= $winnerIndex ?? '' ?>">
            <?php foreach ($wheel as $i => $name): ?>
                <div class="label" style="--angle: <?= ($i + 0.5) * $segment ?>deg">
                    <span><?= h($name) ?></span>
                </div>
            <?php endforeach; ?>
        </div>
    </div>

    <p class="result" id="result">
        <?php if ($winnerIndex !== null): ?>
            <strong><?= h($wheel[$winnerIndex]) ?></strong> さん、お願いします!
        <?php elseif (count($candidates) === 0): ?>
            全員当たりました。リセットしてください
        <?php else: ?>
            残り <?= count($candidates) ?> 人
        <?php endif; ?>
    </p>

    <form method="post" class="buttons">
        <button name="action" value="spin" id="spin" <?= count($candidates) === 0 ? 'disabled' : '' ?>>回す</button>
        <button name="action" value="reset" class="secondary">リセット</button>
    </form>

    <?php if (count($picked) > 0): ?>
        <section class="history">
            <h2>当たった人(<?= count($picked) ?>人)</h2>
            <p><?= h(implode('、', $picked)) ?></p>
        </section>
    <?php endif; ?>

    <footer>
        動いている場所: <?= h(gethostname()) ?> / PHP <?= h(PHP_VERSION) ?>
    </footer>

    <script>
        // 当たった人の扇形が上の▼に来るように、ルーレットを回転させる
        const wheel = document.getElementById('wheel');
        const result = document.getElementById('result');
        const spin = document.getElementById('spin');
        const winner = wheel.dataset.winner;

        if (winner !== '') {
            const segment = 360 / Number(wheel.dataset.count);
            const jitter = (Math.random() - 0.5) * segment * 0.7;
            const angle = 360 * 6 - ((Number(winner) + 0.5) * segment + jitter);

            const wasDisabled = spin.disabled;
            result.classList.add('hidden');
            spin.disabled = true;

            requestAnimationFrame(() => requestAnimationFrame(() => {
                wheel.style.transform = `rotate(${angle}deg)`;
            }));
            wheel.addEventListener('transitionend', () => {
                result.classList.remove('hidden');
                spin.disabled = wasDisabled;
            }, { once: true });
        }
    </script>
</body>
</html>
