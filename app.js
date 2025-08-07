// タブ管理
class TabManager {
  constructor() {
    this.tabButtons = document.querySelectorAll(".tab-button");
    this.tabContents = document.querySelectorAll(".tab-content");
  }

  init() {
    this.tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.switchTab(btn.dataset.tab);
      });
    });
  }

  switchTab(targetTab) {
    this.tabButtons.forEach(btn => {
      if (btn.dataset.tab === targetTab) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    this.tabContents.forEach(content => {
      if (content.id === targetTab) {
        content.classList.add("active");
      } else {
        content.classList.remove("active");
      }
    });
  }
}

// ストレージ管理
class StorageManager {
  constructor() {
    this.keyInput = document.getElementById("keyInput");
    this.valueInput = document.getElementById("valueInput");
    this.storageType = document.getElementById("storageType");
    this.localList = document.getElementById("localList");
    this.sessionList = document.getElementById("sessionList");
    this.interactiveExamples = [
      {
        title: "永続性テスト",
        description: "localStorage vs sessionStorageの違いを確認",
        action: () => this.demonstratePersistence()
      },
      {
        title: "同一オリジンポリシー",
        description: "ドメイン間のストレージアクセス制限",
        action: () => this.demonstrateOriginPolicy()
      },
      {
        title: "容量制限チェック",
        description: "Web Storageの容量制限を確認",
        action: () => this.demonstrateQuota()
      }
    ];
  }

  init() {
    this.refreshDisplay();
    this.addInteractiveExamples();
    
    window.saveData = () => this.saveData();
    window.clearStorage = (type) => this.clearStorage(type);
  }

  saveData() {
    const key = this.keyInput.value;
    const value = this.valueInput.value;
    const type = this.storageType.value;

    if (!key) {
      alert("キーを入力してください");
      return;
    }

    if (type === "local") {
      localStorage.setItem(key, value);
    } else {
      sessionStorage.setItem(key, value);
    }

    this.keyInput.value = "";
    this.valueInput.value = "";
    this.refreshDisplay();
  }

  clearStorage(type) {
    const confirmMessage = type === "local" 
      ? "localStorageを全削除しますか？" 
      : "sessionStorageを全削除しますか？";
    
    if (!confirm(confirmMessage)) {
      return;
    }

    if (type === "local") {
      localStorage.clear();
    } else {
      sessionStorage.clear();
    }

    this.refreshDisplay();
  }

  refreshDisplay() {
    this.updateList(this.localList, localStorage);
    this.updateList(this.sessionList, sessionStorage);
  }

  updateList(element, storage) {
    element.innerHTML = "";

    if (storage.length === 0) {
      const emptyMessage = document.createElement("li");
      emptyMessage.textContent = "（データなし）";
      emptyMessage.style.color = "#999";
      element.appendChild(emptyMessage);
      return;
    }

    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      const value = storage.getItem(key);
      
      const li = document.createElement("li");
      li.innerHTML = `
        <span class="storage-key">${this.escapeHtml(key)}</span>
        <span class="storage-separator">=</span>
        <span class="storage-value">${this.escapeHtml(value)}</span>
      `;
      
      element.appendChild(li);
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  addInteractiveExamples() {
    const storageSection = document.getElementById("storage");
    const storageDisplay = storageSection.querySelector(".storage-display");
    
    const examplesContainer = document.createElement("div");
    examplesContainer.className = "interactive-examples";
    examplesContainer.innerHTML = "<h3>🧪 インタラクティブテスト</h3>";
    
    const exampleGrid = document.createElement("div");
    exampleGrid.className = "example-grid";
    
    this.interactiveExamples.forEach(example => {
      const exampleDiv = document.createElement("div");
      exampleDiv.className = "example-item";
      
      const button = document.createElement("button");
      button.textContent = example.title;
      button.className = "demo-button";
      button.onclick = example.action;
      
      const description = document.createElement("p");
      description.textContent = example.description;
      description.className = "example-description";
      
      exampleDiv.appendChild(button);
      exampleDiv.appendChild(description);
      exampleGrid.appendChild(exampleDiv);
    });
    
    examplesContainer.appendChild(exampleGrid);
    storageDisplay.after(examplesContainer);
  }

  demonstratePersistence() {
    const timestamp = new Date().toISOString();
    localStorage.setItem("persistence_test", `保存時刻: ${timestamp}`);
    sessionStorage.setItem("persistence_test", `保存時刻: ${timestamp}`);
    
    this.refreshDisplay();
    
    alert(
      "両方のストレージにデータを保存しました。\n" +
      "ブラウザを閉じて再度開くと、localStorageのみデータが残っています。\n" +
      "上の表示で確認してください。"
    );
  }

  demonstrateOriginPolicy() {
    alert(
      "同一オリジンポリシーにより、\n" +
      "- https://example.com\n" +
      "- https://sub.example.com\n" +
      "- http://example.com\n" +
      "これらは全て異なるストレージ領域を持ちます。\n\n" +
      "現在のオリジン: " + window.location.origin
    );
  }

  demonstrateQuota() {
    try {
      const testKey = "quota_test";
      let testData = "a";
      let size = 1;
      
      while (size < 10 * 1024 * 1024) {
        testData += testData;
        size = testData.length;
      }
      
      try {
        localStorage.setItem(testKey, testData);
        localStorage.removeItem(testKey);
        alert(`約${(size / 1024 / 1024).toFixed(1)}MBのデータを保存できました。`);
      } catch (e) {
        alert(`容量制限に達しました。\n最大約${(size / 2 / 1024 / 1024).toFixed(1)}MBまで保存可能です。`);
      }
    } catch (e) {
      alert("容量テスト中にエラーが発生しました: " + e.message);
    }
  }
}

// XSSデモ
class XSSDemo {
  constructor() {
    this.xssInput = document.getElementById("xssInput");
    this.xssResult = document.getElementById("xssResult");
    this.exampleScripts = [
      'localStorage.getItem("token")',
      'Object.keys(localStorage).map(k => `${k}: ${localStorage.getItem(k)}`).join("\\n")',
      'JSON.stringify(localStorage)',
      'sessionStorage.getItem("user_data")'
    ];
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
    exampleContainer.innerHTML = "<p><strong>例:</strong></p>";
    
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "example-buttons";
    
    this.exampleScripts.forEach((script, index) => {
      const button = document.createElement("button");
      button.textContent = `例${index + 1}`;
      button.className = "example-btn";
      button.onclick = () => {
        this.xssInput.value = script;
      };
      buttonContainer.appendChild(button);
    });
    
    exampleContainer.appendChild(buttonContainer);
    this.xssInput.parentNode.insertBefore(exampleContainer, this.xssInput);
  }

  runXSS() {
    const input = this.xssInput.value.trim();
    
    if (!input) {
      this.showResult("スクリプトを入力してください", "info");
      return;
    }

    this.clearResult();
    
    try {
      console.log("XSSデモ実行:", input);
      
      const originalAlert = window.alert;
      let alertContent = null;
      
      window.alert = (msg) => {
        alertContent = msg;
      };
      
      const result = eval(input);
      
      window.alert = originalAlert;
      
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
  }
}

// 学習セクション
class LearnSection {
  constructor() {
    this.learnContent = null;
  }

  init() {
    this.enhanceLearnSection();
  }

  enhanceLearnSection() {
    const learnSection = document.getElementById("learn");
    
    const additionalContent = document.createElement("div");
    additionalContent.className = "learn-enhanced";
    additionalContent.innerHTML = `
      <h3>🔒 セキュリティベストプラクティス</h3>
      <ul class="best-practices">
        <li>
          <strong>機密情報を保存しない:</strong>
          <span>トークン、パスワード、個人情報はlocalStorageに保存すべきではありません</span>
        </li>
        <li>
          <strong>HttpOnly Cookieの使用:</strong>
          <span>認証トークンはHttpOnly属性付きのCookieで管理しましょう</span>
        </li>
        <li>
          <strong>データの暗号化:</strong>
          <span>やむを得ず保存する場合は、適切に暗号化してください</span>
        </li>
        <li>
          <strong>定期的なクリーンアップ:</strong>
          <span>不要になったデータは速やかに削除しましょう</span>
        </li>
      </ul>

      <h3>📊 ストレージ比較表</h3>
      <table class="storage-comparison">
        <thead>
          <tr>
            <th>特性</th>
            <th>localStorage</th>
            <th>sessionStorage</th>
            <th>Cookie (HttpOnly)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>永続性</td>
            <td>永続的</td>
            <td>タブを閉じるまで</td>
            <td>期限設定可能</td>
          </tr>
          <tr>
            <td>容量</td>
            <td>5-10MB</td>
            <td>5-10MB</td>
            <td>4KB</td>
          </tr>
          <tr>
            <td>JSアクセス</td>
            <td>✅ 可能</td>
            <td>✅ 可能</td>
            <td>❌ 不可</td>
          </tr>
          <tr>
            <td>XSS耐性</td>
            <td>❌ 脆弱</td>
            <td>❌ 脆弱</td>
            <td>✅ 保護</td>
          </tr>
          <tr>
            <td>サーバー送信</td>
            <td>❌ なし</td>
            <td>❌ なし</td>
            <td>✅ 自動</td>
          </tr>
        </tbody>
      </table>
    `;
    
    learnSection.appendChild(additionalContent);
  }
}

// メインアプリケーション
class LocalStoragePlayground {
  constructor() {
    this.tabManager = new TabManager();
    this.storageManager = new StorageManager();
    this.xssDemo = new XSSDemo();
    this.learnSection = new LearnSection();
  }

  init() {
    this.tabManager.init();
    this.storageManager.init();
    this.xssDemo.init();
    this.learnSection.init();
    
    this.addGlobalEventListeners();
    this.showInitialMessage();
  }

  addGlobalEventListeners() {
    window.addEventListener("storage", (e) => {
      console.log("Storage event detected:", e);
      this.storageManager.refreshDisplay();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const activeTab = document.querySelector(".tab-content.active");
        if (activeTab && activeTab.id === "xss") {
          this.xssDemo.clearResult();
        }
      }
    });
  }

  showInitialMessage() {
    const hasVisited = localStorage.getItem("has_visited");
    
    if (!hasVisited) {
      localStorage.setItem("has_visited", "true");
      localStorage.setItem("first_visit", new Date().toISOString());
      
      console.log("🎯 LocalStorage Playgroundへようこそ！");
      console.log("このツールでWeb Storageの動作とセキュリティリスクを学びましょう。");
    }
  }
}

// アプリケーション起動
document.addEventListener("DOMContentLoaded", () => {
  const app = new LocalStoragePlayground();
  app.init();
});