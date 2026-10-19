/* ============================================================
   router.js — 閲覧モードの切り替え

   ・URL の ?view=collaborate / ?view=career で直接開ける
   ・ブラウザの戻る / 進むに対応
   ・ページの再読み込みは起こさない
   ・初回訪問は必ず ABOUT ME（保存した選択で上書きしない）
   ・タブとして読み上げられ、矢印キーでも切り替えられる
   ============================================================ */

const Router = (() => {
  const VIEWS = ["about", "collaborate", "career"];
  const DEFAULT_VIEW = "about";
  const PARAM = "view";

  let current = null;
  const tabs = new Map(); // viewId -> [button, ...]

  /** URL から現在のモードを読む。未指定・不正な値は ABOUT ME。 */
  const viewFromUrl = () => {
    const value = new URLSearchParams(window.location.search).get(PARAM);
    return VIEWS.includes(value) ? value : DEFAULT_VIEW;
  };

  /** モードに対応する URL を作る（GitHub Pages のサブパスでもそのまま動く） */
  const urlFor = (viewId) => {
    const url = new URL(window.location.href);
    url.hash = "";
    if (viewId === DEFAULT_VIEW) url.searchParams.delete(PARAM);
    else url.searchParams.set(PARAM, viewId);
    return url.pathname + url.search;
  };

  /* ---------------- 切り替えボタン ---------------- */
  const buildSwitch = (container) => {
    if (!container) return;
    container.innerHTML = "";
    VIEWS.forEach((viewId) => {
      const cfg = SITE_COPY.views[viewId];
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "switch__btn";
      btn.id = `tab-${viewId}-${container.id}`;
      btn.dataset.view = viewId;
      btn.dataset.cursor = "link";
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-controls", "viewRoot");
      btn.setAttribute("aria-selected", "false");
      btn.tabIndex = -1;

      const label = document.createElement("span");
      label.className = "switch__label";
      label.textContent = cfg.label;
      const note = document.createElement("span");
      note.className = "switch__note";
      note.textContent = cfg.ja;
      btn.append(label, note);

      btn.addEventListener("click", () => go(viewId));
      btn.addEventListener("keydown", onTabKey);
      container.appendChild(btn);

      if (!tabs.has(viewId)) tabs.set(viewId, []);
      tabs.get(viewId).push(btn);
    });
  };

  /** 矢印キー・Home・End でモードを移動する */
  const onTabKey = (event) => {
    const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next = null;
    if (event.key in keys) next = VIEWS[(VIEWS.indexOf(current) + keys[event.key] + VIEWS.length) % VIEWS.length];
    else if (event.key === "Home") next = VIEWS[0];
    else if (event.key === "End") next = VIEWS[VIEWS.length - 1];
    if (!next) return;
    event.preventDefault();
    go(next);
    const group = event.currentTarget.parentElement;
    const target = group && group.querySelector(`[data-view="${next}"]`);
    if (target) target.focus();
  };

  const syncTabs = (viewId) => {
    tabs.forEach((buttons, id) => {
      const selected = id === viewId;
      buttons.forEach((btn) => {
        btn.setAttribute("aria-selected", String(selected));
        btn.tabIndex = selected ? 0 : -1;
        btn.classList.toggle("is-active", selected);
      });
    });
  };

  /* ---------------- メニュー内のセクション一覧 ---------------- */
  const buildMenu = (viewId) => {
    const list = document.getElementById("menuList");
    if (!list) return;
    list.innerHTML = "";
    V.navItems(viewId).forEach((item) => {
      const a = document.createElement("a");
      a.className = "menu__link";
      a.href = item.href;
      a.dataset.cursor = "link";
      const no = document.createElement("span");
      no.textContent = `( ${item.no} )`;
      a.append(no, document.createTextNode(item.label));
      list.appendChild(a);
    });
  };

  /* ---------------- 本文の描画 ---------------- */
  const renderView = (viewId) => {
    const root = document.getElementById("viewRoot");
    if (!root) return;
    root.innerHTML = "";
    root.appendChild(V.build(viewId));
    root.dataset.view = viewId;

    const activeTab = (tabs.get(viewId) || [])[0];
    if (activeTab) root.setAttribute("aria-labelledby", activeTab.id);

    buildMenu(viewId);
    if (typeof M !== "undefined" && M.scan) M.scan();
    if (typeof U !== "undefined" && U.bindDynamic) U.bindDynamic();
  };

  const announce = (viewId) => {
    const node = document.getElementById("viewAnnouncer");
    if (!node) return;
    const cfg = SITE_COPY.views[viewId];
    node.textContent = `${cfg.label}（${cfg.ja}）の表示に切り替えました。`;
  };

  /**
   * モードを切り替える。
   * push=false のときは履歴を増やさない（戻る/進むからの呼び出し）。
   */
  const apply = (viewId, { push = true, announceChange = true } = {}) => {
    if (!VIEWS.includes(viewId)) viewId = DEFAULT_VIEW;
    const changed = viewId !== current;
    current = viewId;

    syncTabs(viewId);
    renderView(viewId);

    const cfg = SITE_COPY.views[viewId];
    document.title = cfg.docTitle;

    if (push) window.history.pushState({ view: viewId }, "", urlFor(viewId));
    if (changed && announceChange) announce(viewId);
    return changed;
  };

  /** ボタンから呼ばれる切り替え */
  const go = (viewId) => {
    if (viewId === current) return;
    apply(viewId, { push: true });
    // 新しい内容は先頭から読み始められるようにする
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const init = () => {
    buildSwitch(document.getElementById("viewSwitch"));
    buildSwitch(document.getElementById("viewSwitchMobile"));

    window.addEventListener("popstate", () => {
      const next = viewFromUrl();
      if (next === current) return;
      apply(next, { push: false });
      window.scrollTo({ top: 0, behavior: "auto" });
    });

    // 初期表示。URL に指定があればそれを、無ければ ABOUT ME。
    apply(viewFromUrl(), { push: false, announceChange: false });
    window.history.replaceState({ view: current }, "", urlFor(current));
  };

  return { init, go, get current() { return current; } };
})();
