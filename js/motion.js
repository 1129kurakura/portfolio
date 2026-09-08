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
  const observeReveals = () => {
    const targets = [
      ...document.querySelectorAll('[data-split="words"], .rise'),
    ].filter((node) => !node.closest(".hero"));
    if (reduced || !("IntersectionObserver" in window)) {
      targets.forEach((t) => t.classList.add("is-revealed"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    targets.forEach((t, i) => {
      if (!t.style.getPropertyValue("--d")) {
        t.style.setProperty("--d", `${(i % 6) * 45}ms`);
      }
      io.observe(t);
    });
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
  };
  return { init, reduced };
})();
