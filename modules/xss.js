export class XSSDemo {
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