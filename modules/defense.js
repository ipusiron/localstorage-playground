export class DefenseDemo {
  constructor() {
    // 防御デモ専用のクラス
  }

  init() {
    this.addDefenseDemo();
    window.defenseDemo = this;
  }

  addDefenseDemo() {
    const defenseSection = document.getElementById('defense');
    
    const defenseContainer = document.createElement('div');
    defenseContainer.className = 'defense-demo';
    defenseContainer.innerHTML = `
      <div class="defense-examples">
        <div class="defense-card">
          <h4>📋 CSP (Content Security Policy)</h4>
          <p>適切なCSPヘッダーでXSS攻撃を防ぐ</p>
          <button class="defense-btn" onclick="defenseDemo.demonstrateCSP()">CSP効果を確認</button>
        </div>
        
        <div class="defense-card">
          <h4>🔐 HttpOnly Cookie</h4>
          <p>JavaScriptからアクセスできない安全なCookie</p>
          <button class="defense-btn" onclick="defenseDemo.demonstrateHttpOnly()">HttpOnly効果を確認</button>
        </div>
        
        <div class="defense-card">
          <h4>🧹 入力サニタイゼーション</h4>
          <p>危険な文字をエスケープして攻撃を無効化</p>
          <button class="defense-btn" onclick="defenseDemo.demonstrateSanitization()">サニタイゼーション効果を確認</button>
        </div>
      </div>
    `;
    
    defenseSection.appendChild(defenseContainer);
  }

  demonstrateCSP() {
    const demoDiv = document.createElement('div');
    demoDiv.className = 'defense-result';
    demoDiv.innerHTML = `
      <h4>📋 CSP防御デモ結果</h4>
      <div class="defense-comparison">
        <div class="before-defense">
          <h5>❌ CSPなし（脆弱）</h5>
          <code>// インラインスクリプトが実行される
&lt;script&gt;alert(localStorage.token)&lt;/script&gt;</code>
          <p class="vulnerability">→ 攻撃成功: トークンが盗まれる</p>
        </div>
        
        <div class="after-defense">
          <h5>✅ CSP適用後（安全）</h5>
          <code>Content-Security-Policy: script-src 'self'</code>
          <p class="protection">→ 攻撃失敗: インラインスクリプト実行がブロックされる</p>
        </div>
      </div>
      <div class="implementation-guide">
        <h5>実装方法:</h5>
        <code>&lt;meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self'"&gt;</code>
      </div>
    `;
    
    this.showDefenseResult(demoDiv);
  }

  demonstrateHttpOnly() {
    const demoDiv = document.createElement('div');
    demoDiv.className = 'defense-result';
    demoDiv.innerHTML = `
      <h4>🔐 HttpOnly Cookie 防御デモ結果</h4>
      <div class="defense-comparison">
        <div class="before-defense">
          <h5>❌ 通常のCookie（脆弱）</h5>
          <code>document.cookie = "token=abc123"
console.log(document.cookie) // "token=abc123"</code>
          <p class="vulnerability">→ 攻撃成功: JSからCookieにアクセス可能</p>
        </div>
        
        <div class="after-defense">
          <h5>✅ HttpOnly Cookie（安全）</h5>
          <code>Set-Cookie: token=abc123; HttpOnly; Secure
console.log(document.cookie) // ""（空文字）</code>
          <p class="protection">→ 攻撃失敗: JSからCookieにアクセス不可</p>
        </div>
      </div>
      <div class="implementation-guide">
        <h5>実装方法（サーバーサイド）:</h5>
        <code>res.setHeader('Set-Cookie', 
  'token=abc123; HttpOnly; Secure; SameSite=Strict');</code>
      </div>
    `;
    
    this.showDefenseResult(demoDiv);
  }

  demonstrateSanitization() {
    const maliciousInput = '<script>alert("XSS")</script><img src="x" onerror="alert(\'XSS\')">';
    const sanitizedInput = this.sanitizeInput(maliciousInput);

    const demoDiv = document.createElement('div');
    demoDiv.className = 'defense-result';
    demoDiv.innerHTML = `
      <h4>🧹 入力サニタイゼーション防御デモ結果</h4>
      <div class="defense-comparison">
        <div class="before-defense">
          <h5>❌ サニタイゼーションなし（脆弱）</h5>
          <code>innerHTML = "${this.escapeForDisplay(maliciousInput)}"</code>
          <div class="demo-output vulnerable">
            <strong>想定される危険な動作:</strong>
            <div class="output-sample-text">⚠️ 実環境では alert("XSS") が実行され、悪意あるスクリプトが動作します</div>
            <div class="code-preview">${this.escapeForDisplay(maliciousInput)}</div>
          </div>
          <p class="vulnerability">→ 攻撃成功: スクリプトが実行される（デモでは安全のため実行をスキップ）</p>
        </div>

        <div class="after-defense">
          <h5>✅ サニタイゼーション後（安全）</h5>
          <code>innerHTML = "${sanitizedInput}"</code>
          <div class="demo-output safe">
            <strong>実際の出力（安全）:</strong>
            <div class="output-sample">${sanitizedInput}</div>
          </div>
          <p class="protection">→ 攻撃失敗: 危険な文字がエスケープされる</p>
        </div>
      </div>
      <div class="implementation-guide">
        <h5>実装方法:</h5>
        <code>// DOMPurifyライブラリ使用例
const clean = DOMPurify.sanitize(userInput);
element.innerHTML = clean;</code>
      </div>
    `;

    this.showDefenseResult(demoDiv);
  }

  sanitizeInput(input) {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  escapeForDisplay(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  showDefenseResult(demoDiv) {
    const existingResult = document.querySelector('.defense-result');
    if (existingResult) {
      existingResult.remove();
    }
    
    const defenseDemo = document.querySelector('.defense-demo');
    defenseDemo.appendChild(demoDiv);
    
    demoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}