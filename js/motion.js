const M = (() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const STAGGER = 55;
  const splitWords = (root = document) => {
    root.querySelectorAll('[data-split="words"]').forEach((node) => {
      const lines = node.querySelectorAll(".line");
      let index = 0;
      lines.forEach((line) => {
        const words = line.textContent.trim().split(/\s+/);
        line.textContent = "";
        words.forEach((w) => {
          const span = document.createElement("span");
          span.className = "word";
          span.style.setProperty("--d", `${index * STAGGER}ms`);
          const inner = document.createElement("i");
          inner.textContent = w;
          span.appendChild(inner);
          line.appendChild(span);
          line.appendChild(document.createTextNode(" "));
          index += 1;
        });
      });
    });
  };
  /** 画面に入った（または通り過ぎた）要素を表示する。
      IntersectionObserver だと素早いスクロールで取りこぼし、
      要素が出ないまま残ることがあるため、位置を直接見て判定する。 */
  const REVEAL_LINE = 0.94; // 画面高さのこの位置まで来たら出す
  const observeReveals = () => {
    const targets = [
      ...document.querySelectorAll('[data-split="words"], .rise'),
    ].filter((node) => !node.closest(".hero"));
    if (reduced) {
      targets.forEach((t) => t.classList.add("is-revealed"));
      return;
    }
    targets.forEach((t, i) => {
      if (!t.style.getPropertyValue("--d")) {
        t.style.setProperty("--d", `${(i % 6) * 45}ms`);
      }
    });
    let pending = targets;
    const check = () => {
      if (!pending.length) return;
      const line = window.innerHeight * REVEAL_LINE;
      const still = [];
      pending.forEach((node) => {
        if (node.getBoundingClientRect().top < line) {
          node.classList.add("is-revealed");
        } else {
          still.push(node);
        }
      });
      pending = still;
    };
    onScroll(check);
    check();
  };
  const litStatement = () => {
    const section = document.querySelector(".statement");
    const words = [...document.querySelectorAll(".statement__text .word")];
    if (!section || !words.length) return;
    if (reduced) {
      words.forEach((w) => w.classList.add("is-lit"));
      return;
    }
    const update = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = vh * 0.15;
      const progress = (start - rect.top) / (start - end + rect.height * 0.55);
      const lit = Math.round(Math.min(Math.max(progress, 0), 1) * words.length);
      words.forEach((w, i) => w.classList.toggle("is-lit", i < lit));
    };
    onScroll(update);
    update();
  };
  /** 画面上端のスクロール進捗バー */
  const scrollProgress = () => {
    const bar = document.getElementById("progressBar");
    if (!bar) return;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? window.scrollY / max : 0;
      bar.style.setProperty("--p", Math.min(Math.max(ratio, 0), 1).toFixed(4));
    };
    onScroll(update);
    update();
  };
  /** 画像をスクロールに合わせてゆっくり上下に動かす（視差） */
  const PARALLAX_SHIFT = 16;
  const parallax = () => {
    if (reduced) return;
    const nodes = [...document.querySelectorAll("[data-parallax]")];
    if (!nodes.length) return;
    const update = () => {
      const vh = window.innerHeight;
      nodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) return;
        const center = rect.top + rect.height / 2;
        const offset = (center - vh / 2) / vh;
        const clamped = Math.min(Math.max(offset, -1), 1);
        node.style.setProperty("--py", `${(clamped * -PARALLAX_SHIFT).toFixed(1)}px`);
      });
    };
    onScroll(update);
    update();
  };
  const stickyHeader = () => {
    const head = document.getElementById("siteHead");
    if (!head) return;
    let last = window.scrollY;
    onScroll(() => {
      const y = window.scrollY;
      const goingDown = y > last && y > window.innerHeight * 0.6;
      head.classList.toggle("is-hidden", goingDown && !head.dataset.pinned);
      last = y;
    });
  };
  const handlers = [];
  let ticking = false;
  const runAll = () => {
    handlers.forEach((fn) => fn());
    ticking = false;
  };
  const onScroll = (fn) => {
    handlers.push(fn);
    if (handlers.length === 1) {
      window.addEventListener(
        "scroll",
        () => {
          if (ticking) return;
          ticking = true;
          requestAnimationFrame(runAll);
        },
        { passive: true }
      );
      window.addEventListener("resize", runAll, { passive: true });
    }
  };
  const init = () => {
    splitWords();
    observeReveals();
    litStatement();
    stickyHeader();
    scrollProgress();
    parallax();
  };
  return { init, reduced };
})();
