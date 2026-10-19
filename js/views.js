/* ============================================================
   views.js — 3つの閲覧モードを組み立てる

   ABOUT ME / COLLABORATE / CAREER
   どのモードも、同じデータ（data.js）と同じ部品（parts.js）を使い、
   「何を、どの順で、どの深さで見せるか」だけを変えています。
   ============================================================ */

const V = (() => {
  const { el, add, has, pad } = P;

  /* ================= 共通パーツ ================= */

  /** 最初の画面。モードごとに言葉だけが変わる。 */
  const hero = (viewId) => {
    const cfg = SITE_COPY.views[viewId];
    const node = el("section", "hero surface-paper");
    node.id = "top";
    node.setAttribute("aria-labelledby", "hero-heading");

    const inner = el("div", "shell hero__inner");
    add(inner, el("p", "mono-label hero__eyebrow rise", cfg.hero.eyebrow));

    const title = el("h1", "hero__title");
    title.id = "hero-heading";
    title.dataset.split = "words";
    cfg.hero.lines.forEach((line) => add(title, el("span", "line", line)));
    inner.appendChild(title);

    if (has(cfg.hero.lead)) add(inner, el("p", "hero__lead rise", cfg.hero.lead));

    if (viewId === "about") {
      const dl = el("dl", "hero__meta rise");
      SITE_DATA.hero.meta.forEach((row) => {
        const wrap = el("div");
        add(wrap, el("dt", "mono-label", row.label), el("dd", null, row.value));
        dl.appendChild(wrap);
      });
      inner.appendChild(dl);
    }

    node.appendChild(inner);

    const foot = el("div", "shell hero__foot");
    const cue = P.anchor(`#${cfg.sections[0]}`, "scroll-cue");
    add(cue, el("span", "mono-label", "SCROLL"), el("span", "scroll-cue__line"));
    add(foot, cue, el("p", "mono-label hero__year", `${SITE_DATA.meta.year} — ${SITE_DATA.meta.location}`));
    node.appendChild(foot);

    if (viewId === "about") {
      const ticker = el("div", "ticker");
      ticker.setAttribute("aria-hidden", "true");
      const track = el("div", "ticker__track");
      const once = SITE_DATA.hero.ticker;
      [...once, ...once].forEach((t) => add(track, el("span", null, t)));
      add(ticker, track);
      node.appendChild(ticker);
    }
    return node;
  };

  /** 連絡先。モードごとに前置きの文だけ変える。 */
  const contact = (viewId, number) => {
    const c = SITE_DATA.contact;
    const connect = SITE_COPY.collaborate.connect;
    const isCollab = viewId === "collaborate";
    const { section, body } = P.section({
      id: "contact",
      number,
      title: isCollab ? connect.title : "CONTACT",
      ja: isCollab ? connect.ja : "連絡先",
      lede: isCollab ? connect.lede : "気軽にご連絡ください。メールと SNS のどちらでも届きます。",
      surface: "ink",
    });

    const lines = el("p", "contact__title rise");
    lines.textContent = c.lines.join(" ");
    body.appendChild(lines);

    const actions = el("div", "contact__actions rise");
    c.actions.forEach((a) => {
      const link = P.anchor(a.href, "btn");
      link.textContent = a.label;
      actions.appendChild(link);
    });
    body.appendChild(actions);

    const links = el("ul", "contact__links");
    c.socials.forEach((s) => {
      const li = el("li");
      const a = P.anchor(s.href, "contact__link");
      add(a, el("span", "mono-label", s.label), el("b", null, s.handle));
      add(li, a);
      links.appendChild(li);
    });
    body.appendChild(links);
    return section;
  };

  /** 団体の一覧。表示する一言を view で切り替える。 */
  const activityRows = (viewId, items) => {
    const list = el("ol", "actlist");
    items.forEach((item, i) => {
      const li = el("li", "actlist__row rise");
      li.style.setProperty("--d", `${Math.min(i, 5) * 40}ms`);

      add(li, el("p", "actlist__no mono-label", pad(i + 1)));

      const main = el("div", "actlist__main");
      const nameRow = el("div", "actlist__namerow");
      add(nameRow, el("h3", "actlist__org", item.org));
      if (item.lead) add(nameRow, el("span", "badge", "代表 / LEAD"));
      add(main, nameRow);
      add(main, el("p", "actlist__role", item.role));
      const note = P.activityCopy(item.id, viewId) || item.summary;
      if (has(note)) add(main, el("p", "actlist__note", note));
      add(li, main);

      const meta = el("div", "actlist__meta");
      add(meta, el("p", "mono-label", item.kind));
      if (has(item.link)) {
        const a = P.anchor(item.link, "actionlink");
        add(a, el("span", null, "VISIT"), el("i", "actionlink__arrow", "↗"));
        meta.appendChild(a);
      }
      add(li, meta);
      list.appendChild(li);
    });
    return list;
  };

  /** プロジェクトのカード。深さを level で変える。 */
  const projectCard = (item, { level = "brief", index = 0 } = {}) => {
    const card = el("article", "pcard rise");
    card.dataset.level = level;
    card.style.setProperty("--d", `${Math.min(index, 3) * 50}ms`);

    const figure = el("figure", "pcard__figure");
    const media = el("div", "media pcard__media");
    P.fillMedia(media, item.image, item.title, { alt: `${item.title}（${item.subtitle}）` });
    add(figure, media);
    add(card, figure);

    const bodyEl = el("div", "pcard__body");
    const head = el("div", "pcard__head");
    add(head, el("span", "mono-label", item.subtitle), el("span", "mono-label", item.year));
    add(bodyEl, head);
    add(bodyEl, el("h3", "pcard__title", item.title));

    const collab = P.projectCopy(item.id, "collaborate");
    if (level === "active" && has(collab.stage)) {
      add(bodyEl, el("p", "pcard__stage", collab.stage));
    }

    const lead = level === "active" && has(collab.goal) ? collab.goal : item.summary;
    if (has(lead)) add(bodyEl, el("p", "pcard__text", lead));

    if (level === "active" && (collab.wanted || []).length) {
      const wrap = el("div", "pcard__wanted");
      add(wrap, el("p", "mono-label", "一緒にできそうなこと"));
      add(wrap, P.tagList(collab.wanted));
      add(bodyEl, wrap);
    } else if (level !== "compact") {
      add(bodyEl, P.tagList(item.tags));
    }

    add(bodyEl, P.linkList(item.links));
    add(card, bodyEl);
    return card;
  };

  /* ================= ABOUT ME ================= */

  const aboutIntro = (number) => {
    const p = SITE_DATA.profile;
    const { section, body } = P.section({
      id: "about",
      number,
      title: "ABOUT",
      ja: "自己紹介",
      surface: "paper",
      wide: true,
    });

    const grid = el("div", "intro");
    const figure = el("figure", "intro__media rise");
    const media = el("div", "media");
    P.fillMedia(media, p.portrait, SITE_DATA.meta.nameJa, {
      alt: `${SITE_DATA.meta.nameJa} のポートレート`,
      position: p.portraitPosition,
      parallax: false,
    });
    add(figure, media, el("figcaption", "mono-label", p.portraitCaption));
    add(grid, figure);

    const text = el("div", "intro__text");
    add(text, el("h3", "intro__name", p.heading));
    p.paragraphs.forEach((para) => add(text, el("p", "rise", para)));
    add(grid, text);

    body.appendChild(grid);
    return section;
  };

  const aboutActivities = (number) => {
    const { section, body } = P.section({
      id: "activities",
      number,
      title: "ACTIVITIES",
      ja: "いま所属していること",
      lede: SITE_DATA.affiliations.lede,
      surface: "paper",
      wide: true,
    });
    body.appendChild(activityRows("about", P.activities()));
    return section;
  };

  const interests = (number) => {
    const cfg = SITE_COPY.about.interests;
    const { section, body } = P.section({
      id: "interests",
      number,
      title: cfg.title,
      ja: cfg.ja,
      lede: cfg.lede,
      surface: "ink",
      wide: true,
    });

    const groups = [...new Set(cfg.items.map((i) => i.group))];
    const wrap = el("div", "interests");
    groups.forEach((group) => {
      const col = el("section", "interests__group rise");
      add(col, el("h3", "interests__grouptitle", group));
      const ul = el("ul", "interests__list");
      cfg.items
        .filter((i) => i.group === group)
        .forEach((i) => {
          const li = el("li", "interests__item");
          add(li, el("b", null, i.name));
          if (has(i.note)) add(li, el("span", null, i.note));
          ul.appendChild(li);
        });
      add(col, ul);
      wrap.appendChild(col);
    });
    body.appendChild(wrap);
    return section;
  };

  const featuredWorks = (number) => {
    const all = P.byNewest(P.projects());
    const featured = all.filter((p) => p.featured);
    const rest = all.filter((p) => !p.featured);

    const { section, body } = P.section({
      id: "works",
      number,
      title: "WORKS",
      ja: "手がけたもの",
      lede: SITE_DATA.works.lede,
      surface: "ink",
      wide: true,
    });

    const grid = el("div", "pgrid");
    featured.forEach((item, i) => grid.appendChild(projectCard(item, { index: i })));
    body.appendChild(grid);

    if (rest.length) {
      // 最初は代表作だけを見せ、必要な人だけが続きを開ける（段階的な開示）
      const more = el("details", "more");
      const summary = el("summary", "more__toggle");
      summary.dataset.cursor = "link";
      add(summary, el("span", null, `ほかのプロジェクトも見る（${rest.length}件）`), el("i", "more__sign", "＋"));
      add(more, summary);
      const moreGrid = el("div", "pgrid more__body");
      rest.forEach((item, i) => moreGrid.appendChild(projectCard(item, { index: i })));
      add(more, moreGrid);
      body.appendChild(more);
    }
    return section;
  };

  const journey = (number) => {
    const cfg = SITE_COPY.about.journey;
    const { section, body } = P.section({
      id: "journey",
      number,
      title: cfg.title,
      ja: cfg.ja,
      lede: cfg.lede,
      surface: "paper",
      wide: true,
    });
    const ol = el("ol", "timeline");
    cfg.items.forEach((item, i) => {
      const li = el("li", "timeline__item rise");
      li.style.setProperty("--d", `${Math.min(i, 5) * 40}ms`);
      add(li, el("p", "timeline__when mono-label", item.when));
      const main = el("div", "timeline__main");
      add(main, el("h3", "timeline__title", item.title));
      if (has(item.note)) add(main, el("p", "timeline__note", item.note));
      add(li, main);
      ol.appendChild(li);
    });
    body.appendChild(ol);
    return section;
  };

  /* ================= COLLABORATE ================= */

  /** 「名前＋補足」の並び。COLLABORATE と CAREER で使い回す。 */
  const noteGrid = (items, className = "notegrid") => {
    const wrap = el("ul", className);
    items.forEach((item, i) => {
      const li = el("li", "notecard rise");
      li.style.setProperty("--d", `${Math.min(i, 4) * 45}ms`);
      add(li, el("h3", "notecard__name", item.name));
      if (has(item.note)) add(li, el("p", "notecard__note", item.note));
      if (has(item.where)) add(li, el("p", "notecard__where", item.where));
      wrap.appendChild(li);
    });
    return wrap;
  };

  const simpleBlock = (id, number, cfg, surface, className) => {
    const { section, body } = P.section({
      id,
      number,
      title: cfg.title,
      ja: cfg.ja,
      lede: cfg.lede,
      surface,
      wide: true,
    });
    body.appendChild(noteGrid(cfg.items, className));
    return section;
  };

  const activeProjects = (number) => {
    const items = P.byNewest(P.projects().filter(P.isCurrent));
    const { section, body } = P.section({
      id: "active",
      number,
      title: "ACTIVE PROJECTS",
      ja: "いま動いているもの",
      lede: "進行中のプロジェクトです。段階と、一緒にできそうなことを添えています。",
      surface: "ink",
      wide: true,
    });
    const grid = el("div", "pgrid");
    items.forEach((item, i) => grid.appendChild(projectCard(item, { level: "active", index: i })));
    body.appendChild(grid);
    return section;
  };

  const previousWork = (number) => {
    const items = P.byNewest(P.projects().filter((p) => !P.isCurrent(p)));
    const { section, body } = P.section({
      id: "previous",
      number,
      title: "PREVIOUS",
      ja: "これまでの活動",
      lede: "完了した活動です。",
      surface: "paper",
      wide: true,
    });
    const ol = el("ol", "minilist");
    items.forEach((item, i) => {
      const li = el("li", "minilist__row rise");
      li.style.setProperty("--d", `${Math.min(i, 4) * 40}ms`);
      const main = el("div");
      add(main, el("h3", "minilist__title", item.title));
      add(main, el("p", "minilist__note", item.summary));
      add(li, main);
      add(li, el("p", "mono-label minilist__when", item.year));
      ol.appendChild(li);
    });
    body.appendChild(ol);
    return section;
  };

  /* ================= CAREER ================= */

  const careerSummary = (number) => {
    const cfg = SITE_COPY.career.summary;
    const { section, body } = P.section({
      id: "summary",
      number,
      title: cfg.title,
      ja: cfg.ja,
      surface: "paper",
      wide: true,
    });
    body.appendChild(noteGrid(cfg.points, "notegrid notegrid--2"));
    return section;
  };

  /** 企業向けのケーススタディ。詳細は折りたたみで出す。 */
  const caseStudy = (item, index) => {
    const c = P.projectCopy(item.id, "career");
    const article = el("article", "case rise");
    article.style.setProperty("--d", `${Math.min(index, 3) * 50}ms`);

    // 成果物が分かるように、小さめの図版を添える
    if (has(item.image)) {
      const figure = el("figure", "case__figure");
      const media = el("div", "media case__media");
      P.fillMedia(media, item.image, item.title, { alt: `${item.title} の画面` });
      add(figure, media);
      add(article, figure);
    }

    const head = el("div", "case__head");
    add(head, el("span", "mono-label", `${item.subtitle} — ${item.year}`));
    add(head, el("h3", "case__title", item.title));
    if (has(c.overview)) add(head, el("p", "case__overview", c.overview));
    add(article, head);

    const facts = P.factList([
      { label: "MY ROLE / 担当", value: c.myRole },
      { label: "STATUS / 状況", value: c.status },
      { label: "PROBLEM / 課題", value: c.problem },
    ]);
    if (facts) add(article, facts);

    if ((c.stack || []).length) {
      const stack = el("div", "case__stack");
      add(stack, el("p", "mono-label", "STACK / 技術"));
      add(stack, P.tagList(c.stack));
      add(article, stack);
    }

    const extra = P.factList([
      { label: "CHALLENGES / 難しかった点", value: c.challenges },
      { label: "RESULTS / 結果", value: c.results },
      { label: "NEXT / 次の一手", value: c.next },
    ]);
    if (extra) {
      const details = el("details", "more more--case");
      const summary = el("summary", "more__toggle");
      summary.dataset.cursor = "link";
      add(summary, el("span", null, "詳細を見る"), el("i", "more__sign", "＋"));
      add(details, summary, extra);
      add(article, details);
    }

    add(article, P.linkList(item.links));
    return article;
  };

  /** ケーススタディに出すプロジェクト（copy.js の selectedIds 順） */
  const selectedItems = () => {
    const ids = SITE_COPY.career.selectedIds || [];
    const picked = P.projectsByIds(ids);
    if (picked.length) return picked;
    return P.byNewest(P.projects()).filter((p) => has(P.projectCopy(p.id, "career").overview));
  };

  const selectedProjects = (number) => {
    const items = selectedItems();
    const { section, body } = P.section({
      id: "selected",
      number,
      title: "SELECTED PROJECTS",
      ja: "主なプロジェクト",
      lede: "担当範囲・使用技術・現在の状況です。",
      surface: "ink",
      wide: true,
    });
    const list = el("div", "caselist");
    items.forEach((item, i) => list.appendChild(caseStudy(item, i)));
    body.appendChild(list);
    return section;
  };

  const skills = (number) => {
    const cfg = SITE_COPY.career.skills;
    const { section, body } = P.section({
      id: "skills",
      number,
      title: cfg.title,
      ja: cfg.ja,
      lede: cfg.lede,
      surface: "paper",
      wide: true,
    });

    cfg.groups.forEach((group) => {
      const wrap = el("section", "skillgroup rise");
      add(wrap, el("h3", "skillgroup__name", group.name));
      if (has(group.note)) add(wrap, el("p", "skillgroup__note", group.note));
      const ul = el("ul", "skilllist");
      group.items.forEach((s) => {
        const li = el("li", "skilllist__item");
        add(li, el("b", null, s.name));
        if (has(s.where)) add(li, el("span", null, s.where));
        ul.appendChild(li);
      });
      add(wrap, ul);
      body.appendChild(wrap);
    });

    if (cfg.academic && (cfg.academic.items || []).length) {
      const wrap = el("section", "skillgroup rise");
      add(wrap, el("h3", "skillgroup__name", cfg.academic.name));
      add(wrap, P.tagList(cfg.academic.items));
      body.appendChild(wrap);
    }
    return section;
  };

  /** ケーススタディに入らない活動（大会など）を、結果中心で短くまとめる */
  const experience = (number) => {
    const cfg = SITE_COPY.career.experience;
    const chosen = new Set((SITE_COPY.career.selectedIds || []).map(String));
    const items = P.byNewest(P.projects()).filter((p) => !chosen.has(p.id));
    const { section, body } = P.section({
      id: "experience",
      number,
      title: cfg.title,
      ja: cfg.ja,
      lede: cfg.lede,
      surface: "paper",
      wide: true,
    });
    const ol = el("ol", "minilist");
    items.forEach((item, i) => {
      const c = P.projectCopy(item.id, "career");
      const li = el("li", "minilist__row rise");
      li.style.setProperty("--d", `${Math.min(i, 4) * 40}ms`);
      const main = el("div");
      add(main, el("h3", "minilist__title", item.title));
      const note = has(c.results) ? `${c.overview || item.summary}（${c.results}）` : c.overview || item.summary;
      add(main, el("p", "minilist__note", note));
      add(li, main);
      add(li, el("p", "mono-label minilist__when", item.year));
      ol.appendChild(li);
    });
    body.appendChild(ol);
    return section;
  };

  const leadership = (number) => {
    const { section, body } = P.section({
      id: "leadership",
      number,
      title: "LEADERSHIP & ACTIVITIES",
      ja: "組織での役割",
      lede: "所属団体での役割と、担当している取り組みです。",
      surface: "ink",
      wide: true,
    });
    body.appendChild(activityRows("career", P.activities()));
    return section;
  };

  /* ================= モードの組み立て ================= */

  const BUILDERS = {
    about: aboutIntro,
    activities: aboutActivities,
    interests: (n, view) =>
      view === "career"
        ? simpleBlock("interests", n, SITE_COPY.career.interests, "paper", "notegrid")
        : interests(n),
    works: featuredWorks,
    journey,
    build: (n) => simpleBlock("build", n, SITE_COPY.collaborate.build, "paper", "notegrid"),
    active: activeProjects,
    looking: (n) => simpleBlock("looking", n, SITE_COPY.collaborate.looking, "paper", "notegrid"),
    howiwork: (n) => simpleBlock("howiwork", n, SITE_COPY.collaborate.howIWork, "ink", "notegrid"),
    previous: previousWork,
    summary: careerSummary,
    selected: selectedProjects,
    skills,
    leadership,
    experience,
    contact,
  };

  /** 白い面と黒い面が切り替わる境目に、グラデーションの帯を付ける */
  const applySeams = (frag) => {
    let prev = null;
    [...frag.children].forEach((node) => {
      const surface = node.classList.contains("surface-ink") ? "ink" : "paper";
      if (prev && prev !== surface) {
        node.dataset.seam = prev === "paper" ? "from-paper" : "from-ink";
      }
      prev = surface;
    });
  };

  /** 指定モードの本文をまとめて組み立てる */
  const build = (viewId) => {
    const cfg = SITE_COPY.views[viewId];
    const frag = document.createDocumentFragment();
    frag.appendChild(hero(viewId));
    cfg.sections.forEach((name, i) => {
      const builder = BUILDERS[name];
      if (!builder) return;
      frag.appendChild(builder(pad(i + 1), viewId));
    });
    applySeams(frag);
    return frag;
  };

  /** メニューに出す、そのモードのセクション一覧 */
  const navItems = (viewId) => {
    const cfg = SITE_COPY.views[viewId];
    return [{ label: "TOP", href: "#top", no: "00" }].concat(
      cfg.sections.map((name, i) => {
        const node = document.getElementById(name);
        const title = node && node.querySelector(".block__titleen");
        return { label: title ? title.textContent : name.toUpperCase(), href: `#${name}`, no: pad(i + 1) };
      })
    );
  };

  return { build, navItems };
})();
