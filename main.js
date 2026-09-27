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
      // 先に静的な文言を差し替えてから、各モジュールが動的な部分を組み立てる
      window.i18n.apply();

      this.tabManager.init();
      this.storageManager.init();
      this.xssDemo.init();
      this.defenseDemo.init();
      this.learnSection.init();

      // ストレージ側の操作は StorageManager が委譲で受け取る。
      // ここで二重に登録すると同じ操作が2回走る。
      document.addEventListener("click", (event) => {
        const button = event.target.closest("[data-action]");
        if (button && button.dataset.action === "run-xss") this.xssDemo.runXSS();
      });

      this.setupLanguageSwitch();
      this.addGlobalEventListeners();
      this.showInitialMessage();

      // グローバル参照を設定（他モジュールから参照するため）
      window.storageManager = this.storageManager;
    });
  }

  setupLanguageSwitch() {
    const toggle = document.getElementById("languageToggle");
    if (toggle) {
      toggle.addEventListener("click", () => {
        window.i18n.setLanguage(window.i18n.language === "ja" ? "en" : "ja");
      });
    }

    // 言語を切り替えた直後は、開いていたタブと入力中の文字を戻す
    const carriedTab = window.i18n.restoreCarriedState();
    if (carriedTab) this.tabManager.switchTab(carriedTab);
  }

  addGlobalEventListeners() {
    window.addEventListener("storage", () => {
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

      console.log(window.i18n.t("welcome.title"));
      console.log(window.i18n.t("welcome.body"));
    }
  }
}

const app = new LocalStoragePlayground();
app.init();
