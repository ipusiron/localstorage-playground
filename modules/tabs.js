export class TabManager {
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