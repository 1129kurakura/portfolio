# KURA' — Kuranosuke Shiga Portfolio

志賀 蔵之介（Kuranosuke Shiga）のポートフォリオサイト。
HTML / CSS / JavaScript のみで作られており、ビルド不要でそのまま公開できます。

**同じ内容を、読む人に合わせて 3 通りの見せ方に切り替えられます。**

| モード | URL | 想定する読み手 |
|---|---|---|
| ABOUT ME（初期表示） | `/portfolio/` | はじめて訪れた人、友人、大学関係者 |
| COLLABORATE | `/portfolio/?view=collaborate` | 一緒にプロジェクトをやりたい人 |
| CAREER | `/portfolio/?view=career` | 採用担当の方、企業のエンジニア |

URL をそのまま共有すれば、相手はそのモードで開きます。
ブラウザの戻る / 進むにも対応していて、切り替えでページは再読み込みされません。

---

## 1. 内容の変更方法

編集するファイルは 2 つだけです。

| ファイル | 役割 |
|---|---|
| [`js/data.js`](js/data.js) | **事実**（団体名・役職・プロジェクトの中身・連絡先） |
| [`js/copy.js`](js/copy.js) | **見せ方**（モードごとの言い回し、モード専用のセクション） |

この 2 つを分けているのは、**同じプロジェクトを 3 モードで重複管理しないため**です。
プロジェクトの事実は data.js に 1 回だけ書き、
「一般向けにはこう、採用向けにはこう」を copy.js で足します。
両者は `id`（`furatto` や `wings` など）で結びついています。

### プロジェクトを追加する

**① `js/data.js` の `works.items` に事実を書く**

```js
{
  id: "new-project",          // ★ copy.js と結びつけるための名前（半角英数）
  featured: false,            // true にすると ABOUT の代表作に出る
  title: "プロジェクト名",
  subtitle: "どこの活動か",
  year: "2026.Oct - Now",     // "Now"/"現在" を含むと「進行中」扱い
  category: "SERVICE",
  role: "担当",
  summary: "説明文。",
  tags: ["タグ"],
  image: "assets/images/xxx.png",
  links: [{ label: "詳しく見る", href: "https://...", primary: true }],
}
```

**② `js/copy.js` の `projects` に、対象者別の見せ方を足す（任意）**

```js
"new-project": {
  collaborate: {
    stage: "開発中",                    // 進み具合
    goal: "何を実現したいか",
    wanted: ["一緒にできそうなこと"],
  },
  career: {
    overview: "概要",
    problem: "課題",
    myRole: "担当範囲",
    status: "現在の状況",
    stack: ["使った技術"],
    challenges: "", results: "", next: "",   // 空欄は表示されません
  },
},
```

copy.js に何も書かなければ、data.js の `summary` がそのまま使われます。

**③ CAREER のケーススタディに載せたい場合**

`js/copy.js` の `career.selectedIds` に id を足してください。
ここに書いた順に並びます。書かれていないものは EXPERIENCE に短くまとまります。

### 所属団体を追加する

`js/data.js` の `affiliations.items` に `id` 付きで追加し、
必要なら `js/copy.js` の `activities` に一般向け / 採用向けの一言を足します。

### モードごとのセクションを変える

`js/copy.js` の `views.<モード>.sections` が、そのモードに出すセクションと順番です。

```js
about: {
  sections: ["about", "activities", "interests", "works", "journey", "contact"],
},
```

並べ替えると表示順が変わります。使える名前は `js/views.js` の `BUILDERS` にあります。

### 画像を差し替える

1. 画像を `assets/images/` に置く
2. `data.js` の `image:` / `portrait:` にパスを書く

パスが空の場合はプレースホルダが出るので、画像が無くても崩れません。

| 用途 | 推奨サイズ |
|---|---|
| プロフィール写真 | 1200 × 1600（3:4） |
| プロジェクト画像 | 1600 × 1000（16:10） |
| SNS シェア画像 `og.jpg` | 1200 × 630 |

プロフィール写真の切り取り位置は `data.js` の `portraitPosition` で調整できます
（顔が上寄りなら `"center top"`、`"center 15%"` のような % 指定も可）。

### 色・文字サイズを変える

[`css/tokens.css`](css/tokens.css) の変数を書き換えます。

```css
--paper: #f1efea;      /* 明るい面の背景 */
--ink:   #0a0a0a;      /* 暗い面の背景 */
--accent:#ff3d14;      /* アクセント */
--accent-text:#c92f0d; /* 明るい面で小さい文字に使うアクセント */
```

セクションの明暗は、`js/views.js` の各セクションの `surface: "paper" | "ink"` で決まります。
白黒が切り替わる境目には、グラデーションの帯が自動で入ります。

---

## 2. ローカルで確認する

```bash
npx serve -l 4185 /Users/kura/Documents/Coding/kura-portfolio
```

ブラウザで <http://localhost:4185> を開きます。

---

## 3. 更新するとき（ダブルクリックだけ）

Finder で **`サイトを更新.command`** をダブルクリックすると、ターミナルが開いて次の順に進みます。

1. 変更されたファイルを一覧表示
2. `js/` の書き間違いをチェック（**間違いがあれば送信しないので、サイトが壊れません**）
3. 更新メモを入力して Enter
4. GitHub に送信
5. 公開サイトに反映されるまで待ち、反映されたらブラウザで開く

- 初回だけ「"ターミナル"から"書類"フォルダ内のファイルにアクセスしようとしています」と出たら **許可** を押してください
- 公開後に表示が変わらないときは、ブラウザのキャッシュなので **Cmd + Shift + R**

---

## 4. ファイル構成

```
kura-portfolio/
├── index.html           骨組み（ヘッダー・メニュー・本文の入れ物）
├── css/
│   ├── tokens.css       色・文字サイズ・余白・動きの設定値
│   ├── base.css         リセット、出現アニメーションの土台
│   ├── layout.css       ヘッダー、面の切り替え、境目のグラデーション
│   ├── components.css   ローダー / カーソル / メニュー / モード切替 / タグ / ボタン
│   ├── sections.css     最初の画面、セクションの枠、連絡先
│   └── views.css        各セクションの中身
├── js/
│   ├── data.js          ★事実（団体・プロジェクト・連絡先）
│   ├── copy.js          ★見せ方（モード別の言い回しとセクション）
│   ├── parts.js         画面を組み立てる共通部品
│   ├── views.js         3モードの組み立て
│   ├── router.js        モード切り替え（URL・履歴・キーボード）
│   ├── motion.js        スクロール連動の動き
│   ├── ui.js            ローダー・カーソル・メニュー
│   └── main.js          起動処理
├── assets/images/       画像置き場
├── サイトを更新.command   ダブルクリックで公開
└── .nojekyll            GitHub Pages 用
```

---

## 5. 仕様メモ

- 外部ライブラリなし。ビルド工程なし。欧文フォントのみ Google Fonts（Inter Tight / IBM Plex Mono）
- 和文は **Meiryo UI**（Windows 標準）。無い環境では Meiryo → Hiragino Sans（Mac）→ Yu Gothic UI → Noto Sans JP の順で代替
- モード切り替えはタブとして読み上げられ、**矢印キー・Home・End** で操作できます。切り替えは読み上げにも通知されます
- `prefers-reduced-motion` に対応（動きを減らす設定では視差と出現演出を止めます）
- JavaScript が無効でも、`<noscript>` に所属・プロジェクト・連絡先の要点を表示します
- 相対パスのみを使用しているため、GitHub Pages のサブパス（`/portfolio/`）でそのまま動きます
- タップ領域は 44px 以上。320 / 375 / 768 / 1280 / 1440px で横スクロールが出ないことを確認済み
