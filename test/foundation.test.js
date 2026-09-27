const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.join(__dirname, "..");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");

test("classic scripts load the application without ES module imports", () => {
  const html = read("index.html");
  const main = read("main.js");

  assert.match(html, /<script src="modules\/tabs\.js"><\/script>/);
  assert.match(html, /<script src="main\.js"><\/script>/);
  assert.doesNotMatch(html, /type="module"/);
  assert.doesNotMatch(main, /^import /m);
});

test("all feature constructors are exposed before main.js runs", () => {
  for (const name of ["tabs", "storage", "xss", "defense", "learn"]) {
    assert.match(read(`modules/${name}.js`), /window\.[A-Za-z]+\s*=/);
  }
});

test("storage list renders key and value through DOM text nodes", () => {
  const source = read("modules/storage.js");
  const start = source.indexOf("updateList(element, storage)");
  const end = source.indexOf("\n  detectDataType(value) {");
  const section = source.slice(start, end);

  assert.match(section, /keyElement\.textContent = key/);
  assert.match(section, /valueElement\.textContent = this\.formatValueSimple\(value\)/);
  assert.doesNotMatch(section, /li\.innerHTML/);
});

test("XSS sandbox restores temporary API hooks on an exception", () => {
  const source = read("modules/xss.js");
  const start = source.indexOf("runXSS()");
  const end = source.indexOf("showExecutionSteps(script)");
  const section = source.slice(start, end);

  assert.match(section, /restoreSandbox = \(\) =>/);
  assert.match(section, /catch \(e\) \{\s+restoreSandbox\(\);/);
});
