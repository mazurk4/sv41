// 自分の作品のサイトを確かめる自動テスト(第11回の発展・第14回)
// 第9回の cafe-site のテストを、どんな作品でも使えるようにしたもの
//
// ファイル名の .cjs は、Vite など package.json に "type": "module" がある作品でも動かすため
//
// 実行のしかた(SITE_DIR に、公開するフォルダの名前を入れる)
//   Mac:        SITE_DIR=public node --test
//   PowerShell: $env:SITE_DIR="public"; node --test
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const siteDir = path.resolve(process.env.SITE_DIR || 'public');

// 公開するフォルダの中の、すべてのファイル(サブフォルダの中も)
// .git と .github は公開されない(GitHub Pages に上げるときに外される)ので、調べない
const files = fs
  .readdirSync(siteDir, { recursive: true })
  .map((name) => name.split(path.sep).join('/'))
  .filter((name) => !/^\.git(hub)?(\/|$)/.test(name))
  .filter((name) => fs.statSync(path.join(siteDir, name)).isFile());

const pages = files
  .filter((name) => name.endsWith('.html'))
  .map((name) => {
    const html = fs.readFileSync(path.join(siteDir, name), 'utf8');
    // コメントの中の <img> やリンクは、表示されないので調べない
    return { name, html, shown: html.replace(/<!--[\s\S]*?-->/g, '') };
  });

// ページの中のリンクと画像の先(外のサイトや、ページの中の移動は除く)
function localLinks(shown) {
  return [...shown.matchAll(/\s(?:href|src)="([^"]*)"/g)]
    .map(([, url]) => url)
    .filter((url) => url && !/^([a-z]+:|\/\/|#)/i.test(url));
}

test('トップページ(index.html)がある', () => {
  assert.ok(files.includes('index.html'), `${siteDir} に index.html がありません`);
});

test('どの画像にも alt がある', () => {
  for (const { name, shown } of pages) {
    for (const [img] of shown.matchAll(/<img\b[^>]*>/g)) {
      assert.match(img, /\salt=/, `${name} の画像に alt がありません: ${img}`);
    }
  }
});

test('リンクが / で始まっていない(GitHub Pages ではリポジトリ名の分ずれる)', () => {
  for (const { name, shown } of pages) {
    for (const url of localLinks(shown)) {
      assert.ok(!url.startsWith('/'), `${name} のリンクが / で始まっています: ${url}`);
    }
  }
});

test('リンクと画像の先に、ファイルがある', () => {
  for (const { name, shown } of pages) {
    for (const url of localLinks(shown)) {
      if (url.startsWith('/')) continue; // 上のテストで見る
      let file = decodeURIComponent(url.split(/[?#]/)[0]);
      if (file === '' || file.endsWith('/')) file += 'index.html';
      const target = path.posix.normalize(path.posix.join(path.posix.dirname(name), file));
      assert.ok(files.includes(target), `${name} のリンク先がありません: ${url}`);
    }
  }
});

test('コンフリクトの印が残っていない', () => {
  for (const name of files.filter((f) => /\.(html|css|js)$/.test(f))) {
    const text = fs.readFileSync(path.join(siteDir, name), 'utf8');
    assert.doesNotMatch(text, /^(<{7}|={7}|>{7})/m, `${name} にコンフリクトの印が残っています`);
  }
});

test('公開しないファイルが入っていない', () => {
  const ng = [
    [/(^|\/)\.env/, 'パスワードなどを書く設定ファイル'],
    [/\.php$/, 'PHP のファイル(GitHub Pages では動かず、中身がそのまま読める)'],
    [/\.(sql|sqlite|db)$/, 'データベースのファイル'],
    [/\.(pem|key)$|(^|\/)id_(rsa|ed25519)/, '鍵のファイル'],
    [/\.(zip|bak|log)$|_old|_bak|_backup/, '古いファイル・まとめたファイル'],
    [/(^|\/)(node_modules|\.git)\//, '公開しないフォルダ'],
  ];
  for (const name of files) {
    for (const [pattern, why] of ng) {
      assert.doesNotMatch(name, pattern, `公開しないファイルがあります(${why}): ${name}`);
    }
  }
});
