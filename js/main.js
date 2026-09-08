(() => {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (!window.location.hash) window.scrollTo(0, 0);

  const boot = () => {
    R.all(SITE_DATA);
    M.init();

    U.init(() => {
      document.getElementById("siteHead").classList.add("is-in");
      const hero = document.getElementById("hero-heading");
      const eyebrow = document.querySelector(".hero__eyebrow");
      [hero, eyebrow, document.getElementById("heroMeta")].forEach((node, i) => {
        if (!node) return;
        node.style.setProperty("--d", `${i * 90}ms`);
        node.classList.add("is-revealed");
      });
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
