# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

LocalStorage Playground is an educational tool that shows how far `localStorage` and `sessionStorage` protect stored data, and where that protection stops. Part of the "生成AIで作るセキュリティツール100" project (Day 038).

Live demo: https://ipusiron.github.io/localstorage-playground/

## Architecture

A static client-side page. Plain scripts (no ES modules, no bundler, no dependencies), so the page also works when opened over `file://`.

```
index.html                 # Markup; display text is bound to the dictionary via data-i18n
main.js                    # Entry point: initialises modules, wires the language switch
modules/
├── i18n.js               # MESSAGES (ja/en) and the I18n class
├── tabs.js               # Tab switching and keyboard navigation (TabManager)
├── storage.js            # Storage operations, presets, search, export (StorageManager)
├── xss.js                # XSS demonstrations (XSSDemo)
├── defense.js            # Defense demonstrations (DefenseDemo)
└── learn.js              # Explanatory content (LearnSection)
```

Each module assigns its class to `window` so `main.js` can construct it. `main.js` exposes `window.storageManager`, and `defense.js` exposes `window.defenseDemo`, for cross-module access.

## Rules that the tests enforce

`npm test` (Node 22, `node --test`, no dependencies) fails if any of these are broken. They are not style preferences; each one exists because the corresponding bug was found in this repository.

**1. Never build HTML strings out of user input.**
Keys, values and search terms go through `createElement` and `textContent` only. They must not reach `innerHTML`, attribute values, `onclick`-style strings, URLs or `eval` concatenation. A key containing `"` used to break out of the edit modal's `value=""` attribute; a key containing `'` used to break the argument of an inline `onclick`.

**2. No inline event handlers and no `style` attributes.**
Use `addEventListener`, or `data-action` with the delegated handler in `StorageManager.setupDelegatedActions()`. Set geometry through the CSSOM (`element.style.width = ...`), not through markup. This is what lets the CSP drop `'unsafe-inline'`.

**3. Do not register the same `data-action` twice.**
`main.js` handles only `run-xss`; every storage action is handled inside `StorageManager`. Registering an action in both places makes one click run the handler twice.

**4. Never touch the Storage instances to monitor writes.**
`StorageManager.wrapStorageAPIs()` replaces `Storage.prototype.setItem/removeItem/clear`. Assigning to `localStorage.setItem` adds an enumerable own property, and `Object.defineProperty(localStorage, "setItem", ...)` actually stores an entry under the key `setItem` — both pollute `Object.keys(localStorage)`, which the XSS enumeration demo displays.

**5. The XSS sandbox must always restore what it replaced.**
`restoreSandbox` is defined before any API is replaced, and is called on both the normal path and the `catch` path. The blocked `fetch` returns a rejected promise that already has a `catch` attached, so an unhandled rejection is not reported.

**6. No external resources or network calls.**
No CDN, font, API or analytics. `connect-src 'none'` stays. `xss.js` is the only file that mentions `fetch`/`XMLHttpRequest`/`sendBeacon`, and only to block them.

**7. Display text lives in `modules/i18n.js`.**
Modules call `this.t("key")`; they must not contain Japanese display strings. `index.html` binds text through `data-i18n`, `data-i18n-html` and `data-i18n-attr`. The `ja` and `en` tables must have identical keys and identical `{placeholder}` names.

**8. Do not let the page scroll horizontally.**
Checked at 1280, 768, 390 and 320 px. Global `box-sizing: border-box`, `min-width: 0` on flex children, and `minmax(min(100%, Npx), 1fr)` for grid tracks.

## Language handling

Order: `?lang=ja|en` → the saved setting → `navigator.language`. The setting is written to `localStorage` under `localstorage-playground:lang` and is deliberately visible in the tool's own list. Reads and writes are wrapped in `try`/`catch` so a browser that refuses Storage does not break the page.

Switching reloads the page. The active tab and the three input fields are carried across in `window.name`, never in Storage, so the data the tool displays is not disturbed.

## Running it

No build step.

```bash
# Open directly
start index.html          # Windows

# Or serve over HTTP (closer to real conditions for the same-origin demo)
python -m http.server 8000

# Tests
npm test
```

## Deliberate exceptions

- `eval()` in `xss.js`, and `'unsafe-eval'` in the CSP. This is the point of the tool. It runs with the network APIs blocked.
- `innerHTML` is still used in `storage.js` for static markup that contains no user input. Adding user input to any of those templates is a defect.
- There is deliberately no `escapeHtml()` helper any more. The old one used the `textContent` → `innerHTML` trick, which leaves `"` and `'` untouched and therefore did not protect attribute values. Do not reintroduce it; build DOM instead.
- Screenshots are produced by `D:\ipusiron-work\business\research\try100_audit\impl\shots\day038_shots.py`, which lives outside this repository.
