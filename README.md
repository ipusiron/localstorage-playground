# LocalStorage Playground - Webストレージの危険性の学習・体験ツール

![GitHub Repo stars](https://img.shields.io/github/stars/ipusiron/localstorage-playground?style=social)
![GitHub forks](https://img.shields.io/github/forks/ipusiron/localstorage-playground?style=social)
![GitHub last commit](https://img.shields.io/github/last-commit/ipusiron/localstorage-playground)
![GitHub license](https://img.shields.io/github/license/ipusiron/localstorage-playground)
[![GitHub Pages](https://img.shields.io/badge/demo-GitHub%20Pages-blue?logo=github)](https://ipusiron.github.io/localstorage-playground/)

**Day038 - 生成AIで作るセキュリティツール100**

---

## 🔍 このツールについて

**LocalStorage Playground** は、ブラウザの `localStorage` や `sessionStorage` に保存されるデータの構造やセキュリティリスク（とくに XSS との組み合わせ）を可視化・体験できる軽量な教育向けツールです。

---

## 🎯 主な機能

- `localStorage` / `sessionStorage` に保存されたデータの一覧表示
- 任意のキー・値の追加・削除
- ストレージのクリア機能（片方または両方）
- ページリロードによる永続性テスト
- `localStorage` と `sessionStorage` の違いを視覚的に比較
- セキュリティ警告の表示（アクセス可能性・XSS盗難リスク）
- （オプション）XSSによる`localStorage`盗難のデモ

---

## 🧪 使用技術

- HTML / CSS / JavaScript（Vanilla JS）
- `localStorage`, `sessionStorage`, `DOM`, `EventListener`
- （一部：`innerHTML`や`eval()` の安全な取り扱い）

---

## 📚 学べること

- Web Storage API の基本と構造
- クライアントストレージにおけるセキュリティ上の注意点
- XSSと組み合わさることでの深刻な情報漏洩例
- `HttpOnly` Cookieとの違い
- `sessionStorage` の適切な用途と寿命

---

## 🌐 デモページ

👉 [https://ipusiron.github.io/localstorage-playground/](https://ipusiron.github.io/localstorage-playground/)

---

## 📸 スクリーンショット

> ![ダミー](assets/screenshot.png)  
>
> *"ダミー*

---

## 📁 ディレクトリー構成

```
localstorage-playground/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/ # スクリーンショット
```

---

## 🔧 現時点の実装内容（v0.1）

本ツールは以下の機能を初期実装済みです（Claude Code CLI などによる改良に利用可能です）。

### 📁 実装ファイル

- `index.html`：3タブ構成（ストレージ操作 / XSSデモ / 学習）
- `style.css`：モダンUI＋レスポンシブ対応＋ダークモード
- `script.js`：以下の機能を含む

### ⚙️ 実装済み機能一覧

| 機能カテゴリ | 実装内容 |
|--------------|----------|
| ✅ タブUI       | クリックで表示切替、activeクラス切替制御 |
| ✅ ストレージ操作 | localStorage / sessionStorage の保存・削除・一覧表示 |
| ✅ リロード保持確認 | localStorage はリロード後も保持されることを確認可能 |
| ✅ 比較可視化     | local と session のデータを並列表示（視覚比較） |
| ✅ XSS擬似実行    | `eval()` を用いた localStorage 読み出しデモ（安全領域内） |
| ✅ 基本バリデーション | 空キーの保存防止、XSS結果の表示領域あり |

---

| バージョン      | 内容                                 |
| ---------- | ---------------------------------- |
| **v1**（現行） | 3タブUI・基本操作（表示・保存・削除）・XSSデモ実装済み     |
| **v2**（次）  | UI強化（モバイル対応改善・視覚強調・アニメーション・警告表示など） |
| **v3**（将来） | 機能追加（個別削除、暗号化保存シミュレート、安全性レベル診断など）  |

---

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) をご覧ください。

---

## 🛠 このツールについて

本ツールは、「生成AIで作るセキュリティツール100」プロジェクトの一環として開発されました。 このプロジェクトでは、AIの支援を活用しながら、セキュリティに関連するさまざまなツールを100日間にわたり制作・公開していく取り組みを行っています。

プロジェクトの詳細や他のツールについては、以下のページをご覧ください。

🔗 [https://akademeia.info/?page_id=42163](https://akademeia.info/?page_id=42163)
