class StorageManager {
  constructor() {
    this.keyInput = document.getElementById("keyInput");
    this.valueInput = document.getElementById("valueInput");
    this.storageType = document.getElementById("storageType");
    this.localList = document.getElementById("localList");
    this.sessionList = document.getElementById("sessionList");
    this.interactiveExamples = [
      {
        title: this.t("test.persistence.title"),
        description: this.t("test.persistence.description"),
        action: () => this.demonstratePersistence()
      },
      {
        title: this.t("test.origin.title"),
        description: this.t("test.origin.description"),
        action: () => this.demonstrateOriginPolicy()
      },
      {
        title: this.t("test.quota.title"),
        description: this.t("test.quota.description"),
        action: () => this.demonstrateQuota()
      }
    ];
    
    // プリセットデータ定義
    this.presets = {
      userAuth: {
        name: this.t("preset.auth.name"),
        description: this.t("preset.auth.description"),
        data: {
          jwt_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
          user_id: "user_12345",
          session_id: "sess_abc123xyz789",
          refresh_token: "refresh_token_sample_1234567890",
          auth_timestamp: new Date().toISOString()
        }
      },
      userData: {
        name: this.t("preset.profile.name"),
        description: this.t("preset.profile.description"),
        data: {
          user_profile: JSON.stringify({
            name: this.t("sample.personName"),
            email: "yamada@example.com",
            age: 30,
            preferences: {
              theme: "dark",
              language: "ja",
              notifications: true
            }
          }),
          last_login: new Date().toISOString(),
          user_preferences: JSON.stringify({ fontSize: "medium", autoSave: true }),
          favorite_items: JSON.stringify(["item1", "item2", "item3"])
        }
      },
      ecommerce: {
        name: this.t("preset.shop.name"),
        description: this.t("preset.shop.description"),
        data: {
          shopping_cart: JSON.stringify([
            { id: 1, name: this.t("sample.laptop"), price: 98000, quantity: 1 },
            { id: 2, name: this.t("sample.mouse"), price: 2980, quantity: 2 }
          ]),
          wishlist: JSON.stringify([3, 5, 8, 12]),
          recently_viewed: JSON.stringify(["product_1", "product_2", "product_3"]),
          checkout_form: JSON.stringify({ 
            shipping: "express", 
            payment: "credit_card" 
          }),
          coupon_code: "SAVE20"
        }
      },
      analytics: {
        name: this.t("preset.analytics.name"),
        description: this.t("preset.analytics.description"),
        data: {
          ga_client_id: "GA1.2.1234567890.1234567890",
          utm_source: "google",
          utm_medium: "cpc",
          utm_campaign: "summer_sale",
          page_views: "42",
          session_duration: "300",
          conversion_id: "conv_abc123"
        }
      },
      dangerous: {
        name: this.t("preset.risky.name"),
        description: this.t("preset.risky.description"),
        data: {
          api_key: "sk-1234567890abcdefghijklmnopqrstuvwxyz",
          database_password: "admin123",
          credit_card_token: "tok_visa_4242424242424242",
          private_key: "[DUMMY_KEY] This is not a real key. Included for demo purposes only.",
          social_security: "123-45-6789",
          admin_token: "admin_super_secret_token_do_not_expose"
        }
      },
      webapp: {
        name: this.t("preset.appstate.name"),
        description: this.t("preset.appstate.description"),
        data: {
          app_state: JSON.stringify({
            currentPage: "dashboard",
            sidebarOpen: true,
            activeTab: "overview"
          }),
          form_draft: JSON.stringify({
            title: this.t("sample.draftTitle"),
            content: this.t("sample.draftBody"),
            savedAt: new Date().toISOString()
          }),
          ui_settings: JSON.stringify({
            layout: "grid",
            density: "comfortable",
            showHints: true
          }),
          feature_flags: JSON.stringify({
            newUI: true,
            betaFeatures: false,
            debugMode: false
          })
        }
      },
      xssVectors: {
        name: this.t("preset.xss.name"),
        description: this.t("preset.xss.description"),
        data: {
          xss_basic: "<script>alert('XSS')</script>",
          xss_img: "<img src=x onerror='alert(\"XSS\")'>",
          xss_encoded: "%3Cscript%3Ealert('XSS')%3C/script%3E",
          xss_event: "javascript:alert('XSS')",
          xss_data_uri: "data:text/html,<script>alert('XSS')</script>",
          safe_html: "<b>This is safe HTML</b>"
        }
      },
      performance: {
        name: this.t("preset.perf.name"),
        description: this.t("preset.perf.description"),
        data: {
          large_array: JSON.stringify(new Array(100).fill("data")),
          large_object: JSON.stringify(
            Object.fromEntries(
              Array.from({ length: 50 }, (_, i) => [`key_${i}`, `value_${i}`])
            )
          ),
          base64_image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
          long_string: "a".repeat(1000)
        }
      }
    };
  }

  // Storageが使える状態かを、実際に読み書きして確かめる。
  // プライベートウィンドウや「サイトデータをブロック」の設定では、
  // localStorage へ触れるだけで SecurityError になることがある。
  probeStorage() {
    const probe = (storage) => {
      const result = { readable: false, writable: false };
      try {
        void storage.length;
        result.readable = true;
      } catch (e) {
        return result;
      }
      const key = "__playground_probe__";
      try {
        storage.setItem(key, "1");
        storage.removeItem(key);
        result.writable = true;
      } catch (e) {
        // 読めるが書けない（容量いっぱい、書き込み拒否）
      }
      return result;
    };

    this.storageState = {
      local: probe(localStorage),
      session: probe(sessionStorage)
    };
    return this.storageState;
  }

  get storageUsable() {
    const state = this.storageState || this.probeStorage();
    return state.local.readable || state.session.readable;
  }

  // Storageへ触る処理をまとめて包む。例外は画面の言葉にして返す。
  safely(action, fallback = null) {
    try {
      return action();
    } catch (e) {
      this.reportStorageError(e);
      return fallback;
    }
  }

  reportStorageError(error) {
    const key = error && error.name === "QuotaExceededError"
      ? "storageError.quota"
      : "storageError.blocked";
    this.displayNotification(this.t(key));
    console.warn("[storage]", error);
  }

  // 使えないことを画面の先頭で伝える
  showStorageUnavailableNotice() {
    const section = document.getElementById("storage");
    if (!section || section.querySelector(".storage-unavailable")) return;

    const notice = this.createElement("div", { class: "storage-unavailable", role: "status" }, [
      this.createElement("strong", { text: this.t("storageError.noticeTitle") }),
      this.createElement("p", { text: this.t("storageError.noticeBody") })
    ]);
    const heading = section.querySelector("h2");
    if (heading) heading.after(notice);
    else section.prepend(notice);
  }

  init() {
    this.probeStorage();

    if (!this.storageUsable) {
      // 一覧も統計も作れないので、理由を出して静かに止める。
      // ほかのタブ（XSSデモ・防御デモ・学習）は動かしたいので、例外は投げない。
      this.showStorageUnavailableNotice();
      this.setupDelegatedActions();
      window.storageManager = this;
      return;
    }

    this.refreshDisplay();
    this.createCollapsibleStorageOperations();
    this.addSearchFunctionality();
    this.addCapacityStatistics();
    this.addExportFunctionality();
    this.addPresetSelector();
    this.addInteractiveExamples();
    this.setupRealtimeUpdates();
    this.setupDelegatedActions();

    if (!this.storageState.local.writable) {
      // 読めるが書けない場合も、保存を押す前に伝える
      this.displayNotification(this.t("storageError.readOnly"));
    }

    // グローバル参照を追加（他モジュールから参照するため）
    window.storageManager = this;
  }

  setupDelegatedActions() {
    document.addEventListener("click", (event) => {
      const target = event.target.closest("[data-action]");
      if (!target) return;

      const storageType = target.dataset.storage;

      switch (target.dataset.action) {
        case "save-data":
          this.saveData();
          break;
        case "clear-storage":
          this.clearStorage(storageType);
          break;
        case "toggle-collapsible":
          this.toggleCollapsibleSection(target);
          break;
        case "close-delete-confirm":
          this.closeDeleteConfirmDialog();
          break;
        case "execute-delete":
          if (this.pendingDelete) {
            this.executeDeleteFromModal(this.pendingDelete.key, this.pendingDelete.storageType);
          }
          break;
        case "export-data":
          this.exportData(storageType);
          break;
        case "close-export":
          this.closeExportModal();
          break;
        case "download-export":
          this.downloadExport(storageType);
          break;
        case "close-quota":
          this.closeQuotaResultDialog();
          break;
        default:
          break;
      }
    });
  }

  createCollapsibleStorageOperations() {
    const storageSection = document.getElementById("storage");
    const inputArea = storageSection.querySelector(".input-area");
    const actionsDiv = storageSection.querySelector(".actions");

    // 折りたたみ可能なセクションを作成する。
    // 既存の要素はouterHTMLで複製せず、ノードのまま移動する。
    // 複製すると、コンストラクターが保持する入力欄の参照がDOMから切り離され、保存が効かなくなる。
    const collapsibleSection = document.createElement("div");
    collapsibleSection.className = "collapsible-section collapsed";

    const header = document.createElement("button");
    header.type = "button";
    header.className = "collapsible-header";
    header.setAttribute("aria-expanded", "false");

    const title = document.createElement("span");
    title.className = "collapsible-title";
    title.textContent = this.t("storage.operationsTitle");

    const toggle = document.createElement("span");
    toggle.className = "collapsible-toggle";
    toggle.textContent = "▼";
    toggle.setAttribute("aria-hidden", "true");

    header.append(title, toggle);
    header.addEventListener("click", () => this.toggleCollapsibleSection(header));

    const content = document.createElement("div");
    content.className = "collapsible-content";
    content.append(inputArea, actionsDiv);

    collapsibleSection.append(header, content);

    // 新しいセクションを最上部に挿入
    const h2 = storageSection.querySelector("h2");
    h2.after(collapsibleSection);
  }

  toggleCollapsibleSection(header) {
    const section = header.parentElement;
    const toggle = header.querySelector(".collapsible-toggle");
    const content = section.querySelector(".collapsible-content");
    
    if (section.classList.contains("collapsed")) {
      // 展開
      section.classList.remove("collapsed");
      section.classList.add("expanded");
      toggle.textContent = "▲";
      header.setAttribute("aria-expanded", "true");
      
      // 動的コンテンツに対応した高さ計算
      content.style.maxHeight = "none";
      const height = content.scrollHeight;
      content.style.maxHeight = "0";
      
      // アニメーションのためのタイムアウト
      setTimeout(() => {
        content.style.maxHeight = height + "px";
      }, 10);
      
      // アニメーション完了後に"none"に設定（動的コンテンツの追加に対応）
      setTimeout(() => {
        if (section.classList.contains("expanded")) {
          content.style.maxHeight = "none";
        }
      }, 350);
    } else {
      // 折りたたみ
      section.classList.remove("expanded");
      section.classList.add("collapsed");
      toggle.textContent = "▼";
      header.setAttribute("aria-expanded", "false");
      
      // 現在の高さを取得してアニメーション用に設定
      content.style.maxHeight = content.scrollHeight + "px";
      setTimeout(() => {
        content.style.maxHeight = "0";
      }, 10);
    }
  }

  addSearchFunctionality() {
    const storageSection = document.getElementById("storage");
    const collapsibleContent = storageSection.querySelector(".collapsible-content");
    
    // 検索コンテナを作成
    const searchContainer = document.createElement("div");
    searchContainer.className = "search-container";
    searchContainer.innerHTML = `
      <div class="search-box">
        <input type="text" id="storageSearch" placeholder="${this.t("search.placeholder")}">
        <button id="clearSearch" type="button" title="${this.t("search.clearTitle")}" aria-label="${this.t("search.clearTitle")}">✕</button>
      </div>
      <div class="search-filters">
        <label><input type="checkbox" id="filterLocal" checked> localStorage</label>
        <label><input type="checkbox" id="filterSession" checked> sessionStorage</label>
        <select id="typeFilter">
          <option value="all">${this.t("filter.all")}</option>
          <option value="string">${this.t("filter.string")}</option>
          <option value="json">JSON</option>
          <option value="number">${this.t("filter.number")}</option>
          <option value="boolean">${this.t("filter.boolean")}</option>
          <option value="url">URL</option>
          <option value="email">${this.t("filter.email")}</option>
        </select>
      </div>
    `;
    
    // 折りたたみコンテンツ内に追加
    if (collapsibleContent) {
      collapsibleContent.appendChild(searchContainer);
    } else {
      // フォールバック: 通常の場所に追加
      const actionsDiv = storageSection.querySelector(".actions");
      if (actionsDiv) {
        actionsDiv.before(searchContainer);
      } else {
        storageSection.appendChild(searchContainer);
      }
    }
    
    // 検索イベントリスナー
    const searchInput = document.getElementById("storageSearch");
    const clearSearchBtn = document.getElementById("clearSearch");
    const filterLocal = document.getElementById("filterLocal");
    const filterSession = document.getElementById("filterSession");
    const typeFilter = document.getElementById("typeFilter");
    
    // 検索実行
    const performSearch = () => {
      this.filterStorageDisplay();
    };
    
    searchInput.addEventListener("input", performSearch);
    clearSearchBtn.addEventListener("click", () => {
      searchInput.value = "";
      performSearch();
    });
    filterLocal.addEventListener("change", performSearch);
    filterSession.addEventListener("change", performSearch);
    typeFilter.addEventListener("change", performSearch);
  }

  addPresetSelector() {
    console.log("AddPresetSelector called");
    const storageSection = document.getElementById("storage");
    
    // 検索エリアの後、ストレージ表示の前に配置
    const searchContainer = storageSection.querySelector(".search-container");
    const searchStats = storageSection.querySelector(".search-stats");
    
    let insertAfterElement = searchStats || searchContainer;
    
    // プリセットカテゴリの定義
    const presetCategories = {
      common: {
        name: this.t("presetGroup.common.name"),
        description: this.t("presetGroup.common.description"),
        presets: ['userAuth', 'userData', 'webapp']
      },
      ecommerce: {
        name: this.t("presetGroup.commerce.name"),
        description: this.t("presetGroup.commerce.description"),
        presets: ['ecommerce', 'analytics']
      },
      security: {
        name: this.t("presetGroup.security.name"),
        description: this.t("presetGroup.security.description"),
        presets: ['dangerous', 'xssVectors']
      },
      performance: {
        name: this.t("presetGroup.performance.name"),
        description: this.t("presetGroup.performance.description"),
        presets: ['performance']
      }
    };
    
    // プリセットセレクターのコンテナを作成
    const presetContainer = document.createElement("div");
    presetContainer.className = "preset-container";
    presetContainer.innerHTML = `
      <h3>${this.t("preset.heading")}</h3>
      <div class="preset-categories">
        ${Object.entries(presetCategories).map(([categoryKey, category], index) => `
          <button class="preset-category-btn ${index === 0 ? 'active' : ''}" data-category="${categoryKey}">
            ${category.name}
          </button>
        `).join('')}
      </div>
      <div class="preset-category-description"></div>
      <div class="preset-cards-container">
        ${Object.entries(presetCategories).map(([categoryKey, category], index) => `
          <div class="preset-category-content ${index === 0 ? 'active' : ''}" data-category="${categoryKey}">
            <div class="preset-grid">
              ${category.presets.map(presetKey => {
                const preset = this.presets[presetKey];
                const isWarning = presetKey === 'dangerous' || presetKey === 'xssVectors';
                return `
                  <div class="preset-card ${isWarning ? 'preset-warning' : ''}">
                    <div class="preset-header">
                      <div class="preset-name">${preset.name}</div>
                      <div class="preset-description">${preset.description}</div>
                    </div>
                    <div class="preset-actions">
                      <button class="preset-btn preset-btn-local" data-preset="${presetKey}" data-storage="local">
                        → localStorage
                      </button>
                      <button class="preset-btn preset-btn-session" data-preset="${presetKey}" data-storage="session">
                        → sessionStorage
                      </button>
                    </div>
                    <div class="preset-preview">
                      <small>${this.t("preset.includedKeys", { keys: Object.keys(preset.data).join(", ") })}</small>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
    
    // 検索エリアの後に挿入（ストレージ表示の前）
    if (insertAfterElement) {
      insertAfterElement.after(presetContainer);
    } else {
      // フォールバック: 検索コンテナの後に追加
      const fallbackElement = storageSection.querySelector(".search-container") || 
                              storageSection.querySelector(".actions");
      if (fallbackElement) {
        fallbackElement.after(presetContainer);
      } else {
        storageSection.appendChild(presetContainer);
      }
    }
    
    // カテゴリ切り替えのイベントリスナー
    const categoryButtons = presetContainer.querySelectorAll(".preset-category-btn");
    const categoryContents = presetContainer.querySelectorAll(".preset-category-content");
    const categoryDescription = presetContainer.querySelector(".preset-category-description");
    
    // 初期表示の説明を設定
    categoryDescription.textContent = presetCategories.common.description;
    
    categoryButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const category = btn.dataset.category;
        
        // ボタンのアクティブ状態を切り替え
        categoryButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        // コンテンツの表示を切り替え
        categoryContents.forEach(content => {
          if (content.dataset.category === category) {
            content.classList.add("active");
          } else {
            content.classList.remove("active");
          }
        });
        
        // 説明を更新
        categoryDescription.textContent = presetCategories[category].description;
      });
    });
    
    // プリセットボタンのイベントリスナーを追加
    presetContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("preset-btn")) {
        const presetKey = e.target.dataset.preset;
        const storageType = e.target.dataset.storage;
        this.loadPreset(presetKey, storageType);
      }
    });
  }

  loadPreset(presetKey, storageType) {
    const preset = this.presets[presetKey];
    if (!preset) return;
    
    // 確認ダイアログ（危険なデータの場合は特別な警告）
    const isDangerous = presetKey === 'dangerous' || presetKey === 'xssVectors';
    const confirmMessage = isDangerous 
      ? this.t("preset.confirmRisky", { storage: storageType, name: preset.name })
      : this.t("preset.confirm", { storage: storageType, name: preset.name });
    
    if (!confirm(confirmMessage)) return;
    
    const storage = storageType === 'local' ? localStorage : sessionStorage;
    let loadedCount = 0;
    
    // データをストレージに追加
    Object.entries(preset.data).forEach(([key, value]) => {
      try {
        // 動的な値の処理（タイムスタンプなど）
        if (typeof value === 'function') {
          storage.setItem(key, value());
        } else {
          storage.setItem(key, value);
        }
        loadedCount++;
      } catch (e) {
        console.error(`Failed to set ${key}:`, e);
      }
    });
    
    // 完了通知
    this.displayNotification(
      this.t("preset.loaded", { name: preset.name, storage: storageType, count: loadedCount })
    );
    
    // 表示を更新
    this.refreshDisplay();
  }

  setupRealtimeUpdates() {
    // ストレージイベントリスナー（他のタブ/ウィンドウからの変更を検知）
    window.addEventListener('storage', (e) => {
      console.log('Storage event detected:', e);
      this.refreshDisplay();
      this.showUpdateNotification(e);
    });

    // 定期的な更新チェック（同一タブ内の変更も検知）
    this.startPolling();
    
    // Proxyを使ってlocalStorage/sessionStorageの変更を監視
    this.wrapStorageAPIs();
  }

  startPolling() {
    // 現在の状態を保存
    this.lastLocalState = this.getStorageState(localStorage);
    this.lastSessionState = this.getStorageState(sessionStorage);
    
    // 500msごとに変更をチェック
    this.pollingInterval = setInterval(() => {
      const currentLocalState = this.getStorageState(localStorage);
      const currentSessionState = this.getStorageState(sessionStorage);
      
      if (currentLocalState !== this.lastLocalState || currentSessionState !== this.lastSessionState) {
        this.refreshDisplay();
        this.lastLocalState = currentLocalState;
        this.lastSessionState = currentSessionState;
      }
    }, 500);
  }

  getStorageState(storage) {
    const state = {};
    // 監視の最中にStorageが使えなくなっても、ポーリングごと止めない
    try {
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        state[key] = storage.getItem(key);
      }
    } catch (e) {
      return "";
    }
    return JSON.stringify(state);
  }

  wrapStorageAPIs() {
    // Storageのインスタンスへ代入したり defineProperty したりしてはいけない。
    // Storageは名前付きプロパティを持つオブジェクトなので、
    // localStorage.setItem = fn は列挙可能な自前プロパティを増やし、
    // Object.defineProperty(localStorage, "setItem", ...) にいたっては
    // "setItem" というキーで関数の文字列を実際に保存してしまう（実測で確認）。
    // どちらも Object.keys(localStorage) を汚し、XSS学習デモの列挙結果に
    // 実在しないキーが混ざる。そこでプロトタイプ側を包む。
    const manager = this;
    const originals = {};

    for (const method of ["setItem", "removeItem", "clear"]) {
      const original = Storage.prototype[method];
      originals[method] = original;

      Storage.prototype[method] = function (...args) {
        const result = original.apply(this, args);
        if (this === localStorage || this === sessionStorage) {
          manager.refreshDisplay();
          manager.showUpdateNotification({
            key: method === "clear" ? null : args[0],
            newValue: method === "setItem" ? args[1] : null,
            storageArea: this
          });
        }
        return result;
      };
    }

    // 復元できるように控えておく（テストと学習デモで使う）
    this.originalStorageMethods = originals;
  }

  showUpdateNotification(event) {
    // 更新通知を表示
    const storageType = event.storageArea === localStorage ? 'localStorage' : 'sessionStorage';
    const message = event.key 
      ? this.t("notify.updated", { storage: storageType, key: event.key })
      : this.t("notify.cleared", { storage: storageType });
    
    this.displayNotification(message);
  }

  displayNotification(message) {
    // 既存の通知があれば削除
    const existingNotification = document.querySelector('.storage-notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
    // 新しい通知を作成
    const notification = document.createElement('div');
    notification.className = 'storage-notification';
    // 画面の変化を読み上げへ伝える
    notification.setAttribute('role', 'status');
    notification.setAttribute('aria-live', 'polite');
    notification.textContent = message;
    
    // ストレージセクションの最上部に追加
    const storageSection = document.getElementById('storage');
    storageSection.insertBefore(notification, storageSection.firstChild.nextSibling);
    
    // 3秒後に自動的に削除
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  saveData() {
    const key = this.keyInput.value;
    const value = this.valueInput.value;
    const type = this.storageType.value;

    if (!key) {
      alert(this.t("alert.needKey"));
      return;
    }

    // 容量いっぱい、書き込み拒否のときは理由を出して、入力は消さない
    const saved = this.safely(() => {
      (type === "local" ? localStorage : sessionStorage).setItem(key, value);
      return true;
    }, false);
    if (!saved) return;

    this.keyInput.value = "";
    this.valueInput.value = "";
    this.refreshDisplay();
  }

  clearStorage(type) {
    const confirmMessage = type === "local" 
      ? this.t("confirm.clearLocal") 
      : this.t("confirm.clearSession");
    
    if (!confirm(confirmMessage)) {
      return;
    }

    this.safely(() => {
      (type === "local" ? localStorage : sessionStorage).clear();
    });

    this.refreshDisplay();
  }

  refreshDisplay() {
    // Storageが読めない状態でも、画面の描画ごと落とさない
    this.safely(() => {
      this.updateList(this.localList, localStorage);
      this.updateList(this.sessionList, sessionStorage);
    });
    
    // 容量統計も更新
    if (document.querySelector('.capacity-stats-container')) {
      this.updateCapacityStats();
    }
  }

  updateList(element, storage) {
    element.replaceChildren();

    if (storage.length === 0) {
      const emptyMessage = document.createElement("li");
      emptyMessage.textContent = this.t("list.empty");
      emptyMessage.className = "storage-empty-message";
      element.appendChild(emptyMessage);
      return;
    }

    const storageType = storage === localStorage ? 'local' : 'session';

    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      const value = storage.getItem(key);
      const dataType = this.detectDataType(value);
      
      const li = document.createElement("li");
      li.className = "storage-item-simple";
      li.dataset.key = key;
      li.dataset.value = value.toLowerCase();
      li.dataset.type = dataType.type;
      li.dataset.storage = storageType;
      
      // シンプルな1行表示：key = value（ダブルクリックで編集）
      const keyElement = document.createElement("span");
      keyElement.className = "storage-key";
      keyElement.textContent = key;
      const separator = document.createElement("span");
      separator.className = "storage-separator";
      separator.textContent = " = ";
      const valueElement = document.createElement("span");
      valueElement.className = "storage-value";
      valueElement.title = value;
      valueElement.textContent = this.formatValueSimple(value);
      li.append(keyElement, separator, valueElement);
      
      // ダブルクリックで編集機能を追加
      li.addEventListener('dblclick', (e) => {
        this.editItem(key, storageType);
      });
      
      // ホバー時の視覚的フィードバック
      li.classList.add('storage-item-editable');
      li.title = this.t("list.editHint");
      
      element.appendChild(li);
    }
  }

  detectDataType(value) {
    // JSON判定
    if (this.isJSON(value)) {
      return { type: 'json', icon: '📄' };
    }
    
    // 数値判定
    if (!isNaN(value) && !isNaN(parseFloat(value)) && value.trim() !== '') {
      return { type: 'number', icon: '🔢' };
    }
    
    // 真偽値判定
    if (value === 'true' || value === 'false') {
      return { type: 'boolean', icon: '✓' };
    }
    
    // URL判定
    if (this.isURL(value)) {
      return { type: 'url', icon: '🔗' };
    }
    
    // メール判定
    if (this.isEmail(value)) {
      return { type: 'email', icon: '📧' };
    }
    
    // デフォルトは文字列
    return { type: 'string', icon: '📝' };
  }

  isJSON(str) {
    try {
      const parsed = JSON.parse(str);
      return typeof parsed === 'object' && parsed !== null;
    } catch (e) {
      return false;
    }
  }

  isURL(str) {
    try {
      new URL(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  isEmail(str) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(str);
  }

  // 戻り値は textContent へ渡すので、ここでHTMLエスケープしてはいけない。
  // エスケープすると "a<b>" が "a&lt;b&gt;" と画面に出る（実測で確認）。
  formatValueSimple(value) {
    const maxLength = 80;  // シンプル表示用により短く

    // JSON の場合は1行で表示
    if (this.isJSON(value)) {
      try {
        const parsed = JSON.parse(value);
        const compactJson = JSON.stringify(parsed);
        if (compactJson.length > maxLength) {
          return `${compactJson.substring(0, maxLength)}...`;
        }
        return compactJson;
      } catch (e) {
        // JSONパースエラーの場合は通常の文字列として処理
      }
    }

    if (value.length > maxLength) {
      return `${value.substring(0, maxLength)}...`;
    }

    return value;
  }

  editItem(key, storageType) {
    const storage = storageType === "local" ? localStorage : sessionStorage;
    const currentValue = storage.getItem(key);

    if (currentValue === null) {
      alert(this.t("alert.keyNotFound", { key }));
      return;
    }

    this.showEditModal(key, currentValue, storageType);
  }

  t(key, params) {
    return window.i18n.t(key, params);
  }

  createElement(tag, props = {}, children = []) {
    const node = document.createElement(tag);
    for (const [name, value] of Object.entries(props)) {
      if (name === "class") {
        node.className = value;
      } else if (name === "text") {
        node.textContent = value;
      } else if (name === "dataset") {
        Object.assign(node.dataset, value);
      } else if (name === "on") {
        for (const [type, handler] of Object.entries(value)) {
          node.addEventListener(type, handler);
        }
      } else if (value !== null && value !== undefined) {
        node.setAttribute(name, value);
      }
    }
    for (const child of [].concat(children)) {
      if (child) node.append(child);
    }
    return node;
  }

  showEditModal(originalKey, originalValue, storageType) {
    // 既存のモーダルがあれば削除
    const existingModal = document.querySelector('.edit-modal');
    if (existingModal) {
      existingModal.remove();
    }

    const el = (...args) => this.createElement(...args);
    const close = () => this.closeEditModal();

    const keyField = el("input", { type: "text", id: "editKey", placeholder: this.t("edit.keyPlaceholder") });
    keyField.value = originalKey;

    const valueField = el("textarea", { id: "editValue", rows: "6", placeholder: this.t("edit.valuePlaceholder") });
    valueField.value = originalValue;

    const content = el("div", {
      class: "edit-modal-content",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "editModalTitle"
    }, [
      el("div", { class: "edit-modal-header" }, [
        el("h3", { id: "editModalTitle", text: this.t("edit.title") }),
        el("button", {
          class: "edit-modal-close", type: "button",
          title: this.t("common.close"), "aria-label": this.t("common.close"), text: "✕",
          on: { click: close }
        })
      ]),
      el("div", { class: "edit-modal-body" }, [
        el("div", { class: "edit-field" }, [
          el("label", { for: "editKey", text: this.t("edit.keyLabel") }),
          keyField
        ]),
        el("div", { class: "edit-field" }, [
          el("label", { for: "editValue", text: this.t("edit.valueLabel") }),
          valueField
        ]),
        el("div", { class: "edit-info" }, [
          el("span", { class: "edit-storage-type", text: `${storageType}Storage` }),
          el("span", { class: "edit-data-size", text: this.t("edit.size", { bytes: new Blob([originalValue]).size }) })
        ])
      ]),
      el("div", { class: "edit-modal-footer" }, [
        el("button", {
          class: "edit-delete-btn", type: "button", text: this.t("common.delete"),
          on: { click: () => this.confirmDeleteFromModal(originalKey, storageType) }
        }),
        el("div", { class: "edit-footer-right" }, [
          el("button", { class: "edit-cancel-btn", type: "button", text: this.t("common.cancel"), on: { click: close } }),
          el("button", {
            class: "edit-save-btn", type: "button", text: this.t("common.save"),
            on: { click: () => this.saveEdit(originalKey, storageType) }
          })
        ])
      ])
    ]);

    const modal = el("div", { class: "edit-modal" }, [
      el("div", { class: "edit-modal-overlay", on: { click: close } }),
      content
    ]);

    // モーダルをボディに追加
    document.body.appendChild(modal);

    // フォーカス設定
    setTimeout(() => {
      keyField.focus();
      keyField.select();
    }, 100);

    // ESCキーで閉じる
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        this.closeEditModal();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  closeEditModal() {
    const modal = document.querySelector('.edit-modal');
    if (modal) {
      modal.remove();
    }
  }

  saveEdit(originalKey, storageType) {
    const newKey = document.getElementById('editKey').value.trim();
    const newValue = document.getElementById('editValue').value;
    
    if (!newKey) {
      alert(this.t("alert.needKey"));
      return;
    }

    const storage = storageType === 'local' ? localStorage : sessionStorage;
    
    try {
      // キーが変更された場合は元のキーを削除
      if (originalKey !== newKey) {
        // 新しいキーが既に存在するかチェック
        if (storage.getItem(newKey) !== null) {
          if (!confirm(this.t("confirm.overwrite", { key: newKey }))) {
            return;
          }
        }
        storage.removeItem(originalKey);
      }
      
      // 新しい値を保存
      storage.setItem(newKey, newValue);
      
      // 成功通知
      let message;
      if (originalKey !== newKey) {
        message = this.t("notify.renamed", { from: originalKey, to: newKey });
      } else {
        message = this.t("notify.saved", { key: newKey });
      }
      
      this.displayNotification(message);
      this.closeEditModal();
      this.refreshDisplay();
      
    } catch (error) {
      alert(this.t("alert.saveFailed", { message: error.message }));
      console.error('Save edit error:', error);
    }
  }

  confirmDeleteFromModal(key, storageType) {
    // カスタム確認ダイアログを表示
    this.showDeleteConfirmDialog(key, storageType);
  }

  showDeleteConfirmDialog(key, storageType) {
    // 既存の確認ダイアログがあれば削除
    const existingDialog = document.querySelector('.delete-confirm-dialog');
    if (existingDialog) {
      existingDialog.remove();
    }

    const dialog = document.createElement('div');
    dialog.className = 'delete-confirm-dialog';
    dialog.innerHTML = `
      <div class="delete-confirm-overlay" data-action="close-delete-confirm"></div>
      <div class="delete-confirm-content" role="dialog" aria-modal="true" aria-labelledby="deleteConfirmTitle">
        <div class="delete-confirm-header">
          <h3 id="deleteConfirmTitle">${this.t("delete.title")}</h3>
        </div>
        <div class="delete-confirm-body">
          <p>${this.t("delete.question")}</p>
          <div class="delete-item-info">
            <div class="delete-key-info">
              <strong>${this.t("edit.keyLabel")}</strong> <code class="delete-key-name"></code>
            </div>
            <div class="delete-storage-info">
              <strong>${this.t("delete.storageLabel")}</strong> ${storageType}Storage
            </div>
          </div>
          <p class="delete-warning">${this.t("delete.warning")}</p>
        </div>
        <div class="delete-confirm-footer">
          <button class="delete-cancel-btn" type="button" data-action="close-delete-confirm">${this.t("common.cancel")}</button>
          <button class="delete-execute-btn" type="button" data-action="execute-delete">
            ${this.t("delete.execute")}
          </button>
        </div>
      </div>
    `;

    // キーは属性やHTML文字列へ入れず、テキストとして入れる
    dialog.querySelector('.delete-key-name').textContent = key;
    // 実行ボタンが参照する対象を控える
    this.pendingDelete = { key, storageType };

    document.body.appendChild(dialog);

    // ESCキーで閉じる
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        this.closeDeleteConfirmDialog();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  closeDeleteConfirmDialog() {
    this.pendingDelete = null;
    const dialog = document.querySelector('.delete-confirm-dialog');
    if (dialog) {
      dialog.remove();
    }
  }

  executeDeleteFromModal(key, storageType) {
    const storage = storageType === 'local' ? localStorage : sessionStorage;
    
    try {
      storage.removeItem(key);
      this.displayNotification(this.t("notify.deleted", { key }));
      
      // モーダルとダイアログを閉じる
      this.closeDeleteConfirmDialog();
      this.closeEditModal();
      
      // 表示を更新
      this.refreshDisplay();
      
    } catch (error) {
      alert(this.t("alert.deleteFailed", { message: error.message }));
      console.error('Delete error:', error);
    }
  }

  addCapacityStatistics() {
    const storageSection = document.getElementById("storage");
    const searchContainer = storageSection.querySelector(".search-container");
    
    // 容量統計コンテナを作成
    const statsContainer = document.createElement("div");
    statsContainer.className = "capacity-stats-container";
    statsContainer.innerHTML = `
      <div class="capacity-stats">
        <h4>${this.t("stats.heading")}</h4>
        <div class="stats-grid">
          <div class="stat-card local-stats">
            <div class="stat-header">
              <span class="stat-title">📦 localStorage</span>
              <button class="export-btn" type="button" data-action="export-data" data-storage="local" title="${this.t("export.buttonTitle")}">
                ${this.t("export.button")}
              </button>
            </div>
            <div class="stat-content">
              <div class="capacity-bar">
                <div class="capacity-fill local-fill"></div>
                <span class="capacity-text local-text">0 / ~5MB</span>
              </div>
              <div class="stat-details">
                <span class="item-count local-count">${this.t("stats.itemCount", { count: 0 })}</span>
                <span class="data-size local-size">0B</span>
              </div>
            </div>
          </div>
          <div class="stat-card session-stats">
            <div class="stat-header">
              <span class="stat-title">⏳ sessionStorage</span>
              <button class="export-btn" type="button" data-action="export-data" data-storage="session" title="${this.t("export.buttonTitle")}">
                ${this.t("export.button")}
              </button>
            </div>
            <div class="stat-content">
              <div class="capacity-bar">
                <div class="capacity-fill session-fill"></div>
                <span class="capacity-text session-text">0 / ~5MB</span>
              </div>
              <div class="stat-details">
                <span class="item-count session-count">${this.t("stats.itemCount", { count: 0 })}</span>
                <span class="data-size session-size">0B</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // 検索コンテナの後に追加
    if (searchContainer) {
      searchContainer.after(statsContainer);
    } else {
      storageSection.appendChild(statsContainer);
    }
    
    // 統計を更新
    this.updateCapacityStats();
  }

  updateCapacityStats() {
    const localStats = this.calculateStorageStats(localStorage);
    const sessionStats = this.calculateStorageStats(sessionStorage);
    
    // localStorage統計更新
    this.updateStatDisplay('local', localStats);
    
    // sessionStorage統計更新
    this.updateStatDisplay('session', sessionStats);
  }

  calculateStorageStats(storage) {
    let totalSize = 0;
    let itemCount = 0;
    
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      const value = storage.getItem(key);
      totalSize += new Blob([key + value]).size;
      itemCount++;
    }
    
    const maxSize = 5 * 1024 * 1024; // 5MB仮定
    const percentage = Math.min((totalSize / maxSize) * 100, 100);
    
    return {
      totalSize,
      itemCount,
      percentage,
      maxSize
    };
  }

  updateStatDisplay(storageType, stats) {
    const fillElement = document.querySelector(`.${storageType}-fill`);
    const textElement = document.querySelector(`.${storageType}-text`);
    const countElement = document.querySelector(`.${storageType}-count`);
    const sizeElement = document.querySelector(`.${storageType}-size`);
    
    if (fillElement) {
      fillElement.style.width = `${stats.percentage}%`;
      
      // 容量に応じて色を変更
      if (stats.percentage > 80) {
        fillElement.className = `capacity-fill ${storageType}-fill danger`;
      } else if (stats.percentage > 60) {
        fillElement.className = `capacity-fill ${storageType}-fill warning`;
      } else {
        fillElement.className = `capacity-fill ${storageType}-fill normal`;
      }
    }
    
    if (textElement) {
      textElement.textContent = `${this.formatBytes(stats.totalSize)} / ~${this.formatBytes(stats.maxSize)}`;
    }
    
    if (countElement) {
      countElement.textContent = this.t("stats.itemCount", { count: stats.itemCount });
    }
    
    if (sizeElement) {
      sizeElement.textContent = this.formatBytes(stats.totalSize);
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + sizes[i];
  }

  addExportFunctionality() {
    // エクスポートモーダルのスタイルを追加するためのプレースホルダー
    // 実際のモーダルはexportDataメソッドで動的に作成
  }

  exportData(storageType) {
    const storage = storageType === 'local' ? localStorage : sessionStorage;
    
    // エクスポートモーダルを表示
    this.showExportModal(storage, storageType);
  }

  showExportModal(storage, storageType) {
    // 既存のモーダルがあれば削除
    const existingModal = document.querySelector('.export-modal');
    if (existingModal) {
      existingModal.remove();
    }

    // データを収集
    const data = {};
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      data[key] = storage.getItem(key);
    }

    const modal = document.createElement('div');
    modal.className = 'export-modal';
    modal.innerHTML = `
      <div class="export-modal-overlay" data-action="close-export"></div>
      <div class="export-modal-content">
        <div class="export-modal-header">
          <h3>${this.t("export.title")}</h3>
          <button class="export-modal-close" type="button" data-action="close-export" title="${this.t("common.close")}">✕</button>
        </div>
        <div class="export-modal-body">
          <div class="export-info">
            <span class="export-storage-type">${storageType}Storage</span>
            <span class="export-item-count">${this.t("stats.itemCount", { count: Object.keys(data).length })}</span>
            <span class="export-data-size">${this.formatBytes(new Blob([JSON.stringify(data)]).size)}</span>
          </div>
          <div class="export-format">
            <label>
              <input type="radio" name="exportFormat" value="json" checked>
              ${this.t("export.json")}
            </label>
            <label>
              <input type="radio" name="exportFormat" value="csv">
              ${this.t("export.csv")}
            </label>
          </div>
          <div class="export-preview">
            <label for="exportPreview">${this.t("export.preview")}</label>
            <textarea id="exportPreview" readonly rows="8">${JSON.stringify(data, null, 2)}</textarea>
          </div>
        </div>
        <div class="export-modal-footer">
          <button class="export-cancel-btn" type="button" data-action="close-export">${this.t("common.cancel")}</button>
          <button class="export-download-btn" type="button" data-action="download-export" data-storage="${storageType}">
            ${this.t("export.download")}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    
    // フォーマット変更時のプレビュー更新
    const formatRadios = modal.querySelectorAll('input[name="exportFormat"]');
    formatRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        this.updateExportPreview(data, radio.value);
      });
    });
    
    // ESCキーで閉じる
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        this.closeExportModal();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  updateExportPreview(data, format) {
    const previewElement = document.getElementById('exportPreview');
    if (!previewElement) return;
    
    if (format === 'json') {
      previewElement.value = JSON.stringify(data, null, 2);
    } else if (format === 'csv') {
      const csv = this.convertToCSV(data);
      previewElement.value = csv;
    }
  }

  convertToCSV(data) {
    const header = 'Key,Value\n';
    const rows = Object.entries(data).map(([key, value]) => {
      // CSVのためにエスケープ処理
      const escapedKey = `"${key.replace(/"/g, '""')}"`;
      const escapedValue = `"${value.replace(/"/g, '""')}"`;
      return `${escapedKey},${escapedValue}`;
    }).join('\n');
    
    return header + rows;
  }

  closeExportModal() {
    const modal = document.querySelector('.export-modal');
    if (modal) {
      modal.remove();
    }
  }

  downloadExport(storageType) {
    const storage = storageType === 'local' ? localStorage : sessionStorage;
    const formatRadios = document.querySelectorAll('input[name="exportFormat"]');
    const selectedFormat = Array.from(formatRadios).find(radio => radio.checked)?.value || 'json';
    
    // データを収集
    const data = {};
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      data[key] = storage.getItem(key);
    }
    
    let content, filename, mimeType;
    
    const now = new Date();
    // 日本時間（JST = UTC+9）に変換
    const jstDate = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    const dateTimeString = jstDate.toISOString().slice(0, 19).replace(/[T:]/g, '_');
    
    if (selectedFormat === 'json') {
      content = JSON.stringify(data, null, 2);
      filename = `${storageType}Storage_${dateTimeString}.json`;
      mimeType = 'application/json';
    } else if (selectedFormat === 'csv') {
      content = this.convertToCSV(data);
      filename = `${storageType}Storage_${dateTimeString}.csv`;
      mimeType = 'text/csv';
    }
    
    // ファイルダウンロード
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    this.displayNotification(this.t("notify.downloaded", { filename }));
    this.closeExportModal();
  }

  filterStorageDisplay() {
    const searchQuery = document.getElementById("storageSearch").value.toLowerCase();
    const showLocal = document.getElementById("filterLocal").checked;
    const showSession = document.getElementById("filterSession").checked;
    const typeFilter = document.getElementById("typeFilter").value;
    
    const storageItems = document.querySelectorAll(".storage-item, .storage-item-simple");
    
    storageItems.forEach(item => {
      const key = item.dataset.key.toLowerCase();
      const value = item.dataset.value;
      const type = item.dataset.type;
      const storage = item.dataset.storage;
      
      // 検索クエリマッチング
      const matchesSearch = !searchQuery || 
        key.includes(searchQuery) || 
        value.includes(searchQuery);
      
      // ストレージタイプフィルター
      const matchesStorageFilter = 
        (storage === 'local' && showLocal) || 
        (storage === 'session' && showSession);
      
      // データタイプフィルター
      const matchesTypeFilter = typeFilter === 'all' || type === typeFilter;
      
      // すべての条件をチェック
      const shouldShow = matchesSearch && matchesStorageFilter && matchesTypeFilter;
      
      item.style.display = shouldShow ? 'flex' : 'none';
    });
    
    // 検索結果の統計を表示
    this.updateSearchStats();
  }

  updateSearchStats() {
    const visibleItems = document.querySelectorAll(".storage-item:not([style*='display: none']), .storage-item-simple:not([style*='display: none'])");
    const totalItems = document.querySelectorAll(".storage-item, .storage-item-simple").length;
    
    // 既存の統計表示を削除
    const existingStats = document.querySelector(".search-stats");
    if (existingStats) {
      existingStats.remove();
    }
    
    // 検索結果が0件でない場合、または検索条件がある場合のみ統計を表示
    const searchInput = document.getElementById("storageSearch");
    if (searchInput && (searchInput.value || visibleItems.length !== totalItems)) {
      const statsDiv = document.createElement("div");
      statsDiv.className = "search-stats";
      statsDiv.textContent = this.t("search.showing", { visible: visibleItems.length, total: totalItems });
      
      const searchContainer = document.querySelector(".search-container");
      searchContainer.after(statsDiv);
    }
  }

  addInteractiveExamples() {
    const storageSection = document.getElementById("storage");
    
    // プリセットコンテナの後を探す
    const presetContainer = storageSection.querySelector(".preset-container");
    let insertAfterElement = presetContainer;
    
    // プリセットがない場合は、検索エリアを基準にする
    if (!insertAfterElement) {
      const searchStats = storageSection.querySelector(".search-stats");
      const searchContainer = storageSection.querySelector(".search-container");
      insertAfterElement = searchStats || searchContainer;
    }
    
    // 既存のストレージ表示エリアがあるかチェック
    const existingStorageDisplay = storageSection.querySelector(".storage-display");
    let targetElement;
    
    if (existingStorageDisplay) {
      // 既存のものを使用
      this.localList = document.getElementById("localList");
      this.sessionList = document.getElementById("sessionList");
      targetElement = existingStorageDisplay;
    } else {
      // ストレージ表示エリアを新規作成
      const storageDisplayContainer = document.createElement("div");
      storageDisplayContainer.innerHTML = `
        <div class="storage-display">
          <div>
            <div class="storage-header">
              <h3>📦 localStorage</h3>
              <button class="clear-storage-btn" type="button" data-action="clear-storage" data-storage="local" title="${this.t("storage.clearLocalTitle")}">
                ${this.t("storage.clearAll")}
              </button>
            </div>
            <ul id="localList"></ul>
          </div>
          <div>
            <div class="storage-header">
              <h3>⏳ sessionStorage</h3>
              <button class="clear-storage-btn" type="button" data-action="clear-storage" data-storage="session" title="${this.t("storage.clearSessionTitle")}">
                ${this.t("storage.clearAll")}
              </button>
            </div>
            <ul id="sessionList"></ul>
          </div>
        </div>
      `;
      
      // プリセットの後に挿入
      if (insertAfterElement) {
        insertAfterElement.after(storageDisplayContainer);
      } else {
        // フォールバック
        const fallbackElement = storageSection.querySelector(".search-container") || 
                                storageSection.querySelector(".actions");
        if (fallbackElement) {
          fallbackElement.after(storageDisplayContainer);
        } else {
          storageSection.appendChild(storageDisplayContainer);
        }
      }
      
      // リストへの参照を更新
      this.localList = document.getElementById("localList");
      this.sessionList = document.getElementById("sessionList");
      targetElement = storageDisplayContainer;
    }
    
    // インタラクティブテストを折りたたみ形式で作成
    const examplesContainer = document.createElement("div");
    examplesContainer.className = "collapsible-section collapsed";
    examplesContainer.innerHTML = `
      <div class="collapsible-header" data-action="toggle-collapsible">
        <span class="collapsible-title">${this.t("test.heading")}</span>
        <span class="collapsible-toggle">▼</span>
      </div>
      <div class="collapsible-content">
        <div class="interactive-examples-content">
          <div class="example-grid"></div>
        </div>
      </div>
    `;
    
    targetElement.after(examplesContainer);
    
    // イベントハンドラーを失わないようにDOM要素を直接追加
    const exampleGrid = examplesContainer.querySelector(".example-grid");
    
    this.interactiveExamples.forEach((example, index) => {
      const exampleDiv = document.createElement("div");
      exampleDiv.className = "example-item";
      
      const button = document.createElement("button");
      button.textContent = example.title;
      button.className = "demo-button";
      button.id = `demo-button-${index}`;
      
      // イベントリスナーを適切に設定
      button.addEventListener('click', (e) => {
        e.preventDefault();
        console.log(`Executing: ${example.title}`);
        example.action.call(this);
      });
      
      const description = document.createElement("p");
      description.textContent = example.description;
      description.className = "example-description";
      
      exampleDiv.appendChild(button);
      exampleDiv.appendChild(description);
      exampleGrid.appendChild(exampleDiv);
    });
  }

  demonstratePersistence() {
    const timestamp = new Date().toISOString();
    localStorage.setItem("persistence_test", this.t("test.savedAt", { time: timestamp }));
    sessionStorage.setItem("persistence_test", this.t("test.savedAt", { time: timestamp }));
    
    this.refreshDisplay();
    
    alert(
      this.t("test.persistence.message")
    );
  }

  demonstrateOriginPolicy() {
    alert(
      this.t("test.origin.message", { origin: window.location.origin })
    );
  }

  demonstrateQuota() {
    try {
      const testKey = "quota_test";
      let maxSuccessfulSize = 0;
      let lastTestedSize = 0;
      
      // 段階的に容量をテスト (1MB, 2MB, 4MB, 8MB, 16MB...)
      let testSize = 1024 * 1024; // 1MB から開始
      
      while (testSize <= 50 * 1024 * 1024) { // 最大50MBまでテスト
        try {
          const testData = "a".repeat(testSize);
          lastTestedSize = testSize;
          
          // 実際に保存を試行
          localStorage.setItem(testKey, testData);
          localStorage.removeItem(testKey); // 成功したらすぐ削除
          
          maxSuccessfulSize = testSize;
          testSize *= 2; // 次は倍のサイズでテスト
          
        } catch (e) {
          // 保存に失敗したら、より詳細な範囲で再テスト
          break;
        }
      }
      
      // より詳細な制限値を探す（失敗した直前のサイズから細かく探る）
      if (maxSuccessfulSize > 0 && lastTestedSize > maxSuccessfulSize) {
        let detailTestSize = maxSuccessfulSize;
        const increment = Math.max(1024 * 100, Math.floor((lastTestedSize - maxSuccessfulSize) / 10)); // 100KB または 1/10 ずつ増加
        
        while (detailTestSize < lastTestedSize) {
          detailTestSize += increment;
          try {
            const testData = "a".repeat(detailTestSize);
            localStorage.setItem(testKey, testData);
            localStorage.removeItem(testKey);
            maxSuccessfulSize = detailTestSize;
          } catch (e) {
            break;
          }
        }
      }
      
      // 現在のlocalStorage使用量を計算
      let currentUsage = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        currentUsage += new Blob([key + value]).size;
      }
      
      if (maxSuccessfulSize > 0) {
        const maxMB = (maxSuccessfulSize / 1024 / 1024).toFixed(1);
        const currentMB = (currentUsage / 1024 / 1024).toFixed(2);
        const availableMB = ((maxSuccessfulSize - currentUsage) / 1024 / 1024).toFixed(1);
        
        this.showQuotaResultDialog({
          success: true,
          maxMB,
          currentMB,
          availableMB,
          // 使用量は 0.00MB と丸めず、単位を選んで出す
          currentBytes: currentUsage,
          maxBytes: maxSuccessfulSize,
          hasExistingData: currentUsage > 0
        });
      } else {
        this.showQuotaResultDialog({
          success: false,
          error: this.t("quota.tooSmall")
        });
      }
      
    } catch (e) {
      this.showQuotaResultDialog({
        success: false,
        error: this.t("quota.error", { message: e.message })
      });
    }
  }

  showQuotaResultDialog(result) {
    // 既存のモーダルがあれば削除
    const existingDialog = document.querySelector('.quota-result-modal');
    if (existingDialog) {
      existingDialog.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'quota-result-modal';
    
    if (result.success) {
      modal.innerHTML = `
        <div class="quota-modal-overlay" data-action="close-quota"></div>
        <div class="quota-modal-content">
          <div class="quota-modal-header">
            <h3>${this.t("quota.resultTitle")}</h3>
            <button class="quota-modal-close" type="button" data-action="close-quota" title="${this.t("common.close")}" aria-label="${this.t("common.close")}">✕</button>
          </div>
          <div class="quota-modal-body">
            <div class="quota-summary">
              <div class="quota-main-stat">
                <div class="quota-capacity">
                  <span class="capacity-label">${this.t("quota.capacityLabel")}</span>
                  <span class="capacity-value">${this.t("quota.about", { mb: result.maxMB })}</span>
                </div>
                <div class="quota-usage">
                  <span class="usage-label">${this.t("quota.usageLabel")}</span>
                  <span class="usage-value">${this.formatBytes(result.currentBytes)} (${((result.currentBytes / result.maxBytes) * 100).toFixed(1)}%)</span>
                </div>
              </div>
              
              <div class="quota-progress-bar">
                <div class="progress-track">
                  <div class="progress-fill"></div>
                </div>
                <div class="progress-labels">
                  <span>0MB</span>
                  <span>${result.maxMB}MB</span>
                </div>
              </div>
              
              <div class="quota-info">
                <p class="quota-status">
                  ${result.hasExistingData 
                    ? this.t("quota.hasData") 
                    : this.t("quota.noData")
                  }
                </p>
                <p class="quota-note">
                  ${this.t("quota.remaining", { mb: result.availableMB })}
                </p>
              </div>
            </div>
          </div>
          <div class="quota-modal-footer">
            <button class="quota-ok-btn" type="button" data-action="close-quota">
              ${this.t("common.ok")}
            </button>
          </div>
        </div>
      `;
    } else {
      modal.innerHTML = `
        <div class="quota-modal-overlay" data-action="close-quota"></div>
        <div class="quota-modal-content error">
          <div class="quota-modal-header">
            <h3>${this.t("quota.errorTitle")}</h3>
            <button class="quota-modal-close" type="button" data-action="close-quota" title="${this.t("common.close")}" aria-label="${this.t("common.close")}">✕</button>
          </div>
          <div class="quota-modal-body">
            <div class="error-content">
              <div class="error-icon">⚠️</div>
              <p class="error-message">${result.error}</p>
              <div class="error-suggestions">
                <p><strong>${this.t("quota.adviceLabel")}</strong></p>
                <ul>
                  <li>${this.t("quota.advice1")}</li>
                  <li>${this.t("quota.advice2")}</li>
                  <li>${this.t("quota.advice3")}</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="quota-modal-footer">
            <button class="quota-ok-btn" type="button" data-action="close-quota">
              ${this.t("common.close")}
            </button>
          </div>
        </div>
      `;
    }

    // 幅はstyle属性ではなくCSSOMで指定する（CSPのstyle-src対策）
    const progressFill = modal.querySelector('.progress-fill');
    if (progressFill && result.success) {
      const ratio = (result.currentBytes / result.maxBytes) * 100;
      progressFill.style.width = `${Math.min(ratio, 100).toFixed(1)}%`;
    }

    document.body.appendChild(modal);
    
    // ESCキーで閉じる
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        this.closeQuotaResultDialog();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  closeQuotaResultDialog() {
    const modal = document.querySelector('.quota-result-modal');
    if (modal) {
      modal.remove();
    }
  }
}

window.StorageManager = StorageManager;
