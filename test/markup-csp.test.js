const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.join(__dirname, "..");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");
const html = read("index.html");
const css = read("style.css");
const NL = String.fromCharCode(10);
const scripts = ["main.js", "modules/tabs.js", "modules/storage.js", "modules/xss.js", "modules/defense.js", "modules/learn.js"];

test("インラインのイベントハンドラーとstyle属性を書かない", () => {
  // 「教育用サンプル」と印をつけた行は、画面へ差し込まない文字列なので対象外とする
  for (const name of [...scripts, "index.html"]) {
    const lines = read(name).split(NL);
    lines.forEach((line, index) => {
      const previous = index > 0 ? lines[index - 1] : "";
      if (previous.includes("教育用サンプル")) return;
      assert.doesNotMatch(line, /\son[a-z]+\s*=\s*"/, `${name}:${index + 1} にインラインハンドラーがある`);
      assert.doesNotMatch(line, /\sstyle\s*=\s*"/, `${name}:${index + 1} にstyle属性がある`);
    });
  }
});

test("CSPは不要なunsafe-inlineを含まない", () => {
  const match = html.match(/Content-Security-Policy" content="([^"]+)"/);
  assert.ok(match, "meta CSPがない");
  const csp = match[1];
  assert.doesNotMatch(csp, /'unsafe-inline'/);
  assert.match(csp, /connect-src 'none'/);
  assert.match(csp, /object-src 'none'/);
  assert.match(csp, /base-uri 'self'/);
  assert.match(csp, /form-action 'self'/);
  // 学習デモのevalだけは残す。理由はSECURITY.mdに書く
  assert.match(csp, /script-src 'self' 'unsafe-eval'/);
});

test("外部への通信を持ち込まない", () => {
  // xss.jsだけは例外。学習デモのために通信APIを一時的に差し替えて遮断する
  for (const name of [...scripts, "index.html", "style.css"]) {
    const source = read(name);
    assert.doesNotMatch(source, /https?:\/\/[a-z0-9.-]+\/[^"')\s]*\.(js|css|woff2?)/i, `${name} が外部リソースを読んでいる`);
    if (name === "modules/xss.js") continue;
    assert.doesNotMatch(source, /\bfetch\s*\(|XMLHttpRequest|sendBeacon|new WebSocket/, `${name} に通信がある`);
  }
});

test("XSSデモの通信APIは遮断のために差し替え、必ず元へ戻す", () => {
  const xss = read("modules/xss.js");
  // 差し替えるより先に復元手順を決めている
  const restoreAt = xss.indexOf("restoreSandbox = () => {");
  const firstOverrideAt = xss.indexOf("window.alert = (msg) =>");
  assert.ok(restoreAt > 0 && firstOverrideAt > 0);
  assert.ok(restoreAt < firstOverrideAt, "復元手順の定義が差し替えより後にある");
  // 差し替えたものはすべて元へ戻す
  for (const api of ["window.alert", "window.fetch", "window.XMLHttpRequest", "window.WebSocket", "window.Image", "navigator.sendBeacon"]) {
    assert.match(xss, new RegExp(`${api.replace(".", "\.")} = original`), `${api} を戻していない`);
  }
  // 遮断であって、本当に送ってはいない
  assert.doesNotMatch(xss, /originalFetch\s*\(/);
  assert.doesNotMatch(xss, /originalSendBeacon\s*\(/);
});

test("すべてのbutton要素にtypeがある", () => {
  const buttons = html.match(/<button[^>]*>/g) || [];
  assert.ok(buttons.length > 0);
  for (const button of buttons) {
    assert.match(button, /type="button"|type="submit"/, `type未指定: ${button}`);
  }
});

test("タブはtablist・tab・tabpanelで関連づける", () => {
  assert.match(html, /role="tablist"/);
  const tabs = html.match(/role="tab"/g) || [];
  const panels = html.match(/role="tabpanel"/g) || [];
  assert.equal(tabs.length, 4);
  assert.equal(panels.length, 4);
  for (const name of ["storage", "xss", "defense", "learn"]) {
    assert.match(html, new RegExp(`id="tab-${name}"[^>]*aria-controls="${name}"`));
    assert.match(html, new RegExp(`id="${name}"[^>]*aria-labelledby="tab-${name}"`));
  }
});

test("タブは左右キーとHome・Endで移動できる", () => {
  const tabs = read("modules/tabs.js");
  for (const key of ["ArrowRight", "ArrowLeft", "Home", "End"]) {
    assert.match(tabs, new RegExp(`"${key}"`), `${key} の処理がない`);
  }
  assert.match(tabs, /tabIndex = btn\.classList\.contains\("active"\) \? 0 : -1/);
});

test("入力欄にはラベルがある", () => {
  for (const id of ["keyInput", "valueInput", "xssInput"]) {
    assert.match(html, new RegExp(`<label[^>]*for="${id}"`), `${id} のlabelがない`);
  }
});

test("狭い画面で横に溢れない指定が入っている", () => {
  assert.match(css, /\*,\s*\r?\n\*::before,\s*\r?\n\*::after \{\s*\r?\n  box-sizing: border-box;/);
  assert.doesNotMatch(css, /minmax\((\d+)px, 1fr\)/);
  assert.match(css, /minmax\(min\(100%, \d+px\), 1fr\)/);
});
