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
