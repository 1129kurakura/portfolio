# KURA' — Kuranosuke Shiga Portfolio

志賀 蔵之介（Kuranosuke Shiga）のポートフォリオサイト。
HTML / CSS / JavaScript のみで作られており、ビルド不要でそのまま公開できます。

参考デザイン：[noth.in](https://www.noth.in/) — 黒×白の巨大タイポグラフィ、
語単位のリビール、ローダーカウンター、横に流れる帯という構成を踏襲しています。

---

## 1. 内容の変更方法

**文章・リンク・画像パスは、すべて [`js/data.js`](js/data.js) の 1 ファイルにまとまっています。**
HTML や CSS を触らずに、ここだけを書き換えれば内容が更新されます。

```js
const SITE_DATA = {
  meta: { ... },          // 名前・年・拠点
  hero: { ... },          // トップの大見出し、下部を流れる帯
  statement: { ... },     // スクロールで浮かび上がる文章
  affiliations: { ... },  // ★所属と役職
  works: { ... },         // ★手がけたプロジェクト
  profile: { ... },       // プロフィール文・肩書一覧・FOCUS
  strip: { ... },         // 流れる大きな文字
  contact: { ... },       // 連絡先（メール・X・Instagram）
  menu: [ ... ],          // メニュー項目
  footer: { ... },        // コピーライト
};
```

### 所属・役職を追加する

`affiliations.items` に 1 つオブジェクトを足すだけです。番号（01, 02 …）と
一覧表は自動で作られます。

```js
{
  org: "団体名",                       // 大きく表示される名前
  orgEn: "English Name",              // 小さく併記される英語名
  roleLabel: "ROLE / 役職",            // 省略可（学域などに変えたいとき）
  role: "代表",                        // ★役職（太字で表示）
  roleEn: "Representative",           // 役職の英語表記
  kind: "学生団体 / STUDENT ORG",      // 種別ラベル
  period: "現在",                      // 期間
  lead: true,                         // true にすると「代表 / LEAD」バッジが付く
  summary: "説明文。",
  tags: ["代表", "企画運営"],
  image: "assets/images/xxx.jpg",     // 空欄可（ホバー時に出る画像）
  link: "https://example.com",        // 空欄可
}
```

### プロジェクト（WORKS）を追加する

`works.items` に追加します。**テンプレートが 3 件入っているので、
書き換えて使ってください。**`data.js` の works の中には、
コピーして貼るための空テンプレートもコメントで用意してあります。

```js
{
  featured: true,                      // true にすると横幅いっぱいの大きな表示
  title: "プロジェクト名",
  subtitle: "一言説明",
  year: "2026",
  category: "WEB / SITE",              // 種別ラベル（自由）
  role: "企画・デザイン・実装",          // ★このプロジェクトでの担当
  summary: "説明文。",
  tags: ["HTML", "CSS", "JavaScript"],
  image: "assets/images/work-01.jpg",  // 空欄可
  links: [                             // ★詳細ページへのリンク（何個でも）
    { label: "詳しく見る", href: "https://...", primary: true },
    { label: "GitHub",   href: "https://..." },
  ],
}
```

- `links` は何個でも足せます。`primary: true` を付けたものが、
  オレンジの枠のボタン風に目立って表示されます
- `links: []` にすればリンク欄ごと消えます
- `featured: true` は 1〜2 件だけにすると、強弱がついて見栄えがします
- `works.items` を空 `[]` にすると、WORKS セクション自体が非表示になります

### 画像を差し替える

1. 画像を `assets/images/` に置く
2. `data.js` の該当する `image:` / `portrait:` にパスを書く（例 `"assets/images/portrait.jpg"`）

パスが空の場合は「NO IMAGE」のプレースホルダが自動表示されるので、
画像が無い状態でも崩れません。

推奨サイズ：
| 用途 | ファイル | 推奨 |
|------|----------|------|
| プロフィール写真 | `portrait.jpg` | 1200 × 1500 (4:5) |
| 所属ホバー画像 | 任意 | 800 × 1000 (4:5) |
| WORKS の画像 | 任意 | 1600 × 1200 (4:3) |
| SNS シェア画像 | `og.jpg` | 1200 × 630 |

### 色・文字サイズを変える

[`css/tokens.css`](css/tokens.css) の CSS 変数を書き換えます。

```css
--paper: #f1efea;   /* 明るい面の背景 */
--ink:   #0a0a0a;   /* 暗い面の背景 */
--accent:#ff3d14;   /* アクセント（代表バッジ・ホバー） */
```

---

## 2. ローカルで確認する

```bash
python3 -m http.server 4185 --directory .
```

ブラウザで <http://localhost:4185> を開きます。
（`index.html` を直接ダブルクリックしても動きますが、サーバー経由を推奨）

---

## 3. GitHub Pages で公開する

```bash
git init
git add .
git commit -m "feat: portfolio site"
git branch -M main
git remote add origin https://github.com/<ユーザー名>/<リポジトリ名>.git
git push -u origin main
```

そのあと GitHub の **Settings → Pages** で

- Source: `Deploy from a branch`
- Branch: `main` / `/ (root)`

を選んで保存すると、`https://<ユーザー名>.github.io/<リポジトリ名>/` で公開されます。

> ユーザーサイト（`https://<ユーザー名>.github.io/`）にしたい場合は、
> リポジトリ名を `<ユーザー名>.github.io` にしてください。

`.nojekyll` を同梱しているので、Jekyll による変換は行われません。

---

## 4. ファイル構成

```
kura-portfolio/
├── index.html          マークアップ（構造のみ。文章は data.js から）
├── css/
│   ├── tokens.css      色・文字サイズ・余白・動きの設定値
│   ├── base.css        リセットと共通タイポグラフィ
│   ├── layout.css      ヘッダー・全体骨格・フッター
│   ├── components.css  ローダー / カーソル / メニュー / 帯 / ボタン
│   └── sections.css    各セクションの見た目
├── js/
│   ├── data.js         ★内容（ここを編集）
│   ├── render.js       data.js を HTML に流し込む
│   ├── motion.js       文字分割・スクロール演出
│   ├── ui.js           ローダー・カーソル・メニュー・ホバー
│   └── main.js         起動処理
├── assets/images/      画像置き場
└── .nojekyll           GitHub Pages 用
```

---

## 5. 仕様メモ

- 外部ライブラリなし（欧文フォントのみ Google Fonts：Inter Tight / IBM Plex Mono）
- 和文は **Meiryo UI**（Windows 標準フォント）を指定。インストールされていない環境では
  Meiryo → Hiragino Sans（Mac）→ Yu Gothic UI → Noto Sans JP の順に自動で代替されます。
  変更するときは `css/tokens.css` の `--font-ja` を書き換えてください
- `prefers-reduced-motion` に対応（動きを減らす設定の端末ではアニメーションを停止）
- キーボード操作対応（Tab でフォーカス、Esc でメニューを閉じる）
- JavaScript 無効時は `<noscript>` に基本情報を表示
- 横スクロールが発生しないことを 320 / 768 / 1440px で確認済み
