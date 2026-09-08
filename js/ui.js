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

    const timer = window.setInterval(step, 40);
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

    const setLink = (on) => node.classList.toggle("is-link", on);
    document.addEventListener("mouseover", (e) => {
      const hit = e.target.closest('a, button, [data-cursor="link"]');
      setLink(Boolean(hit));
    });
  };

  /* ---------------- 所属リストのホバー演出 ---------------- */
  const affilHover = () => {
    const rows = [...document.querySelectorAll(".affil__row")];
    const media = $("#hoverMedia");
    if (!rows.length) return;

    const place = (e) => {
      if (!media) return;
      media.style.transform =
        `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%) scale(1)`;
    };

    rows.forEach((row) => {
      row.addEventListener("mouseenter", () => {
        row.classList.add("is-hot");
        if (!media || coarse) return;
        const src = row.dataset.image;
        if (!src) return;
        media.innerHTML = "";
        const img = document.createElement("img");
        img.src = src;
        img.alt = "";
        media.appendChild(img);
        media.classList.add("is-visible");
      });

      row.addEventListener("mouseleave", () => {
        row.classList.remove("is-hot");
        if (media) media.classList.remove("is-visible");
      });

      row.addEventListener("mousemove", place, { passive: true });
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
        const first = panel.querySelector("a");
        if (first) first.focus({ preventScroll: true });
        return;
      }

      panel.classList.remove("is-open");
      window.setTimeout(() => {
        panel.hidden = true;
      }, 700);
    };

    btn.addEventListener("click", () => setState(!open));

    panel.addEventListener("click", (e) => {
      if (e.target.closest("a")) setState(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && open) {
        setState(false);
        btn.focus();
      }
    });
  };

  /* ---------------- 起動 ---------------- */
  const init = (onLoaderDone) => {
    loader(onLoaderDone);
    cursor();
    affilHover();
    menu();
  };

  return { init };
})();
