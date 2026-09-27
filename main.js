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

      // 1つのモジュールが失敗しても、残りは組み立てる。
      // Storageを拒否するブラウザーでは、以前ここで最初の例外が出た時点で
      // 学習タブなどが作られないままになっていた。
      const steps = [
        ["tabs", () => this.tabManager.init()],
        ["storage", () => this.storageManager.init()],
        ["xss", () => this.xssDemo.init()],
        ["defense", () => this.defenseDemo.init()],
        ["learn", () => this.learnSection.init()]
      ];
      for (const [name, step] of steps) {
        try {
          step();
        } catch (e) {
          console.warn(`[init] failed: ${name}`, e);
        }
      }

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
    // Storageを拒否する環境ではここで例外になる。あいさつを出せないだけなので、握って進む。
    try {
      if (localStorage.getItem("has_visited")) return;
      localStorage.setItem("has_visited", "true");
      localStorage.setItem("first_visit", new Date().toISOString());
    } catch (e) {
      return;
    }

    console.log(window.i18n.t("welcome.title"));
    console.log(window.i18n.t("welcome.body"));
  }
}

const app = new LocalStoragePlayground();
app.init();
