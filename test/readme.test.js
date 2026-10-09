const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");

test("ユースケースの「このツールならではの使い方」の例が、見本のソースと一致する（日英）", () => {
  const xss = read("modules/xss.js");
  const defense = read("modules/defense.js");
  const ja = read("README.md");
  const en = read("README.en.md");
  assert.ok(xss.includes('localStorage.getItem("token")'));
  assert.ok(xss.includes("JSON.stringify(localStorage)"));
  assert.ok(xss.includes("malware"));
  assert.ok(defense.includes("node.textContent = userInput"));
  assert.ok(defense.includes("element.innerHTML = "));
  for (const md of [ja, en]) {
    assert.ok(md.includes('localStorage.getItem("token")'));
    assert.ok(md.includes("node.textContent = userInput") && md.includes("malware"));
  }
});
