export class StorageManager {
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
    
    // プリセットデータ定義
    this.presets = {
      userAuth: {
        name: "🔐 認証情報",
        description: "一般的な認証関連データ",
        data: {
          jwt_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
          user_id: "user_12345",
          session_id: "sess_abc123xyz789",
          refresh_token: "refresh_token_sample_1234567890",
          auth_timestamp: new Date().toISOString()
        }
      },
      userData: {
        name: "👤 ユーザー設定",
        description: "ユーザープロファイルと設定",
        data: {
          user_profile: JSON.stringify({
            name: "山田太郎",
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
        name: "🛒 ECサイト",
        description: "ショッピングカート・商品データ",
        data: {
          shopping_cart: JSON.stringify([
            { id: 1, name: "ノートPC", price: 98000, quantity: 1 },
            { id: 2, name: "マウス", price: 2980, quantity: 2 }
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
        name: "📊 分析データ",
        description: "トラッキング・分析関連",
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
        name: "⚠️ 危険なデータ",
        description: "セキュリティリスクのあるデータ例",
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
        name: "💻 Webアプリ状態",
        description: "アプリケーションの状態管理",
        data: {
          app_state: JSON.stringify({
            currentPage: "dashboard",
            sidebarOpen: true,
            activeTab: "overview"
          }),
          form_draft: JSON.stringify({
            title: "下書きタイトル",
            content: "保存された下書き内容...",
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
        name: "💉 XSS攻撃ベクター",
        description: "XSS脆弱性テスト用データ",
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
        name: "🚀 パフォーマンステスト",
        description: "大量データ・容量テスト",
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

  init() {
    console.log("StorageManager init called");
    this.refreshDisplay();
    this.createCollapsibleStorageOperations();
    this.addSearchFunctionality();
    this.addCapacityStatistics();
    this.addExportFunctionality();
    this.addPresetSelector();
    this.addInteractiveExamples();
    this.setupRealtimeUpdates();
    
    window.saveData = () => this.saveData();
    window.clearStorage = (type) => this.clearStorage(type);
    
    // グローバル参照を追加（エスケープされたキーの処理用）
    window.storageManager = this;
  }

  createCollapsibleStorageOperations() {
    const storageSection = document.getElementById("storage");
    const inputArea = storageSection.querySelector(".input-area");
    const actionsDiv = storageSection.querySelector(".actions");
    
    // 既存の要素を一時的に保存
    const inputAreaHTML = inputArea.outerHTML;
    const actionsHTML = actionsDiv.outerHTML;
    
    // 折りたたみ可能なセクションを作成
    const collapsibleSection = document.createElement("div");
    collapsibleSection.className = "collapsible-section collapsed";
    collapsibleSection.innerHTML = `
      <div class="collapsible-header" onclick="storageManager.toggleCollapsibleSection(this)">
        <span class="collapsible-title">⚙️ ストレージ操作</span>
        <span class="collapsible-toggle">▼</span>
      </div>
      <div class="collapsible-content">
        ${inputAreaHTML}
        ${actionsHTML}
      </div>
    `;
    
    // 既存の要素を削除
    inputArea.remove();
    actionsDiv.remove();
    
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
        <input type="text" id="storageSearch" placeholder="🔍 キーまたは値で検索...">
        <button id="clearSearch" title="検索をクリア">✕</button>
      </div>
      <div class="search-filters">
        <label><input type="checkbox" id="filterLocal" checked> localStorage</label>
        <label><input type="checkbox" id="filterSession" checked> sessionStorage</label>
        <select id="typeFilter">
          <option value="all">すべての型</option>
          <option value="string">文字列</option>
          <option value="json">JSON</option>
          <option value="number">数値</option>
          <option value="boolean">真偽値</option>
          <option value="url">URL</option>
          <option value="email">メール</option>
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
        name: "📝 一般的なデータ",
        description: "よく使用される基本的なデータパターン",
        presets: ['userAuth', 'userData', 'webapp']
      },
      ecommerce: {
        name: "🛒 Eコマース",
        description: "オンラインショップ関連のデータ",
        presets: ['ecommerce', 'analytics']
      },
      security: {
        name: "🔒 セキュリティテスト",
        description: "セキュリティ脆弱性の学習用データ",
        presets: ['dangerous', 'xssVectors']
      },
      performance: {
        name: "⚡ パフォーマンス",
        description: "容量・速度テスト用データ",
        presets: ['performance']
      }
    };
    
    // プリセットセレクターのコンテナを作成
    const presetContainer = document.createElement("div");
    presetContainer.className = "preset-container";
    presetContainer.innerHTML = `
      <h3>📦 サンプルデータプリセット</h3>
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
                      <small>含まれるキー: ${Object.keys(preset.data).join(", ")}</small>
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
      ? `⚠️ 警告: このプリセットには機密情報やXSS攻撃ベクターが含まれます。\n${storageType}Storageに「${preset.name}」をロードしますか？`
      : `${storageType}Storageに「${preset.name}」をロードしますか？`;
    
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
      `✅ ${preset.name}を${storageType}Storageにロードしました（${loadedCount}個のキー）`
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
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      state[key] = storage.getItem(key);
    }
    return JSON.stringify(state);
  }

  wrapStorageAPIs() {
    // localStorage のメソッドをラップ
    const originalLocalSetItem = localStorage.setItem;
    const originalLocalRemoveItem = localStorage.removeItem;
    const originalLocalClear = localStorage.clear;
    
    localStorage.setItem = (key, value) => {
      originalLocalSetItem.call(localStorage, key, value);
      this.refreshDisplay();
      this.showUpdateNotification({ key, newValue: value, storageArea: localStorage });
    };
    
    localStorage.removeItem = (key) => {
      originalLocalRemoveItem.call(localStorage, key);
      this.refreshDisplay();
      this.showUpdateNotification({ key, newValue: null, storageArea: localStorage });
    };
    
    localStorage.clear = () => {
      originalLocalClear.call(localStorage);
      this.refreshDisplay();
      this.showUpdateNotification({ key: null, newValue: null, storageArea: localStorage });
    };
    
    // sessionStorage のメソッドをラップ
    const originalSessionSetItem = sessionStorage.setItem;
    const originalSessionRemoveItem = sessionStorage.removeItem;
    const originalSessionClear = sessionStorage.clear;
    
    sessionStorage.setItem = (key, value) => {
      originalSessionSetItem.call(sessionStorage, key, value);
      this.refreshDisplay();
      this.showUpdateNotification({ key, newValue: value, storageArea: sessionStorage });
    };
    
    sessionStorage.removeItem = (key) => {
      originalSessionRemoveItem.call(sessionStorage, key);
      this.refreshDisplay();
      this.showUpdateNotification({ key, newValue: null, storageArea: sessionStorage });
    };
    
    sessionStorage.clear = () => {
      originalSessionClear.call(sessionStorage);
      this.refreshDisplay();
      this.showUpdateNotification({ key: null, newValue: null, storageArea: sessionStorage });
    };
  }

  showUpdateNotification(event) {
    // 更新通知を表示
    const storageType = event.storageArea === localStorage ? 'localStorage' : 'sessionStorage';
    const message = event.key 
      ? `${storageType}: "${event.key}" が更新されました`
      : `${storageType} がクリアされました`;
    
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
    
    // 容量統計も更新
    if (document.querySelector('.capacity-stats-container')) {
      this.updateCapacityStats();
    }
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
      const displayValue = this.formatValueSimple(value);
      li.innerHTML = `
        <span class="storage-key">${this.escapeHtml(key)}</span>
        <span class="storage-separator"> = </span>
        <span class="storage-value" title="${this.escapeHtml(value)}">${displayValue}</span>
      `;
      
      // ダブルクリックで編集機能を追加
      li.addEventListener('dblclick', (e) => {
        this.editItem(key, storageType);
      });
      
      // ホバー時の視覚的フィードバック
      li.style.cursor = 'pointer';
      li.title = 'ダブルクリックで編集';
      
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

  formatValue(value, dataType) {
    const maxLength = 100;
    
    if (dataType.type === 'json') {
      try {
        const parsed = JSON.parse(value);
        const formatted = JSON.stringify(parsed, null, 2);
        return formatted.length > maxLength 
          ? `${this.escapeHtml(formatted.substring(0, maxLength))}...`
          : this.escapeHtml(formatted);
      } catch (e) {
        return this.escapeHtml(value);
      }
    }
    
    if (value.length > maxLength) {
      return `${this.escapeHtml(value.substring(0, maxLength))}...`;
    }
    
    return this.escapeHtml(value);
  }

  formatValueSimple(value) {
    const maxLength = 80;  // シンプル表示用により短く
    
    // JSON の場合は1行で表示
    if (this.isJSON(value)) {
      try {
        const parsed = JSON.parse(value);
        const compactJson = JSON.stringify(parsed);
        if (compactJson.length > maxLength) {
          return `${this.escapeHtml(compactJson.substring(0, maxLength))}...`;
        }
        return this.escapeHtml(compactJson);
      } catch (e) {
        // JSONパースエラーの場合は通常の文字列として処理
      }
    }
    
    if (value.length > maxLength) {
      return `${this.escapeHtml(value.substring(0, maxLength))}...`;
    }
    
    return this.escapeHtml(value);
  }

  deleteItem(key, storageType) {
    if (!confirm(`「${key}」を${storageType}Storageから削除しますか？`)) {
      return;
    }
    
    const storage = storageType === 'local' ? localStorage : sessionStorage;
    storage.removeItem(key);
    
    this.displayNotification(`✅ 「${key}」を削除しました`);
    this.refreshDisplay();
  }

  editItem(key, storageType) {
    const storage = storageType === 'local' ? localStorage : sessionStorage;
    const currentValue = storage.getItem(key);
    
    if (currentValue === null) {
      alert(`キー「${key}」が見つかりません。`);
      return;
    }
    
    this.showEditModal(key, currentValue, storageType);
  }

  showEditModal(originalKey, originalValue, storageType) {
    // 既存のモーダルがあれば削除
    const existingModal = document.querySelector('.edit-modal');
    if (existingModal) {
      existingModal.remove();
    }

    // モーダルHTML作成
    const modal = document.createElement('div');
    modal.className = 'edit-modal';
    modal.innerHTML = `
      <div class="edit-modal-overlay" onclick="storageManager.closeEditModal()"></div>
      <div class="edit-modal-content">
        <div class="edit-modal-header">
          <h3>✏️ データ編集</h3>
          <button class="edit-modal-close" onclick="storageManager.closeEditModal()" title="閉じる">✕</button>
        </div>
        <div class="edit-modal-body">
          <div class="edit-field">
            <label for="editKey">キー:</label>
            <input type="text" id="editKey" value="${this.escapeHtml(originalKey)}" placeholder="キーを入力">
          </div>
          <div class="edit-field">
            <label for="editValue">値:</label>
            <textarea id="editValue" placeholder="値を入力" rows="6">${this.escapeHtml(originalValue)}</textarea>
          </div>
          <div class="edit-info">
            <span class="edit-storage-type">${storageType}Storage</span>
            <span class="edit-data-size">サイズ: ${new Blob([originalValue]).size} バイト</span>
          </div>
        </div>
        <div class="edit-modal-footer">
          <button class="edit-delete-btn" onclick="storageManager.confirmDeleteFromModal('${this.escapeHtml(originalKey)}', '${storageType}')">
            🗑️ 削除
          </button>
          <div class="edit-footer-right">
            <button class="edit-cancel-btn" onclick="storageManager.closeEditModal()">キャンセル</button>
            <button class="edit-save-btn" onclick="storageManager.saveEdit('${this.escapeHtml(originalKey)}', '${storageType}')">
              💾 保存
            </button>
          </div>
        </div>
      </div>
    `;

    // モーダルをボディに追加
    document.body.appendChild(modal);
    
    // フォーカス設定
    setTimeout(() => {
      const keyInput = document.getElementById('editKey');
      if (keyInput) {
        keyInput.focus();
        keyInput.select();
      }
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
      alert('キーを入力してください。');
      return;
    }

    const storage = storageType === 'local' ? localStorage : sessionStorage;
    
    try {
      // キーが変更された場合は元のキーを削除
      if (originalKey !== newKey) {
        // 新しいキーが既に存在するかチェック
        if (storage.getItem(newKey) !== null) {
          if (!confirm(`キー「${newKey}」は既に存在します。上書きしますか？`)) {
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
        message = `✅ 「${originalKey}」を「${newKey}」に変更して保存しました`;
      } else {
        message = `✅ 「${newKey}」を更新しました`;
      }
      
      this.displayNotification(message);
      this.closeEditModal();
      this.refreshDisplay();
      
    } catch (error) {
      alert(`保存に失敗しました: ${error.message}`);
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
      <div class="delete-confirm-overlay" onclick="storageManager.closeDeleteConfirmDialog()"></div>
      <div class="delete-confirm-content">
        <div class="delete-confirm-header">
          <h3>🗑️ 削除の確認</h3>
        </div>
        <div class="delete-confirm-body">
          <p>以下のデータを削除しますか？</p>
          <div class="delete-item-info">
            <div class="delete-key-info">
              <strong>キー:</strong> <code>${this.escapeHtml(key)}</code>
            </div>
            <div class="delete-storage-info">
              <strong>ストレージ:</strong> ${storageType}Storage
            </div>
          </div>
          <p class="delete-warning">⚠️ この操作は取り消せません</p>
        </div>
        <div class="delete-confirm-footer">
          <button class="delete-cancel-btn" onclick="storageManager.closeDeleteConfirmDialog()">キャンセル</button>
          <button class="delete-execute-btn" onclick="storageManager.executeDeleteFromModal('${this.escapeHtml(key)}', '${storageType}')">
            🗑️ 削除する
          </button>
        </div>
      </div>
    `;

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
    const dialog = document.querySelector('.delete-confirm-dialog');
    if (dialog) {
      dialog.remove();
    }
  }

  executeDeleteFromModal(key, storageType) {
    const storage = storageType === 'local' ? localStorage : sessionStorage;
    
    try {
      storage.removeItem(key);
      this.displayNotification(`✅ 「${key}」を削除しました`);
      
      // モーダルとダイアログを閉じる
      this.closeDeleteConfirmDialog();
      this.closeEditModal();
      
      // 表示を更新
      this.refreshDisplay();
      
    } catch (error) {
      alert(`削除に失敗しました: ${error.message}`);
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
        <h4>📊 ストレージ容量統計</h4>
        <div class="stats-grid">
          <div class="stat-card local-stats">
            <div class="stat-header">
              <span class="stat-title">📦 localStorage</span>
              <button class="export-btn" onclick="storageManager.exportData('local')" title="データをエクスポート">
                💾 書き出し
              </button>
            </div>
            <div class="stat-content">
              <div class="capacity-bar">
                <div class="capacity-fill local-fill"></div>
                <span class="capacity-text local-text">0 / ~5MB</span>
              </div>
              <div class="stat-details">
                <span class="item-count local-count">0アイテム</span>
                <span class="data-size local-size">0B</span>
              </div>
            </div>
          </div>
          <div class="stat-card session-stats">
            <div class="stat-header">
              <span class="stat-title">⏳ sessionStorage</span>
              <button class="export-btn" onclick="storageManager.exportData('session')" title="データをエクスポート">
                💾 書き出し
              </button>
            </div>
            <div class="stat-content">
              <div class="capacity-bar">
                <div class="capacity-fill session-fill"></div>
                <span class="capacity-text session-text">0 / ~5MB</span>
              </div>
              <div class="stat-details">
                <span class="item-count session-count">0アイテム</span>
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
      countElement.textContent = `${stats.itemCount}アイテム`;
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
      <div class="export-modal-overlay" onclick="storageManager.closeExportModal()"></div>
      <div class="export-modal-content">
        <div class="export-modal-header">
          <h3>💾 データエクスポート</h3>
          <button class="export-modal-close" onclick="storageManager.closeExportModal()" title="閉じる">✕</button>
        </div>
        <div class="export-modal-body">
          <div class="export-info">
            <span class="export-storage-type">${storageType}Storage</span>
            <span class="export-item-count">${Object.keys(data).length}アイテム</span>
            <span class="export-data-size">${this.formatBytes(new Blob([JSON.stringify(data)]).size)}</span>
          </div>
          <div class="export-format">
            <label>
              <input type="radio" name="exportFormat" value="json" checked>
              JSON形式 (.json)
            </label>
            <label>
              <input type="radio" name="exportFormat" value="csv">
              CSV形式 (.csv)
            </label>
          </div>
          <div class="export-preview">
            <label for="exportPreview">プレビュー:</label>
            <textarea id="exportPreview" readonly rows="8">${JSON.stringify(data, null, 2)}</textarea>
          </div>
        </div>
        <div class="export-modal-footer">
          <button class="export-cancel-btn" onclick="storageManager.closeExportModal()">キャンセル</button>
          <button class="export-download-btn" onclick="storageManager.downloadExport('${storageType}')">
            💾 ダウンロード
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
    
    this.displayNotification(`✅ ${filename} をダウンロードしました`);
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
      statsDiv.textContent = `${visibleItems.length} / ${totalItems} 件のアイテムを表示中`;
      
      const searchContainer = document.querySelector(".search-container");
      searchContainer.after(statsDiv);
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
              <button class="clear-storage-btn" onclick="storageManager.clearStorage('local')" title="localStorageを全削除">
                🗑️ 全削除
              </button>
            </div>
            <ul id="localList"></ul>
          </div>
          <div>
            <div class="storage-header">
              <h3>⏳ sessionStorage</h3>
              <button class="clear-storage-btn" onclick="storageManager.clearStorage('session')" title="sessionStorageを全削除">
                🗑️ 全削除
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
      <div class="collapsible-header" onclick="storageManager.toggleCollapsibleSection(this)">
        <span class="collapsible-title">🧪 インタラクティブテスト</span>
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
          hasExistingData: currentUsage > 0
        });
      } else {
        this.showQuotaResultDialog({
          success: false,
          error: '最小テストサイズ(1MB)でも保存に失敗しました。'
        });
      }
      
    } catch (e) {
      this.showQuotaResultDialog({
        success: false,
        error: `容量テスト中にエラーが発生しました: ${e.message}`
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
        <div class="quota-modal-overlay" onclick="storageManager.closeQuotaResultDialog()"></div>
        <div class="quota-modal-content">
          <div class="quota-modal-header">
            <h3>📊 容量制限テスト結果</h3>
            <button class="quota-modal-close" onclick="storageManager.closeQuotaResultDialog()" title="閉じる">✕</button>
          </div>
          <div class="quota-modal-body">
            <div class="quota-summary">
              <div class="quota-main-stat">
                <div class="quota-capacity">
                  <span class="capacity-label">利用可能容量</span>
                  <span class="capacity-value">約 ${result.maxMB}MB</span>
                </div>
                <div class="quota-usage">
                  <span class="usage-label">現在の使用量</span>
                  <span class="usage-value">${result.currentMB}MB (${((parseFloat(result.currentMB) / parseFloat(result.maxMB)) * 100).toFixed(1)}%)</span>
                </div>
              </div>
              
              <div class="quota-progress-bar">
                <div class="progress-track">
                  <div class="progress-fill" style="width: ${Math.min(((parseFloat(result.currentMB) / parseFloat(result.maxMB)) * 100), 100).toFixed(1)}%"></div>
                </div>
                <div class="progress-labels">
                  <span>0MB</span>
                  <span>${result.maxMB}MB</span>
                </div>
              </div>
              
              <div class="quota-info">
                <p class="quota-status">
                  ${result.hasExistingData 
                    ? '📁 既存データが保存されています' 
                    : '💡 新規テスト環境です'
                  }
                </p>
                <p class="quota-note">
                  残り約 <strong>${result.availableMB}MB</strong> 利用可能
                </p>
              </div>
            </div>
          </div>
          <div class="quota-modal-footer">
            <button class="quota-ok-btn" onclick="storageManager.closeQuotaResultDialog()">
              📋 確認
            </button>
          </div>
        </div>
      `;
    } else {
      modal.innerHTML = `
        <div class="quota-modal-overlay" onclick="storageManager.closeQuotaResultDialog()"></div>
        <div class="quota-modal-content error">
          <div class="quota-modal-header">
            <h3>❌ テストエラー</h3>
            <button class="quota-modal-close" onclick="storageManager.closeQuotaResultDialog()" title="閉じる">✕</button>
          </div>
          <div class="quota-modal-body">
            <div class="error-content">
              <div class="error-icon">⚠️</div>
              <p class="error-message">${result.error}</p>
              <div class="error-suggestions">
                <p><strong>推奨対処法:</strong></p>
                <ul>
                  <li>ブラウザを再起動してください</li>
                  <li>プライベートモードでお試しください</li>
                  <li>他のタブを閉じてください</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="quota-modal-footer">
            <button class="quota-ok-btn" onclick="storageManager.closeQuotaResultDialog()">
              閉じる
            </button>
          </div>
        </div>
      `;
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