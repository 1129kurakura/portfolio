/* ============================================================
   ui.js — ローダー / カーソル / メニュー / ホバー

   本文はモードごとに作り直されるため、
   描画のたびに必要なものは U.bindDynamic() でつなぎ直します。
   ============================================================ */

const U = (() => {
  const $ = (sel) => document.querySelector(sel);
  const coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  /* ---------------- ローダー ---------------- */
  const loader = (onDone) => {
    const root = $("#loader");
    const count = $("#loaderCount");
    const bar = $("#loaderBar");
    if (!root) return onDone();

    window.setTimeout(() => root.classList.add("is-armed"), 30);

    const DURATION = M.reduced ? 300 : 1700;
    const start = performance.now();
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      window.clearInterval(timer);
      count.textContent = "100";
      bar.style.width = "100%";
      root.classList.add("is-done");
      document.body.classList.remove("is-locked");
      onDone();
      window.setTimeout(() => root.remove(), 800);
    };

    const step = () => {
      const t = Math.min((performance.now() - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(eased * 100);
      count.textContent = String(value).padStart(3, "0");
      bar.style.width = `${value}%`;
      if (t >= 1) window.setTimeout(finish, M.reduced ? 0 : 260);
    };

    // setInterval を使うことで、非表示タブでも確実に完了する
    const timer = window.setInterval(step, 40);
    // 保険：どんな場合でも一定時間後には必ず解除する
    window.setTimeout(finish, DURATION + 1200);

    document.body.classList.add("is-locked");
    step();
  };

  /* ---------------- カスタムカーソル ---------------- */
  const cursor = () => {
    const node = $("#cursor");
    if (!node || coarse) return;

    const dot = node.querySelector(".cursor__dot");
    const ring = node.querySelector(".cursor__ring");
    const pos = { x: innerWidth / 2, y: innerHeight / 2 };
    const ringPos = { ...pos };

    window.addEventListener(
      "mousemove",
      (e) => {
        pos.x = e.clientX;
        pos.y = e.clientY;
        node.classList.add("is-active");
      },
      { passive: true }
    );

    document.addEventListener("mouseleave", () => node.classList.remove("is-active"));

    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.16;
      ringPos.y += (pos.y - ringPos.y) * 0.16;
      dot.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    document.addEventListener("mouseover", (e) => {
      const hit = e.target.closest('a, button, summary, [data-cursor="link"]');
      node.classList.toggle("is-link", Boolean(hit));
    });
  };

  /* ---------------- 本文の中のホバー ---------------- */
  const bindDynamic = () => {
    document.querySelectorAll(".actlist__row").forEach((row) => {
      if (row.dataset.bound === "true") return;
      row.dataset.bound = "true";
      row.addEventListener("mouseenter", () => row.classList.add("is-hot"));
      row.addEventListener("mouseleave", () => row.classList.remove("is-hot"));
    });
  };

  /* ---------------- 全画面メニュー ---------------- */
  const menu = () => {
    const btn = $("#menuBtn");
    const panel = $("#menuPanel");
    const label = btn && btn.querySelector(".menu-btn__label");
    if (!btn || !panel) return;

    let open = false;

    const setState = (next) => {
      open = next;
      btn.setAttribute("aria-expanded", String(open));
      label.textContent = open ? label.dataset.close : label.dataset.open;
      document.body.classList.toggle("is-locked", open);

      if (open) {
        panel.hidden = false;
        requestAnimationFrame(() => panel.classList.add("is-open"));
        const first = panel.querySelector('[aria-selected="true"], a');
        if (first) first.focus({ preventScroll: true });
        return;
      }

      panel.classList.remove("is-open");
      window.setTimeout(() => {
        panel.hidden = true;
      }, 700);
    };

    btn.addEventListener("click", () => setState(!open));

    // リンクでもモード切り替えでも、押したらメニューを閉じる
    panel.addEventListener("click", (e) => {
      if (e.target.closest("a, .switch__btn")) setState(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && open) {
        setState(false);
        btn.focus();
      }
    });
  };

  /* ---------------- モードによらず変わらない部分 ---------------- */
  const buildStatic = () => {
    const brand = SITE_DATA.meta.brand;
    document.querySelectorAll(".brand__word, .loader__word").forEach((n) => {
      n.textContent = brand;
    });

    const socials = $("#menuSocials");
    if (socials) {
      socials.innerHTML = "";
      SITE_DATA.contact.socials.forEach((s) => {
        const a = P.anchor(s.href, "");
        a.textContent = s.label;
        socials.appendChild(a);
      });
    }

    const copy = $("#footCopy");
    const note = $("#footNote");
    if (copy) copy.textContent = SITE_DATA.footer.copy;
    if (note) note.textContent = SITE_DATA.footer.note;
  };

  const init = (onLoaderDone) => {
    loader(onLoaderDone);
    cursor();
    menu();
  };

  return { init, buildStatic, bindDynamic };
})();
