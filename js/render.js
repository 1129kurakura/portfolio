const R = (() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  };
  const initialsOf = (name = "") =>
    name.trim().slice(0, 2).toUpperCase() || "KS";
  const fillMedia = (node, src, label, ratio) => {
    if (!node) return;
    if (ratio) node.style.setProperty("--ratio", ratio);
    node.innerHTML = "";
    if (src) {
      const img = el("img");
      img.src = src;
      img.alt = label || "";
      img.loading = "lazy";
      img.decoding = "async";
      img.dataset.parallax = ""; // スクロール視差の対象にする
      node.dataset.empty = "false";
      node.appendChild(img);
      return;
    }
    node.dataset.empty = "true";
    node.dataset.initials = initialsOf(label);
  };
  const setLines = (node, lines) => {
    if (!node) return;
    node.innerHTML = "";
    lines.forEach((text) => node.appendChild(el("span", "line", text)));
  };
  /* ---------------- HERO ---------------- */
  const hero = (d) => {
    $("#heroEyebrow").textContent = d.hero.eyebrow;
    setLines($("#hero-heading"), d.hero.lines);

    const meta = $("#heroMeta");
    meta.innerHTML = "";
    const dl = el("dl", "hero__meta rise");
    d.hero.meta.forEach((row) => {
      const wrap = el("div");
      wrap.appendChild(el("dt", null, row.label));
      wrap.appendChild(el("dd", null, row.value));
      dl.appendChild(wrap);
    });
    meta.replaceWith(dl);
    dl.id = "heroMeta";
    $("#heroYear").textContent = `${d.meta.year} — ${d.meta.location}`;
    const ticker = $("#heroTicker");
    const once = d.hero.ticker;
    [...once, ...once].forEach((t) => ticker.appendChild(el("span", null, t)));
  };
  /* ---------------- STATEMENT ---------------- */
  const statement = (d) => {
    setLines($("#statement-heading"), [d.statement.text]);
    $("#statementJa").textContent = d.statement.ja;
  };
  /* ---------------- AFFILIATIONS ---------------- */
  /** 1 団体 = 1 行。所属・役職・種別をこの 1 か所にだけ書く */
  const affilRow = (item, i) => {
    const li = el("li", "affil__row rise");
    li.style.setProperty("--d", `${Math.min(i, 6) * 70}ms`);
    li.dataset.image = item.image || "";
    li.appendChild(el("p", "affil__no mono-label", pad(i + 1)));
    const org = el("div", "affil__orgcell");
    org.appendChild(el("h3", "affil__orgname", item.org));
    if (item.orgEn) org.appendChild(el("p", "affil__orgen mono-label", item.orgEn));
    li.appendChild(org);
    const role = el("div", "affil__rolecell");
    if (item.roleLabel) role.appendChild(el("p", "affil__rolelabel mono-label", item.roleLabel));
    const top = el("div", "affil__roletop");
    top.appendChild(el("p", "affil__rolename", item.role));
    if (item.lead) top.appendChild(el("span", "badge", "代表 / LEAD"));
    role.appendChild(top);
    if (item.roleEn) role.appendChild(el("p", "affil__roleen mono-label", item.roleEn));
    if (item.summary) role.appendChild(el("p", "affil__summary", item.summary));
    if (item.tags && item.tags.length) {
      const tags = el("div", "affil__tags");
      item.tags.forEach((t) => tags.appendChild(el("span", "tag", t)));
      role.appendChild(tags);
    }
    li.appendChild(role);
    const meta = el("div", "affil__metacell");
    if (item.kind) meta.appendChild(el("p", "mono-label", item.kind));
    if (item.period) meta.appendChild(el("p", "mono-label", item.period));
    if (item.link) {
      const a = el("a", "affil__link mono-label");
      a.href = item.link;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.dataset.cursor = "link";
      a.appendChild(el("span", null, "VISIT"));
      a.appendChild(el("i", "work__arrow", "↗"));
      meta.appendChild(a);
    }
    li.appendChild(meta);
    return li;
  };
  const affiliations = (d) => {
    const items = (d.affiliations && d.affiliations.items) || [];
    $("#affilLede").textContent = (d.affiliations && d.affiliations.lede) || "";
    $("#affilCount").textContent = `${pad(items.length)} ORGANIZATIONS`;
    const list = $("#affilList");
    items.forEach((item, i) => list.appendChild(affilRow(item, i)));
  };
  /* ---------------- WORKS ---------------- */
  const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const NOW_PATTERN = /now|present|現在|継続/i;
  const WORK_GROUP_DEFAULTS = {
    current: { label: "NOW", ja: "現在取り組んでいること" },
    past: { label: "ARCHIVE", ja: "これまでの活動" },
  };
  const pad = (n) => String(n).padStart(2, "0");
  /** year の先頭の年月を「年×12＋月」にする。読めなければ Infinity（グループの末尾へ） */
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
  /** 現在／過去に分け、それぞれ古い順に。同じ年月は data.js に書いた順 */
  const groupWorks = (items) => {
    const sorted = items
      .map((item, order) => ({ item, order, key: startKeyOf(item) }))
      .sort((a, b) => a.key - b.key || a.order - b.order)
      .map(({ item }) => item);
    return {
      current: sorted.filter(isCurrent),
      past: sorted.filter((item) => !isCurrent(item)),
    };
  };
  const workLinks = (item) => {
    const links = (item.links || []).filter((l) => l && l.href && l.label);
    if (!links.length) return null;
    const wrap = el("div", "work__links");
    links.forEach((l) => {
      const a = el("a", l.primary ? "work__link is-primary" : "work__link");
      a.href = l.href;
      a.dataset.cursor = "link";
      if (l.href.startsWith("http")) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
      a.appendChild(el("span", null, l.label));
      a.appendChild(el("i", "work__arrow", "↗"));
      wrap.appendChild(a);
    });
    return wrap;
  };
  const workCard = (item, index) => {
    const li = el("li", "work rise");
    li.style.setProperty("--d", `${Math.min(index, 3) * 90}ms`);
    li.dataset.featured = String(Boolean(item.featured));
    const figure = el("figure", "work__figure");
    const media = el("div", "media work__media");
    fillMedia(media, item.image, item.title); // 比率は CSS 側で決める
    figure.appendChild(media);
    li.appendChild(figure);
    const body = el("div", "work__body");
    const head = el("div", "work__head");
    head.appendChild(el("span", "mono-label", `( ${pad(index + 1)} )`));
    const facts = [item.category, item.year].filter(Boolean).join(" — ");
    head.appendChild(el("span", "mono-label", facts));
    body.appendChild(head);
    body.appendChild(el("h4", "work__title", item.title));
    if (item.subtitle) body.appendChild(el("p", "work__sub", item.subtitle));
    if (item.role) {
      const role = el("p", "work__role");
      role.appendChild(el("span", "mono-label", "ROLE / 担当"));
      role.appendChild(el("span", "work__rolevalue", item.role));
      body.appendChild(role);
    }
    if (item.summary) body.appendChild(el("p", "work__summary", item.summary));
    if (item.tags && item.tags.length) {
      const tags = el("div", "work__tags");
      item.tags.forEach((t) => tags.appendChild(el("span", "tag", t)));
      body.appendChild(tags);
    }
    const links = workLinks(item);
    if (links) body.appendChild(links);
    li.appendChild(body);
    return li;
  };
  const workGroup = (key, labels, items) => {
    const group = el("section", `works__group works__group--${key}`);
    const headingId = `works-${key}`;
    group.setAttribute("aria-labelledby", headingId);
    const head = el("header", "works__grouphead");
    const title = el("h3", "works__grouptitle");
    title.id = headingId;
    title.appendChild(el("span", "works__groupen", labels.label));
    title.appendChild(el("span", "works__groupja", labels.ja));
    head.appendChild(title);
    const unit = items.length === 1 ? "PROJECT" : "PROJECTS";
    head.appendChild(el("p", "mono-label works__groupcount", `${pad(items.length)} ${unit}`));
    group.appendChild(head);
    const list = el("ol", "works__grid");
    items.forEach((item, i) => list.appendChild(workCard(item, i)));
    group.appendChild(list);
    return group;
  };
  const works = (d) => {
    if (!d.works) return;
    const items = d.works.items || [];
    const section = document.getElementById("works");
    if (!items.length) {
      if (section) section.hidden = true;
      return;
    }
    $("#worksLede").textContent = d.works.lede || "";
    $("#worksCount").textContent = `${pad(items.length)} PROJECTS`;
    const groups = groupWorks(items);
    const labels = { ...WORK_GROUP_DEFAULTS, ...(d.works.groups || {}) };
    const wrap = $("#worksGroups");
    ["current", "past"].forEach((key) => {
      if (!groups[key].length) return;
      wrap.appendChild(workGroup(key, labels[key], groups[key]));
    });
  };
  /* ---------------- PROFILE ---------------- */
  const profile = (d) => {
    const p = d.profile;
    $("#profile-heading").textContent = p.heading;
    $("#portraitCaption").textContent = p.portraitCaption;
    fillMedia($("#portrait"), p.portrait, d.meta.nameJa, "4 / 5");
    const text = $("#profileText");
    p.paragraphs.forEach((para) => text.appendChild(el("p", "rise", para)));
    const focus = $("#focusBlock");
    focus.appendChild(el("p", "mono-label focus__title", p.focus.title));
    const grid = el("div", "focus__grid");
    p.focus.items.forEach((f) => {
      const cell = el("div", "focus__cell");
      cell.appendChild(el("span", "mono-label", f.no));
      cell.appendChild(el("b", null, f.name));
      cell.appendChild(el("p", null, f.desc));
      grid.appendChild(cell);
    });
    focus.appendChild(grid);
  };
  /* ---------------- STRIP ---------------- */
  const strip = (d) => {
    const build = (node, word, times) => {
      for (let i = 0; i < times; i += 1) node.appendChild(el("span", null, word));
    };
    build($("#stripA"), d.strip.a, 12);
    build($("#stripB"), d.strip.b, 12);
  };
  /* ---------------- CONTACT / MENU / FOOTER ---------------- */
  const contact = (d) => {
    setLines($("#contact-heading"), d.contact.lines);
    const actions = $("#contactActions");
    d.contact.actions.forEach((a) => {
      const btn = el("a", "btn rise", a.label);
      btn.href = a.href;
      btn.dataset.cursor = "link";
      actions.appendChild(btn);
    });
    const links = $("#contactLinks");
    d.contact.socials.forEach((s) => {
      const a = el("a", "contact__link");
      a.href = s.href;
      a.dataset.cursor = "link";
      if (s.href.startsWith("http")) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
      a.appendChild(el("span", "mono-label", s.label));
      a.appendChild(el("b", null, s.handle));
      links.appendChild(a);
    });
  };
  const menu = (d) => {
    const list = $("#menuList");
    d.menu.forEach((m) => {
      const a = el("a", "menu__link");
      a.href = m.href;
      a.dataset.cursor = "link";
      a.appendChild(el("span", null, `( ${m.no} )`));
      a.appendChild(document.createTextNode(m.label));
      list.appendChild(a);
    });
    const socials = $("#menuSocials");
    d.contact.socials.forEach((s) => {
      const a = el("a", null, s.label);
      a.href = s.href;
      a.dataset.cursor = "link";
      if (s.href.startsWith("http")) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
      socials.appendChild(a);
    });
  };
  const footer = (d) => {
    $("#footCopy").textContent = d.footer.copy;
    $("#footNote").textContent = d.footer.note;
    document.querySelectorAll(".brand__word").forEach((n) => {
      n.textContent = d.meta.brand;
    });
    $(".loader__word").textContent = d.meta.brand;
  };
  const all = (d) => {
    hero(d);
    statement(d);
    affiliations(d);
    works(d);
    profile(d);
    strip(d);
    contact(d);
    menu(d);
    footer(d);
  };
  return { all, fillMedia };
})();
