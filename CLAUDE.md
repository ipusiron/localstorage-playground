# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LocalStorage Playground is an educational security tool that demonstrates the characteristics and vulnerabilities of browser Web Storage APIs (localStorage and sessionStorage), particularly in relation to XSS attacks. This is part of the "生成AIで作るセキュリティツール100" (100 Security Tools with Generative AI) project, Day 038.

## Architecture

This is a client-side only web application built with vanilla JavaScript, HTML, and CSS:

- **index.html**: Main HTML structure with 3 tabs (Storage Operations, XSS Demo, Learning)
- **script.js**: Core functionality for storage operations, tab switching, and XSS demonstration
- **style.css**: Responsive styling with dark mode support

Key functionality:
- Tab-based UI with three sections: storage operations, XSS demonstration, and learning materials
- Storage manipulation: save, delete, and clear operations for both localStorage and sessionStorage
- Visual comparison of localStorage vs sessionStorage persistence
- Controlled XSS demonstration using `eval()` to show security vulnerabilities

## Development Commands

This is a static HTML/CSS/JavaScript project with no build process:

```bash
# Open the project locally
# Simply open index.html in a browser

# Deploy to GitHub Pages
# The project is configured to deploy to: https://ipusiron.github.io/localstorage-playground/
```

## Security Considerations

This tool intentionally includes security vulnerabilities for educational purposes:
- The XSS demo section uses `eval()` to demonstrate localStorage theft
- This should only be used in controlled educational environments
- The tool is designed to teach about Web Storage security risks, not for production use

## Testing Approach

Manual testing in browser:
1. Test storage operations across localStorage and sessionStorage
2. Verify persistence after page reload (localStorage should persist, sessionStorage should not)
3. Test XSS demo functionality in a safe environment
4. Check responsive design and dark mode compatibility