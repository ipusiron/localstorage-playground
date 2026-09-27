class LearnSection {
  constructor() {
    this.learnContent = null;
  }

  init() {
    this.enhanceLearnSection();
  }

  // 文言は辞書から取り、DOMとして組み立てる。
  // 表の見出しと中身は配列で持ち、日英で同じ構造になるようにする。
  enhanceLearnSection() {
    const learnSection = document.getElementById("learn");
    const t = (key) => window.i18n.t(key);

    const additionalContent = document.createElement("div");
    additionalContent.className = "learn-enhanced";

    const practicesHeading = document.createElement("h3");
    practicesHeading.textContent = t("learn.practicesHeading");

    const practices = document.createElement("ul");
    practices.className = "best-practices";
    for (const name of ["noSecrets", "httpOnly", "encrypt", "cleanup"]) {
      const item = document.createElement("li");
      const label = document.createElement("strong");
      label.textContent = t(`learn.practice.${name}.label`);
      const body = document.createElement("span");
      body.textContent = t(`learn.practice.${name}.body`);
      item.append(label, document.createTextNode(" "), body);
      practices.appendChild(item);
    }

    const tableHeading = document.createElement("h3");
    tableHeading.textContent = t("learn.tableHeading");

    const table = document.createElement("table");
    table.className = "storage-comparison";

    const head = document.createElement("thead");
    const headRow = document.createElement("tr");
    for (const key of ["learn.table.aspect", "learn.table.local", "learn.table.session", "learn.table.cookie"]) {
      const cell = document.createElement("th");
      cell.scope = "col";
      cell.textContent = t(key);
      headRow.appendChild(cell);
    }
    head.appendChild(headRow);

    const body = document.createElement("tbody");
    for (const row of ["persistence", "capacity", "jsAccess", "xssResistance", "sentToServer"]) {
      const tr = document.createElement("tr");
      const aspect = document.createElement("th");
      aspect.scope = "row";
      aspect.textContent = t(`learn.row.${row}.aspect`);
      tr.appendChild(aspect);
      for (const column of ["local", "session", "cookie"]) {
        const cell = document.createElement("td");
        cell.textContent = t(`learn.row.${row}.${column}`);
        tr.appendChild(cell);
      }
      body.appendChild(tr);
    }

    table.append(head, body);
    additionalContent.append(practicesHeading, practices, tableHeading, table);
    learnSection.appendChild(additionalContent);
  }
}

window.LearnSection = LearnSection;
