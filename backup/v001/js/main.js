/* ============================================================
   main.js — 起動処理
   ============================================================ */

(() => {
  // リロード時にスクロール位置が復元されると、ローダーと演出がずれるため先頭に戻す
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (!window.location.hash) window.scrollTo(0, 0);

  const boot = () => {
    R.all(SITE_DATA);   // data.js の内容を描画
    M.init();           // 文字分割とスクロール演出

    U.init(() => {      // ローダー完了後にヒーローを見せる
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
