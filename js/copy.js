/* ============================================================
   copy.js — 「誰に向けて、どう見せるか」を管理するファイル

   ・事実（団体名・役職・プロジェクトの中身）は js/data.js
   ・対象者ごとの言い回しや、モード専用のセクションはこのファイル

   同じプロジェクトを 3 モードで重複管理しないため、
   data.js の id（furatto / wings など）で紐づけています。

   ★ ここの文章は、既存サイトに書かれていた内容だけを元に構成しています。
     本人の言葉に書き換えて問題ありません。
     空欄（""）や空配列（[]）の項目は、画面に表示されません。
     埋めると自動的に表示されます。
   ============================================================ */

const SITE_COPY = {
  /* ---------------- 閲覧モードの定義 ---------------- */
  views: {
    about: {
      label: "ABOUT ME",
      ja: "活動・興味・人物像",
      navNote: "はじめての方へ",
      docTitle: "KURA' | 志賀 蔵之介のポートフォリオ",
      hero: {
        eyebrow: "PORTFOLIO — STUDENT / ORGANIZER / ENGINEER",
        lines: ["Hello. I am", "Kuranosuke", "Shiga."],
        lead:
          "興味を持ったことに飛び込んで、そこで見つけた課題を、技術と人の両方から解いていく。電気通信大学の学生として、複数の団体の運営とものづくりを並行しています。",
      },
      sections: ["about", "activities", "interests", "works", "journey", "contact"],
    },

    collaborate: {
      label: "COLLABORATE",
      ja: "仲間・プロジェクト",
      navNote: "一緒につくりたい方へ",
      docTitle: "COLLABORATE — KURA' | 志賀 蔵之介",
      hero: {
        eyebrow: "FOR MAKERS — 一緒に考え、つくり、試す",
        lines: ["Let's build", "something", "together."],
        lead:
          "企画から開発・運営まで、学生団体の事業として形にしてきました。いま動いているプロジェクトと、これから挑戦したいことを並べています。興味が近い方は気軽に声をかけてください。",
      },
      sections: ["build", "active", "looking", "howiwork", "previous", "contact"],
    },

    career: {
      label: "CAREER",
      ja: "技術・実績・採用",
      navNote: "採用担当の方へ",
      docTitle: "CAREER — KURA' | 志賀 蔵之介",
      hero: {
        eyebrow: "FOR RECRUITERS — 技術 / 役割 / 実績",
        lines: ["Kuranosuke", "Shiga."],
        lead:
          "電気通信大学 情報理工学域 Ⅱ類（融合系）在学。複数の学生団体で代表・PDM として企画から開発・運営までを担当し、Web・3D・生成AI を使ったプロダクト開発に取り組んでいます。",
      },
      sections: ["summary", "selected", "skills", "leadership", "experience", "interests", "contact"],
    },
  },

  /* ---------------- ABOUT ME モード専用 ---------------- */
  about: {
    interests: {
      title: "INTERESTS",
      ja: "関心のある領域",
      lede:
        "「つくること」と「人をつなぐこと」が中心にあり、そこから技術・運営・スポーツへ広がっています。",
      // group は関心の系統。同じ group のものが近くに並びます。
      items: [
        { name: "ソフトウェア / Web 開発", group: "つくる", note: "サービスの企画から実装まで" },
        { name: "3D・シミュレーション", group: "つくる", note: "Unity / Blender を使った再現と体験" },
        { name: "生成AI の活用", group: "つくる", note: "設計作業を自動化する道具として" },
        { name: "情報セキュリティ", group: "学ぶ", note: "情報理工学域での専門領域のひとつ" },
        { name: "計測・制御 / ロボティクス", group: "学ぶ", note: "融合系で横断的に学んでいる分野" },
        { name: "チーム運営・意思決定", group: "つなぐ", note: "代表・班長としての組織づくり" },
        { name: "国際交流", group: "つなぐ", note: "留学生と日本人学生をつなぐ企画" },
        { name: "スポーツのデータ分析", group: "つなぐ", note: "アメフトの試合・練習データ" },
      ],
    },

    journey: {
      title: "JOURNEY",
      ja: "2026年のあゆみ",
      lede: "主な経歴を時系列で並べています。",
      // 確認できる事実のみ。追加するときは出典のある出来事だけにしてください。
      items: [
        { when: "2026.04", title: "電気通信大学 入学", note: "情報理工学域 Ⅱ類（融合系）" },
        { when: "2026.05", title: "ゆめリス 始動", note: "学生団体 u&me の事業として企画・開発・運営" },
        { when: "2026.07", title: "鳥人間コンテスト2026", note: "U.E.C.wings 駆動班として参加。テストフライトに成功" },
        { when: "2026.08", title: "全国公フェンシング大会2026", note: "UEC Fencers Club 主将として男子フルーレ団体に出場、ベスト16" },
        { when: "2026.09", title: "U.E.C.wings 28代代表に", note: "公式サイトのリニューアル、機体の3D化・飛行シミュレーターの開発を開始" },
        { when: "2026.09", title: "ふらっと / SAKIMO / 都市3Dマップ 始動", note: "u&me・kindchord の事業として並行して企画・開発" },
      ],
    },
  },

  /* ---------------- COLLABORATE モード専用 ---------------- */
  collaborate: {
    build: {
      title: "WHAT I WANT TO BUILD",
      ja: "つくりたいもの",
      lede: "いま関心があり、これから形にしていきたい方向です。",
      items: [
        {
          name: "生活の「ちょっとした壁」を外すサービス",
          note: "おでかけの壁をなくす「ふらっと」、大切な人を見守る「SAKIMO」のように、日常の困りごとから出発したプロダクト。",
        },
        {
          name: "体験できる 3D・シミュレーション",
          note: "機体の3D化やフライトシミュレーターのように、理解や体験を助ける道具をつくること。",
        },
        {
          name: "生成AI を設計作業に組み込む",
          note: "三面図から3Dモデルを起こす試みの精度を上げ、ものづくりの前段を速くすること。",
        },
      ],
    },

    looking: {
      title: "LOOKING FOR",
      ja: "一緒に取り組めそうな領域",
      lede:
        "高い専門性が前提ではありません。興味が重なるところがあれば、一緒に調べながら進められればと思っています。",
      items: [
        { name: "Web / アプリ開発", note: "フロントエンド、サービスの実装" },
        { name: "3D / Unity / Blender", note: "モデリング、シミュレーション、展示用の体験づくり" },
        { name: "AI・データ活用", note: "生成AIの活用、データ分析" },
        { name: "UI / UX デザイン", note: "使いやすさ、見せ方の設計" },
        { name: "企画・事業づくり", note: "課題の整理、コンペへの挑戦" },
      ],
    },

    howIWork: {
      title: "HOW I WORK",
      ja: "進めかた",
      lede: "これまでのプロジェクトで実際にとってきた進め方です。",
      items: [
        { name: "まず動くものをつくる", note: "構想で止めず、プロトタイプや実証に向けた準備まで進める。" },
        { name: "役割をまたいで関わる", note: "企画・開発・運営を切り分けず、必要なところに入る。" },
        { name: "現場で確かめる", note: "テストフライトや大会など、実際の場で試して次につなげる。" },
        { name: "使ってもらう形まで持っていく", note: "公式サイトや展示のように、人が触れる状態にして届ける。" },
      ],
    },

    connect: {
      title: "LET'S CONNECT",
      ja: "声をかけてください",
      lede:
        "プロジェクトの相談でも、「こういうことをやってみたい」という話でも歓迎です。メールか SNS のどちらでも届きます。",
    },
  },

  /* ---------------- CAREER モード専用 ---------------- */
  career: {
    summary: {
      title: "SUMMARY",
      ja: "概要",
      // 事実と行動のみで構成しています。
      points: [
        {
          name: "複数の組織で代表・責任者を務める",
          note:
            "鳥人間サークル U.E.C.wings 28代代表 兼 駆動班班長、学生団体 u&me 代表、UEC Fencers Club 代表（創設メンバー）、kindchord では PDM。",
        },
        {
          name: "企画から開発・運営までを一貫して担当",
          note:
            "「ふらっと」「ゆめリス」「都市3Dマップ」「SAKIMO」では、事業の立ち上げから開発・運営までを統括。",
        },
        {
          name: "技術を課題解決の手段として使う",
          note:
            "設計のイメージ共有に生成AIと3D化、体験展示に Unity、組織の情報発信に Web。目的に合わせて技術を選んでいます。",
        },
        {
          name: "運用中のサイトの改善と保守",
          note:
            "U.E.C.wings 公式サイトのリニューアルでは、表現の刷新に加えて複数の脆弱性に対応しました。",
        },
      ],
    },

    // ケーススタディとして詳しく見せるプロジェクト（この順で並びます）。
    // ここに無いものは EXPERIENCE に短くまとめて出ます。
    selectedIds: ["furatto", "sakimo", "tri-view-3d", "flight-sim", "wings-hp", "city3d", "yumelist"],

    experience: {
      title: "EXPERIENCE",
      ja: "大会・実績",
      lede: "主な大会実績です",
    },

    skills: {
      title: "TECHNICAL SKILLS",
      ja: "技術",
      lede:
        "このサイトに掲載しているプロジェクトで、実際に使った技術のみを挙げています。各項目に、使った場面を併記しています。",
      groups: [
        {
          name: "プロジェクトで実装",
          note: "成果物として形にしたもの",
          items: [
            { name: "HTML / CSS / JavaScript", where: "本ポートフォリオ、U.E.C.wings 公式サイトのリニューアル" },
            { name: "Unity", where: "人力飛行機のフライトシミュレーター（3D空間・飛行挙動の再現）" },
            { name: "Blender", where: "機体三面図を自動で3D再現するシミュレーター（モデル生成）" },
            { name: "生成AI の活用", where: "三面図から3Dモデルを自動生成するパイプライン" },
            { name: "PLATEAU（3D都市モデル）", where: "都市3Dマップ（開発中）" },
          ],
        },
        {
          name: "取り組み中",
          note: "現在進めている、または精度向上に挑戦しているもの",
          items: [
            { name: "生成AI の精度改善", where: "三面図の3D化で、より忠実な再現を目指して調整中" },
            { name: "Web セキュリティ", where: "U.E.C.wings 公式サイトでの脆弱性対応" },
            { name: "データ分析", where: "CRUSHERS での試合・練習データの分析" },
          ],
        },
      ],
      // 大学で学んでいる領域（専攻の分野であり、実務経験とは区別しています）
      academic: {
        name: "大学で学んでいる領域",
        items: ["セキュリティ情報学", "情報通信工学", "電子情報学", "計測・制御システム", "先端ロボティクス"],
      },
    },

    interests: {
      title: "CAREER INTERESTS",
      ja: "関心のある領域",
      lede: "現時点で関心を持っている方向です。特定の企業に限定したものではありません。",
      items: [
        { name: "プロダクト開発", note: "課題の定義から実装・運用まで関わる仕事" },
        { name: "ソフトウェアエンジニアリング", note: "Web を中心としたサービス開発" },
        { name: "3D・シミュレーション応用", note: "設計支援や体験型コンテンツへの活用" },
        { name: "情報セキュリティ", note: "大学での専攻分野と、運用サイトでの対応経験から" },
        { name: "データ分析", note: "スポーツ分析で取り組んでいる領域の延長として" },
      ],
    },
  },

  /* ---------------- プロジェクトごとの、対象者別の見せ方 ----------------
     data.js の works.items の id と対応します。
     collaborate: 一緒に取り組む人向け（段階・目指すこと・歓迎する関わり方）
     career:      採用担当者向けのケーススタディ
     空欄の項目は表示されません。埋めると自動で表示されます。
  ------------------------------------------------------------------- */
  projects: {
    furatto: {
      collaborate: {
        stage: "実証準備中",
        goal: "おでかけのときに感じる「ちょっとした壁」をなくすサービスとして形にすること。",
        wanted: ["フロントエンド開発", "UI/UX デザイン", "ユーザー調査"],
      },
      career: {
        overview: "学生団体 u&me の事業。「あなたのおでかけの壁を ふらっと に。」をコンセプトに企画・開発・運営を統括。",
        problem: "おでかけの際に生じる心理的・情報的な障壁。",
        myRole: "最高責任者として、企画の立ち上げから開発・運営までを統括。",
        status: "実証段階に向けて準備中。",
        stack: [],
        challenges: "",
        results: "",
        next: "",
      },
    },

    sakimo: {
      collaborate: {
        stage: "実証準備中",
        goal: "大切な人をさりげなく見守れる仕組みをつくること。",
        wanted: ["サービス設計", "アプリ開発"],
      },
      career: {
        overview: "学生団体 kindchord の事業。「あなたの大切な人を、見守る。」をコンセプトとする見守りサービス。",
        problem: "離れて暮らす家族などを見守る手段の不足。",
        myRole: "PDM として企画・開発・運営を統括。",
        status: "実証段階に向けて準備中。",
        stack: [],
        challenges: "",
        results: "",
        next: "",
      },
    },

    city3d: {
      collaborate: {
        stage: "開発中",
        goal: "PLATEAU のデータを使って、街を3Dで見られるようにすること。",
        wanted: ["3D / WebGL", "地理空間データ"],
      },
      career: {
        overview: "学生団体 u&me の事業として、国土交通省の3D都市モデル PLATEAU を利用した都市3Dマップを開発。",
        problem: "",
        myRole: "最高責任者として企画・開発・運営を担当。",
        status: "開発段階。",
        stack: ["PLATEAU（3D都市モデル）"],
        challenges: "",
        results: "",
        next: "",
      },
    },

    yumelist: {
      collaborate: {
        stage: "実証準備中",
        goal: "u&melist を実際に使ってもらえる状態まで持っていくこと。",
        wanted: [],
      },
      career: {
        overview: "学生団体 u&me の事業「u&melist」の企画・開発・運営を統括。",
        problem: "",
        myRole: "最高責任者。",
        status: "実証段階に向けて準備中。",
        stack: [],
        challenges: "",
        results: "",
        next: "",
      },
    },

    "wings-hp": {
      collaborate: {
        stage: "公開済み",
        goal: "サークルの活動を外に伝わる形にすること。",
        wanted: [],
      },
      career: {
        overview:
          "鳥人間サークル U.E.C.wings の公式サイトを、代替わりに合わせてリニューアル。機体の3Dモデルが離陸するアニメーションをスクロールに連動させるなど、動きのある構成にした。",
        problem: "代替わりに伴うサイトの刷新と、既存サイトの脆弱性。",
        myRole: "開発を担当。",
        status: "公開・運用中。",
        stack: ["HTML / CSS / JavaScript", "3Dモデル"],
        challenges: "複数の脆弱性への対応を行い、セキュリティ面を改善した。",
        results: "",
        next: "",
      },
    },

    "flight-sim": {
      collaborate: {
        stage: "開発中",
        goal: "新歓やオープンキャンパスで、人力飛行機の飛行を体験してもらえる展示にすること。",
        wanted: ["Unity", "物理シミュレーション", "展示の企画"],
      },
      career: {
        overview:
          "体験型の展示を目的に、三面図から起こした機体の3Dデータを使った人力飛行機のフライトシミュレーターを開発。Unity で構築した3D空間で飛行挙動を再現した。",
        problem: "人力飛行機の飛行を、実機なしで体験・理解できる手段がない。",
        myRole: "開発を担当。",
        status: "開発済み。展示・研究への活用はこれから。",
        stack: ["Unity", "3Dモデル"],
        challenges: "",
        results: "",
        next: "新歓・オープンキャンパスでの展示、初歩的な飛行シミュレーションの研究への活用を予定。",
      },
    },

    "tri-view-3d": {
      collaborate: {
        stage: "開発中（精度改善に挑戦中）",
        goal: "三面図から、設計の完成形をすぐイメージできるようにすること。",
        wanted: ["生成AI", "Blender / 3D"],
      },
      career: {
        overview:
          "設計時に完成形をイメージしやすくすることを目的に、生成AIで機体三面図から Blender の3Dモデルを自動生成し、ブラウザ上で確認できるシミュレーターを開発。",
        problem: "三面図だけでは、設計の完成形をチーム内で共有しづらい。",
        myRole: "開発を担当。",
        status: "動作する状態まで実装済み。精度の改善を継続中。",
        stack: ["生成AI", "Blender", "ブラウザでの3D表示"],
        challenges: "生成AIの出力精度。より忠実な再現を目指して調整を継続している。",
        results: "",
        next: "精度を高め、飛行シミュレーターの基礎データとして活用する。",
      },
    },

    "birdman-2026": {
      collaborate: { stage: "完了", goal: "", wanted: [] },
      career: {
        overview:
          "琵琶湖で開催される鳥人間コンテストに向け、U.E.C.wings の駆動班として1km以上の飛行を目指して機体製作に参加。",
        problem: "",
        myRole: "駆動班として駆動部に関わる。",
        status: "完了。本戦出場は叶わなかったが、テストフライトに成功し、現地で本戦の視察を実施。",
        stack: [],
        challenges: "",
        results: "テストフライト成功。",
        next: "",
      },
    },

    "fencing-2026": {
      collaborate: { stage: "完了", goal: "", wanted: [] },
      career: {
        overview:
          "全国公フェンシング大会2026（東京大学駒場キャンパス）に、UEC Fencers Club として男子フルーレ団体で出場。",
        problem: "",
        myRole: "主将として出場。",
        status: "完了。",
        stack: [],
        challenges: "",
        results: "ベスト16（準優勝校の山形大学に敗退）。",
        next: "",
      },
    },
  },

  /* ---------------- 団体ごとの、対象者別の一言 ----------------
     data.js の affiliations.items の id と対応します。
     about:       一般の方向け（その活動が自分にとってどういう意味か）
     career:      採用担当者向け（役割と取り組み）
     空欄なら data.js の summary がそのまま使われます。
  ------------------------------------------------------------- */
  activities: {
    uec: {
      about: "情報と工学の境界にある融合系で、セキュリティから制御・ロボティクスまで横断して学んでいます。",
      career: "情報理工学域 Ⅱ類（融合系）。2026年4月入学。",
    },
    wings: {
      about: "ものづくりの中心。機体の駆動部をつくりながら、28代の代表として組織全体も見ています。",
      career:
        "28代代表 兼 駆動班班長。駆動部の設計・製作に加え、公式サイトのリニューアルと脆弱性対応、機体の3D化・飛行シミュレーターの開発を担当。",
    },
    uandme: {
      about: "「こうだったらいいのに」を事業の形にする場所。複数のサービスを並行して進めています。",
      career:
        "代表。「ふらっと」「ゆめリス」「都市3Dマップ」の企画・開発・運営を統括し、コンペにも参加。",
    },
    fencers: {
      about: "創設メンバーとして立ち上げた同好会。選手として大会にも出ています。",
      career: "代表・創設メンバー。2027年の学友会公認を目標に運営中。主将として全国公大会でベスト16。",
    },
    kindchord: {
      about: "見守りサービス「SAKIMO」に取り組んでいる学生団体です。",
      career: "PDM として見守りサービス「SAKIMO」の企画・開発・運営を担当。",
    },
    ices: {
      about: "留学生と日本人学生が自然に混ざる場をつくる活動。人をつなぐ側の経験になっています。",
      career: "国際交流イベントの企画・運営を担当。",
    },
    crushers: {
      about: "プレーする側ではなく、データでチームを支える関わり方をしています。",
      career: "アナライジングスタッフとして、試合・練習のデータ分析を担当。",
    },
  },
};
