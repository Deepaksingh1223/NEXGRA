/* =========================================================================
   NEXGRA — NEW UI ANIMATIONS
   Pure additive behaviour. Never touches existing IDs/classes used by the
   template's own scripts — only adds classes for CSS transitions above.
   ========================================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1) Top progress loader --------------------------------------------- */
  function initLoadBar() {
    var bar = document.createElement("div");
    bar.id = "ak-loadbar";
    document.body.appendChild(bar);
    requestAnimationFrame(function () {
      bar.style.width = "70%";
    });
    window.addEventListener("load", function () {
      bar.style.width = "100%";
      setTimeout(function () {
        bar.classList.add("ak-done");
        setTimeout(function () { bar.remove(); }, 500);
      }, 150);
    });
  }

  /* 2) Topbar shadow once page is scrolled ------------------------------ */
  function initTopbarScroll() {
    var topbar = document.getElementById("main-topbar");
    if (!topbar) return;
    var onScroll = function () {
      if (window.scrollY > 8) topbar.classList.add("ak-scrolled");
      else topbar.classList.remove("ak-scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* 3) Scroll-reveal for cards further down long pages ------------------ */
  function initReveal() {
    var cards = document.querySelectorAll(".page-wrapper .card");
    if (!cards.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      cards.forEach(function (c) { c.classList.add("ak-in"); });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("ak-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    cards.forEach(function (card, i) {
      // First screenful already animates via CSS page-load animation;
      // only add the reveal-on-scroll treatment to cards further down.
      if (i > 7) {
        card.classList.add("ak-reveal");
        io.observe(card);
      }
    });
  }

  /* 4) Soft ripple on buttons -------------------------------------------- */
  function initRipple() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest(".btn");
      if (!btn) return;
      var rect = btn.getBoundingClientRect();
      btn.style.setProperty("--ak-x", (e.clientX - rect.left) + "px");
      btn.style.setProperty("--ak-y", (e.clientY - rect.top) + "px");
      btn.classList.remove("ak-ripple");
      // force reflow so the animation can restart on rapid clicks
      void btn.offsetWidth;
      btn.classList.add("ak-ripple");
    });
  }

  function boot() {
    if (!reduceMotion) initLoadBar();
    initTopbarScroll();
    initReveal();
    initRipple();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
