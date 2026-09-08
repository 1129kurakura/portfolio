/* ============================================================
   data.js — サイトの文章・画像・リンクはすべてこのファイルで管理します
   ここだけを書き換えれば、HTML / CSS を触らずに内容を更新できます。
   画像は assets/images/ に置き、そのパスを image: に書いてください。
   image を "" （空）にすると、自動生成のプレースホルダが表示されます。
   ============================================================ */

const SITE_DATA = {
  /* ---------- 基本情報 ---------- */
  meta: {
    brand: "KURA",          // ロゴ表記（末尾の ' は自動で付きます）
    nameEn: "Kuranosuke Shiga",
    nameJa: "志賀 蔵之介",
    year: "2026",
    location: "Chofu, Tokyo",
  },

  /* ---------- ヒーロー（最初の大見出し） ---------- */
  hero: {
    eyebrow: "PORTFOLIO — STUDENT / ORGANIZER / ENGINEER",
    // 1要素 = 1行。各行は単語ごとにアニメーションします。
    lines: ["Hello. I am", "Kuranosuke", "Shiga."],
    meta: [
      { label: "NAME", value: "志賀 蔵之介 / Kuranosuke Shiga" },
      { label: "SCHOOL", value: "電気通信大学 情報理工学域 Ⅱ類（融合系）" },
      { label: "BASED IN", value: "東京・調布 / Tokyo, Japan" },
    ],
    // 画面下を流れる帯
    ticker: [
      "U.E.C.wings 28代 代表",
      "駆動班 班長",
      "学生団体 u&me 代表",
      "UEC Fencers Club 代表",
      "ICES",
      "Crushers アナライジングスタッフ",
    ],
  },

  /* ---------- ステートメント（スクロールで文字が浮かぶ段落） ---------- */
  statement: {
    text: "I lead teams, build systems, and connect people. Between engineering and community, I look for the shape of an idea.",
    ja: "つくることと、人をつなぐこと。electro-communications の学生として、技術と組織の両方から「かたち」をつくっています。",
  },

  /* ---------- 所属・役職 ---------- */
  affiliations: {
    lede: "現在所属している組織と、そこで担っている役職です。代表・班長として運営に関わるものから、スタッフとして支えるものまで。",
    items: [
      {
        org: "電気通信大学",
        orgEn: "The University of Electro-Communications",
        roleLabel: "FIELD / 学域",   // 役職欄の見出し（省略時は "ROLE / 役職"）
        role: "情報理工学域 Ⅱ類（融合系）",
        roleEn: "School of Informatics and Engineering, Cluster II (Interdisciplinary)",
        kind: "在学 / EDUCATION",
        period: "在学中",
        lead: false, // true にすると「代表」バッジが付きます
        summary:
          "国立大学法人 電気通信大学の情報理工学域 Ⅱ類（融合系）に所属。情報学と工学を横断する領域で学んでいます。",
        tags: ["情報理工学域", "Ⅱ類（融合系）", "国立大学法人"],
        image: "",            // 例: "assets/images/uec.jpg"
        link: "https://www.uec.ac.jp/",
      },
      {
        org: "U.E.C.wings",
        orgEn: "UEC Festival Executive Committee",
        role: "28代 代表 兼 駆動班 班長",
        roleEn: "28th Representative & Head of the Drive Division",
        kind: "学園祭実行委員会 / COMMITTEE",
        period: "28代",
        lead: true,
        summary:
          "電気通信大学の学園祭実行委員会 U.E.C.wings の28代代表。組織全体の意思決定を担いながら、駆動班の班長として現場の運営を指揮しています。",
        tags: ["代表", "班長", "学園祭運営", "マネジメント"],
        image: "",
        link: "",
      },
      {
        org: "u&me",
        orgEn: "Student Organization u&me",
        role: "代表",
        roleEn: "Representative",
        kind: "学生団体 / STUDENT ORG",
        period: "現在",
        lead: true,
        summary:
          "学生団体 u&me の代表。企画の立ち上げから運営までを主導しています。",
        tags: ["代表", "学生団体", "企画運営"],
        image: "",
        link: "",
      },
      {
        org: "UEC Fencers Club",
        orgEn: "UEC Fencers Club",
        role: "代表",
        roleEn: "Representative",
        kind: "サークル / CLUB",
        period: "現在",
        lead: true,
        summary:
          "電気通信大学フェンシングサークルの代表。活動運営とメンバーのとりまとめを担当しています。",
        tags: ["代表", "フェンシング", "サークル運営"],
        image: "",
        link: "",
      },
      {
        org: "ICES",
        orgEn: "International Cultural Exchange Society",
        role: "メンバー",
        roleEn: "Member",
        kind: "留学生国際交流会サークル / CIRCLE",
        period: "現在",
        lead: false,
        summary:
          "留学生国際交流会サークル ICES に所属。留学生と日本人学生をつなぐ交流企画に参加しています。",
        tags: ["国際交流", "留学生支援"],
        image: "",
        link: "",
      },
      {
        org: "Crushers",
        orgEn: "UEC American Football Club",
        role: "アナライジングスタッフ",
        roleEn: "Analyzing Staff",
        kind: "アメリカンフットボール部 / SPORTS",
        period: "現在",
        lead: false,
        summary:
          "アメリカンフットボール部 Crushers のアナライジングスタッフ。試合・練習のデータ分析でチームを支えています。",
        tags: ["データ分析", "アメフト", "スタッフ"],
        image: "",
        link: "",
      },
    ],
  },

  /* ------------------------------------------------------------------
     WORKS（手がけたプロジェクト）

     ★ 以下の 3 件は「テンプレート」です。内容を書き換えて使ってください。
       不要な項目は "" （空文字）や [] （空配列）にすれば非表示になります。
       items から丸ごと消せば、その分だけ表示が減ります。

     各項目の意味：
       featured : true にすると 1 件で横幅いっぱいの大きな表示になる
       title    : プロジェクト名（大きく表示）
       subtitle : 一言説明（タイトルの下）
       year     : 年・時期
       category : 種別ラベル（WEB / EVENT / TOOL など自由）
       role     : そのプロジェクトでの自分の役割
       summary  : 説明文（3〜4行程度が目安）
       tags     : 使った技術やキーワード
       image    : assets/images/ に置いた画像パス（空ならプレースホルダ）
       links    : 詳細ページなどへのリンク（何個でも追加可・0個でもOK）
                  { label: "表示名", href: "URL", primary: true }
                  primary: true を付けたものが目立つボタン風になります
     ------------------------------------------------------------------ */
  works: {
    lede: "企画・開発・運営として関わったプロジェクトです。詳しい内容は各リンクから見られます。",
    items: [
      {
        featured: true,
        title: "Project Title 01",
        subtitle: "ここにプロジェクトの一言説明を書きます",
        year: "2026",
        category: "WEB / SITE",
        role: "企画・デザイン・実装",
        summary:
          "プロジェクトの概要をここに書きます。何を課題として、どう考えて、何をつくったのか。関わった人数や期間、担当範囲を書いておくと伝わりやすくなります。",
        tags: ["HTML", "CSS", "JavaScript"],
        image: "",                       // 例: "assets/images/work-01.jpg"
        links: [
          { label: "詳しく見る", href: "https://example.com", primary: true },
          { label: "GitHub", href: "https://github.com/" },
        ],
      },
      {
        featured: false,
        title: "Project Title 02",
        subtitle: "ここにプロジェクトの一言説明を書きます",
        year: "2025",
        category: "EVENT",
        role: "運営統括",
        summary:
          "イベントや企画の場合は、規模（来場者数・参加団体数など）と自分の担当を書くと具体的になります。",
        tags: ["企画運営", "チーム管理"],
        image: "",
        links: [{ label: "詳しく見る", href: "https://example.com", primary: true }],
      },
      {
        featured: false,
        title: "Project Title 03",
        subtitle: "リンクが無いプロジェクトの例",
        year: "2025",
        category: "TOOL",
        role: "開発",
        summary:
          "リンクや画像が無くてもレイアウトは崩れません。links を [] にすると、リンク欄そのものが消えます。",
        tags: ["Python", "データ分析"],
        image: "",
        links: [],
      },

      /* ↓ 新しく追加するときは、この形をコピーして使ってください
      {
        featured: false,
        title: "",
        subtitle: "",
        year: "",
        category: "",
        role: "",
        summary: "",
        tags: [],
        image: "",
        links: [{ label: "詳しく見る", href: "", primary: true }],
      },
      */
    ],
  },

  /* ---------- プロフィール ---------- */
  profile: {
    heading: "志賀 蔵之介 —\nKuranosuke Shiga",
    portrait: "assets/images/profile.png",                       // 例: "assets/images/portrait.jpg"
    portraitCaption: "PORTRAIT / 2026",
    paragraphs: [
      "国立大学法人 電気通信大学 情報理工学域 Ⅱ類（融合系）に在籍。情報と工学の境界にある領域を学びながら、学内では複数の団体で運営に携わっています。",
      "学園祭実行委員会 U.E.C.wings では28代代表 兼 駆動班班長、学生団体 u&me と UEC Fencers Club では代表を務めています。加えて ICES での国際交流、アメリカンフットボール部 Crushers でのデータ分析にも取り組んでいます。",
    ],
    spec: [
      { label: "所属", value: "電気通信大学 情報理工学域 Ⅱ類（融合系）" },
      { label: "役職", value: "U.E.C.wings 28代代表 / 駆動班班長" },
      { label: "役職", value: "学生団体 u&me 代表" },
      { label: "役職", value: "UEC Fencers Club 代表" },
      { label: "活動", value: "ICES / Crushers アナライジングスタッフ" },
    ],
    focus: {
      title: "FOCUS",
      items: [
        { no: "01", name: "Organization", desc: "団体運営・チームマネジメント・意思決定" },
        { no: "02", name: "Engineering", desc: "情報理工学域での学び、ソフトウェア制作" },
        { no: "03", name: "Community", desc: "国際交流、人と人をつなぐ場づくり" },
        { no: "04", name: "Analysis", desc: "スポーツのデータ分析とフィードバック" },
      ],
    },
  },

  /* ---------- 画面を流れる帯（グリッチ部分） ---------- */
  strip: { a: "KURA'", b: "志賀 蔵之介" },

  /* ---------- コンタクト ---------- */
  contact: {
    lines: ["Let's start", "something."],
    actions: [
      { label: "DROP ME AN EMAIL", value: "kuranosukeshiga1129@gmail.com", href: "mailto:kuranosukeshiga1129@gmail.com" },
    ],
    socials: [
      { label: "EMAIL", handle: "kuranosukeshiga1129@gmail.com", href: "mailto:kuranosukeshiga1129@gmail.com" },
      { label: "X (TWITTER)", handle: "@kuranosukeshiga", href: "https://x.com/kuranosukeshiga" },
      { label: "INSTAGRAM", handle: "@kuranosukeshiga", href: "https://www.instagram.com/kuranosukeshiga/" },
    ],
  },

  /* ---------- メニュー ---------- */
  menu: [
    { label: "HOME", href: "#top", no: "00" },
    { label: "STATEMENT", href: "#statement", no: "01" },
    { label: "AFFILIATIONS", href: "#affiliations", no: "02" },
    { label: "WORKS", href: "#works", no: "03" },
    { label: "PROFILE", href: "#profile", no: "04" },
    { label: "CONTACT", href: "#contact", no: "05" },
  ],

  /* ---------- フッター ---------- */
  footer: {
    copy: "©2026 KURANOSUKE SHIGA",
    note: "DESIGNED & BUILT IN TOKYO",
  },
};
