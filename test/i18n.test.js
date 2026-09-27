const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.join(__dirname, "..");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");
const NL = String.fromCharCode(10);
const JAPANESE = /[぀-ヿ一-鿿]/;

// i18n.js から辞書だけを取り出す
const source = read("modules/i18n.js");
const MESSAGES = new Function(source.split("class I18n")[0] + "return MESSAGES;")();

const uiModules = ["main.js", "modules/tabs.js", "modules/storage.js", "modules/xss.js", "modules/defense.js", "modules/learn.js"];

// 引用符の外にある // から後ろだけを落とす
function stripTrailingComment(line) {
  let quote = null;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (quote) {
      if (ch === "\\") i += 1;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      continue;
    }
    if (ch === "/" && line[i + 1] === "/") return line.slice(0, i);
  }
  return line;
}

test("日本語と英語のキーが一致し、空の値がない", () => {
  const ja = Object.keys(MESSAGES.ja).sort();
  const en = Object.keys(MESSAGES.en).sort();
  assert.deepEqual(en, ja, "キーの集合が違う");
  assert.ok(ja.length > 200, "キーが少なすぎる");

  for (const language of ["ja", "en"]) {
    for (const [key, value] of Object.entries(MESSAGES[language])) {
      assert.equal(typeof value, "string", `${language}.${key} が文字列でない`);
      assert.notEqual(value.trim(), "", `${language}.${key} が空`);
    }
  }
});

test("英語の辞書に日本語が残っていない", () => {
  // 日本語の見本データも英語側は英語にする。例外があればここへ明記する
  // 言語切り替えボタンだけは、切り替え先の言語の表記で出す
  const allowed = new Set(["lang.toggle"]);
  for (const [key, value] of Object.entries(MESSAGES.en)) {
    if (allowed.has(key)) continue;
    assert.doesNotMatch(value, JAPANESE, `en.${key} に日本語が残っている: ${value}`);
  }
});

test("差し込みの名前が日英でそろっている", () => {
  const names = (text) => (text.match(/\{[a-zA-Z]+\}/g) || []).sort().join(",");
  for (const key of Object.keys(MESSAGES.ja)) {
    assert.equal(names(MESSAGES.en[key]), names(MESSAGES.ja[key]), `${key} の差し込みが食い違う`);
  }
});

test("画面の文言をモジュールへ直接書かない", () => {
  for (const name of uiModules) {
    const lines = read(name).split(NL);
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("//") || trimmed.startsWith("*")) return;
      // 行末のコメントだけを落とす。
      // 文字列の中の // をコメントと見なすと、コード見本の日本語を見逃す。
      const code = stripTrailingComment(line);
      assert.doesNotMatch(code, JAPANESE, `${name}:${index + 1} に画面文言が直書きされている`);
    });
  }
});

test("index.htmlの表示文字はすべて辞書と結びついている", () => {
  const html = read("index.html");
  // data-i18n / data-i18n-html / data-i18n-attr で指すキーが辞書にある
  const keys = [...html.matchAll(/data-i18n(?:-html)?="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(keys.length >= 20, "data-i18nが少なすぎる");
  for (const key of keys) {
    assert.ok(MESSAGES.ja[key], `辞書にない: ${key}`);
  }
  for (const attr of [...html.matchAll(/data-i18n-attr="([^"]+)"/g)].map((m) => m[1])) {
    for (const pair of attr.split(",")) {
      const key = pair.split(":")[1].trim();
      assert.ok(MESSAGES.ja[key], `辞書にない属性キー: ${key}`);
    }
  }
});

test("モジュールが呼ぶキーが辞書にある", () => {
  for (const name of uiModules) {
    const body = read(name);
    for (const match of body.matchAll(/\bt\("([a-zA-Z][\w.]*)"/g)) {
      const key = match[1];
      assert.ok(MESSAGES.ja[key], `${name}: 辞書にないキー ${key}`);
    }
  }
});

test("言語の決め方と保存の失敗の扱い", () => {
  // ?lang、保存値、ブラウザー言語の順
  const detect = source.slice(source.indexOf("detectLanguage()"), source.indexOf("  readSaved() {"));
  assert.ok(detect.indexOf("searchParams") < detect.indexOf("readSaved"), "?langを先に見ていない");
  assert.ok(detect.indexOf("readSaved") < detect.indexOf("navigator.language"), "保存値をブラウザー言語より後に見ている");

  // Storageが使えなくても止まらない
  for (const method of ["  readSaved() {", "  writeSaved(language) {"]) {
    const section = source.slice(source.indexOf(method), source.indexOf(method) + 400);
    assert.match(section, /try \{/, `${method} が例外を処理していない`);
    assert.match(section, /catch \(e\)/, `${method} が例外を処理していない`);
  }
});

test("言語を切り替えても開いていたタブと入力を失わない", () => {
  const setLanguage = source.slice(source.indexOf("setLanguage(language)"), source.indexOf("restoreCarriedState()"));
  for (const id of ["keyInput", "valueInput", "xssInput"]) {
    assert.match(setLanguage, new RegExp(id), `${id} を持ち越していない`);
  }
  assert.match(setLanguage, /tab:/);
  // 持ち越しはStorageを汚さない
  assert.doesNotMatch(setLanguage, /sessionStorage\.setItem|localStorage\.setItem/);
  assert.match(setLanguage, /window\.name = JSON\.stringify/);
});
