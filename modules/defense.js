class DefenseDemo {
  constructor() {
    // 防御デモ専用のクラス
  }

  init() {
    this.addDefenseDemo();
    window.defenseDemo = this;
  }

  t(key, params) {
    return window.i18n.t(key, params);
  }

  // 要素を組み立てる小さなヘルパー。HTML文字列を組み立てない。
  el(tag, props = {}, children = []) {
    const node = document.createElement(tag);
    for (const [name, value] of Object.entries(props)) {
      if (name === "class") node.className = value;
      else if (name === "text") node.textContent = value;
      else if (value !== null && value !== undefined) node.setAttribute(name, value);
    }
    for (const child of [].concat(children)) {
      if (child) node.append(child);
    }
    return node;
  }

  addDefenseDemo() {
    const defenseSection = document.getElementById("defense");

    const cards = ["csp", "httponly", "sanitization"].map((name) =>
      this.el("div", { class: "defense-card" }, [
        this.el("h4", { text: this.t(`defense.${name}.title`) }),
        this.el("p", { text: this.t(`defense.${name}.summary`) }),
        this.el("button", {
          class: "defense-btn",
          type: "button",
          "data-defense": name,
          text: this.t(`defense.${name}.button`)
        })
      ])
    );

    const defenseContainer = this.el("div", { class: "defense-demo" }, [
      this.el("div", { class: "defense-examples" }, cards)
    ]);

    defenseSection.appendChild(defenseContainer);

    // インラインのonclickを使わず、生成後にイベントを登録する
    const handlers = {
      csp: () => this.demonstrateCSP(),
      httponly: () => this.demonstrateHttpOnly(),
      sanitization: () => this.demonstrateSanitization()
    };
    for (const button of defenseContainer.querySelectorAll("[data-defense]")) {
      button.addEventListener("click", handlers[button.dataset.defense]);
    }
  }

  // 「防御なし」と「防御あり」を並べた結果カードを作る。
  // extra には、その防御だけで足りるわけではないという但し書きを入れる。
  buildComparison(name, beforeCode, afterCode, guideCode, extraNodes = []) {
    const before = this.el("div", { class: "before-defense" }, [
      this.el("h5", { text: this.t(`defense.${name}.beforeTitle`) }),
      this.el("code", { text: beforeCode }),
      ...extraNodes,
      this.el("p", { class: "vulnerability", text: this.t(`defense.${name}.beforeResult`) })
    ]);

    const after = this.el("div", { class: "after-defense" }, [
      this.el("h5", { text: this.t(`defense.${name}.afterTitle`) }),
      this.el("code", { text: afterCode }),
      this.el("p", { class: "protection", text: this.t(`defense.${name}.afterResult`) })
    ]);

    return this.el("div", { class: "defense-result" }, [
      this.el("h4", { text: this.t(`defense.${name}.resultTitle`) }),
      this.el("div", { class: "defense-comparison" }, [before, after]),
      this.el("div", { class: "implementation-guide" }, [
        this.el("h5", { text: this.t(`defense.${name}.guideTitle`) }),
        this.el("code", { text: guideCode })
      ]),
      this.el("p", { class: "defense-caveat", text: this.t(`defense.${name}.caveat`) })
    ]);
  }

  demonstrateCSP() {
    const before = '<script>alert(localStorage.token)</script>';
    const after = "Content-Security-Policy: script-src 'self'";
    const guide = '<meta http-equiv="Content-Security-Policy"\n      content="default-src \'self\'; script-src \'self\'">';
    this.showDefenseResult(this.buildComparison("csp", before, after, guide));
  }

  demonstrateHttpOnly() {
    const before = 'document.cookie = "token=abc123"\nconsole.log(document.cookie) // "token=abc123"';
    const after = 'Set-Cookie: token=abc123; HttpOnly; Secure\nconsole.log(document.cookie) // ""';
    const guide = "res.setHeader('Set-Cookie',\n  'token=abc123; HttpOnly; Secure; SameSite=Strict');";
    this.showDefenseResult(this.buildComparison("httponly", before, after, guide));
  }

  demonstrateSanitization() {
    // 教育用サンプル: 文字列として見せるだけで、DOMへは差し込まない
    const maliciousInput = '<script>alert("XSS")</script><img src="x" onerror="alert(1)">';

    // 危険な見本も、安全な出力も textContent で入れる。
    // これ自体が「文字として入れれば実行されない」という実演になっている。
    const preview = this.el("div", { class: "demo-output vulnerable" }, [
      this.el("strong", { text: this.t("defense.sanitization.previewLabel") }),
      this.el("div", { class: "output-sample-text", text: this.t("defense.sanitization.previewNote") }),
      this.el("div", { class: "code-preview", text: maliciousInput })
    ]);

    const safeOutput = this.el("div", { class: "demo-output safe" }, [
      this.el("strong", { text: this.t("defense.sanitization.safeLabel") }),
      this.el("div", { class: "output-sample", text: maliciousInput })
    ]);

    const guide = this.t("defense.sanitization.guideCode");

    const result = this.buildComparison(
      "sanitization",
      `element.innerHTML = "${maliciousInput}"`,
      "node.textContent = userInput",
      guide,
      [preview]
    );
    result.querySelector(".after-defense").appendChild(safeOutput);
    this.showDefenseResult(result);
  }

  showDefenseResult(demoDiv) {
    const existingResult = document.querySelector(".defense-result");
    if (existingResult) {
      existingResult.remove();
    }

    const defenseDemo = document.querySelector(".defense-demo");
    defenseDemo.appendChild(demoDiv);

    demoDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

window.DefenseDemo = DefenseDemo;
