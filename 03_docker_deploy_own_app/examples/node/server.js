// ライブラリを使わない、いちばん小さいWebサーバー
const http = require('node:http');

const port = 3000;

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<h1>Hello from Node.js!</h1><p>Node.js ${process.version} で動いています。</p>`);
});

server.listen(port, () => {
    console.log(`http://localhost:${port} で起動しました(コンテナの中のポート)`);
});
