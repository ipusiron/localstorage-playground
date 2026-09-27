const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.join(__dirname, "..");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");
const storage = read("modules/storage.js");

// コードだけを検査する（説明のコメントに語が出てくるため）
const NL = String.fromCharCode(10);
const stripComments = (source) =>
  source
    .split(NL)
    .filter((line) => !line.trim().startsWith("//"))
    .join(NL);

const slice = (source, startMarker, endMarker) => {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  assert.ok(start >= 0, `見つからない: ${startMarker}`);
  assert.ok(end > start, `見つからない: ${endMarker}`);
  return stripComments(source.slice(start, end));
};

test("折りたたみ生成は入力欄をouterHTMLで複製せずノードのまま移動する", () => {
  const section = slice(storage, "createCollapsibleStorageOperations() {", "toggleCollapsibleSection(header) {");
  assert.doesNotMatch(section, /outerHTML/);
  assert.doesNotMatch(section, /inputArea\.remove\(\)/);
  assert.match(section, /content\.append\(inputArea, actionsDiv\)/);
});

test("ストレージ監視はインスタンスへ代入せずプロトタイプを包む", () => {
  const section = slice(storage, "wrapStorageAPIs() {", "showUpdateNotification(event) {");
  assert.doesNotMatch(section, /localStorage\.(setItem|removeItem|clear)\s*=/);
  assert.doesNotMatch(section, /sessionStorage\.(setItem|removeItem|clear)\s*=/);
  assert.doesNotMatch(section, /Object\.defineProperty\(\s*(localStorage|sessionStorage)/);
  assert.match(section, /Storage\.prototype\[method\] = function/);
});

test("編集モーダルはキーと値をHTML文字列へ差し込まない", () => {
  const section = slice(storage, "showEditModal(originalKey, originalValue, storageType) {", "closeEditModal() {");
  assert.doesNotMatch(section, /innerHTML/);
  assert.doesNotMatch(section, /onclick=/);
  assert.match(section, /keyField\.value = originalKey/);
  assert.match(section, /valueField\.value = originalValue/);
});

test("createElementヘルパーは属性値を文字列連結で組み立てない", () => {
  const section = slice(storage, "createElement(tag, props", "showEditModal(originalKey");
  assert.match(section, /node\.textContent = value/);
  assert.match(section, /node\.setAttribute\(name, value\)/);
  assert.doesNotMatch(section, /innerHTML/);
});

test("Storageが使えない環境でも画面を止めない", () => {
  const main = read("main.js");
  // 1つのモジュールの失敗で残りの初期化を巻き添えにしない
  const init = slice(main, "init() {", "setupLanguageSwitch() {");
  assert.match(init, /for \(const \[name, step\] of steps\)/);
  assert.match(init, /try \{[\s\S]*?step\(\);[\s\S]*?\} catch/);
  // あいさつのためのStorage読み書きで落ちない
  const welcome = slice(main, "showInitialMessage() {", "const app =");
  assert.match(welcome, /try \{[\s\S]*?localStorage[\s\S]*?\} catch/);

  // 読み書きできるかを実際に試してから組み立てる
  assert.match(storage, /probeStorage\(\) \{/);
  assert.match(storage, /get storageUsable\(\)/);
  assert.match(storage, /showStorageUnavailableNotice\(\) \{/);
  const storageInit = slice(storage, "init() {", "editItem(key, storageType) {");
  assert.match(storageInit, /if \(!this\.storageUsable\)/);
  assert.match(storageInit, /this\.showStorageUnavailableNotice\(\);/);

  // 例外は画面の言葉にする
  assert.match(storage, /reportStorageError\(error\) \{/);
  assert.match(storage, /storageError\.quota/);
  assert.match(storage, /storageError\.blocked/);
  for (const method of ["refreshDisplay() {", "saveData() {", "clearStorage(type) {"]) {
    const section = storage.slice(storage.indexOf(method), storage.indexOf(method) + 900);
    assert.match(section, /this\.safely\(/, `${method} が safely で包まれていない`);
  }
});

test("XSSデモはStorageが読めなくても動く", () => {
  const xss = read("modules/xss.js");
  const snapshot = slice(xss, "captureStorageSnapshot() {", "analyzeSecurityImpact(");
  assert.match(snapshot, /try \{/);
  assert.match(snapshot, /catch \(e\) \{/);
  const demo = slice(xss, "ensureDemoData(script) {", "prepareDemoData(script) {");
  assert.match(demo, /try \{[\s\S]*?catch/);
});
