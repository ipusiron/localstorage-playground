# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LocalStorage Playground is an educational security tool that demonstrates Web Storage API vulnerabilities, particularly XSS attack vectors. Part of "生成AIで作るセキュリティツール100" project (Day 038).

Live demo: https://ipusiron.github.io/localstorage-playground/

## Architecture

Static client-side web application using vanilla JavaScript ES6 modules:

```
main.js                    # Entry point, initializes all modules
modules/
├── tabs.js               # Tab navigation (TabManager class)
├── storage.js            # Storage operations, presets, search, export (StorageManager class)
├── xss.js                # XSS attack demonstrations (XSSDemo class)
├── defense.js            # Security defense demos (DefenseDemo class)
└── learn.js              # Educational content (LearnSection class)
```

**Module Responsibilities:**
- **StorageManager**: Handles localStorage/sessionStorage CRUD, data presets, search/filter, capacity stats, JSON/CSV export, real-time update monitoring via wrapped Storage APIs
- **XSSDemo**: Demonstrates XSS attacks (basic, advanced, persistent) with sandboxed `eval()` execution, blocks external requests (fetch, XMLHttpRequest, WebSocket, Image, sendBeacon)
- **DefenseDemo**: Shows CSP, HttpOnly Cookie, and input sanitization defense techniques
- **TabManager**: Simple tab switching between 4 sections (Storage, XSS, Defense, Learn)

**Global Window References:**
- `window.saveData()`, `window.clearStorage()`, `window.runXSS()` - called from inline onclick handlers
- `window.storageManager`, `window.defenseDemo` - module instances for modal callbacks

## Development

No build process. Open `index.html` directly in browser or serve via local HTTP server.

```bash
# Option 1: Direct file open
start index.html  # Windows

# Option 2: Python HTTP server (for stricter CORS testing)
python -m http.server 8000
```

## Security Notes

This tool intentionally uses unsafe patterns for educational demonstration:
- `eval()` in xss.js for XSS demo execution
- CSP header allows `'unsafe-eval'` and `'unsafe-inline'`
- External network requests are blocked programmatically, not by CSP

The XSS sandbox intercepts: `window.alert`, `window.fetch`, `XMLHttpRequest`, `WebSocket`, `Image.src`, `navigator.sendBeacon`