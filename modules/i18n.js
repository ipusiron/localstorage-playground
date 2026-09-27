// 日本語と英語の文言をここへ集める。
// 画面の文言をモジュール側へ直接書かず、必ず i18n.t(キー) で取り出す。
const MESSAGES = {
  ja: {
    "app.title": "LocalStorage Playground",
    "app.subtitle": "localStorage / sessionStorage の特性と危険性を体験しよう",
    "lang.toggle": "English",
    "lang.toggleTitle": "英語表示に切り替える",

    "tabs.label": "機能",
    "tab.storage": "🗃 ストレージ操作",
    "tab.xss": "💥 XSSデモ",
    "tab.defense": "🛡️ 防御デモ",
    "tab.learn": "📖 学習",

    "storage.heading": "🗃 ストレージ（localStorageとsessionStorage）操作",
    "storage.keyLabel": "キー",
    "storage.valueLabel": "値",
    "storage.save": "保存",
    "storage.localTitle": "📦 localStorage",
    "storage.sessionTitle": "⏳ sessionStorage",
    "storage.clearAll": "🗑️ 全削除",
    "storage.clearLocalTitle": "localStorageを全削除",
    "storage.clearSessionTitle": "sessionStorageを全削除",

    "xss.heading": "💥 XSSによるlocalStorage盗難のデモ",
    "xss.lead": "下のフィールドに悪意あるスクリプトを入力して「実行」すると、localStorageからデータを盗む動作を再現できます（安全な環境の中だけで実行してください）。",
    "xss.inputLabel": "教育用スクリプト",
    "xss.placeholder": "例: alert(localStorage.getItem(\"token\"))",
    "xss.run": "🚀 実行",

    "defense.heading": "🛡️ セキュリティ防御デモンストレーション",
    "defense.lead": "XSS攻撃に対する主要な防御手法の効果を確認できます。各防御策がどのように攻撃を無効化するかを体験してください。",

    "learn.heading": "📖 Web Storageの仕組みとセキュリティ",
    "learn.point1html": "<strong>localStorage</strong> は永続的にブラウザー内へ保存され、JavaScriptから自由に読み書きできます。",
    "learn.point2html": "<strong>sessionStorage</strong> はタブを閉じると消えますが、JavaScriptからアクセスできます。",
    "learn.point3html": "<strong>XSS</strong> 攻撃が成立すると、保存されたトークンなどがすぐに盗まれます。",
    "learn.point4html": "機密情報は <code>HttpOnly Cookie</code> へ保存すべきで、localStorageは適しません。",

    "footer.repo": "🔗 GitHubリポジトリはこちら",

    "welcome.title": "🎯 LocalStorage Playgroundへようこそ",
    "welcome.body": "このツールでWeb Storageの動作とセキュリティリスクを学びましょう。",

    "learn.practicesHeading": "🔒 セキュリティのベストプラクティス",
    "learn.practice.noSecrets.label": "機密情報を保存しない:",
    "learn.practice.noSecrets.body": "トークン、パスワード、個人情報をlocalStorageへ保存してはいけません。",
    "learn.practice.httpOnly.label": "HttpOnly Cookieを使う:",
    "learn.practice.httpOnly.body": "認証トークンはHttpOnly属性を付けたCookieで扱います。",
    "learn.practice.encrypt.label": "データを暗号化する:",
    "learn.practice.encrypt.body": "やむを得ず保存する場合は、適切に暗号化します。ただし鍵の置き場所も同じ問題を抱えます。",
    "learn.practice.cleanup.label": "不要なデータを消す:",
    "learn.practice.cleanup.body": "使わなくなったデータは早めに削除します。",
    "learn.tableHeading": "📊 ストレージの比較",
    "learn.table.aspect": "特性",
    "learn.table.local": "localStorage",
    "learn.table.session": "sessionStorage",
    "learn.table.cookie": "Cookie (HttpOnly)",
    "learn.row.persistence.aspect": "永続性",
    "learn.row.persistence.local": "永続的",
    "learn.row.persistence.session": "タブを閉じるまで",
    "learn.row.persistence.cookie": "期限を指定できる",
    "learn.row.capacity.aspect": "容量",
    "learn.row.capacity.local": "5〜10MB",
    "learn.row.capacity.session": "5〜10MB",
    "learn.row.capacity.cookie": "4KB",
    "learn.row.jsAccess.aspect": "JavaScriptからの読み取り",
    "learn.row.jsAccess.local": "✅ できる",
    "learn.row.jsAccess.session": "✅ できる",
    "learn.row.jsAccess.cookie": "❌ できない",
    "learn.row.xssResistance.aspect": "XSSへの強さ",
    "learn.row.xssResistance.local": "❌ 読み取られる",
    "learn.row.xssResistance.session": "❌ 読み取られる",
    "learn.row.xssResistance.cookie": "✅ 読み取られない",
    "learn.row.sentToServer.aspect": "サーバーへの自動送信",
    "learn.row.sentToServer.local": "❌ しない",
    "learn.row.sentToServer.session": "❌ しない",
    "learn.row.sentToServer.cookie": "✅ する",

    "defense.csp.title": "📋 CSP（Content Security Policy）",
    "defense.csp.summary": "読み込めるスクリプトをブラウザー側で制限する",
    "defense.csp.button": "CSPの効果を見る",
    "defense.csp.resultTitle": "📋 CSPの効果",
    "defense.csp.beforeTitle": "❌ CSPなし",
    "defense.csp.beforeResult": "→ 差し込まれたスクリプトがそのまま実行される",
    "defense.csp.afterTitle": "✅ CSPあり",
    "defense.csp.afterResult": "→ インラインのスクリプトが実行されない",
    "defense.csp.guideTitle": "書き方",
    "defense.csp.caveat": "CSPはXSSをなくすものではありません。差し込みの穴が残っていれば、許可された経路を使う攻撃は通ります。出力時に安全なDOM APIを使うことが先で、CSPはその上に重ねる備えです。",
    "defense.httponly.title": "🔐 HttpOnly Cookie",
    "defense.httponly.summary": "JavaScriptから読めないCookieにする",
    "defense.httponly.button": "HttpOnlyの効果を見る",
    "defense.httponly.resultTitle": "🔐 HttpOnly Cookieの効果",
    "defense.httponly.beforeTitle": "❌ ふつうのCookie",
    "defense.httponly.beforeResult": "→ JavaScriptから中身を読める",
    "defense.httponly.afterTitle": "✅ HttpOnly Cookie",
    "defense.httponly.afterResult": "→ JavaScriptからは空に見える",
    "defense.httponly.guideTitle": "書き方（サーバー側）",
    "defense.httponly.caveat": "Cookieへ移してもXSSの影響がゼロになるわけではありません。トークンを読めなくても、攻撃者のスクリプトは利用者のブラウザー上で動くので、そのままリクエストを送れます。SameSiteはCSRFに効くもので、XSSの対策とは別です。",
    "defense.sanitization.title": "🧹 出力時に文字として入れる",
    "defense.sanitization.summary": "入力をHTMLとして解釈させない",
    "defense.sanitization.button": "出力の違いを見る",
    "defense.sanitization.resultTitle": "🧹 出力のしかたで結果が変わる",
    "defense.sanitization.beforeTitle": "❌ HTMLとして入れる",
    "defense.sanitization.beforeResult": "→ 差し込まれたタグが要素になる（このデモでは文字として見せている）",
    "defense.sanitization.afterTitle": "✅ 文字として入れる",
    "defense.sanitization.afterResult": "→ タグがそのまま文字として表示される",
    "defense.sanitization.guideTitle": "書き方",
    "defense.sanitization.previewLabel": "入力の例",
    "defense.sanitization.previewNote": "実環境でinnerHTMLへ渡すと、この中のスクリプトが動きます。",
    "defense.sanitization.safeLabel": "textContentで入れた結果",
    "defense.sanitization.caveat": "エスケープ関数を足すより、入力をHTMLの文脈へ持ち込まないほうが確実です。属性値やURL、イベント属性では必要なエスケープが変わるため、文脈ごとに正しく書き分ける必要が出てきます。",

    "xss.warningLabel": "⚠️ 警告:",
    "xss.warningBody": "このデモは学習のためのものです。実際のWebサイトで同じコードを実行しないでください。",
    "xss.scenarioHeading": "🎯 攻撃シナリオを選ぶ",
    "xss.select": "選択",
    "xss.category.basic.name": "🎯 基本の攻撃",
    "xss.category.basic.description": "localStorageを素直に読むだけの攻撃",
    "xss.category.advanced.name": "🔥 進んだ攻撃",
    "xss.category.advanced.description": "保存されているデータをまとめて取る",
    "xss.category.persistent.name": "💀 居座る攻撃",
    "xss.category.persistent.description": "コードを保存したり、外へ送り出したりする",
    "xss.script.token.name": "トークンの窃取",
    "xss.script.token.explanation": "認証トークンを直接読み取る",
    "xss.script.session.name": "セッションデータの窃取",
    "xss.script.session.explanation": "sessionStorageから利用者の情報を読み取る",
    "xss.script.enumerate.name": "全データの列挙",
    "xss.script.enumerate.explanation": "localStorageの中身をすべて並べる",
    "xss.script.json.name": "JSONでまとめて取得",
    "xss.script.json.explanation": "全データをJSONの形で取り出す",
    "xss.script.malware.name": "コードの埋め込み",
    "xss.script.malware.explanation": "悪意のあるコードをlocalStorageへ保存する",
    "xss.script.exfiltrate.name": "外部への送信",
    "xss.script.exfiltrate.explanation": "全データを攻撃者のサーバーへ送ろうとする",
    "xss.selectedAttack": "📝 選んだ攻撃: {name}",
    "xss.behaviorLabel": "動作:",
    "xss.codeLabel": "コード:",
    "xss.riskLevel": "🔴 高リスク",
    "xss.riskNote": "実際の攻撃では、個人情報やアカウントが奪われます。",
    "xss.stepsHeading": "🔍 実行の流れ",
    "xss.step.validated": "✅ 入力したスクリプトを確認した",
    "xss.step.sandbox": "🔐 通信を遮断する準備をした",
    "xss.step.snapshot": "📊 実行前のストレージを記録した",
    "xss.step.running": "⚡ スクリプトを実行中",
    "xss.step.done": "✅ スクリプトの実行が終わった",
    "xss.analysisHeading": "🛡️ 何が起きたか",
    "xss.impact.local": "📦 localStorageへの影響",
    "xss.impact.session": "⏳ sessionStorageへの影響",
    "xss.change.added": "➕ 追加: {key}",
    "xss.change.modified": "✏️ 変更: {key}",
    "xss.change.removed": "❌ 削除: {key}",
    "xss.threatHeading": "🚨 外部へ送ろうとした",
    "xss.threatBlocked": "{count}件の送信を遮断しました。",
    "xss.threatWarning": "⚠️ 実際の攻撃では、この通信でデータが持ち出されます。",
    "xss.demoDataAdded": "デモ用に {name} をストレージへ追加しました。",
    "xss.result.alert": "alertの内容: {content}",
    "xss.result.blocked": "⚠️ 外部送信を試みました。通信は遮断しています。",
    "xss.result.written": "✅ 実行が終わりました。ストレージへ書き込まれています。",
    "xss.result.value": "実行結果: {value}",
    "xss.result.empty": "実行は終わりましたが、返る値はありません。",
    "xss.result.error": "エラー: {message}",
    "xss.result.needInput": "スクリプトを入力してください。",
    "xss.blocked.request": "このデモでは外部への送信を遮断します。",
    "xss.blocked.websocket": "このデモではWebSocketの接続を遮断します。",

    "common.close": "閉じる",
    "common.cancel": "キャンセル",
    "common.save": "💾 保存",
    "common.delete": "🗑️ 削除",
    "common.ok": "📋 確認",
    "storage.operationsTitle": "⚙️ ストレージ操作",
    "test.heading": "🧪 動かして確かめる",
    "test.persistence.title": "永続性テスト",
    "test.persistence.description": "localStorageとsessionStorageの違いを確かめる",
    "test.persistence.message": "両方のストレージへデータを保存しました。\nブラウザーを閉じて開き直すと、localStorageのデータだけが残ります。\n上の一覧で確かめてください。",
    "test.origin.title": "同一オリジンポリシー",
    "test.origin.description": "別のドメインからは読めないことを確かめる",
    "test.origin.message": "同一オリジンポリシーにより、\n- https://example.com\n- https://sub.example.com\n- http://example.com\nこれらはすべて別のストレージ領域を持ちます。\n\nいまのオリジン: {origin}",
    "test.quota.title": "容量の上限を調べる",
    "test.quota.description": "どこまで保存できるかを実際に測る",
    "test.savedAt": "保存時刻: {time}",
    "preset.heading": "📦 サンプルデータ",
    "preset.includedKeys": "含まれるキー: {keys}",
    "preset.confirm": "{name} を {storage}Storage へ読み込みますか。",
    "preset.confirmRisky": "⚠️ このサンプルには、機密情報に見立てたデータやXSSの攻撃文字列が含まれます。\n{name} を {storage}Storage へ読み込みますか。",
    "preset.loaded": "✅ {name} を {storage}Storage へ読み込みました（{count}件）。",
    "preset.auth.name": "🔐 認証情報",
    "preset.auth.description": "よくある認証まわりのデータ",
    "preset.profile.name": "👤 ユーザー設定",
    "preset.profile.description": "プロフィールと画面の設定",
    "preset.shop.name": "🛒 ECサイト",
    "preset.shop.description": "買い物かごと商品のデータ",
    "preset.analytics.name": "📊 分析データ",
    "preset.analytics.description": "行動の記録と分析用のデータ",
    "preset.risky.name": "⚠️ 危ないデータ",
    "preset.risky.description": "保存してはいけないデータの例",
    "preset.appstate.name": "💻 アプリの状態",
    "preset.appstate.description": "画面の状態や下書きの保持",
    "preset.xss.name": "💉 XSSの攻撃文字列",
    "preset.xss.description": "XSSの動きを確かめるためのデータ",
    "preset.perf.name": "🚀 大きなデータ",
    "preset.perf.description": "容量と速度を確かめるためのデータ",
    "presetGroup.common.name": "📝 よくあるデータ",
    "presetGroup.common.description": "多くのサイトが保存している型のデータ",
    "presetGroup.commerce.name": "🛒 Eコマース",
    "presetGroup.commerce.description": "オンラインショップまわりのデータ",
    "presetGroup.security.name": "🔒 セキュリティの学習",
    "presetGroup.security.description": "リスクを確かめるためのデータ",
    "presetGroup.performance.name": "⚡ 容量と速度",
    "presetGroup.performance.description": "容量や速度を確かめるためのデータ",
    "sample.personName": "山田太郎",
    "sample.laptop": "ノートPC",
    "sample.mouse": "マウス",
    "sample.draftTitle": "下書きのタイトル",
    "sample.draftBody": "書きかけの本文...",
    "search.placeholder": "🔍 キーまたは値で検索",
    "search.clearTitle": "検索を消す",
    "search.showing": "{total}件のうち{visible}件を表示中",
    "filter.all": "すべての型",
    "filter.string": "文字列",
    "filter.number": "数値",
    "filter.boolean": "真偽値",
    "filter.email": "メール",
    "list.empty": "（データなし）",
    "list.editHint": "ダブルクリックで編集",
    "notify.updated": "{storage}: {key} を更新しました。",
    "notify.cleared": "{storage} を空にしました。",
    "notify.renamed": "✅ {from} を {to} に変えて保存しました。",
    "notify.saved": "✅ {key} を更新しました。",
    "notify.deleted": "✅ {key} を削除しました。",
    "notify.downloaded": "✅ {filename} をダウンロードしました。",
    "alert.needKey": "キーを入力してください。",
    "alert.saveFailed": "保存できませんでした: {message}",
    "alert.deleteFailed": "削除できませんでした: {message}",
    "confirm.clearLocal": "localStorageのデータをすべて削除しますか。",
    "confirm.clearSession": "sessionStorageのデータをすべて削除しますか。",
    "confirm.overwrite": "キー {key} はすでにあります。上書きしますか。",
    "edit.title": "✏️ データの編集",
    "edit.keyLabel": "キー:",
    "edit.valueLabel": "値:",
    "edit.keyPlaceholder": "キーを入力",
    "edit.valuePlaceholder": "値を入力",
    "edit.size": "サイズ: {bytes} バイト",
    "delete.title": "🗑️ 削除の確認",
    "delete.question": "このデータを削除しますか。",
    "delete.storageLabel": "ストレージ:",
    "delete.warning": "⚠️ 元には戻せません。",
    "delete.execute": "🗑️ 削除する",
    "stats.heading": "📊 使っている容量",
    "stats.itemCount": "{count}件",
    "export.title": "💾 データの書き出し",
    "export.button": "💾 書き出し",
    "export.buttonTitle": "データを書き出す",
    "export.json": "JSON形式 (.json)",
    "export.csv": "CSV形式 (.csv)",
    "export.preview": "プレビュー:",
    "export.download": "💾 ダウンロード",
    "quota.resultTitle": "📊 容量の測定結果",
    "quota.capacityLabel": "使える容量",
    "quota.usageLabel": "いまの使用量",
    "quota.about": "約 {mb}MB",
    "quota.hasData": "📁 すでにデータが入っています",
    "quota.noData": "💡 まだ何も入っていません",
    "quota.remaining": "残り約 {mb}MB 使えます",
    "quota.errorTitle": "❌ 測定できませんでした",
    "quota.adviceLabel": "試せること:",
    "quota.advice1": "ブラウザーを再起動する",
    "quota.advice2": "プライベートウィンドウで開く",
    "quota.advice3": "ほかのタブを閉じる",
    "quota.tooSmall": "1MBでも保存できませんでした。",
    "quota.error": "測定中にエラーが起きました: {message}",

    "alert.keyNotFound": "キー {key} が見つかりません。"
  },

  en: {
    "app.title": "LocalStorage Playground",
    "app.subtitle": "See how localStorage and sessionStorage behave, and where they put you at risk",
    "lang.toggle": "日本語",
    "lang.toggleTitle": "Switch to Japanese",

    "tabs.label": "Features",
    "tab.storage": "🗃 Storage",
    "tab.xss": "💥 XSS demo",
    "tab.defense": "🛡️ Defense demo",
    "tab.learn": "📖 Learn",

    "storage.heading": "🗃 Working with localStorage and sessionStorage",
    "storage.keyLabel": "Key",
    "storage.valueLabel": "Value",
    "storage.save": "Save",
    "storage.localTitle": "📦 localStorage",
    "storage.sessionTitle": "⏳ sessionStorage",
    "storage.clearAll": "🗑️ Clear all",
    "storage.clearLocalTitle": "Delete everything in localStorage",
    "storage.clearSessionTitle": "Delete everything in sessionStorage",

    "xss.heading": "💥 Stealing localStorage through XSS",
    "xss.lead": "Type a malicious script into the field below and press Run. The tool reproduces how data is read out of localStorage. Run it only in a safe environment.",
    "xss.inputLabel": "Script for learning",
    "xss.placeholder": "Example: alert(localStorage.getItem(\"token\"))",
    "xss.run": "🚀 Run",

    "defense.heading": "🛡️ Defenses against XSS",
    "defense.lead": "See what the main defenses against XSS actually do. Each demo shows how an attack is neutralised.",

    "learn.heading": "📖 How Web Storage works, and where it is risky",
    "learn.point1html": "<strong>localStorage</strong> persists in the browser, and any JavaScript on the page can read and write it.",
    "learn.point2html": "<strong>sessionStorage</strong> disappears when the tab closes, but JavaScript can still read it.",
    "learn.point3html": "<strong>XSS</strong> that succeeds can take stored tokens immediately.",
    "learn.point4html": "Secrets belong in an <code>HttpOnly Cookie</code>. localStorage is not the place for them.",

    "footer.repo": "🔗 GitHub repository",

    "welcome.title": "🎯 Welcome to LocalStorage Playground",
    "welcome.body": "Use this tool to learn how Web Storage behaves and where the security risks are.",

    "learn.practicesHeading": "🔒 Security best practices",
    "learn.practice.noSecrets.label": "Do not store secrets:",
    "learn.practice.noSecrets.body": "Tokens, passwords and personal data do not belong in localStorage.",
    "learn.practice.httpOnly.label": "Use HttpOnly cookies:",
    "learn.practice.httpOnly.body": "Keep authentication tokens in cookies with the HttpOnly attribute.",
    "learn.practice.encrypt.label": "Encrypt what you must store:",
    "learn.practice.encrypt.body": "If you have no choice, encrypt it. Note that the key itself faces the same problem.",
    "learn.practice.cleanup.label": "Clean up:",
    "learn.practice.cleanup.body": "Delete data as soon as you stop needing it.",
    "learn.tableHeading": "📊 Comparing the storages",
    "learn.table.aspect": "Aspect",
    "learn.table.local": "localStorage",
    "learn.table.session": "sessionStorage",
    "learn.table.cookie": "Cookie (HttpOnly)",
    "learn.row.persistence.aspect": "Persistence",
    "learn.row.persistence.local": "Until deleted",
    "learn.row.persistence.session": "Until the tab closes",
    "learn.row.persistence.cookie": "Expiry can be set",
    "learn.row.capacity.aspect": "Capacity",
    "learn.row.capacity.local": "5-10MB",
    "learn.row.capacity.session": "5-10MB",
    "learn.row.capacity.cookie": "4KB",
    "learn.row.jsAccess.aspect": "Readable by JavaScript",
    "learn.row.jsAccess.local": "✅ Yes",
    "learn.row.jsAccess.session": "✅ Yes",
    "learn.row.jsAccess.cookie": "❌ No",
    "learn.row.xssResistance.aspect": "Resistance to XSS",
    "learn.row.xssResistance.local": "❌ Can be read",
    "learn.row.xssResistance.session": "❌ Can be read",
    "learn.row.xssResistance.cookie": "✅ Cannot be read",
    "learn.row.sentToServer.aspect": "Sent to the server automatically",
    "learn.row.sentToServer.local": "❌ No",
    "learn.row.sentToServer.session": "❌ No",
    "learn.row.sentToServer.cookie": "✅ Yes",

    "defense.csp.title": "📋 CSP (Content Security Policy)",
    "defense.csp.summary": "Tell the browser which scripts it may run",
    "defense.csp.button": "See what CSP does",
    "defense.csp.resultTitle": "📋 What CSP does",
    "defense.csp.beforeTitle": "❌ Without CSP",
    "defense.csp.beforeResult": "→ The injected script simply runs",
    "defense.csp.afterTitle": "✅ With CSP",
    "defense.csp.afterResult": "→ The inline script does not run",
    "defense.csp.guideTitle": "How to set it",
    "defense.csp.caveat": "CSP does not remove XSS. If an injection hole remains, an attack that uses an allowed path still works. Safe DOM APIs at output time come first; CSP is the layer on top.",
    "defense.httponly.title": "🔐 HttpOnly cookie",
    "defense.httponly.summary": "Keep the cookie out of JavaScript's reach",
    "defense.httponly.button": "See what HttpOnly does",
    "defense.httponly.resultTitle": "🔐 What an HttpOnly cookie does",
    "defense.httponly.beforeTitle": "❌ Ordinary cookie",
    "defense.httponly.beforeResult": "→ JavaScript can read the value",
    "defense.httponly.afterTitle": "✅ HttpOnly cookie",
    "defense.httponly.afterResult": "→ JavaScript sees nothing",
    "defense.httponly.guideTitle": "How to set it (server side)",
    "defense.httponly.caveat": "Moving a token into a cookie does not reduce XSS to nothing. Even when the script cannot read the token, it runs in the user's browser and can send requests as the user. SameSite addresses CSRF, which is a different problem from XSS.",
    "defense.sanitization.title": "🧹 Insert input as text",
    "defense.sanitization.summary": "Never let input be parsed as HTML",
    "defense.sanitization.button": "See the difference",
    "defense.sanitization.resultTitle": "🧹 How you output it changes everything",
    "defense.sanitization.beforeTitle": "❌ Inserted as HTML",
    "defense.sanitization.beforeResult": "→ The injected tags become elements (this demo only shows them as text)",
    "defense.sanitization.afterTitle": "✅ Inserted as text",
    "defense.sanitization.afterResult": "→ The tags are shown as characters",
    "defense.sanitization.guideTitle": "How to do it",
    "defense.sanitization.previewLabel": "The input",
    "defense.sanitization.previewNote": "Passing this to innerHTML in a real page would run the script inside it.",
    "defense.sanitization.safeLabel": "The result of using textContent",
    "defense.sanitization.caveat": "Adding an escape function is less reliable than keeping input out of HTML contexts. Attributes, URLs and event handlers each need different escaping, so every context becomes a place to get it wrong.",

    "xss.warningLabel": "⚠️ Warning:",
    "xss.warningBody": "This demo is for learning. Do not run the same code against a real website.",
    "xss.scenarioHeading": "🎯 Pick an attack scenario",
    "xss.select": "Select",
    "xss.category.basic.name": "🎯 Basic attacks",
    "xss.category.basic.description": "Attacks that simply read localStorage",
    "xss.category.advanced.name": "🔥 Broader attacks",
    "xss.category.advanced.description": "Take everything that is stored, in one go",
    "xss.category.persistent.name": "💀 Attacks that stay",
    "xss.category.persistent.description": "Store code, or send the data outside",
    "xss.script.token.name": "Stealing a token",
    "xss.script.token.explanation": "Read the authentication token directly",
    "xss.script.session.name": "Stealing session data",
    "xss.script.session.explanation": "Read the user's data out of sessionStorage",
    "xss.script.enumerate.name": "Listing everything",
    "xss.script.enumerate.explanation": "List every entry in localStorage",
    "xss.script.json.name": "Grabbing it all as JSON",
    "xss.script.json.explanation": "Take all the data in JSON form",
    "xss.script.malware.name": "Planting code",
    "xss.script.malware.explanation": "Store malicious code in localStorage",
    "xss.script.exfiltrate.name": "Sending it outside",
    "xss.script.exfiltrate.explanation": "Try to send everything to the attacker's server",
    "xss.selectedAttack": "📝 Selected attack: {name}",
    "xss.behaviorLabel": "What it does:",
    "xss.codeLabel": "Code:",
    "xss.riskLevel": "🔴 High risk",
    "xss.riskNote": "In a real attack this takes personal data and accounts.",
    "xss.stepsHeading": "🔍 What happens when you run it",
    "xss.step.validated": "✅ Checked the script you typed",
    "xss.step.sandbox": "🔐 Prepared to block outgoing requests",
    "xss.step.snapshot": "📊 Recorded the storage before running",
    "xss.step.running": "⚡ Running the script",
    "xss.step.done": "✅ The script finished",
    "xss.analysisHeading": "🛡️ What actually happened",
    "xss.impact.local": "📦 Effect on localStorage",
    "xss.impact.session": "⏳ Effect on sessionStorage",
    "xss.change.added": "➕ Added: {key}",
    "xss.change.modified": "✏️ Changed: {key}",
    "xss.change.removed": "❌ Removed: {key}",
    "xss.threatHeading": "🚨 It tried to send data out",
    "xss.threatBlocked": "Blocked {count} outgoing request(s).",
    "xss.threatWarning": "⚠️ In a real attack, this is how the data leaves.",
    "xss.demoDataAdded": "Added {name} to storage for this demo.",
    "xss.result.alert": "alert said: {content}",
    "xss.result.blocked": "⚠️ It tried to send data out. The request was blocked.",
    "xss.result.written": "✅ Finished. Something was written to storage.",
    "xss.result.value": "Result: {value}",
    "xss.result.empty": "It finished, but there is no value to show.",
    "xss.result.error": "Error: {message}",
    "xss.result.needInput": "Type a script first.",
    "xss.blocked.request": "This demo blocks outgoing requests.",
    "xss.blocked.websocket": "This demo blocks WebSocket connections.",

    "common.close": "Close",
    "common.cancel": "Cancel",
    "common.save": "💾 Save",
    "common.delete": "🗑️ Delete",
    "common.ok": "📋 OK",
    "storage.operationsTitle": "⚙️ Storage controls",
    "test.heading": "🧪 Try it out",
    "test.persistence.title": "Persistence",
    "test.persistence.description": "See how localStorage and sessionStorage differ",
    "test.persistence.message": "Data was written to both storages.\nClose the browser and open it again: only the localStorage entry survives.\nCheck the lists above.",
    "test.origin.title": "Same-origin policy",
    "test.origin.description": "See that another origin cannot read it",
    "test.origin.message": "Under the same-origin policy,\n- https://example.com\n- https://sub.example.com\n- http://example.com\neach has its own separate storage area.\n\nCurrent origin: {origin}",
    "test.quota.title": "Check the size limit",
    "test.quota.description": "Measure how much you can actually store",
    "test.savedAt": "Saved at: {time}",
    "preset.heading": "📦 Sample data",
    "preset.includedKeys": "Keys included: {keys}",
    "preset.confirm": "Load {name} into {storage}Storage?",
    "preset.confirmRisky": "⚠️ This sample contains stand-in secrets and XSS payloads.\nLoad {name} into {storage}Storage?",
    "preset.loaded": "✅ Loaded {name} into {storage}Storage ({count} entries).",
    "preset.auth.name": "🔐 Credentials",
    "preset.auth.description": "Typical authentication data",
    "preset.profile.name": "👤 User settings",
    "preset.profile.description": "Profile and display preferences",
    "preset.shop.name": "🛒 Online shop",
    "preset.shop.description": "Cart and product data",
    "preset.analytics.name": "📊 Analytics",
    "preset.analytics.description": "Tracking and analytics data",
    "preset.risky.name": "⚠️ Risky data",
    "preset.risky.description": "Examples of what not to store",
    "preset.appstate.name": "💻 Application state",
    "preset.appstate.description": "Screen state and saved drafts",
    "preset.xss.name": "💉 XSS payloads",
    "preset.xss.description": "Data for trying out XSS behaviour",
    "preset.perf.name": "🚀 Large data",
    "preset.perf.description": "Data for size and speed checks",
    "presetGroup.common.name": "📝 Everyday data",
    "presetGroup.common.description": "The kind of data most sites store",
    "presetGroup.commerce.name": "🛒 E-commerce",
    "presetGroup.commerce.description": "Data from online shops",
    "presetGroup.security.name": "🔒 Security practice",
    "presetGroup.security.description": "Data for looking at the risks",
    "presetGroup.performance.name": "⚡ Size and speed",
    "presetGroup.performance.description": "Data for size and speed checks",
    "sample.personName": "Taro Yamada",
    "sample.laptop": "Laptop",
    "sample.mouse": "Mouse",
    "sample.draftTitle": "Draft title",
    "sample.draftBody": "Unfinished text...",
    "search.placeholder": "🔍 Search keys and values",
    "search.clearTitle": "Clear the search",
    "search.showing": "Showing {visible} of {total}",
    "filter.all": "All types",
    "filter.string": "String",
    "filter.number": "Number",
    "filter.boolean": "Boolean",
    "filter.email": "Email",
    "list.empty": "(nothing stored)",
    "list.editHint": "Double-click to edit",
    "notify.updated": "{storage}: updated {key}.",
    "notify.cleared": "{storage} was cleared.",
    "notify.renamed": "✅ Renamed {from} to {to} and saved.",
    "notify.saved": "✅ Updated {key}.",
    "notify.deleted": "✅ Deleted {key}.",
    "notify.downloaded": "✅ Downloaded {filename}.",
    "alert.needKey": "Type a key first.",
    "alert.saveFailed": "Could not save: {message}",
    "alert.deleteFailed": "Could not delete: {message}",
    "confirm.clearLocal": "Delete everything in localStorage?",
    "confirm.clearSession": "Delete everything in sessionStorage?",
    "confirm.overwrite": "The key {key} already exists. Overwrite it?",
    "edit.title": "✏️ Edit entry",
    "edit.keyLabel": "Key:",
    "edit.valueLabel": "Value:",
    "edit.keyPlaceholder": "Type a key",
    "edit.valuePlaceholder": "Type a value",
    "edit.size": "Size: {bytes} bytes",
    "delete.title": "🗑️ Confirm deletion",
    "delete.question": "Delete this entry?",
    "delete.storageLabel": "Storage:",
    "delete.warning": "⚠️ This cannot be undone.",
    "delete.execute": "🗑️ Delete it",
    "stats.heading": "📊 How much is stored",
    "stats.itemCount": "{count} entries",
    "export.title": "💾 Export data",
    "export.button": "💾 Export",
    "export.buttonTitle": "Export the data",
    "export.json": "JSON (.json)",
    "export.csv": "CSV (.csv)",
    "export.preview": "Preview:",
    "export.download": "💾 Download",
    "quota.resultTitle": "📊 Size limit measured",
    "quota.capacityLabel": "Available capacity",
    "quota.usageLabel": "Currently used",
    "quota.about": "About {mb}MB",
    "quota.hasData": "📁 There is already data here",
    "quota.noData": "💡 Nothing stored yet",
    "quota.remaining": "About {mb}MB left",
    "quota.errorTitle": "❌ The measurement failed",
    "quota.adviceLabel": "Things to try:",
    "quota.advice1": "Restart the browser",
    "quota.advice2": "Open a private window",
    "quota.advice3": "Close other tabs",
    "quota.tooSmall": "Even 1MB could not be stored.",
    "quota.error": "Something went wrong during the measurement: {message}",

    "alert.keyNotFound": "No such key: {key}"
  }
};

class I18n {
  constructor() {
    // 言語の決め方は、URLの ?lang、保存した設定、ブラウザーの言語の順。
    // 設定はこのツール自身が localStorage へ保存する。
    // 一覧にそのまま出てくるが、それも「localStorageとはこういうもの」という例になる。
    this.storageKey = "localstorage-playground:lang";
    this.language = this.detectLanguage();
  }

  detectLanguage() {
    const fromUrl = new URLSearchParams(location.search).get("lang");
    if (fromUrl === "ja" || fromUrl === "en") return fromUrl;

    const saved = this.readSaved();
    if (saved === "ja" || saved === "en") return saved;

    const browser = (navigator.language || "").toLowerCase();
    return browser.startsWith("ja") ? "ja" : "en";
  }

  // Storageが使えない環境（プライベートウィンドウ、設定で拒否）でも画面を止めない
  readSaved() {
    try {
      return localStorage.getItem(this.storageKey);
    } catch (e) {
      return null;
    }
  }

  writeSaved(language) {
    try {
      localStorage.setItem(this.storageKey, language);
      return true;
    } catch (e) {
      return false;
    }
  }

  t(key, params = {}) {
    const table = MESSAGES[this.language] || MESSAGES.ja;
    let text = Object.prototype.hasOwnProperty.call(table, key) ? table[key] : key;
    for (const [name, value] of Object.entries(params)) {
      text = text.split("{" + name + "}").join(String(value));
    }
    return text;
  }

  // data-i18n の付いた要素を差し替える。
  // data-i18n-attr は「属性名:キー」をカンマで並べる。
  apply(root = document) {
    document.documentElement.lang = this.language;

    for (const el of root.querySelectorAll("[data-i18n]")) {
      el.textContent = this.t(el.dataset.i18n);
    }

    // 辞書の中身だけを入れる。利用者の入力はここへ渡さない
    for (const el of root.querySelectorAll("[data-i18n-html]")) {
      el.innerHTML = this.t(el.dataset.i18nHtml);
    }

    for (const el of root.querySelectorAll("[data-i18n-attr]")) {
      for (const pair of el.dataset.i18nAttr.split(",")) {
        const [attr, key] = pair.split(":").map((part) => part.trim());
        if (attr && key) el.setAttribute(attr, this.t(key));
      }
    }

    const title = document.querySelector("title");
    if (title) title.textContent = this.t("app.title");
  }

  // 言語を切り替える。読み込み直すので、開いていたタブと入力中の文字を持ち越す。
  // window.name はそのタブの中だけに残り、Storageを汚さない。
  setLanguage(language) {
    if (language !== "ja" && language !== "en") return;
    this.writeSaved(language);

    const activeTab = document.querySelector(".tab-button.active");
    const valueOf = (id) => {
      const field = document.getElementById(id);
      return field ? field.value : "";
    };
    const carried = {
      tab: activeTab ? activeTab.dataset.tab : "storage",
      keyInput: valueOf("keyInput"),
      valueInput: valueOf("valueInput"),
      xssInput: valueOf("xssInput")
    };

    try {
      window.name = JSON.stringify({ playground: carried });
    } catch (e) {
      window.name = "";
    }

    const url = new URL(location.href);
    url.searchParams.set("lang", language);
    location.assign(url.toString());
  }

  // 読み込み直したあとに、持ち越した状態を戻す
  restoreCarriedState() {
    let carried = null;
    try {
      const parsed = JSON.parse(window.name || "{}");
      carried = parsed.playground || null;
    } catch (e) {
      carried = null;
    }
    window.name = "";
    if (!carried) return null;

    for (const id of ["keyInput", "valueInput", "xssInput"]) {
      const field = document.getElementById(id);
      if (field && carried[id]) field.value = carried[id];
    }
    return carried.tab || null;
  }
}

window.MESSAGES = MESSAGES;
window.I18n = I18n;
window.i18n = new I18n();
