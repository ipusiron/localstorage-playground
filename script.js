document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  refreshStorageDisplay();
});

// タブ切り替え
function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;

      tabButtons.forEach(b => b.classList.remove("active"));
      tabContents.forEach(tc => tc.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById(target).classList.add("active");
    });
  });
}

// 保存ボタン：localStorage または sessionStorage に保存
function saveData() {
  const key = document.getElementById("keyInput").value;
  const value = document.getElementById("valueInput").value;
  const type = document.getElementById("storageType").value;

  if (!key) return alert("キーを入力してください");

  if (type === "local") {
    localStorage.setItem(key, value);
  } else {
    sessionStorage.setItem(key, value);
  }

  refreshStorageDisplay();
}

// ストレージ全削除
function clearStorage(type) {
  if (type === "local") {
    localStorage.clear();
  } else {
    sessionStorage.clear();
  }

  refreshStorageDisplay();
}

// 表示の更新
function refreshStorageDisplay() {
  updateList("localList", localStorage);
  updateList("sessionList", sessionStorage);
}

// キーと値の一覧表示
function updateList(elementId, storage) {
  const ul = document.getElementById(elementId);
  ul.innerHTML = "";

  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    const value = storage.getItem(key);
    const li = document.createElement("li");
    li.textContent = `${key} = ${value}`;
    ul.appendChild(li);
  }
}

// XSS実行ボタン
function runXSS() {
  const input = document.getElementById("xssInput").value;
  const output = document.getElementById("xssResult");

  try {
    const result = eval(input); // 安全な範囲内でのみ使うこと！
    output.textContent = `結果: ${result}`;
  } catch (e) {
    output.textContent = `エラー: ${e.message}`;
  }
}
