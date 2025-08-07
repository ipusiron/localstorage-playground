export class LearnSection {
  constructor() {
    this.learnContent = null;
  }

  init() {
    console.log("LearnSection init called");
    this.enhanceLearnSection();
  }

  enhanceLearnSection() {
    const learnSection = document.getElementById("learn");
    console.log("Learn section element:", learnSection);
    
    const additionalContent = document.createElement("div");
    additionalContent.className = "learn-enhanced";
    additionalContent.innerHTML = `
      <h3>🔒 セキュリティベストプラクティス</h3>
      <ul class="best-practices">
        <li>
          <strong>機密情報を保存しない:</strong>
          <span>トークン、パスワード、個人情報はlocalStorageに保存すべきではありません</span>
        </li>
        <li>
          <strong>HttpOnly Cookieの使用:</strong>
          <span>認証トークンはHttpOnly属性付きのCookieで管理しましょう</span>
        </li>
        <li>
          <strong>データの暗号化:</strong>
          <span>やむを得ず保存する場合は、適切に暗号化してください</span>
        </li>
        <li>
          <strong>定期的なクリーンアップ:</strong>
          <span>不要になったデータは速やかに削除しましょう</span>
        </li>
      </ul>

      <h3>📊 ストレージ比較表</h3>
      <table class="storage-comparison">
        <thead>
          <tr>
            <th>特性</th>
            <th>localStorage</th>
            <th>sessionStorage</th>
            <th>Cookie (HttpOnly)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>永続性</td>
            <td>永続的</td>
            <td>タブを閉じるまで</td>
            <td>期限設定可能</td>
          </tr>
          <tr>
            <td>容量</td>
            <td>5-10MB</td>
            <td>5-10MB</td>
            <td>4KB</td>
          </tr>
          <tr>
            <td>JSアクセス</td>
            <td>✅ 可能</td>
            <td>✅ 可能</td>
            <td>❌ 不可</td>
          </tr>
          <tr>
            <td>XSS耐性</td>
            <td>❌ 脆弱</td>
            <td>❌ 脆弱</td>
            <td>✅ 保護</td>
          </tr>
          <tr>
            <td>サーバー送信</td>
            <td>❌ なし</td>
            <td>❌ なし</td>
            <td>✅ 自動</td>
          </tr>
        </tbody>
      </table>
    `;
    
    learnSection.appendChild(additionalContent);
  }
}