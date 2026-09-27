class TabManager {
  constructor() {
    this.tabButtons = document.querySelectorAll(".tab-button");
    this.tabContents = document.querySelectorAll(".tab-content");
  }

  init() {
    this.tabButtons.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        this.switchTab(btn.dataset.tab);
      });

      // WAI-ARIAのタブは左右のキーで移動し、Homeで先頭、Endで末尾へ行く。
      // Tabキーで内側へ入れるよう、選択中のタブだけがフォーカス順に入る（roving tabindex）。
      btn.addEventListener("keydown", (event) => {
        const last = this.tabButtons.length - 1;
        let next = null;

        if (event.key === "ArrowRight") next = index === last ? 0 : index + 1;
        if (event.key === "ArrowLeft") next = index === 0 ? last : index - 1;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = last;
        if (next === null) return;

        event.preventDefault();
        const target = this.tabButtons[next];
        this.switchTab(target.dataset.tab);
        target.focus();
      });
    });

    this.updateTabIndex();
  }

  updateTabIndex() {
    this.tabButtons.forEach((btn) => {
      btn.tabIndex = btn.classList.contains("active") ? 0 : -1;
    });
  }

  switchTab(targetTab) {
    this.tabButtons.forEach(btn => {
      if (btn.dataset.tab === targetTab) {
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
      } else {
        btn.classList.remove("active");
        btn.setAttribute("aria-selected", "false");
      }
    });

    this.tabContents.forEach(content => {
      if (content.id === targetTab) {
        content.classList.add("active");
      } else {
        content.classList.remove("active");
      }
    });

    this.updateTabIndex();
  }
}

window.TabManager = TabManager;
