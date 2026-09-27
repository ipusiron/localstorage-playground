<!--
---
id: day038
slug: localstorage-playground

title: "LocalStorage Playground"

subtitle_ja: "Webストレージの危険性体験ツール"
subtitle_en: "Interactive Web Storage Security Learning Tool"

description_ja: "localStorage/sessionStorageのセキュリティリスクを実践的に学習できる教育ツール。XSS攻撃のシミュレーション、防御手法の比較、ストレージ操作の体験が可能。"
description_en: "An educational tool for hands-on learning about localStorage/sessionStorage security risks. Features XSS attack simulations, defense technique comparisons, and interactive storage operations."

category_ja:
  - Webセキュリティ
category_en:
  - Web Security

difficulty: 2

tags:
  - XSS
  - localStorage
  - sessionStorage
  - Web Storage API
  - CSP
  - HttpOnly Cookie
  - JavaScript

repo_url: "https://github.com/ipusiron/localstorage-playground"
demo_url: "https://ipusiron.github.io/localstorage-playground/"

hub: true
---
-->

# LocalStorage Playground - Webストレージの危険性の学習・体験ツール

[English](README.en.md) · 日本語

![GitHub Repo stars](https://img.shields.io/github/stars/ipusiron/localstorage-playground?style=social)
![GitHub forks](https://img.shields.io/github/forks/ipusiron/localstorage-playground?style=social)
![GitHub last commit](https://img.shields.io/github/last-commit/ipusiron/localstorage-playground)
![GitHub license](https://img.shields.io/github/license/ipusiron/localstorage-playground)
[![GitHub Pages](https://img.shields.io/badge/demo-GitHub%20Pages-blue?logo=github)](https://ipusiron.github.io/localstorage-playground/)

**Day038 - 生成AIで作るセキュリティツール100**

**LocalStorage Playground** は、`localStorage` と `sessionStorage` に保存したデータが、どこまで守られていて、どこから守られていないのかを、実際に触って確かめるためのツールです。

ブラウザーだけで動きます。サーバーもインストールも要りません。保存したデータは自分のブラウザーの中だけにあり、外へ送られることはありません。

## 🔗 デモページ

👉 **[https://ipusiron.github.io/localstorage-playground/](https://ipusiron.github.io/localstorage-playground/)**

## 📸 スクリーンショット

![ストレージの中身を一覧する画面](assets/screenshot.png)

*保存したデータを、localStorageとsessionStorageに分けて一覧する*

![英語表示の防御デモ](assets/en/screenshot.png)

*英語表示。出力のしかたで結果がどう変わるかを並べて見せる*

## 🎯 何ができるか

### ストレージを触る

- `localStorage` と `sessionStorage` の中身を並べて一覧する
- キーと値を追加する、書き換える、消す
- 片方だけ、または両方をまとめて空にする
- キーと値で絞り込む。型（文字列・JSON・数値・真偽値・URL・メール）でも絞り込める
- いま何バイト使っているかを見る。保存できる上限を実際に測る
- 中身をJSONまたはCSVで書き出す（ファイルはブラウザーの中で作る）
- 学習用のサンプルデータをまとめて読み込む

### XSSで何が取れるかを見る

- 攻撃のシナリオを3つの段階（基本・広く取る・居座る）から選ぶ
- 選んだスクリプトを、通信を遮断した状態で実行する
- 実行の前後でストレージがどう変わったかを並べる
- 外へ送ろうとした回数を数える（実際には送らない）

### 防御が何をしてくれるかを見る

- CSP（Content Security Policy）
- HttpOnly Cookie
- 入力を文字として出力する書き方

それぞれについて、「防御なし」と「防御あり」を並べ、**その防御だけでは足りない点**も添えています。

### 仕組みを読む

- `localStorage`・`sessionStorage`・HttpOnly Cookieの比較表
- 機密情報を置かないほうがよい理由

## 🌐 日本語と英語

画面右上のボタンで切り替えます。言語は次の順で決まります。

1. URLの `?lang=ja` または `?lang=en`
2. 前回選んだ設定（`localstorage-playground:lang` というキーでlocalStorageへ保存される）
3. ブラウザーの言語設定

設定は隠さず、ほかのデータと同じように一覧へ出します。「このツール自身の設定もlocalStorageに置かれている」ことが、そのまま例になるためです。

切り替えるとページを読み込み直しますが、**開いていたタブと入力中の文字はそのまま残ります**。持ち越しには `window.name` を使っており、ストレージの中身は汚しません。

## 🔐 このツール自身の安全性

学習用のツールであっても、そのツール自身に穴があっては話になりません。次のようにしています。

- 利用者の入力（キー・値・検索語）を、**HTMLの文字列へ組み立てない**。表示はすべて `textContent` と `createElement` で行う
- インラインの `onclick` と `style` 属性を使わない
- CSPで `script-src 'unsafe-inline'` と `style-src 'unsafe-inline'` を許可しない
- `connect-src 'none'` と `object-src 'none'` を指定し、外部への通信と埋め込みを止める
- 外部のCDN・フォント・APIを一切読み込まない

`script-src` の `'unsafe-eval'` だけは残しています。XSSデモが入力したスクリプトを `eval` で実行するためです。実行中は `fetch`・`XMLHttpRequest`・`WebSocket`・`Image`・`navigator.sendBeacon` を差し替えて遮断し、終わったら例外が出た場合も含めて必ず元へ戻します。詳しくは [SECURITY.md](SECURITY.md) を参照してください。

## 📛 セキュリティリスク情報

このツールで再現できる攻撃、実際の被害の例、推奨される対策は、別ファイルにまとめています。

👉 **[セキュリティリスクと対策の詳細](SECURITY.md)**

## 🧪 テスト

依存パッケージはありません。Node.js 22以降で動きます。

```bash
npm test
```

33件のテストがあり、次を確かめます。

- 利用者の入力をHTML文字列やイベント属性へ混ぜていないこと
- インラインハンドラー・`style`属性・不要な `'unsafe-inline'`・外部リソース・通信を持ち込んでいないこと
- XSSデモが差し替えた通信APIを必ず元へ戻すこと
- タブ・ダイアログ・ラベル・`button`の`type`・CSP・`lang`の組み立て
- 日本語と英語の辞書のキーが一致し、空の値と差し込みの食い違いがないこと
- 画面の文言をモジュールへ直接書いていないこと

`.github/workflows/test.yml` が、pushとpull requestのたびに同じテストを実行します。

## 📂 ディレクトリー構成

```
localstorage-playground/
├── index.html                # 画面の骨組み。文言は data-i18n で辞書と結ぶ
├── style.css                 # スタイル（狭い画面とダークモードに対応）
├── main.js                   # 起動処理。各モジュールの初期化と言語切り替え
├── modules/
│   ├── i18n.js               # 日英の辞書と、言語の判定・切り替え
│   ├── tabs.js               # タブの切り替えとキーボード操作
│   ├── storage.js            # ストレージの操作（追加・編集・削除・検索）
│   │                         # 容量統計、書き出し、サンプルデータ、動作確認
│   ├── xss.js                # XSSデモ（シナリオ選択・遮断・影響の分析）
│   ├── defense.js            # 防御デモ（CSP・HttpOnly・出力のしかた）
│   └── learn.js              # 学習用の解説と比較表
├── test/
│   ├── foundation.test.js    # 読み込みの形と、安全な表示の土台
│   ├── storage-safety.test.js # 入力の扱いとストレージ監視の作法
│   ├── markup-csp.test.js    # CSP・マークアップ・アクセシビリティ
│   ├── i18n.test.js          # 日英の辞書と文言の集約
│   └── docs.test.js          # READMEとSECURITY.mdの整合
├── .github/workflows/test.yml # pushとpull requestでテストを実行
├── package.json              # node --test を呼ぶだけ。依存なし
├── CLAUDE.md                 # このリポジトリーで作業するときの前提
├── README.md                 # この文書
├── README.en.md              # 英語版
├── SECURITY.md               # セキュリティリスクと対策
├── LICENSE                   # MITライセンス
└── assets/
    ├── screenshot.png        # 日本語画面のスクリーンショット
    └── en/
        └── screenshot.png    # 英語画面のスクリーンショット
```

## ⚙️ 動作環境

- モダンブラウザー（Chrome・Edge・Firefox・Safariの最近の版）
- ビルドは不要。`index.html` をそのまま開いても、ローカルのHTTPサーバー経由でも動く
- テストの実行にはNode.js 22以降が必要（ツール自体の利用には不要）

`file://` で開いた場合も、すべての機能が動くことを確認しています。ただし `file://` ではオリジンの扱いがブラウザーによって異なるため、同一オリジンポリシーの確認はHTTP経由のほうが実態に近くなります。

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) をご覧ください。

## 🛠 このツールについて

本ツールは、「生成AIで作るセキュリティツール100」プロジェクトの一環として開発されました。このプロジェクトでは、AIの支援を活用しながら、セキュリティに関連するさまざまなツールを100日間にわたり制作・公開していく取り組みを行っています。

プロジェクトの詳細や他のツールについては、以下のページをご覧ください。

🔗 [https://akademeia.info/?page_id=42163](https://akademeia.info/?page_id=42163)
