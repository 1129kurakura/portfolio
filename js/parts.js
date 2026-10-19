/* ============================================================
   parts.js — 画面を組み立てるための共通部品

   どのモードからも使う「小さな部品」をここにまとめています。
   モードごとの組み立ては js/views.js にあります。
   ============================================================ */

const P = (() => {
  /* ---------------- 基本 ---------------- */
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  };

  const pad = (n) => String(n).padStart(2, "0");

  /** 文字列が中身を持つか（空白だけの項目は「無い」と見なす） */
  const has = (value) => typeof value === "string" && value.trim().length > 0;

  /** 複数の子要素をまとめて追加する */
  const add = (parent, ...children) => {
    children.filter(Boolean).forEach((child) => parent.appendChild(child));
    return parent;
  };

  /* ---------------- 画像 ---------------- */
  const initialsOf = (name = "") => name.trim().slice(0, 2).toUpperCase() || "KS";

  /**
   * 画像を枠に流し込む。src が空ならプレースホルダ表示になる。
   * alt には「何の画像か」を書く（装飾目的なら空文字を渡す）。
   */
  const fillMedia = (node, src, label, options = {}) => {
    if (!node) return;
    if (options.ratio) node.style.setProperty("--ratio", options.ratio);
    node.innerHTML = "";
    if (!has(src)) {
      node.dataset.empty = "true";
      node.dataset.initials = initialsOf(label);
      return;
    }
    const img = el("img");
    img.src = src;
    img.alt = options.alt != null ? options.alt : `${label} のイメージ`;
    img.loading = options.eager ? "eager" : "lazy";
    img.decoding = "async";
    if (options.parallax !== false) img.dataset.parallax = "";
    if (options.position) img.style.objectPosition = options.position;
    node.dataset.empty = "false";
    node.appendChild(img);
  };

  /* ---------------- 小さな部品 ---------------- */
  const tagList = (tags, className = "taglist") => {
    const list = (tags || []).filter(has);
    if (!list.length) return null;
    const wrap = el("ul", className);
    list.forEach((t) => add(wrap, el("li", "tag", t)));
    return wrap;
  };

  /** 外部リンクなら安全に新しいタブで開く */
  const anchor = (href, className) => {
    const a = el("a", className);
    a.href = href;
    a.dataset.cursor = "link";
    if (/^https?:/i.test(href)) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    return a;
  };

  const linkList = (links, className = "linklist") => {
    const list = (links || []).filter((l) => l && has(l.href) && has(l.label));
    if (!list.length) return null;
    const wrap = el("div", className);
    list.forEach((l) => {
      const a = anchor(l.href, l.primary ? "actionlink is-primary" : "actionlink");
      add(a, el("span", null, l.label), el("i", "actionlink__arrow", "↗"));
      wrap.appendChild(a);
    });
    return wrap;
  };

  /** 「ラベル / 値」の定義リスト。値が空の行は出さない。 */
  const factList = (rows, className = "facts") => {
    const list = (rows || []).filter((r) => r && has(r.value));
    if (!list.length) return null;
    const dl = el("dl", className);
    list.forEach((row) => {
      const item = el("div", "facts__row");
      add(item, el("dt", "mono-label", row.label), el("dd", null, row.value));
      dl.appendChild(item);
    });
    return dl;
  };

  /* ---------------- セクションの枠 ---------------- */
  /**
   * 見出し付きのセクションを作り、{ section, body } を返す。
   * body の中に中身を足していく。
   */
  const section = ({ id, number, title, ja, lede, surface = "paper", wide = false }) => {
    const node = el("section", `block surface-${surface}`);
    node.id = id;
    const headingId = `${id}-heading`;
    node.setAttribute("aria-labelledby", headingId);

    const shell = el("div", "shell");
    const head = el("header", "block__head");

    if (number || title) {
      const eyebrow = el("p", "mono-label block__no");
      eyebrow.textContent = number ? `( ${number} )` : "";
      if (number) head.appendChild(eyebrow);
    }

    const heading = el("h2", "block__title rise");
    heading.id = headingId;
    add(heading, el("span", "block__titleen", title));
    if (has(ja)) add(heading, el("span", "block__titleja", ja));
    head.appendChild(heading);

    if (has(lede)) add(head, el("p", "block__lede rise", lede));
    shell.appendChild(head);

    const body = el("div", wide ? "block__body block__body--wide" : "block__body");
    shell.appendChild(body);
    node.appendChild(shell);
    return { section: node, body };
  };

  /* ---------------- プロジェクトの並び替え ---------------- */
  const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const NOW_PATTERN = /now|present|現在|継続/i;

  /** year の先頭の年月を「年×12＋月」にする。読めなければ Infinity（末尾へ） */
  const startKeyOf = (item) => {
    const text = String(item.start || item.year || "");
    const match = text.match(/(\d{4})(?:\s*[.\/\-年]\s*([A-Za-z]{3,}|\d{1,2}))?/);
    if (!match) return Infinity;
    const [, yearText, monthText = ""] = match;
    const named = MONTHS.indexOf(monthText.slice(0, 3).toLowerCase());
    const month = named >= 0 ? named + 1 : Number(monthText) || 0;
    return Number(yearText) * 12 + month;
  };

  /** status があればそれに従い、無ければ year に "Now" / "現在" があるかで判定 */
  const isCurrent = (item) =>
    item.status ? item.status === "current" : NOW_PATTERN.test(String(item.year || ""));

  /** 新しい順に並べる（同じ年月は data.js の並び順） */
  const byNewest = (items) =>
    items
      .map((item, order) => ({ item, order, key: startKeyOf(item) }))
      .sort((a, b) => b.key - a.key || a.order - b.order)
      .map(({ item }) => item);

  /** 古い順に並べる */
  const byOldest = (items) =>
    items
      .map((item, order) => ({ item, order, key: startKeyOf(item) }))
      .sort((a, b) => a.key - b.key || a.order - b.order)
      .map(({ item }) => item);

  /* ---------------- データの取り出し ---------------- */
  const projectCopy = (id, view) => {
    const entry = (SITE_COPY.projects && SITE_COPY.projects[id]) || {};
    return entry[view] || {};
  };

  const activityCopy = (id, view) => {
    const entry = (SITE_COPY.activities && SITE_COPY.activities[id]) || {};
    return entry[view] || "";
  };

  const projects = () => (SITE_DATA.works && SITE_DATA.works.items) || [];
  const activities = () => (SITE_DATA.affiliations && SITE_DATA.affiliations.items) || [];

  /** id の配列から、その順番でプロジェクトを取り出す */
  const projectsByIds = (ids) =>
    (ids || []).map((id) => projects().find((p) => p.id === id)).filter(Boolean);

  return {
    el, pad, has, add, anchor,
    fillMedia, tagList, linkList, factList, section,
    startKeyOf, isCurrent, byNewest, byOldest,
    projectCopy, activityCopy, projects, activities, projectsByIds,
  };
})();
