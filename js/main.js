/* ============================================================
   main.js — 起動処理
   ============================================================ */

(() => {
  // リロード時にスクロール位置が復元されると、ローダーと演出がずれるため先頭に戻す
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (!window.location.hash) window.scrollTo(0, 0);

  const boot = () => {
    U.buildStatic();   // ロゴ・連絡先・フッター（モードによらず同じ部分）
    M.init();          // スクロール処理を立ち上げる
    Router.init();     // URL を見て本文を描画する

    U.init(() => {     // ローダーが明けたら
      document.getElementById("siteHead").classList.add("is-in");
      M.releaseHero(); // 最初の画面を表示する
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
