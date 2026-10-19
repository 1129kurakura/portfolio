/* ============================================================
   motion.js — スクロールに連動する動き

   モードを切り替えると本文が作り直されるため、
   描画のたびに M.scan() を呼んで対象を集め直します。
   ============================================================ */

const M = (() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const STAGGER = 55;
  const REVEAL_LINE = 0.94; // 画面高さのこの位置まで来たら出す
  const PARALLAX_SHIFT = 16;

  let pending = [];        // まだ表示されていない要素
  let parallaxNodes = [];
  let heroHeld = true;     // ローダーが明けるまで、最初の画面は出さずに待つ

  /* ---------------- 文字を単語に分ける ---------------- */
  const splitWords = (root = document) => {
    root.querySelectorAll('[data-split="words"]').forEach((node) => {
      if (node.dataset.splitDone === "true") return;
      node.dataset.splitDone = "true";
      node.querySelectorAll(".line").forEach((line) => {
        const words = line.textContent.trim().split(/\s+/);
        line.textContent = "";
        words.forEach((word, i) => {
          const span = document.createElement("span");
          span.className = "word";
          span.style.setProperty("--d", `${i * STAGGER}ms`);
          const inner = document.createElement("i");
          inner.textContent = word;
          span.appendChild(inner);
          line.appendChild(span);
          line.appendChild(document.createTextNode(" "));
        });
      });
    });
  };

  /* ---------------- 表示の対象を集め直す ---------------- */
  const collect = () => {
    const all = [...document.querySelectorAll('[data-split="words"], .rise')];
    pending = all.filter((node) => {
      if (node.classList.contains("is-revealed")) return false;
      if (heroHeld && node.closest(".hero")) return false;
      return true;
    });
    pending.forEach((node, i) => {
      if (!node.style.getPropertyValue("--d")) {
        node.style.setProperty("--d", `${(i % 6) * 45}ms`);
      }
    });
    parallaxNodes = [...document.querySelectorAll("[data-parallax]")];
  };

  /**
   * 画面に入った（または通り過ぎた）要素を表示する。
   * IntersectionObserver だと素早いスクロールで取りこぼし、
   * 要素が出ないまま残ることがあるため、位置を直接見て判定する。
   */
  const checkReveals = () => {
    if (!pending.length) return;
    if (reduced) {
      pending.forEach((node) => node.classList.add("is-revealed"));
      pending = [];
      return;
    }
    const line = window.innerHeight * REVEAL_LINE;
    const still = [];
    pending.forEach((node) => {
      if (node.getBoundingClientRect().top < line) node.classList.add("is-revealed");
      else still.push(node);
    });
    pending = still;
  };

  /* ---------------- 画像の視差 ---------------- */
  const updateParallax = () => {
    if (reduced || !parallaxNodes.length) return;
    const vh = window.innerHeight;
    parallaxNodes.forEach((node) => {
      const rect = node.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > vh + 200) return;
      const center = rect.top + rect.height / 2;
      const offset = Math.min(Math.max((center - vh / 2) / vh, -1), 1);
      node.style.setProperty("--py", `${(offset * -PARALLAX_SHIFT).toFixed(1)}px`);
    });
  };

  /* ---------------- 画面上端の進捗バー ---------------- */
  const updateProgress = () => {
    const bar = document.getElementById("progressBar");
    if (!bar) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    bar.style.setProperty("--p", Math.min(Math.max(ratio, 0), 1).toFixed(4));
  };

  /* ---------------- スクロール方向でヘッダーを出し入れ ---------------- */
  let lastY = 0;
  const updateHeader = () => {
    const head = document.getElementById("siteHead");
    if (!head) return;
    const y = window.scrollY;
    const goingDown = y > lastY && y > window.innerHeight * 0.6;
    head.classList.toggle("is-hidden", goingDown);
    lastY = y;
  };

  /* ---------------- スクロール処理をまとめて回す ---------------- */
  let ticking = false;
  const runAll = () => {
    checkReveals();
    updateParallax();
    updateProgress();
    updateHeader();
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(runAll);
  };

  /** 本文を描き直したあとに呼ぶ */
  const scan = () => {
    splitWords();
    collect();
    runAll();
  };

  /** ローダーが明けたら、最初の画面を表示する */
  const releaseHero = () => {
    heroHeld = false;
    scan();
  };

  const init = () => {
    lastY = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    scan();
  };

  return { init, scan, releaseHero, reduced };
})();
