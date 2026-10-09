// Minimal workspace app. The coa watch server runs `npm start` with PORT set and
// proxies the builder's app tab to it. No dependencies: Node's http module only.
const http = require("http");

const port = Number(process.env.PORT) || 3000;
const workspaceDir = process.env.WORKSPACE_DIR || "(not set)";
const startedAt = new Date().toISOString();

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Second App</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; padding: 24px; background: #f6f7f9; color: #1f2328; }
    main { max-width: 520px; margin: 0 auto; background: #fff; border: 1px solid #d0d7de; border-radius: 8px; padding: 24px; }
    h1 { margin-top: 0; }
    button { font-size: 16px; padding: 8px 16px; cursor: pointer; }
    input { font-size: 16px; padding: 8px; width: 100%; box-sizing: border-box; }
    dl { display: grid; grid-template-columns: max-content 1fr; gap: 4px 12px; font-size: 14px; }
    dt { color: #57606a; }
    dd { margin: 0; font-family: monospace; word-break: break-all; }
    .state { margin: 16px 0; padding: 12px; background: #fff4e5; border-radius: 6px; }
  </style>
</head>
<body>
  <main>
    <h1>Second App</h1>
    <p>Client-side state below lives only in this page. If it survives switching tabs, the app was not reloaded.</p>

    <div class="state">
      <p>Counter: <strong id="count">0</strong></p>
      <button id="increment">Increment</button>
    </div>

    <div class="state">
      <label for="note">Note</label>
      <input id="note" placeholder="Type something, then switch tabs" />
    </div>

    <dl>
      <dt>Page loaded at</dt><dd id="loadedAt"></dd>
      <dt>Server started at</dt><dd>${startedAt}</dd>
      <dt>PORT</dt><dd>${port}</dd>
      <dt>WORKSPACE_DIR</dt><dd>${workspaceDir}</dd>
    </dl>
  </main>

  <script>
    let count = 0;
    document.getElementById("increment").addEventListener("click", () => {
      count += 1;
      document.getElementById("count").textContent = String(count);
    });
    document.getElementById("loadedAt").textContent = new Date().toISOString();
  </script>
</body>
</html>
`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
});

server.listen(port, () => {
  console.log(`second-app listening on http://localhost:${port}`);
});

const shutdown = () => server.close(() => process.exit(0));
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
