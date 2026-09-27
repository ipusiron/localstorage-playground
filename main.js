class LocalStoragePlayground {
  constructor() {
    this.tabManager = new TabManager();
    this.storageManager = new StorageManager();
    this.xssDemo = new XSSDemo();
    this.defenseDemo = new DefenseDemo();
    this.learnSection = new LearnSection();
  }

  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.tabManager.init();
      this.storageManager.init();
      this.xssDemo.init();
      this.defenseDemo.init();
      this.learnSection.init();
      
      this.addGlobalEventListeners();
      this.showInitialMessage();
      
      // グローバル参照を設定（削除ボタンから呼び出すため）
      window.storageManager = this.storageManager;
    });
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

const app = new LocalStoragePlayground();
app.init();
